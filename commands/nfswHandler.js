// nsfwHandler.js
const { warnUser } = require('./warnUser');

module.exports.handleNsfwCheck = async function handleNsfwCheck(sock, from, msg, nsfwScore) {
  if (nsfwScore > 0.7) {
    await sock.sendMessage(from, {
      text: "🚫 NSFW content detected! Message removed."
    }, { quoted: msg });

    await sock.deleteMessage(from, { id: msg.key.id, remoteJid: from, fromMe: false });

    await warnUser(sock, from, msg.key.participant || msg.key.remoteJid, msg);
  }
};
