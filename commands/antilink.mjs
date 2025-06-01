import fs from "fs";
const filePath = "./antilink_config.json";

if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}));

export default {
  name: "antilink",
  description: "⚙️ Simamia ulinzi wa link kwenye group",
  category: "group",
  usage: "😁antilink on/off/delete/kick/warn/status",
  async execute(sock, msg, args) {
    const { from, isGroup, sender } = msg;
    if (!isGroup) return sock.sendMessage(from, { text: "❌ Amri hii inafanya kazi kwenye group tu." }, { quoted: msg });

    const groupMetadata = await sock.groupMetadata(from);
    const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
    if (!groupAdmins.includes(sender)) return sock.sendMessage(from, { text: "⛔ Ni Admin pekee anaweza kubadilisha Antilink." }, { quoted: msg });

    const conf = JSON.parse(fs.readFileSync(filePath));
    conf[from] = conf[from] || { active: false, action: "kick", whitelist: [] };

    const arg = args[0]?.toLowerCase();

    if (arg === "on") {
      conf[from].active = true;
    } else if (arg === "off") {
      conf[from].active = false;
    } else if (["kick", "delete", "warn"].includes(arg)) {
      conf[from].action = arg;
    } else if (arg === "status") {
      return sock.sendMessage(from, {
        text: `📊 *Antilink Status*\n\n🛡️ Active: ${conf[from].active ? "ON" : "OFF"}\n⚙️ Action: ${conf[from].action.toUpperCase()}\n📋 Whitelist: ${conf[from].whitelist.join(", ") || "None"}`
      }, { quoted: msg });
    } else {
      return sock.sendMessage(from, {
        text: `🛠️ Tumia:\n😁antilink on/off\n😁antilink kick/delete/warn\n😁antilink status`
      }, { quoted: msg });
    }

    fs.writeFileSync(filePath, JSON.stringify(conf));
    return sock.sendMessage(from, {
      text: `✅ Antilink imewekwa:\n🛡️ Active: ${conf[from].active}\n⚙️ Action: ${conf[from].action}`,
      react: { text: "🛡️", key: msg.key }
    });
  }
};
