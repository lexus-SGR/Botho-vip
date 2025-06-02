export const command = 'islamicgreeting';
export const description = 'Send an Islamic greeting message (Salamu za Kiislamu) 🌙';

const greetings = [
  'السلام عليكم ورحمة الله وبركاته',
  'جزاكم الله خيرًا',
  'بارك الله فيك'
];

export async function execute(sock, msg, args) {
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  await sock.sendMessage(msg.key.remoteJid, { text: `🌙 Salamu za Kiislamu:\n\n${randomGreeting}` }, { quoted: msg });
}
