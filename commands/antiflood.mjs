export const command = 'antiflood';
export const description = 'Zuia flood ya messages (Admin tu) 🚫';

const floodThreshold = 10; // max messages in interval
const floodIntervalMs = 8000;
const floodData = new Map();

export async function execute(sock, msg, args, from, sender, isGroup, isAdmin) {
  if (!isGroup) return await sock.sendMessage(from, { text: 'Amri hii inapatikana tu kwenye group.' }, { quoted: msg });
  if (!isAdmin) return await sock.sendMessage(from, { text: 'Amri hii ni kwa admin tu.' }, { quoted: msg });

  const option = args[0]?.toLowerCase();
  if (!option || (option !== 'on' && option !== 'off')) {
    return await sock.sendMessage(from, { text: 'Tumia: !antiflood on/off' }, { quoted: msg });
  }

  if (option === 'on') {
    floodData.set(from, { enabled: true, users: new Map() });
    await sock.sendMessage(from, { text: '✅ Anti Flood imewezeshwa.' }, { quoted: msg });
  } else {
    floodData.set(from, { enabled: false, users: new Map() });
    await sock.sendMessage(from, { text: '❌ Anti Flood imezimwa.' }, { quoted: msg });
  }
}

export function onMessage(from, sender) {
  const groupData = floodData.get(from);
  if (!groupData?.enabled) return false;

  const users = groupData.users;
  const now = Date.now();

  if (!users.has(sender)) {
    users.set(sender, []);
  }

  const timestamps = users.get(sender);
  timestamps.push(now);

  // Clear old timestamps outside interval
  while (timestamps.length && now - timestamps[0] > floodIntervalMs) {
    timestamps.shift();
  }

  if (timestamps.length > floodThreshold) {
    return true; // flood detected
  }
  return false;
}
