import fetch from "node-fetch";

export default {
  name: "🎨multistable",
  description: "Tengeneza picha nyingi kwa maelezo (Stability AI)",
  category: "stability",
  async execute(sock, msg, args) {
    if (!args.length) return sock.sendMessage(msg.key.remoteJid, { text: "Tafadhali andika maelezo ya picha." }, { quoted: msg });

    const prompt = args.join(" ");
    const apiKey = process.env.STABILITY_API_KEY;

    try {
      const response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          clip_guidance_preset: "FAST_BLUE",
          height: 512,
          width: 512,
          samples: 3,  // Tunga picha 3
          steps: 30
        })
      });

      if (!response.ok) throw new Error(`Kosa: ${response.statusText}`);

      const data = await response.json();
      if (!data.artifacts || !data.artifacts.length) throw new Error("Hakuna picha iliyopatikana.");

      for (let i = 0; i < data.artifacts.length; i++) {
        const base64 = data.artifacts[i].base64;
        const buffer = Buffer.from(base64, "base64");
        await sock.sendMessage(msg.key.remoteJid, { image: buffer, caption: `Picha #${i+1} kwa: "${prompt}"` }, { quoted: msg });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: "Kosa limejitokeza katika kutengeneza picha. Jaribu tena." }, { quoted: msg });
    }
  }
};
