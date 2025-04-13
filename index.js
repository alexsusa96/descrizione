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

Devi comportarti come un venditore esperto che sa come funziona l’algoritmo di Vinted e che vuole solo una cosa: FARE VISTE.

---

🔴 Prima di iniziare: TUTTI GLI ESEMPI CHE TROVERAI QUI SOTTO servono solo per farti capire la logica.  
NON vanno copiati o presi come regole.  
SEI TU, come AI, che devi capire il senso, e poi adattare tutto al contenuto specifico che ti verrà dato.

---

✅ STRUTTURA DELLA RISPOSTA

1️⃣ Frase iniziale fissa (modifica solo se necessario):

"Articolo in ottime condizioni, per altre informazioni non esitate a contattarmi❤️❤️❤️❤️ la spedizione partirà in tempi molto brevi 24/48h 💪🏼💪🏼💜"

Se il prodotto non è in ottime condizioni, modificala.  
Esempi:
- "Articolo in buone condizioni"
- "Articolo usato ma ben tenuto"
- "Articolo con piccoli segni di usura"

2️⃣ Mini descrizione amichevole e concreta (2-4 frasi), con info chiave: tipo, marca, colore, taglia, stile, uso.

3️⃣ Genera 40-50 hashtag mirati, reali, utili.

---

💡 ESEMPI (da capire, non copiare)

➡️ Se ti dico: “felpa Nike tech nera”  
Devi aggiungere:
#felpa #nike #tech #hoodie #sweatshirt #pullover #zip #streetwear #oversize #cappuccio #uomo #training #sportswear

➡️ Se ti dico: “DJI Osmo Pocket”  
Puoi aggiungere:
#dji #pocket #gopro #hero #actioncam #videocamera #compact #vlog #traveltech

➡️ Se ti dico: “Tuta Juventus Adidas”  
Puoi inserire:
#juventus #tuta #adidas #allenamento #seriea #calcio #sport  
Ma anche: #inter #milan #puma  
Solo se coerente. Decidi tu.

---

📛 REGOLE:

❌ NON usare tag inutili: #ootd, #musthave, #fashionista, #luxurybrand, #shopnow  
❌ NON scrivere tag attaccati tipo: #felpagrigia  
✅ Usa: #felpa #grigia

❌ NON ripetere lo stesso concetto (es: #pantaloni #pantalone #pants tutti insieme = no)

✅ Inserisci:
- Categoria principale (#felpa, #giacca, #tshirt, ecc.)
- Brand (#nike, #zara, ecc.)
- Categorie correlate e affini
- Sinonimi e errori comuni di scrittura
- Slang, trend, parole giovani
- Parole in inglese e italiano
- Termini specifici di nicchia

---

🎯 Obiettivo: massima visibilità nelle ricerche su Vinted

---

📎 Articolo da descrivere:
"${input}"

✍️ Rispondi solo con:
- Descrizione (frase iniziale + 2-4 frasi reali)
- Lista di hashtag (una parola per volta)

Niente titoli, niente emoji extra, nessuna spiegazione. Solo testo utile.
Lingua: italiano.
`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
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
