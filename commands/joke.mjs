export const command = "joke";
export const description = "😂 Get a funny random joke!";

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

export async function handler(sock, msg, args) {
  const jokes = [
    "🤣 Why don't scientists trust atoms?\n🔬 Because they make up everything!",
    "🐔 Why did the chicken join a band?\n🥁 Because it had the drumsticks!",
    "📘 I'm reading a book on anti-gravity...\n😄 It's impossible to put down!"
  ];

  const selected = jokes[Math.floor(Math.random() * jokes.length)];

  await sock.sendMessage(msg.key.remoteJid, { text: "🧠 Thinking of a joke..." }, { quoted: msg });
  await delay(1000);
  await sock.sendMessage(msg.key.remoteJid, { text: selected }, { quoted: msg });
}
