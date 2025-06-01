import fetch from "node-fetch";

export default {
  name: "joke",
  description: "😂 Send a joke / Tuma utani",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "😂", key: msg.key } });

      let jokeText;

      try {
        // Try fetching random joke from joke API
        const res = await fetch("https://official-joke-api.appspot.com/random_joke");
        if (!res.ok) throw new Error("API error");

        const jokeData = await res.json();
        jokeText = `${jokeData.setup}\n${jokeData.punchline}`;
      } catch {
        // fallback joke
        jokeText = "Why don't computers go to the hospital? Because they have viruses! 😂\nKwa nini kompyuta haendi hospitalini? Kwa sababu zina virusi! 😂";
      }

      await sock.sendMessage(from, { text: jokeText });
    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Error occurred while fetching joke.\nHitilafu wakati wa kupata utani." });
      console.error("Joke command error:", error);
    }
  },
};
