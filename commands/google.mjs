import fetch from 'node-fetch'
import chalk from 'chalk'

export const command = 'google'
export const desc = '🔍 Tafuta kitu mtandaoni kupitia Google Search'

export const handler = async (m, { text, usedPrefix }) => {
  if (!text) return m.reply(`Tumia:\n${usedPrefix}google <nini unataka kutafuta>`)

  try {
    await m.reply('🔎 Natafuta... Subiri kidogo.')

    const apiKey = process.env.SERPAPI_KEY
    const searchUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(text)}&api_key=${apiKey}`

    const res = await fetch(searchUrl)
    if (!res.ok) return m.reply('❌ Tatizo katika kupata majibu kutoka Google.')

    const data = await res.json()

    if (!data.organic_results || data.organic_results.length === 0) {
      return m.reply('❌ Hakuna matokeo yalipatikana.')
    }

    let replyText = `🔍 Matokeo ya Google kwa: *${text}*\n\n`

    // Ongeza matokeo 3 ya juu
    data.organic_results.slice(0, 3).forEach((result, i) => {
      replyText += `📌 *${i + 1}. ${result.title}*\n`
      replyText += `${result.snippet || 'Hakuna maelezo'}\n`
      replyText += `🔗 ${result.link}\n\n`
    })

    await m.reply(replyText)

  } catch (error) {
    console.log(chalk.red('[GOOGLE SEARCH ERROR]'), error)
    await m.reply('❌ Tatizo limetokea wakati wa kutafuta Google.')
  }
}
