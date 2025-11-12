module.exports.config = { name: "exx", version: "1.0.0", hasPermssion: 0, credits: "You", description: "Example command file (ex.js) for Mirai-style messenger bot. Includes ping, help, info, say and image commands.", commandCategory: "utilities", usages: "ex <subcommand>", cooldowns: 5 };

const axios = require('axios');

module.exports.run = async function({ api, event, args, Users, Threads }) { try { const senderID = event.senderID; const threadID = event.threadID; const messageID = event.messageID;

const sub = args[0] ? args[0].toLowerCase() : "help";

if (sub === 'ping') {
  const start = Date.now();
  await api.sendMessage('Ping... ⏱️', threadID, (err, info) => {
    if (err) return api.sendMessage('Ping failed: ' + err.message, threadID);
    const latency = Date.now() - start;
    const reply = `Pong! 🏓\nLatency: ${latency} ms`;
    return api.sendMessage(reply, threadID, messageID);
  });
  return;
}

if (sub === 'help' || sub === 'h') {
  const helpText = `Ex command — available subcommands:\n

• ping — check latency\n• info — get info about the sender\n• say <text> — bot repeats the text\n• image <image_url> — send image from URL\n• help — show this message`; return api.sendMessage(helpText, threadID, messageID); }

if (sub === 'info' || sub === 'me') {
  // Try to fetch user name via Users API if available in the bot framework
  let name = 'Unknown';
  try {
    if (Users && typeof Users.getNameUser === 'function') {
      name = await Users.getNameUser(senderID);
    } else if (Threads && Threads.getData) {
      // fallback: check thread data first (not always user name)
      const data = await Threads.getData(threadID);
      if (data && data.threadName) name = data.threadName;
    }
  } catch (e) {
    name = 'Unknown';
  }

  const infoMsg = `User info:\n• Name: ${name}\n• ID: ${senderID}\n• Thread: ${threadID}`;
  return api.sendMessage(infoMsg, threadID, messageID);
}

if (sub === 'say') {
  const text = args.slice(1).join(' ');
  if (!text) return api.sendMessage('Use: ex say <text>', threadID, messageID);
  return api.sendMessage(text, threadID, messageID);
}

if (sub === 'image' || sub === 'img') {
  const url = args[1];
  if (!url) return api.sendMessage('Use: ex image <image_url>', threadID, messageID);

  // simple validation
  if (!/^https?:\/\/.+/i.test(url)) return api.sendMessage('Invalid URL.', threadID, messageID);

  try {
    // download image as stream and send as attachment
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const imgBuffer = Buffer.from(res.data, 'binary');
    const attach = { body: imgBuffer, filename: 'image.jpg' };
    return api.sendMessage({ body: 'Here is your image:', attachment: attach }, threadID, messageID);
  } catch (err) {
    return api.sendMessage('Failed to fetch image: ' + err.message, threadID, messageID);
  }
}

// default
return api.sendMessage('Unknown subcommand. Type: ex help', threadID, messageID);

} catch (err) { console.error('ex.js error:', err); if (event && event.threadID) { try { await api.sendMessage('An error occurred: ' + err.message, event.threadID); } catch(e){} } } };
