import fetch from 'node-fetch'
import chalk from 'chalk'

export const command = 'removebg'
export const desc = '🖼️ Ondoa background ya picha kwa kutumia Remove.bg API'

export const handler = async (m, { conn, quoted, usedPrefix }) => {
  if (!quoted || !quoted.message.imageMessage) return m.reply(`Tuma picha kama reply, kisha tumia:\n${usedPrefix}removebg`)

  try {
    await m.reply('🖼️ Inaondoa background, subiri kidogo...')

    // Pata picha ya reply
    const stream = await conn.downloadMediaMessage(quoted)
    const buffer = Buffer.from(await stream.arrayBuffer())

    // Prepare form data
    const formData = new FormData()
    formData.append('image_file', buffer, 'image.jpg')

    const res = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_KEY
      },
      body: formData
    })

    if (!res.ok) {
      const err = await res.json()
      return m.reply(`❌ Tatizo: ${err.errors?.[0]?.title || res.statusText}`)
    }

    const resultBuffer = await res.buffer()

    await conn.sendMessage(m.chat, { image: resultBuffer, caption: '🖼️ Background imeondolewa!' }, { quoted: m })

  } catch (error) {
    console.log(chalk.red('[REMOVEBG ERROR]'), error)
    await m.reply('❌ Tatizo limetokea wakati wa kuondoa background.')
  }
}
