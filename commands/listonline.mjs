export default {
  name: "listonline",
  description: "Ona majina ya watu walioko online kwenye group",
  category: "group",
  usage: "!listonline",
  async execute(sock, msg) {
    const { from, isGroup, key } = msg;
    if (!isGroup) {
      return await sock.sendMessage(from, { text: "Command hii ni kwa group tu." }, { quoted: msg });
    }

    const groupMetadata = await sock.groupMetadata(from);
    const presence = sock.presences.get(from) || {};

    const onlineParticipants = [];
    for (const [participant, presenceInfo] of Object.entries(presence)) {
      if (presenceInfo.presence === 'available') {
        const user = groupMetadata.participants.find(p => p.id === participant);
        if (user) onlineParticipants.push(user.id.split("@")[0]);
      }
    }

    if (onlineParticipants.length === 0) {
      await sock.sendMessage(from, { text: "Hakuna mtu yuko online sasa." }, { quoted: msg });
      // react with sad emoji 😔
      await sock.sendMessage(from, { react: { text: "😔", key } });
      return;
    }

    const onlineList = onlineParticipants.map(u => `@${u}`).join('\n');
    await sock.sendMessage(from, { text: `Watu walioko online:\n${onlineList}`, mentions: onlineParticipants.map(u => u + '@s.whatsapp.net') }, { quoted: msg });

    // react with eyes emoji 👀
    await sock.sendMessage(from, { react: { text: "👀", key } });
  }
};
