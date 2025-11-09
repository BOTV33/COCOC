module.exports = {
  config: {
    name: "inb",
    aliases: ["mybox", "mbox", "digs"],
    version: "3.0",
    author: "MZ",
    countDown: 5,
    role: 0,
    shortDescription: "ইনবক্সে বটকে নক করুন",
    longDescription: "গ্রুপ থেকে ইনবক্সে বটকে নক করে সিস্টেম চালু করুন",
    category: "utility",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, event, api }) {
    const { senderID, threadID } = event;

    // ✅ Step 1: Confirm senderID
    if (!senderID) {
      return message.reply("❌ ইউজার আইডি পাওয়া যায়নি। কমান্ড ব্যর্থ হয়েছে।");
    }

    // ✅ Step 2: Try sending inbox message
    try {
      await api.sendMessage(
        `✅ SUCCESSFULLY SEND MSG\n🔰 [চাঁদের পাহাড়] PLEASE CK YOUR INBOX OR MSG REQUEST BOX`,
        senderID
      );

      // ✅ Step 3: Confirm success in group
      return message.reply("📨 ইনবক্সে নক পাঠানো হয়েছে! এখন আপনি ইনবক্সে সব ফিচার ব্যবহার করতে পারবেন ✅");
    } catch (err) {
      // ✅ Step 4: Fallback error message
      console.error("❌ ইনবক্সে নক পাঠাতে সমস্যা:", err);

      return message.reply(
        `⚠️ ইনবক্সে নক পাঠানো যায়নি। আপনি যদি আগে বটকে কোনো মেসেজ না পাঠিয়ে থাকেন, তাহলে Messenger-এ বটকে "Hi" বা "/" পাঠান, তারপর আবার চেষ্টা করুন।`
      );
    }
  }
};
