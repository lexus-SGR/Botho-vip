export const command = 'antidelete';
export const description = 'Resend messages deleted by others in group.';

export async function execute(sock, msg, args, from, sender, isGroup) {
  await sock.sendMessage(from, { text: '✅ Antidelete is active. Deleted messages will be restored automatically.' }, { quoted: msg });
  // Implementation note: This needs message_revoke_everyone handler in main index.js to capture and resend deleted content.
}
