async function complimentCommand(sock, msg) {
  const from = msg.key.remoteJid;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  if (!mentioned.length) {
    await sock.sendMessage(from, { text: "⚠️ Tafadhali tag mtu unayetaka kumpongeza." });
    return;
  }

  const user = mentioned[0];
  await sock.sendMessage(from, { react: { text: "😊", key: msg.key } });

  const compliments = [
    "You're amazing! 🌟",
    "You have a great sense of humor! 😂",
    "You're really kind and thoughtful. ❤️",
    "Your smile lights up the room! 😄",
    "You're a true friend. 🤝",
  ];

  const compliment = compliments[Math.floor(Math.random() * compliments.length)];

  await sock.sendMessage(from, {
    text: `😊 @${user.split("@")[0]}, ${compliment}`,
    mentions: [user]
  });
}
