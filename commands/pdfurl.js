const axios = require("axios");

module.exports = {
  name: "extractpdf",
  description: "Extract text from PDF URL",
  usage: "extractpdf <pdf_url>",
  category: "tools",
  react: "📄",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Please provide a PDF URL." }, { quoted: msg });

    const pdfUrl = args[0];
    try {
      await sock.sendMessage(from, { react: { text: "📄", key: msg.key } });

      const res = await axios.post("https://api.pdftools.example/extract", {
        api_key: process.env.PDF_API_KEY,
        url: pdfUrl
      });

      if (!res.data.text) return sock.sendMessage(from, { text: "❌ Could not extract text." }, { quoted: msg });

      const text = res.data.text.length > 1000 ? res.data.text.slice(0, 1000) + "..." : res.data.text;

      await sock.sendMessage(from, { text: `📄 Extracted PDF Text:\n\n${text}` }, { quoted: msg });

    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: "⚠️ PDF extraction failed." }, { quoted: msg });
    }
  }
};
