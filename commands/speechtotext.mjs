import fs from 'fs'
import { Configuration, OpenAIApi } from 'openai'
import chalk from 'chalk'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export const command = 'transcribe'
export const desc = '🎤 Geuza sauti kutoka voice note kuwa maandishi. Mfano: !transcribe (reply kwenye voice note)'

export const handler = async (m, { client, quoted, usedPrefix }) => {
  try {
    if (!quoted || !quoted.message.audioMessage) return m.reply(`Tafadhali jibu (reply) voice note kwa kutumia: ${usedPrefix}transcribe`)

    const media = await client.downloadMediaMessage(quoted)
    const buffer = Buffer.from(media)

    fs.writeFileSync('./temp/audio.ogg', buffer)

    const transcription = await openai.createTranscription(
      fs.createReadStream('./temp/audio.ogg'),
      'whisper-1'
    )

    fs.unlinkSync('./temp/audio.ogg')

    await m.reply(`📝 Matokeo ya transcription:\n\n${transcription.data.text}`)

  } catch (error) {
    console.log(chalk.red('[TRANSCRIBE ERROR]'), error)
    m.reply('❌ Tatizo limetokea wakati wa transcription ya sauti.')
  }
}
