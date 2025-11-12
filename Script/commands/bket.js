const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "bket",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Belalyt Edit",
  description: "ছবি এডিটিং কমান্ড (BKET.js) BOTX666V2 এর জন্য।",
  commandCategory: "fun",
  usages: "bket <কমান্ড> <ছবি লিংক>",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const subCommand = args[0] ? args[0].toLowerCase() : 'help';
  const imageUrl = args[1];

  if (!subCommand || subCommand === 'help') {
    return api.sendMessage(
      `📌 BKET বট কমান্ডস:\n
bket বলো <টেক্সট> — বট টেক্সট রিপিট করবে
bket ছবি <ইমেজ লিংক> — ছবি ডাউনলোড ও প্রদর্শন
bket সাহায্য — এই মেনু দেখাবে
`, threadID, messageID
    );
  }

  if (!imageUrl) {
    return api.sendMessage('❗ ব্যবহার: bket <কমান্ড> <ছবি লিংক>', threadID, messageID);
  }

  if (!/^https?:\/\//.test(imageUrl)) {
    return api.sendMessage('🔗 সঠিক ইমেজ লিংক দাও!', threadID, messageID);
  }

  const tmpPath = path.join(__dirname, `cache_bket_${Date.now()}.jpg`);
  try {
    const res = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(tmpPath, res.data);

    // TODO: এখানে তুমি ছবি এডিট ফাংশনালিটি যোগ করতে পারো

    return api.sendMessage(
      { body: '📸 তোমার ছবিটা:', attachment: fs.createReadStream(tmpPath) },
      threadID,
      () => fs.unlinkSync(tmpPath)
    );
  } catch (e) {
    return api.sendMessage('❌ ছবিটা আনা যায়নি বা এডিট করা সম্ভব হয়নি।', threadID, messageID);
  }
};
