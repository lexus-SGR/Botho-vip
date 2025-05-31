const axios = require("axios");

module.exports = {
  name: "tts",
  description: "Convert text to speech (VoiceRSS)",
  usage: "tts <text>",
  category: "audio",
  react: "🎤",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Enter text to convert." }, { quoted: msg });

    const text = args.join(" ");
    try {
      await sock.sendMessage(from, { react: { text: "🎤", key: msg.key }});

      const apiKey = process.env.VOICE_RSS_KEY;
      const url = `https://api.voicerss.org/?key=${apiKey}&hl=en-us&src=${encodeURIComponent(text)}&c=mp3&f=44khz_16bit_stereo`;

      await sock.sendMessage(from, {
        audio: { url: url },
        mimetype: "audio/mpeg",
        ptt: false,
        fileName: `tts.mp3`,
        caption: `🎤 Text to Speech: ${text}`
      }, { quoted: msg });

    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: "⚠️ Text-to-Speech error." }, { quoted: msg });
    }
  }
};
