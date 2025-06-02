export const command = '😁dare';
export const description = 'Give a funny dare 🎯';

export async function execute(sock, msg, args) {
  const dares = [
    "Send a voice note saying 'I am a chicken 🐔'",
    "Text your crush 'I like you' 😅",
    "Send a funny selfie in the group 🤳",
    "Change your profile pic to a cartoon character for 1 hour 🤖"
  ];
  const dare = dares[Math.floor(Math.random() * dares.length)];
  await sock.sendMessage(msg.key.remoteJid, { text: `🎯 *Dare Task*\n\n${dare}` }, { quoted: msg });
}
