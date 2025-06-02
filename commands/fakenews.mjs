export const command = '😁fakenews';
export const description = 'Send a fake news headline 📰';

export async function execute(sock, msg, args) {
  const headlines = [
    'Aliens land in Nairobi and demand Nyama Choma 🍖🛸',
    'President bans sleeping during the day 😴🚫',
    'Man sues mirror for identity theft 🪞⚖️'
  ];
  const headline = headlines[Math.floor(Math.random() * headlines.length)];
  await sock.sendMessage(msg.key.remoteJid, { text: `🗞️ *Fake News!*\n\n${headline}` }, { quoted: msg });
}
