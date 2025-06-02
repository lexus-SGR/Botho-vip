export const command = 'antispam';
export const description = 'Zuia ujumbe wa spam kwenye group (Admin tu) 🚫';

const spamThreshold = 5; // idadi ya mara ujumbe unaruhusiwa kwa dakika 1
const spamTimeout = 60 * 1000; // 1 dakika kwa millisekondi

// Data structure kuhifadhi historia za ujumbe za watumiaji
const userMessageLog = new Map(); // key: group+user id, value: array ya timestamps

export async function execute(sock, msg, args, from, sender, isGroup, isAdmin) {
  if (!isGroup) {
    return await sock.sendMessage(from, { text: 'Amri hii inapatikana tu kwenye group.' }, { quoted: msg });
  }
  if (!isAdmin) {
    return await sock.sendMessage(from, { text: 'Una haki ya kuwa admin tu kuendesha amri hii.' }, { quoted: msg });
  }

  // Hapa tumia args[0] kama on/off kuanzisha au kuzima anti-spam, kwa sasa tu on/off mapigo
  if (args.length === 0) {
    return await sock.sendMessage(from, { text: 'Tuma "!antispam on" au "!antispam off".' }, { quoted: msg });
  }

  const option = args[0].toLowerCase();

  if (option === 'on') {
    spamEnabled.set(from, true);
    await sock.sendMessage(from, { text: 'Anti-Spam imewashwa kwenye group hii!' }, { quoted: msg });
  } else if (option === 'off') {
    spamEnabled.set(from, false);
    await sock.sendMessage(from, { text: 'Anti-Spam imezimwa kwenye group hii!' }, { quoted: msg });
  } else {
    await sock.sendMessage(from, { text: 'Tuma "!antispam on" au "!antispam off".' }, { quoted: msg });
  }
}

// Kwenye event ya message, tumia function ifuatayo kuangalia spam:

export function checkSpam(from, sender) {
  const key = from + sender;
  const now = Date.now();

  if (!userMessageLog.has(key)) {
    userMessageLog.set(key, []);
  }

  const timestamps = userMessageLog.get(key);
  // Ondoa timestamps za zamani zaidi ya spamTimeout
  while (timestamps.length && now - timestamps[0] > spamTimeout) {
    timestamps.shift();
  }

  timestamps.push(now);

  if (timestamps.length > spamThreshold) {
    // User anafanya spam
    return true;
  }
  return false;
}
