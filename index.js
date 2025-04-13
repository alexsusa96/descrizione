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
Stai per generare una descrizione + una lista di hashtag per un articolo da vendere su Vinted.

Il tuo obiettivo è creare:
1. Una descrizione utile, breve e reale dell’articolo
2. Almeno **45 hashtag unici, strategici e mirati**

---

📌 GLI ESEMPI CHE TROVI SONO SOLO PER SPIEGARTI IL METODO.  
Adatta ogni volta il risultato all’articolo reale.

---

1️⃣ Inizia SEMPRE con:
"Articolo in ottime condizioni, per altre informazioni non esitate a contattarmi❤️❤️❤️❤️ la spedizione partirà in tempi molto brevi 24/48h 💪🏼💪🏼💜"

Se il prodotto non è in ottime condizioni, modifica la frase.  
Esempi:
- "Articolo in buone condizioni"
- "Articolo usato ma ben tenuto"
- "Articolo in condizioni discrete"

---

2️⃣ Scrivi una mini descrizione reale (2-4 frasi). Indica: tipo, brand, colore, taglia, stile, quando si può usare.

---

3️⃣ Genera almeno 45 hashtag separati da spazi.

✅ Devono includere:
- Categoria principale: #felpa, #pantaloni, #giacca
- Brand: #nike, #zara, ecc.
- Categorie correlate: #hoodie, #pullover, #trackpants, #tuta
- Sinonimi e ricerche comuni (anche sbagliate): #felpacappuccio, #felpatagliaM
- Slang/linguaggio giovane/trend: #baggy, #oversize, #techwear, #vintage
- Parole inglesi e italiane
- Termini di utilizzo: #training, #streetwear, #layering, #autunno, #workout
- Articoli simili o alternativi se ha senso (es: #gopro per un DJI)

🛑 NON usare tag generici o inutili: #moda, #style, #casual, #shopping, #outfit, #musthave, #luxurybrand

🛑 NON ripetere tag con la stessa parola. Ogni hashtag deve essere una parola utile, cercabile, pensata.

---

📎 Articolo da descrivere:  
"${input}"

✍️ Rispondi solo con:  
- Frase iniziale  
- Mini descrizione  
- Lista hashtag (tutti in fila, separati da spazio)  
Niente spiegazioni, niente emoji extra.  
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
