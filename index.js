const qrcode = require('qrcode-terminal');

const fs = require('fs');

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});

let fileCounter = 0;


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

client.on('message', async msg => {
    console.log(msg.body);

    if (msg.body === '!ping') {
        msg.reply('pong');
    } else if (msg.hasMedia) {
        const attachmentData = await msg.downloadMedia();
        var fileExtension = attachmentData.mimetype.split(';')[0].split('/')[1];
        var buff = new Buffer.from(attachmentData.data, 'base64');
        fs.writeFileSync(`request-audio-${fileCounter}.${fileExtension}`, buff);
        fileCounter++;
        // Cria função que faz requisição para API do Whisper
        msg.reply(`
            Áudio recebido com sucesso!
            Enviando para análise...
        `);
    } else {
        msg.reply(`
            Media: ${msg.hasMedia}
            Body: ${msg.body}
            Data: ${msg.data}
            Size: ${msg.filesize}
            MimeType: ${msg.mimetype}
            Filename: ${msg.filename}
            Timestamp: ${msg.timestamp}
        `);
    }
});
 