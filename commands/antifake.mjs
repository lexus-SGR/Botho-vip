export const command = 'antifake';
export const description = 'Zuia fake profiles kwenye group (Admin tu) 🚫';

const antifakeGroups = new Set();

export async function execute(sock, msg, args, from, sender, isGroup, isAdmin) {
  if (!isGroup) return await sock.sendMessage(from, { text: 'Amri hii inapatikana tu kwenye group.' }, { quoted: msg });
  if (!isAdmin) return await sock.sendMessage(from, { text: 'Amri hii ni kwa admin tu.' }, { quoted: msg });

  const option = args[0]?.toLowerCase();
  if (!option || (option !== 'on' && option !== 'off')) {
    return await sock.sendMessage(from, { text: 'Tumia: !antifake on/off' }, { quoted: msg });
  }

  if (option === 'on') {
    antifakeGroups.add(from);
    await sock.sendMessage(from, { text: '✅ Anti Fake imewezeshwa.' }, { quoted: msg });
  } else {
    antifakeGroups.delete(from);
    await sock.sendMessage(from, { text: '❌ Anti Fake imezimwa.' }, { quoted: msg });
  }
}

export function checkFakeProfile(from, sender, participants) {
  if (!antifakeGroups.has(from)) return false;

  // Example: check if sender is not in group participants (fake)
  const isParticipant = participants.includes(sender);
  if (!isParticipant) {
    return true; // fake profile
  }
  return false;
}
