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
Crea una descrizione per un articolo da vendere su Vinted.
Informazioni: ${input}
devi fare una descrizione come partenza standard questa:

Articolo in ottime condizioni, per altre informazioni non esitate a contattarmi❤️❤️❤️❤️ la spedizione partirà in tempi molto brevi 24/48h 💪🏼💪🏼💜 

Tags:

qualsiasi sia l'articolo deve partire così la nostra descrizione. c'è solo un'eccezione nel caso ti venisse detto che l'articolo non è in ottime condizioni allora modifica la prima parte per esempio se ti viene detto che è in buone condizioni allora in quel caso dovrai scrivere al posto di "articolo in ottime condizioni": "articolo in buone condizioni".

Bene, ora arriviamo al punto principale ovvero i "tags": in questo punto dovrai mettere parole inerenti all'articolo precedute dall'hashtag (#). Per esempio, se ti viene detto "felpa nike", nei tags dovrai mettere: #felpa #nike #pull #sweat #cappuccio ecc...

Quello che ti ho appena fatto era un'introduzione. Ora vediamo quanti tags mettere e cosa ancora più importante: come metterli.

Partiamo dalla base: i tags devono contenere una sola parola. Se ti viene detto "felpa nike", non scrivere #felpanike, ma #felpa e #nike.

Vediamo quali altri tags scrivere: dovrai mettere tags per categorizzare al meglio l'articolo. Scrivi altre categorie simili. Per esempio, se ti viene chiesta una descrizione per dei "pantaloni nike tech", dovrai mettere tags simili alla categoria pantaloni, come #jeans #trackpants, ecc. Dopo questi, aggiungi tags che completano questi ultimi: ad esempio, se hai scritto #jeans, aggiungi #flared #baggy.

Il nostro scopo è fare più visualizzazioni. Ovviamente tutti questi tags li scegli tu in base ai trend attuali.

A questo punto, dovresti essere già ad almeno 30 tags. Mi raccomando, non scrivere parole a caso: devono essere parole per far esplodere l’articolo.

Ora un altro punto importantissimo: la nostra nicchia principale di acquirenti sono utenti che fanno ricerche su Vinted in modo sbagliato. Per questo dobbiamo categorizzare al meglio l’articolo. Per esempio, le persone al posto di "pantaloni" potrebbero scrivere "pantaloni della tuta", "pantaloni da palestra", o al posto di "felpa" potrebbero scrivere "pullover", "felpa con cappuccio", "felpa con zip". Noi dobbiamo prevedere queste alternative.

Una cosa importante: non c'è bisogno di ripetere le parole. Se hai già scritto #felpa #con #cappuccio, non serve riscrivere #felpa #con #zip, basta scrivere #zip perché gli altri già ci sono.

Altri punti fondamentali:
Usa anche parole inglesi, internazionali e slang giovanili, sempre riferiti alle categorie di vestiti, come #jorts #hoodie #sweat, e così via.

Ora il punto più importante: i tags che fanno esplodere l'articolo.

Esempi (usa come spunto, non copiarli alla lettera):
- Se una persona ti chiede una descrizione per una tuta Adidas della Juventus, per aumentare le visualizzazioni dovrai mettere tags di altre squadre da calcio.
- Se ti chiedono una descrizione per un iPhone 15 Pro Max da 256GB, tu metti anche tags tipo #12 #13 #14 #128gb #apple #watch #magsafe #cover.
- Se ti chiedono una felpa Nike, metti anche #nike #tech #running ecc...

Tutti questi esempi ti servono per capire come ragionare e adattarli a ogni caso.

Bene, il totale dei tags voglio che sia di almeno 40-50 tags.

Mi raccomando: ricorda che il nostro scopo è fare più visualizzazioni possibile!
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
