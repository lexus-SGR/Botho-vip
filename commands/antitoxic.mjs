export const command = 'antitoxic';
export const description = 'Zuia maneno mabaya au toxic kwenye group (Admin tu) 🚫';

const antitoxicGroups = new Set();
const bannedWords = ['badword1', 'badword2', 'badword3']; // Bad words to detect

export async function execute(sock, msg, args, from, sender, isGroup, isAdmin) {
  if (!isGroup) return await sock.sendMessage(from, { text: 'Amri hii inapatikana tu kwenye group.' }, { quoted: msg });
  if (!isAdmin) return await sock.sendMessage(from, { text: 'Amri hii ni kwa admin tu.' }, { quoted: msg });

  const option = args[0]?.toLowerCase();
  if (!option || (option !== 'on' && option !== 'off')) {
    return await sock.sendMessage(from, { text: 'Tumia: !antitoxic on/off' }, { quoted: msg });
  }

  if (option === 'on') {
    antitoxicGroups.add(from);
    await sock.sendMessage(from, { text: '✅ Anti Toxic imewezeshwa.' }, { quoted: msg });
  } else {
    antitoxicGroups.delete(from);
    await sock.sendMessage(from, { text: '❌ Anti Toxic imezimwa.' }, { quoted: msg });
  }
}

export function checkToxic(from, message) {
  if (!antitoxicGroups.has(from)) return false;
  const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
  const lower = text.toLowerCase();
  return bannedWords.some(word => lower.includes(word));
}
