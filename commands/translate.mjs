import fetch from "node-fetch";

const TRANSLATE_API_KEY = process.env.DEEPL_API_KEY; // or use another translate api

export default {
  name: "translate",
  description: "🌐 Translate text / Tafsiri maneno",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "🌐", key: msg.key } });

      if (args.length < 2) {
        await sock.sendMessage(from, { text: "⚠️ Usage: !translate <lang_code> <text>\nMfano: !translate sw Hello\nTafadhali toa lugha na maneno." });
        return;
      }

      const targetLang = args[0];
      const textToTranslate = args.slice(1).join(" ");

      // Using LibreTranslate (free API) as example
      const res = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        body: JSON.stringify({
          q: textToTranslate,
          source: "auto",
          target: targetLang,
          format: "text"
        }),
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        await sock.sendMessage(from, { text: "⚠️ Translation service error.\nHuduma ya tafsiri haipatikani." });
        return;
      }

      const data = await res.json();

      const reply = `
🗣️ Original: ${textToTranslate}
📝 Translated (${targetLang}): ${data.translatedText}

🗣️ Asili: ${textToTranslate}
📝 Imetafsiriwa (${targetLang}): ${data.translatedText}
      `;

      await sock.sendMessage(from, { text: reply });

    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Error occurred during translation.\nHitilafu wakati wa tafsiri." });
      console.error("Translate command error:", error);
    }
  },
};
