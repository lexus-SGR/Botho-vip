import { exec } from "child_process";
import fs from "fs";
import util from "util";
const execAsync = util.promisify(exec);

export default {
  name: "tts",
  description: "Soma maandishi kwa sauti 🔊",
  category: "audio",
  usage: "!tts Habari yako leo?",
  async execute(sock, msg, args) {
    const text = args.join(" ");
    if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Andika maandishi ya kusoma. Mf: `!tts Jina langu ni Ali`" });

    const fileName = "./tts.mp3";
    await execAsync(`gtts-cli "${text}" --lang=sw --output=${fileName}`);

    const audioBuffer = fs.readFileSync(fileName);
    await sock.sendMessage(msg.key.remoteJid, { audio: audioBuffer, mimetype: 'audio/mp4', ptt: true }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, { react: { text: "🎧", key: msg.key } });

    fs.unlinkSync(fileName);
  }
};
