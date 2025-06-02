export const command = 'islamicdua';
export const description = 'Send a random Islamic dua (dua za kiislamu) 🙏';

const duas = [
  'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
  'اللهم إني أسألك العفو والعافية في الدنيا والآخرة',
  'اللهم اجعلني من التوابين واجعلني من المتطهرين'
];

export async function execute(sock, msg, args) {
  const randomDua = duas[Math.floor(Math.random() * duas.length)];
  await sock.sendMessage(msg.key.remoteJid, { text: `🤲 Dua ya Kislamu:\n\n${randomDua}` }, { quoted: msg });
}
