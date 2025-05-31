const warnings = {}; // { groupId: { userId: count } }

async function warnUser(sock, from, userId, msg) {
  if (!warnings[from]) warnings[from] = {};
  if (!warnings[from][userId]) warnings[from][userId] = 0;
  warnings[from][userId]++;

  const count = warnings[from][userId];
  await sock.sendMessage(from, {
    text: `⚠️ @${userId.split("@")[0]} has been warned for sending NSFW content. Total warnings: ${count}`,
    mentions: [userId]
  }, { quoted: msg });

  if (count >= 3) {
    // Kick user after 3 warnings
    await sock.groupParticipantsUpdate(from, [userId], "remove");
    await sock.sendMessage(from, { text: `🚫 @${userId.split("@")[0]} removed after 3 warnings.` , mentions: [userId] });
    warnings[from][userId] = 0;
  }
}

module.exports.warnUser = warnUser;
