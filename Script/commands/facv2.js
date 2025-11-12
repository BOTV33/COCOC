const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "facv2",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Ullash | Updated by Belalyt",
  description: "Swap faces between two images using a stable API",
  commandCategory: "image",
  usages: "[reply 2 images and type faceswap]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
  try {
    // চেক করা যে reply আছে কিনা
    if (!event.messageReply || !event.messageReply.attachments) {
      return api.sendMessage(
        "⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝟐 𝐢𝐦𝐚𝐠𝐞𝐬 𝐰𝐢𝐭𝐡 'faceswap'",
        event.threadID,
        event.messageID
      );
    }

    const attachments = event.messageReply.attachments;

    if (attachments.length < 2) {
      return api.sendMessage(
        "⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐞𝐱𝐚𝐜𝐭𝐥𝐲 𝟐 𝐢𝐦𝐚𝐠𝐞𝐬!",
        event.threadID,
        event.messageID
      );
    }

    const baseUrl = attachments[0].url;
    const swapUrl = attachments[1].url;

    // API URL
    const apiUrl = `https://faceswap.cyberbot.top/faceswap?baseUrl=${encodeURIComponent(
      baseUrl
    )}&swapUrl=${encodeURIComponent(swapUrl)}`;

    // লোডিং মেসেজ
    const loadingMsg = await api.sendMessage(
      "⏳ 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 FaceSwap... Please wait",
      event.threadID
    );

    // API GET request
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    const imgPath = path.join(__dirname, `faceswap_result_${Date.now()}.jpg`);
    fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

    // লোডিং মেসেজ আনসেন্ড
    await api.unsendMessage(loadingMsg.messageID);

    // গ্রুপে পাঠানো
    await api.sendMessage(
      {
        body: "✅ FaceSwap Complete!",
        attachment: fs.createReadStream(imgPath),
      },
      event.threadID,
      () => fs.unlinkSync(imgPath)
    );
  } catch (err) {
    console.error(err);
    return api.sendMessage(
      "❌ FaceSwap failed. Please try again later.",
      event.threadID,
      event.messageID
    );
  }
};
