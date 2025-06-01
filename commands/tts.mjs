import axios from 'axios'
import figlet from 'figlet'
import chalk from 'chalk'

export const command = 'tts'
export const desc = '🎤 Tungoee maneno kuwa sauti (Text to Speech)'
export const handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🎤 *Text to Speech*\n\n🤖 Tumia mfano:\n${usedPrefix}${command} Hello, how are you?`)
  }

  try {
    const loadingText = figlet.textSync('Voice RSS', { font: 'Standard' })
    await m.reply(`\`\`\`\n${loadingText}\n\`\`\`\n\n🎤 *Inatengeneza sauti... Tafadhali subiri...*`)

    const params = new URLSearchParams({
      key: process.env.VOICE_RSS_KEY,
      hl: 'en-us',
      src: text,
      c: 'MP3',
      f: '44khz_16bit_stereo',
      r: '0',
    })

    const url = `https://api.voicerss.org/?${params.toString()}`
    await conn.sendMessage(m.chat, { audio: { url }, mimetype: 'audio/mpeg' }, { quoted: m })

  } catch (error) {
    console.log(chalk.red('[VOICE RSS ERROR]'), error)
    await m.reply('❌ Imeshindikana kutengeneza sauti. Jaribu tena baadaye.')
  }
}
