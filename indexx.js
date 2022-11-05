const qrcode = require('qrcode-terminal');
const mime = require('mime-types');
const request = require('request');
const path = require('path');
const fetch  = require('node-fetch');
const url = `https://api.simsimi.net/v2/?text=&lc=id&key=API-TEST-WEB&=`
const fs = require('fs');



const { Client, LocalAuth, LegacySessionAuth, MessageMedia} = require('whatsapp-web.js');

const client = new Client({
    puppeteer: {
        ffmpegPath: '/path/to/ffmpeg.exe',
        args: ['--no-sandbox','--disable-setuid-sandbox'],
        authStrategy: new LocalAuth()
       
    },
    
});
                       
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Berhasil Login!');
});

// Autentikasi
client.on('authenticated', () => {
    console.log('auth success');
});
// jika Gagal
client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('auth Gagal!', msg);
});

// Loading
client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

//LOG Pesan Masuk

client.on('message', message => {
	console.log(message.body);    
});

client.on('message', message => {
	if(message.body === 'p') {
		message.reply('apa?');
	}
});
client.on('message', message => {
	if(message.body === '!ping')
    {
		console.log(message);
	}

    // STICKER ini \\
    else if(message.body === '-sticker'){
        if(message.hasMedia){
            message.downloadMedia().then(media => {

                if (media) {
    
                    const mediaPath = './downloaded-media/';
    
                    if (!fs.existsSync(mediaPath)) {
                        fs.mkdirSync(mediaPath);
                    }
    
    
                    const extension = mime.extension(media.mimetype);
    
                    const filename = new Date().getTime();
    
                    const fullFilename = mediaPath + filename + '.' + extension;
    
                    // menyimpan file / Gambar
                    try {
                        fs.writeFileSync(fullFilename, media.data,
                            { encoding: 'base64' });
                        console.log('File downloaded successfully!', fullFilename);
                        console.log(fullFilename);
                        MessageMedia.fromFilePath(filePath = fullFilename)
                        client.sendMessage(message.from,
                            new MessageMedia(media.mimetype, media.data, filename),
                        
                        { sendMediaAsSticker: true,stickerAuthor:"Pembuat Koceng",stickerName:"Stickers"} )
                        fs.unlinkSync(fullFilename)
                        console.log(`Gambar Berhasil terhapus!`,);
                    } catch (err) {
                        console.log('Gambar Gagal Disimpan:', err);
                        console.log(`Gambar Berhasil terhapus!`,);
                    }
                }
            });
        }else{
            message.reply(`Kirim gambar Dengan Menulis *-sticker* `)
        }

     }
});
 

                                              





  
   
 //  TAG Dengan Nama
   
   client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    
    await chat.sendMessage(`Bentar ya`, {
        mentions: [contact]
    });

}); //@${contact.id.user}



// Menandai Orang
/*
client.on('message', async (msg) => {
    if(msg.body === '!everyone') {
        const chat = await msg.getChat();
        
        let text = "hehehe";
        let mentions = [];

        for(let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            
            mentions.push(contact);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
    }
});
 
 */



client.initialize();