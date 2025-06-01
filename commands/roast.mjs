async function roastCommand(sock, msg) {
  const from = msg.key.remoteJid;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  if (!mentioned.length) {
    await sock.sendMessage(from, { text: "⚠️ Tafadhali tag mtu unayetaka kumroasta." });
    return;
  }

  const user = mentioned[0];
  await sock.sendMessage(from, { react: { text: "🔥", key: msg.key } });

  const roasts = [
    "You're as useless as the 'ueue' in 'queue'.",
    "You're like a cloud. When you disappear, it's a beautiful day.",
    "You're the reason why the gene pool needs a lifeguard.",
    "You bring everyone so much joy... when you leave the room.",
    "You have something on your chin... no, the third one down.",
  ];

  const roast = roasts[Math.floor(Math.random() * roasts.length)];

  await sock.sendMessage(from, {
    text: `🔥 @${user.split("@")[0]}, ${roast}`,
    mentions: [user]
  });
}
