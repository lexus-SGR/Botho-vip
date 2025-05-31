// warnUser.js
module.exports.warnUser = async function warnUser(sock, from, userId, msg) {
  await sock.sendMessage(from, {
    text: `⚠️ Warning to user: @${userId.split('@')[0]} for sending NSFW content!`,
    mentions: [userId]
  }, { quoted: msg });
};
