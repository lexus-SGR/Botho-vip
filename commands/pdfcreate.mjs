import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export default {
  name: "😁createpdf",
  description: "Tengeneza PDF ya maandishi",
  category: "pdf",
  async execute(sock, msg, args) {
    if (!args.length) return sock.sendMessage(msg.key.remoteJid, { text: "Andika maandishi ya kuweka kwenye PDF." }, { quoted: msg });
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 24;
    page.drawText(args.join(" "), { x: 50, y: height - 4 * fontSize, size: fontSize, font, color: rgb(0,0,0) });
    const pdfBytes = await pdfDoc.save();
    await sock.sendMessage(msg.key.remoteJid, { document: { mimetype: 'application/pdf', data: Buffer.from(pdfBytes), fileName: "output.pdf" } }, { quoted: msg });
  }
};
