import fs from "fs";

const filePath = "./antilink_config.json";
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}));

export default {
  name: "antilink",
  description: "🛡️ Simamia ulinzi dhidi ya link kwenye magroup",
  async execute(sock, msg, args, from) {
    try {
      const isGroup = from.endsWith("@g.us");
      if (!isGroup) {
        return await sock.sendMessage(from, {
          text: "❌ Amri hii inafanya kazi kwenye magroup pekee."
        }, { quoted: msg });
      }

      const groupMetadata = await sock.groupMetadata(from);
      const groupAdmins = groupMetadata.participants
        .filter(p => p.admin !== null)
        .map(p => p.id);

      const sender = msg.key.participant || msg.participant || msg.key.remoteJid;
      if (!groupAdmins.includes(sender)) {
        return await sock.sendMessage(from, {
          text: "⛔ Ni admin pekee anayeweza kubadilisha antilink settings."
        }, { quoted: msg });
      }

      // Soma config na andaa default kama haipo
      const config = JSON.parse(fs.readFileSync(filePath));
      config[from] = config[from] || { active: false, action: "kick", whitelist: [] };

      const option = args[0]?.toLowerCase();

      if (option === "on") {
        config[from].active = true;
      } else if (option === "off") {
        config[from].active = false;
      } else if (["kick", "delete", "warn"].includes(option)) {
        config[from].action = option;
      } else if (option === "status") {
        return await sock.sendMessage(from, {
          text: `📊 *Antilink Status*\n\n🛡️ Active: ${config[from].active ? "ON" : "OFF"}\n⚙️ Action: ${config[from].action.toUpperCase()}\n📋 Whitelist: ${config[from].whitelist.join(", ") || "None"}`,
        }, { quoted: msg });
      } else {
        return await sock.sendMessage(from, {
          text: `🛠️ Matumizi:\n\n🔹 *!antilink on/off*\n🔹 *!antilink kick/delete/warn*\n🔹 *!antilink status*`
        }, { quoted: msg });
      }

      // Andika upya config file
      fs.writeFileSync(filePath, JSON.stringify(config));

      await sock.sendMessage(from, {
        text: `✅ *Antilink Updated*\n\n🛡️ Active: ${config[from].active ? "ON" : "OFF"}\n⚙️ Action: ${config[from].action}`,
        react: { text: "🛡️", key: msg.key }
      });

    } catch (error) {
      console.error("❌ Antilink error:", error);
      await sock.sendMessage(from, {
        text: "❌ Hitilafu imetokea wakati wa kutekeleza antilink command."
      });
    }
  }
};
