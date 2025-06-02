export const command = '😁truth';
export const description = 'Play Truth: answer honestly 😅';

export async function execute(sock, msg) {
  const truths = [
    "Have you ever lied to your best friend? 😳",
    "What's the most embarrassing thing you've done? 🙈",
    "Who was your last crush? 💘",
  ];
  const question = truths[Math.floor(Math.random() * truths.length)];
  await sock.sendMessage(msg.key.remoteJid, { text: `🗣️ *Truth:*\n${question}` }, { quoted: msg });
}
