module.exports.config = { name: "ck", version: "1.0.0", hasPermssion: 0, // 0: everyone, 1: admin, 2: bot owner — change as needed credits: "You", description: "Ck.js — robust Mirai-style command with admin checks, image handling, cooldowns and safe error handling.", commandCategory: "utilities", usages: "ck <subcommand>", cooldowns: 5 };

const axios = require('axios'); const fs = require('fs'); const path = require('path');

// Helper: sleep const wait = ms => new Promise(res => setTimeout(res, ms));

module.exports.run = async function({ api, event, args, Users, Threads, permission }) { const senderID = event.senderID; const threadID = event.threadID; const messageID = event.messageID; const sub = (args[0] || '').toLowerCase();

try { // ADMIN CHECK helper: if command requires admin, you can set permission checks here const isAdmin = (permission && permission === 1) || (event.isGroup && event.adminIDs && event.adminIDs.some(a => a.id == senderID));

// No subcommand -> help
if (!sub || sub === 'help' || sub === 'h') {
  const help = `Ck command — subcommands:\n

• ping — latency check\n• whoami — show your name & id\n• say <text> — bot repeats text\n• image <image_url> — send image from URL\n• sticker <image_url> — download image and resend as attachment\n• admin <on|off> — toggle admin-only helper (admin only)\n• help — show this message`; return api.sendMessage(help, threadID, messageID); }

if (sub === 'ping') {
  const start = Date.now();
  await api.sendMessage('Checking ping...', threadID, (err, info) => {
    const latency = Date.now() - start;
    api.sendMessage(`Pong! ${latency} ms`, threadID, messageID);
  });
  return;
}

if (sub === 'whoami' || sub === 'me' || sub === 'info') {
  let name = 'Unknown';
  try {
    if (Users && typeof Users.getNameUser === 'function') {
      name = await Users.getNameUser(senderID) || name;
    }
  } catch (e) { /* ignore */ }
  return api.sendMessage(`Name: ${name}\nID: ${senderID}\nThread: ${threadID}`, threadID, messageID);
}

if (sub === 'say') {
  const text = args.slice(1).join(' ');
  if (!text) return api.sendMessage('Use: ck say <text>', threadID, messageID);
  return api.sendMessage(text, threadID, messageID);
}

if (sub === 'image' || sub === 'img') {
  const url = args[1];
  if (!url) return api.sendMessage('Use: ck image <image_url>', threadID, messageID);
  if (!/^https?:\/\/.+/i.test(url)) return api.sendMessage('Invalid URL.', threadID, messageID);

  try {
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
    const ext = (url.split('.').pop().split(/[?#]/)[0] || 'jpg').slice(0,4);
    const tmpPath = path.join(__dirname, `tmp_ck_${Date.now()}.${ext}`);
    fs.writeFileSync(tmpPath, res.data);
    const attach = fs.createReadStream(tmpPath);
    await api.sendMessage({ body: "Here is your image:", attachment: attach }, threadID, messageID);
    // cleanup
    wait(500).then(() => { try { fs.unlinkSync(tmpPath); } catch(e){} });
    return;
  } catch (err) {
    return api.sendMessage('Failed to fetch image: ' + (err.message || err), threadID, messageID);
  }
}

if (sub === 'sticker') {
  const url = args[1];
  if (!url) return api.sendMessage('Use: ck sticker <image_url>', threadID, messageID);
  if (!/^https?:\/\/.+/i.test(url)) return api.sendMessage('Invalid URL.', threadID, messageID);

  try {
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
    const tmpPath = path.join(__dirname, `tmp_ck_stk_${Date.now()}.png`);
    fs.writeFileSync(tmpPath, res.data);
    // Many Mirai-style bots accept image attachments and will convert to sticker client-side or via another call.
    const attach = fs.createReadStream(tmpPath);
    await api.sendMessage({ body: "Sticker (image attached):", attachment: attach }, threadID, messageID);
    wait(500).then(() => { try { fs.unlinkSync(tmpPath); } catch(e){} });
    return;
  } catch (err) {
    return api.sendMessage('Failed to create sticker: ' + (err.message || err), threadID, messageID);
  }
}

if (sub === 'admin') {
  // Example admin-only toggle (this is only illustrative — actual persistent storage not implemented)
  if (!isAdmin && permission !== 2) return api.sendMessage('Admin only command.', threadID, messageID);
  const opt = args[1] ? args[1].toLowerCase() : '';
  if (opt !== 'on' && opt !== 'off') return api.sendMessage('Use: ck admin <on|off>', threadID, messageID);
  return api.sendMessage(`Admin helper toggled: ${opt}`, threadID, messageID);
}

// unknown sub
return api.sendMessage('Unknown subcommand. Type: ck help', threadID, messageID);

} catch (err) { console.error('Ck.js error:', err); try { await api.sendMessage('An internal error occurred: ' + (err.message || err), threadID); } catch(e){} } };
