import fetch from "node-fetch";

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY; // you must set your own api key

export default {
  name: "weather",
  description: "🌤️ Get weather by city / Pata hali ya hewa kwa mji",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "🌤️", key: msg.key } });

      if (!args.length) {
        await sock.sendMessage(from, { text: "⚠️ Please provide a city name.\nTafadhali andika jina la mji." });
        return;
      }

      const city = args.join(" ");
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;

      const res = await fetch(url);
      if (!res.ok) {
        await sock.sendMessage(from, { text: "⚠️ Could not find weather for that city.\nHaiwezi kupata hali ya hewa ya mji huo." });
        return;
      }

      const data = await res.json();

      const weatherReport = `
🌍 City: ${data.name}, ${data.sys.country}
🌡️ Temperature: ${data.main.temp}°C
🌬️ Wind: ${data.wind.speed} m/s
💧 Humidity: ${data.main.humidity}%
☁️ Condition: ${data.weather[0].description}

🌍 Jiji: ${data.name}, ${data.sys.country}
🌡️ Joto: ${data.main.temp}°C
🌬️ Upepo: ${data.wind.speed} m/s
💧 Unyevu: ${data.main.humidity}%
☁️ Hali: ${data.weather[0].description}
      `;

      await sock.sendMessage(from, { text: weatherReport });

    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Error fetching weather data.\nHitilafu wakati wa kupata hali ya hewa." });
      console.error("Weather command error:", error);
    }
  },
};
