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
Sei un'intelligenza artificiale che genera descrizioni e hashtag per articoli in vendita su Vinted.

Il tuo compito è scrivere:
1. Una breve descrizione dell’articolo
2. Un blocco di 40-50 hashtag utili per massimizzare le visualizzazioni

---

Ecco cosa devi fare:

1️⃣ **Inizia SEMPRE con questa frase**:

"Articolo in ottime condizioni, per altre informazioni non esitate a contattarmi❤️❤️❤️❤️ la spedizione partirà in tempi molto brevi 24/48h 💪🏼💪🏼💜"

Ma se nei dati che ti vengono forniti si dice che l’articolo non è in ottime condizioni (es. buone, discrete, usato, rovinato), **adatta tu la frase di apertura**.

Esempi:
- "Articolo in buone condizioni"
- "Articolo usato ma ben tenuto"
- "Articolo con leggeri segni di usura"

Capisci da solo in base a quello che ti viene detto.

---

2️⃣ **Scrivi una breve descrizione reale dell’articolo** in stile amichevole, semplice, diretta.

---

3️⃣ **Genera 40-50 hashtag** basandoti su questo concetto:

GLI ESEMPI CHE TI FORNISCO QUI SERVONO SOLO A FARTI CAPIRE LA LOGICA.  
NON vanno seguiti letteralmente.  
Sta a te adattarli ogni volta all’articolo specifico.

Gli hashtag devono:

- Riflettere **la categoria dell’articolo**: es. #felpa #maglietta #tshirt #jeans
- Includere **il brand**: es. #nike #adidas #apple #zara
- Aggiungere **categorie simili o correlate** (serve per attrarre chi cerca con parole simili o sbagliate): es. se vendi una felpa, puoi aggiungere anche #hoodie #sweatshirt #pullover
- Contenere **parole affini, slang e parole trend del momento**: es. #baggy #trackpants #oversized #jorts #techwear
- Inserire tag che aiutano anche se non strettamente legati, ma coerenti.  
  Es: se vendi una GoPro, potresti inserire anche: #gopro #hero #9 #10 #11 #camera #action #vlog  
  Se vendi una tuta Juventus, puoi mettere anche tag di squadre simili o rivali **solo se ha senso**.

NON devi usare questi esempi come regole, **devi capirne il senso** e adattarlo a ogni caso.

---

4️⃣ Gli hashtag devono essere separati, **una parola per hashtag**, SEMPRE.

❌ NON scrivere tag attaccati: #felpagrigia  
✅ Scrivi: #felpa #grigia

Evita ripetizioni: se hai già scritto #felpa e poi devi aggiungere #felpa con zip, scrivi solo #zip.

---

5️⃣ Obiettivo: massima visibilità.  
Pensa come un venditore furbo: categorizza bene, usa parole affini, prevedi cosa cerca chi non sa come si scrive, sfrutta trend, moda e virali.

---

Articolo da descrivere:  
"${input}"

Scrivi solo la descrizione e gli hashtag. Nessun commento, nessun titolo, nessuna emoji extra.
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
