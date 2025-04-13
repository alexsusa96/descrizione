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

🔴 Prima di iniziare: TUTTI GLI ESEMPI CHE TROVERAI QUI SOTTO servono **solo per farti capire la logica**.  
NON vanno copiati o presi come regole.  
SEI TU, come AI, che devi **capire il senso**, e poi **adattare tutto al contenuto specifico** che ti verrà dato.

---

## ✅ STRUTTURA DELLA RISPOSTA

### 🔹 1. Frase iniziale fissa (da modificare se serve):

Inizia **sempre** con questa frase:

"Articolo in ottime condizioni, per altre informazioni non esitate a contattarmi❤️❤️❤️❤️ la spedizione partirà in tempi molto brevi 24/48h 💪🏼💪🏼💜"

➡️ Se dal testo capisci che l’articolo è in condizioni diverse (buone, discrete, usato molto, con segni...), **adattala tu**.

Esempi:
- "Articolo in buone condizioni"
- "Articolo usato ma ben tenuto"
- "Articolo in condizioni discrete, presenta piccoli segni di usura"

Non usare frasi a caso. **Capisci da te cosa scrivere.**

---

### 🔹 2. Descrizione

Scrivi 2-4 frasi **semplici, utili, amichevoli, chiare**, che descrivono l’articolo.  
Usa un tono naturale ma dritto al punto.  
Non devi vendere il sogno, devi **spiegare perché è un buon acquisto**.

---

### 🔹 3. Hashtag (40-50)

Devi generare **tra i 40 e i 50 hashtag** e devono essere **VERAMENTE UTILI**.

Gli hashtag servono a **categorizzare l’articolo** e **intercettare quante più ricerche possibili**, anche quelle sbagliate, anche quelle affini.

---

## 💥 ESEMPI DI COME FUNZIONARE — solo per capire la logica:

### Se ti dico: “felpa Nike tech nera”
NON devi scrivere solo:
#felpa #nike #tech

Devi aggiungere anche:
#hoodie #pullover #sweatshirt #sweater #baggy #oversize #streetwear #tuta #cappuccio #zip #training #gym #sportswear #vintage #uomo #donna  
E tag legati al target: #joggers #outfit #running

---

### Se ti dico: “DJI Osmo Pocket”
NON ti fermi a:
#dji #pocket

Devi aggiungere:
#gopro #hero #actioncam #travelcam #vlog #compactcam #videocamera #stabilizzatore #creatore #youtube #traveltech  
E tag simili o concorrenti, anche di altri prodotti.

---

### Se ti dico: “Tuta Juventus Adidas”
Puoi usare:
#juventus #tuta #adidas #allenamento #football #seriea #training  
Ma anche:
#milan #inter #sport #nike #puma  
**Solo se coerente.** È un esempio. Devi ragionare tu.

---

## 🛑 COSA NON FARE MAI

❌ NON scrivere hashtag inutili o da social tipo:
#musthave, #ootd, #onlineshopping, #fashionista, #loveit, #luxurybrand  
Questi NON servono su Vinted. Sono da influencer, **non vendono niente.**

❌ NON scrivere tag attaccati:
Sbagliato: `#felpagrigia`, `#pantalonituta`  
Giusto: `#felpa #grigia #pantaloni #tuta`

❌ NON ripetere 2 volte la stessa parola in inglese e italiano senza motivo: se hai #felpa e #hoodie, va bene. Ma non #felpa #felpe #felpona.

❌ NON sparare tag a caso. Pensa.  
Il tuo lavoro è fare in modo che l’articolo esca nelle ricerche Vinted, anche quando l’utente scrive cose simili o affini.

---

🎯 OBIETTIVO DEGLI HASHTAG:

✔️ Intercettare più ricerche possibili  
✔️ Usare sinonimi, categorie affini, termini sbagliati ma diffusi  
✔️ Usare slang, inglese, parole moda, parole tecniche  
✔️ Usare nomi di articoli simili  
✔️ Usare parole “complementari” (es. se vendi felpa → metti anche pantaloni, hoodie, tech, zip, training)

---

📎 Ora lavora su questo articolo:

"${input}"

✅ Scrivi prima la frase fissa (o modificata)  
✅ Poi la mini descrizione  
✅ Poi 40-50 hashtag utili

Rispondi **solo con testo + hashtag**.  
Nessun titolo, nessun commento, nessuna emoji extra.

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
