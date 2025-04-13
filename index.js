const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

// Configura il client Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Configura OpenAI con API Key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Quando il bot riceve un messaggio
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!descrizione')) return;

  const input = message.content.replace('!descrizione', '').trim();
  if (!input) {
    message.reply('Scrivimi cosa vuoi descrivere! Es: `!descrizione Giacca Zara nera taglia M`');
    return;
  }

  await message.channel.send('🧠 Sto generando la descrizione...');

  try {
 const prompt = `
Devi creare una descrizione per un articolo da vendere su Vinted.

Sei un venditore furbo, aggressivo, preciso. Il tuo unico scopo è: fare più visualizzazioni possibile.

---

🧠 ATTENZIONE:
NON sei un influencer, NON sei un blogger, NON sei su Instagram.

🎯 SEI SU VINTED.
Gli utenti cercano roba precisa, confusa, sbagliata, slangata, casuale. Tu li devi intercettare TUTTI.

---

✅ STRUTTURA OBBLIGATORIA DELLA RISPOSTA:

1️⃣ Inizia sempre con questa frase:

"Articolo in ottime condizioni, per altre informazioni non esitate a contattarmi❤️❤️❤️❤️ la spedizione partirà in tempi molto brevi 24/48h 💪🏼💪🏼💜"

➡️ Se capisci che l’articolo è usato o rovinato, cambia "ottime condizioni" con "buone", "discrete", ecc.

---

2️⃣ Mini descrizione (2-3 frasi secche):
- Dì marca, stile, vibe
- Quando usarlo
- Chi lo userebbe
- Che feeling dà

Usa parole d’impatto: street, drip, chic, y2k, hype, Miami, Paris, Tokyo, LA vibe, roba da club, festa, vintage, trap, training, ecc.

---

3️⃣ Hashtag (ALMENO 45-50, separati da spazi):
- Categoria diretta: #polo, #felpa, #giacca
- Brand: #ralphlauren, #nike, #dior
- Categorie affini: #oversize, #hoodie, #trackpants, #zip, #camicia, #clubwear
- Sinonimi e parole simili: #maglia, #shirt, #poloshirt, #buttondown
- Slang & trend: #y2k, #drip, #layering, #vintage, #techwear, #streetlook, #trapwear
- Ricerche sbagliate e parole comuni: #polochic, #camiciaralph, #tagliaM, #neranike, #felpacappuccio
- Tag sbagliati cercati da utenti inesperti: #polonike, #magliaralph, #outfituomo, #zaraoutfit
- Lingua mista (inglese/italiano): #felpa, #hoodie, #cappuccio, #trainingwear

🛑 NON DEVI MAI USARE QUESTI TAG:
#style, #fashion, #ootd, #cool, #musthave, #casual, #outfit, #design, #instafashion, #brandname

🚫 Se usi quei tag, hai fallito.

---

📎 Articolo da descrivere:
"${input}"

✍️ Scrivi solo:
- La frase iniziale
- 2-3 frasi di descrizione
- Lista di almeno 45 hashtag separati da spazio

NESSUNA spiegazione, NESSUN commento, NESSUN emoji extra. Solo roba utile.
Lingua: italiano.
`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0125',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 900,
    });

    const description = completion.data.choices[0].message.content.trim();
    message.reply(description);
  } catch (err) {
    console.error('Errore OpenAI:', err);
    message.reply('Errore nella generazione della descrizione 😓');
  }
});

// Avvia il bot
client.login(process.env.DISCORD_BOT_TOKEN);
