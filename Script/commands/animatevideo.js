/**
 * animatevideo.js
 * BOTX666V2 রিপোর স্ট্রাকচারের জন্য ভিডিও অ্যানিমেশন কমান্ড
 */

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");

module.exports.config = {
  name: "animatevideo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Belalyt",
  description: "গ্রুপে আপলোড করা ছবি/ইলিমেন্ট থেকে অ্যানিমেটেড ভিডিও তৈরি করে পাঠাবে",
  commandCategory: "video",
  usages: "[reply one or more images and type animatevideo]",
  cooldowns: 10
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, messageReply, attachments } = event;

  try {
    let urls = [];

    if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
      urls = messageReply.attachments.map(a => a.url);
    } else if (attachments && attachments.length > 0) {
      urls = attachments.map(a => a.url);
    }

    if (urls.length === 0) {
      return api.sendMessage("⚠️ ছবি গ্রুপে আপলোড করে অথবা রিপ্লাই দিয়ে কমান্ড দিন: animatevideo", threadID, messageID);
    }

    const loading = await api.sendMessage("⏳ অ্যানিমেশনের ভিডিও তৈরি হচ্ছে… দয়া করে অপেক্ষা করুন", threadID);

    const frames = [];
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const res = await axios.get(url, { responseType: "arraybuffer" });
      const imgPath = path.join(__dirname, `frame_${Date.now()}_${i}.jpg`);
      fs.writeFileSync(imgPath, Buffer.from(res.data, "binary"));
      frames.push(imgPath);
    }

    const outputVideo = path.join(__dirname, `animate_${Date.now()}.mp4`);
    const cmd = ffmpeg();

    frames.forEach(frame => {
      cmd.input(frame);
    });

    cmd
      .inputFPS(1)
      .outputOptions("-pix_fmt yuv420p")
      .size("720x720")
      .duration(5)
      .save(outputVideo)
      .on("end", async () => {
        frames.forEach(f => fs.unlinkSync(f));
        await api.unsendMessage(loading.messageID);
        await api.sendMessage(
          { body: "✅ ভিডিও তৈরি সম্পন্ন!", attachment: fs.createReadStream(outputVideo) },
          threadID,
          () => fs.unlinkSync(outputVideo)
        );
      })
      .on("error", async err => {
        console.error("animatevideo error:", err);
        await api.unsendMessage(loading.messageID);
        return api.sendMessage("❌ ভিডিও তৈরি ব্যর্থ হয়েছে। আবার চেষ্টা করুন।", threadID, messageID);
      });

  } catch (err) {
    console.error("animatevideo catch:", err);
    return api.sendMessage("❌ ভিডিও তৈরি ব্যর্থ হয়েছে। আবার চেষ্টা করুন।", threadID, messageID);
  }
};
