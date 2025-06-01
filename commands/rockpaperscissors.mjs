export default {
  name: "rps",
  description: "Cheza Mawe (rock), Karatasi (paper), Mkato (scissors) na bot",
  category: "games",
  usage: "!rps <rock|paper|scissors>",
  async execute(sock, msg) {
    const { from, body, key } = msg;
    const args = body.split(' ').slice(1);
    if (!args.length) {
      return await sock.sendMessage(from, { text: "Tuma moja kati ya: rock, paper, scissors." }, { quoted: msg });
    }

    const userChoice = args[0].toLowerCase();
    const validChoices = ["rock", "paper", "scissors"];
    if (!validChoices.includes(userChoice)) {
      return await sock.sendMessage(from, { text: "Chaguo sio sahihi. Tuma rock, paper, au scissors." }, { quoted: msg });
    }

    const botChoice = validChoices[Math.floor(Math.random() * 3)];
    let result = "";

    if (userChoice === botChoice) result = "Sawa! Ni sare! 🤝";
    else if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    ) result = "Umeshinda! 🎉";
    else result = "Umeshindwa! 😢";

    await sock.sendMessage(from, { text: `Umechagua: ${userChoice}\nBot ame-chagua: ${botChoice}\n\n${result}` }, { quoted: msg });
    await sock.sendMessage(from, { react: { text: "🎮", key } });
  }
};
