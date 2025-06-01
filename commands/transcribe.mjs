import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default {
  name: "🎙️transcribe",
  description: "Tafsiri sauti kwenda maandishi (Whisper)",
  category: "openai",
  async execute(sock, msg) {
    let media = msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage || msg.message.voiceMessage;
    if (!media) return sock.sendMessage(msg.key.remoteJid, { text: "Tuma voice note au reply voice note." }, { quoted: msg });
    const buffer = await sock.downloadMediaMessage({ message: { audioMessage: media } });

    try {
      // Andika buffer kwenye file kwa muda mfupi
      fs.writeFileSync("./tmp/audio.ogg", buffer);
      const transcript = await openai.audio.transcriptions.create({
        file: fs.createReadStream("./tmp/audio.ogg"),
        model: "whisper-1"
      });
      await sock.sendMessage(msg.key.remoteJid, { text: `Transcription:\n${transcript.text}` }, { quoted: msg });
      fs.unlinkSync("./tmp/audio.ogg");
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: "Kosa katika kutafsiri sauti." }, { quoted: msg });
    }
  }
};
