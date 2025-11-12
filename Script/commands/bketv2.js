const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "bket",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Belalyt Edit",
  description: "ছবি এডিটিং কমান্ড (bket.js) BOTX666V2 এর জন্য। গ্রুপে ছবি আপলোড করলে ডাউনলোড ও এডিট করা যাবে।",
  commandCategory: "fun",
  usages: "bket <কমান্ড>",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID, attachments, messageReply } = event;
  const subCommand = args[0] ? args[0].toLowerCase() : 'help';

  // সাহায্য মেসেজ
  if (!subCommand || subCommand === 'help') {
    return api.sendMessage(
      `📌 BKET বট কমান্ডস:\n
bket বলো <টেক্সট> — বট টেক্সট রিপিট করবে
bket ছবি — গ্রুপে আপলোড করা ছবি ডাউনলোড ও দেখাবে
bket সাহায্য — এই মেনু দেখাবে
`, threadID, messageID
    );
  }

  // 'বলো' কমান্ড
  if(subCommand === 'বলো' || subCommand === 'say') {
    const text = args.slice(1).join(' ');
    if(!text) return api.sendMessage('❗ ব্যবহার: bket বলো <টেক্সট>', threadID, messageID);
    return api.sendMessage(`🗣️ ${text}`, threadID, messageID);
  }

  // 'ছবি' কমান্ড
  if(subCommand === 'ছবি' || subCommand === 'image') {
    let imageUrl = null;

    // যদি মেসেজে reply থাকে এবং reply-এ ছবি থাকে
    if(messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
      imageUrl = messageReply.attachments[0].url;
    }
    // যদি বর্তমান মেসেজে ছবি থাকে
    else if(attachments && attachments.length > 0) {
      imageUrl = attachments[0].url;
    }
    // যদি args[1] হিসাবে URL দেওয়া হয়
    else if(args[1] && /^https?:\/\//.test(args[1])) {
      imageUrl = args[1];
    }

    if(!imageUrl) return api.sendMessage('❗ ছবি পাওয়া যায়নি। ছবি আপলোড করো অথবা লিংক দাও।', threadID, messageID);

    const tmpPath = path.join(__dirname, `cache_bket_${Date.now()}.jpg`);
    try {
      const res = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(tmpPath, res.data);

      // TODO: এখানে ছবি এডিটিং ফাংশন বসাতে পারো

      return api.sendMessage(
        { body: '📸 তোমার ছবিটা:', attachment: fs.createReadStream(tmpPath) },
        threadID,
        () => fs.unlinkSync(tmpPath)
      );
    } catch(e) {
      return api.sendMessage('❌ ছবিটা ডাউনলোড বা এডিট করা সম্ভব হয়নি।', threadID, messageID);
    }
  }

  // অজানা কমান্ড
  return api.sendMessage('❓ অজানা কমান্ড। `bket সাহায্য` লিখে দেখো।', threadID, messageID);
};
