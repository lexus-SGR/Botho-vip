// antiviewonce.mjs
export const command = 'antiviewonce';
export const description = 'Zuia ujumbe wa View Once kwenye group (Admin tu) 🚫';

const antiViewOnceStatus = new Map(); // key: group id, value: boolean

export async function execute(sock, msg, args, from, sender, isGroup, isAdmin) {
  if (!isGroup) {
    return await sock.sendMessage(from, { text: 'Amri hii inapatikana tu kwenye group.' }, { quoted: msg });
  }
  if (!isAdmin) {
    return await sock.sendMessage(from, { text: 'Amri hii ni kwa admin tu.' }, { quoted: msg });
  }

  const option = args[0]?.toLowerCase();
  if (!option || (option !== 'on' && option !== 'off')) {
    return await sock.sendMessage(from, { text: 'Tumia: !antiviewonce on/off' }, { quoted: msg });
  }

  if (option === 'on') {
    antiViewOnceStatus.set(from, true);
    await sock.sendMessage(from, { text: '✅ Anti View Once imewezeshwa kwenye group hii.' }, { quoted: msg });
  } else {
    antiViewOnceStatus.delete(from);
    await sock.sendMessage(from, { text: '❌ Anti View Once imezimwa kwenye group hii.' }, { quoted: msg });
  }
}

// Helper function you can call from your message handler to block view once messages if enabled
export function checkAntiViewOnce(from, message) {
  if (antiViewOnceStatus.get(from)) {
    // Logic to detect view once message type and block or handle accordingly
    // Usually WhatsApp View Once messages have specific properties, e.g.:
    if (message.message?.viewOnceMessage) {
      return true; // Block or ignore this message
    }
  }
  return false;
}
