export const command = 'antiwame';
export const description = 'Zuia watu wengi ku-join group kwa wakati mmoja (Admin tu) 🚫';

const antiwameGroups = new Set();

export async function execute(sock, msg, args, from, sender, isGroup, isAdmin) {
  if (!isGroup) return await sock.sendMessage(from, { text: 'Amri hii inapatikana tu kwenye group.' }, { quoted: msg });
  if (!isAdmin) return await sock.sendMessage(from, { text: 'Amri hii ni kwa admin tu.' }, { quoted: msg });

  const option = args[0]?.toLowerCase();
  if (!option || (option !== 'on' && option !== 'off')) {
    return await sock.sendMessage(from, { text: 'Tumia: !antiwame on/off' }, { quoted: msg });
  }

  if (option === 'on') {
    antiwameGroups.add(from);
    await sock.sendMessage(from, { text: '✅ Anti Wame imewezeshwa.' }, { quoted: msg });
  } else {
    antiwameGroups.delete(from);
    await sock.sendMessage(from, { text: '❌ Anti Wame imezimwa.' }, { quoted: msg });
  }
}

export function checkWame(from, participants) {
  if (!antiwameGroups.has(from)) return false;
  // Check for many people joining at once - example logic
  if (participants.length > 10) {
    return true; // too many joins
  }
  return false;
}
