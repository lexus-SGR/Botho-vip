async function eightBallCommand(sock, msg, args) {
  const from = msg.key.remoteJid;

  if (!args.length) {
    await sock.sendMessage(from, { text: "⚠️ Tafadhali uliza swali kwanza! (e.g. !8ball Nitafika?" });
    return;
  }

  const question = args.join(" ");
  await sock.sendMessage(from, { react: { text: "🎱", key: msg.key } });

  // Simulate typing for 2 seconds
  await sock.sendMessage(from, { presence: { available: true, typing: true } });
  await new Promise(resolve => setTimeout(resolve, 2000));
  await sock.sendMessage(from, { presence: { available: true, typing: false } });

  const answers = [
    "Yes ✅", "No ❌", "Maybe 🤷", "Definitely! 👍", "I don't think so. 👎",
    "Ask again later.", "Certainly!", "Very doubtful."
  ];

  const answer = answers[Math.floor(Math.random() * answers.length)];

  await sock.sendMessage(from, {
    text: `🎱 Swali: ${question}\n🧙 Jibu: ${answer}`
  });
}
