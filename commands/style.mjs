import fetch from "node-fetch";

export default {
  name: "🎭style",
  description: "Tengeneza picha kwa mtindo maalum (Stability AI)",
  category: "stability",
  async execute(sock, msg, args) {
    if (args.length < 2) return sock.sendMessage(msg.key.remoteJid, { text: "Tumia: !style <mtindo> <maelezo>" }, { quoted: msg });

    const style = args.shift();
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
          text_prompts: [{ text: `${prompt}, style: ${style}` }],
          cfg_scale: 7,
          clip_guidance_preset: "FAST_BLUE",
          height: 512,
          width: 512,
          samples: 1,
          steps: 30
        })
      });

      if (!response.ok) throw new Error(`Kosa: ${response.statusText}`);

      const data = await response.json();
      if (!data.artifacts || !data.artifacts.length) throw new Error("Hakuna picha iliyopatikana.");

      const base64 = data.artifacts[0].base64;
      const buffer = Buffer.from(base64, "base64");

      await sock.sendMessage(msg.key.remoteJid, { image: buffer, caption: `Picha yako kwa mtindo: ${style}` }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: "Kosa limejitokeza katika kutengeneza picha." }, { quoted: msg });
    }
  }
};
