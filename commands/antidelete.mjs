export const command = 'antidelete';
export const description = 'Zuia watu kufuta ujumbe kwenye group (Admin tu) 🚫❌';

let antiDeleteEnabled = new Map(); // Key: group id, Value: true/false

export async function execute(sock, msg, args, from, sender, isGroup, isAdmin) {
  if (!isGroup) {
    return await sock.sendMessage(from, { text: 'Amri hii inapatikana tu kwenye group.' }, { quoted: msg });
  }
  if (!isAdmin) {
    return await sock.sendMessage(from, { text: 'Una haki ya kuwa admin tu kuendesha amri hii.' }, { quoted: msg });
  }

  if (args.length === 0) {
    return await sock.sendMessage(from, { text: 'Tuma "!antidelete on" au "!antidelete off".' }, { quoted: msg });
  }

  const option = args[0].toLowerCase();

  if (option === 'on') {
    antiDeleteEnabled.set(from, true);
    await sock.sendMessage(from, { text: 'Anti-delete imewashwa kwenye group hii!' }, { quoted: msg });
  } else if (option === 'off') {
    antiDeleteEnabled.set(from, false);
    await sock.sendMessage(from, { text: 'Anti-delete imezimwa kwenye group hii!' }, { quoted: msg });
  } else {
    await sock.sendMessage(from, { text: 'Tuma "!antidelete on" au "!antidelete off".' }, { quoted: msg });
  }
}

// In your main message handler, listen for deleted messages and re-send if anti-delete enabled:
// if (antiDeleteEnabled.get(msg.key.remoteJid)) {
//    // re-send deleted message content here
// }
