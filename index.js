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

qualsiasi sia l'articolo deve partire così la nostra descrizione. c'è solo un ecezzione nel caso ti venisse detto che l'articolo non è in ottime condizioni allora modifica la prima parte per esempio se ti viene detto che è in buone condizioni allora in quel caso dovrai scriver al posto di "articolo in ottime condizioni" scriverai: articolo in buone condizioni.
bene ora arriviamo al punto principale ovvero i "tags" in questo punto dovrai mettere parole inerenti all articolo precedute dall' hastag (#) per esmpio se ti viene detto felpa nike nei tags dovrai mettere: #felpa #nike #pull #sweat #cappuccio etc.. etc...
quello che ti ho appena fatto era un introduzione ora vediamo quanti tags mettere e cosa ancora più importante come metterli... partiamo dalla base i tags devono contenere una sola parola se ti viene detto felpa nike non scrivere #felpanike ma #felpa e #nike 
bene ora vediamo quali altri tags scrivere... Dovrai mettere tags per categorizzare al meglio il nostro articolo dovrai scrivere altre categorie dell'articolo simile a quella che ti viene data per esempio se ti viene chiesta una descrizione per dei pantaloni nike tech dovrai mettere tags simili alla categoria pantaloni come jeans trackpants oltre a tags che si basano sulla categoria ne dovrai mettere altri che completino i tags di questi altri tags
mi spiego meglio con un esempio ti viene dato come articolo da descrivere: "pantaloni nike tech" come primi tags ti viene subito da mettere #pantaloni #nike #tech poi pr categorizzarlo al meglio ti viene 

    `;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
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
