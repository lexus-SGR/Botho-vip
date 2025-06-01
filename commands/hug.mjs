async function hugCommand(sock, msg) {
  const from = msg.key.remoteJid;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  if (!mentioned.length) {
    await sock.sendMessage(from, { text: "⚠️ Tafadhali tag mtu unayetaka kumtumia kumbatio." });
    return;
  }

  const user = mentioned[0];
  await sock.sendMessage(from, { react: { text: "🤗", key: msg.key } });

  // URL za picha za kumbatio (random)
  const hugImages = [
    "https://i.imgur.com/r9aU2xv.gif",
    "https://i.imgur.com/wOmoeF8.gif",
    "https://i.imgur.com/nrdYNtL.gif",
  ];

  const imgUrl = hugImages[Math.floor(Math.random() * hugImages.length)];

  await sock.sendMessage(from, {
    text: `🤗 @${user.split("@")[0]}, umepewa kumbatio la papo hapo na @${msg.key.participant.split("@")[0]}!`,
    mentions: [user, msg.key.participant]
  });

  await sock.sendMessage(from, {
    image: { url: imgUrl },
    caption: "Kumbatio la virtual 😊"
  });
}
