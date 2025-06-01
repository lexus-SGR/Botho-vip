// ✅ Command 1: ping.mjs

import figlet from "figlet";

export default { name: "ping", description: "Check bot response time", async execute(sock, msg, args, from, sender, isGroup) { const start = Date.now(); await sock.sendMessage(from, { react: { text: "🏓", key: msg.key }, });

const latency = Date.now() - start;
const textArt = figlet.textSync("PONG!", { horizontalLayout: "default" });
const response = `

[1mPong! 🥊 Response Time: ${latency}ms

``` ${textArt} ````;

await sock.sendMessage(from, { text: response });

}, };

