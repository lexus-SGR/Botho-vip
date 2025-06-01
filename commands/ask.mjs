// ask.mjs - OpenAI ChatGPT 🧠 import axios from 'axios'; import figlet from 'figlet';

export async function askCommand(m, text) { if (!text) return m.reply('🧠 Tuma swali, mfano: 😁ask what is quantum computing?');

try { const response = await axios.post('https://api.openai.com/v1/chat/completions', { model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: text }] }, { headers: { 'Authorization': Bearer ${process.env.OPENAI_API_KEY}, 'Content-Type': 'application/json' } });

const reply = response.data.choices[0].message.content.trim();
const art = figlet.textSync('Loveness AI 🤖', { font: 'Slant' });
m.reply(`🧠 *AI Response:*

${reply}

``` ${art} ````); } catch (err) { console.error(err); m.reply('❌ Imeshindikana kuwasiliana na AI.'); } }

