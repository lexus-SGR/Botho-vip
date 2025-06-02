export default {
  name: "😁getstatus",
  description: "Soma status ya mtumiaji 📄",
  category: "status",
  usage: "!getstatus 2557xxxxxxxx",
  async execute(sock, msg, args) {
    if (!args[0]) {
      return await sock.sendMessage(msg.key.remoteJid, { text: "Tumia: !getstatus 2557xxxxxxxx" }, { quoted: msg });
    }

    const jid = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    const status = await sock.fetchStatus(jid);

    await sock.sendMessage(msg.key.remoteJid, {
      text: `📄 *Status ya ${args[0]}:*\n${status?.status || "Hakuna status iliyowekwa."}`,
    }, { quoted: msg });
  }
};
