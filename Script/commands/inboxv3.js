module.exports = {
  config: {
    name: "inboxv3",
    aliases: ["mybox", "mbox", "digs"],
    version: "2.1",
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

    console.log("📌 Sender ID:", senderID);

    try {
      await api.sendMessage(
        `✅ SUCCESSFULLY SEND MSG\n📘 [চাঁদের পাহাড়] PLEASE CK YOUR INBOX OR MSG REQUEST BOX`,
        senderID
      );

      return message.reply("📨 ইনবক্সে নক পাঠানো হয়েছে!");
    } catch (err) {
      console.error("❌ ইনবক্সে নক পাঠাতে সমস্যা:", err);

      return message.reply(
        `⚠️ ইনবক্সে নক পাঠানো যায়নি। Access token, permission, বা senderID চেক করুন।`
      );
    }
  }
};
