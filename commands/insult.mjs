export const command = '😁insult';
export const description = 'Toa tusi la kuchekesha 😂';

export async function execute(sock, msg) {
  const insults = [
    "You're as useless as the 'g' in lasagna. 😅",
    "You bring everyone so much joy… when you leave the room. 🚪",
    "You have something on your chin… no, the third one down. 😆"
  ];
  const insult = insults[Math.floor(Math.random() * insults.length)];
  await sock.sendMessage(msg.key.remoteJid, { text: insult }, { quoted: msg });
}
