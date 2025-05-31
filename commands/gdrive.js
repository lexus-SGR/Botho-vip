module.exports = {
  name: "gdrive",
  description: "Download Google Drive file by public link",
  usage: "gdrive <Google Drive URL>",
  async execute(sock, msg, args, from, sender) {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Please provide a Google Drive link." }, { quoted: msg });

    const url = args[0];
    if (!url.includes("drive.google.com")) {
      return sock.sendMessage(from, { text: "❌ Invalid Google Drive URL." }, { quoted: msg });
    }

    // Extract file ID
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (!fileIdMatch) return sock.sendMessage(from, { text: "❌ Failed to extract file ID." }, { quoted: msg });

    const fileId = fileIdMatch[0];
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    try {
      await sock.sendMessage(from, { text: "⏳ Downloading file from Google Drive..." }, { quoted: msg });
      await sock.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: "application/octet
