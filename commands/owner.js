module.exports = {
  name: "owner",
  description: "Display the owner's contact info 🧑‍💻",
  category: "utility",
  react: "👑",
  usage: "owner",
  async execute(sock, msg, args, from, sender) {
    const ownerNumber = "255654478605@s.whatsapp.net";
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Bot Owner 🤖
TEL;type=CELL;type=VOICE;waid=255654478605:+255 654 478 605
END:VCARD`;
    
    await sock.sendMessage(from, {
      contacts: {
        displayName: "Bot Owner 🤖",
        contacts: [{ vcard }]
      }
    }, { quoted: msg });
  }
};
