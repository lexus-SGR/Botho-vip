const axios = require("axios");

module.exports = {
  name: "pdfurl",
  description: "Convert a webpage URL to PDF",
  usage: "pdfurl <webpage URL>",
  category: "tools",
  react: "📄",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    if (!args.length) {
      return sock.sendMessage(from, { text: "❌ Please provide a webpage URL." }, { quoted: msg });
    }

    const url = args[0];
    try {
      await sock.sendMessage(from, { react: { text: "📄", key: msg.key }});

      const response = await axios.get(`https://api.pdf.co/v1/pdf/convert/from/url?name=webpage.pdf&url=${encodeURIComponent(url)}`, {
        headers: { "x-api-key": process.env.PDF_API_KEY }
      });

      if (!response.data || !response.data.url) {
        return sock.sendMessage(from, { text: "❌ Failed to convert URL to PDF." }, { quoted: msg });
      }

      const pdfUrl = response.data.url;
      await sock.sendMessage(from, {
        document: { url: pdfUrl },
        mimetype: "application/pdf",
        fileName: "webpage.pdf",
        caption: `📄 PDF generated from ${url}`
      }, { quoted: msg });

    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: "⚠️ Error converting URL to PDF." }, { quoted: msg });
    }
  }
};
