/**
 * fifpaint.js
 * সম্পূর্ণ সেটআপ — PicsArt API ব্যবহার করে গ্রুপে আপলোড করা ছবি এডিট
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "fifpaint",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Belalyt Edit",
  description: "PicsArt API ব্যবহার করে ছবি এডিট করে গ্রুপে পাঠানো যায়।",
  commandCategory: "fun",
  usages: "fifpaint ছবি <filter> <text>",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, attachments, messageReply } = event;
  let imageUrl = null;

  // ছবি চেক করা
  if(messageReply && messageReply.attachments && messageReply.attachments.length) {
    imageUrl = messageReply.attachments[0].url;
  } else if(attachments && attachments.length) {
    imageUrl = attachments[0].url;
  }

  if(!imageUrl) return api.sendMessage('❗ ছবি পাওয়া যায়নি। ছবি আপলোড করো।', threadID, messageID);

  const filter = args[0] ? args[0].toLowerCase() : null;
  const extraText = args.slice(1).join(' ');

  try {
    // PicsArt API কল
    const response = await axios.post(
      'https://api.picsart.io/tools/1.0/edit', // উদাহরণ এন্ডপয়েন্ট
      {
        image_url: imageUrl,
        filter: filter,
        text: extraText
      },
      {
        headers: {
          'X-Picsart-API-Key': process.env.PICSART_API_KEY, // API কী এখানে বসাও
          'Content-Type': 'application/json'
        }
      }
    );

    const editedUrl = response.data.result_url;

    // গ্রুপে পাঠানো
    return api.sendMessage(
      { body: '📸 এডিট করা ছবি:', attachment: editedUrl },
      threadID,
      messageID
    );

  } catch (err) {
    console.error('Error in fifpaint.js:', err);
    return api.sendMessage('❌ API এডিট করতে ব্যর্থ হয়েছে।', threadID, messageID);
  }
};
