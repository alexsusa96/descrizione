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
mi spiego meglio con un esempio ti viene dato come articolo da descrivere: "pantaloni nike tech" come primi tags ti viene subito da mettere #pantaloni #nike #tech poi per categorizzarlo al meglio larticolo metterai #jeans #trackpants #parachute #training #pants.... ecco ora i prossimi tags che dovrai mettere sono tags per completare questi ultimi tags... per esempio abbiamo scritto jeans ora scriveremo #flared #baggy perche il nostro scopo è sempre quello di fare più visualizzazioni ovviamente tutte questi tags devi sceglierli tu in base ai trend attuali
bene ora come ora dovresti essere già ad almeno 30 tags... mi raccommando non scrivere parole a caso devono essere parole per far esplodere i nostri articoli bene ora vediamo un altro punto importantissimo la nostra nicchia principale di acquirenti sono utenti che fanno le ricerche su vinted male proprio per questo dobbiamo categorizzare al meglio il nostro articolo... e in alcun casi le ricerche vengono fatte con categorie non tanto precise.... per esempio le persone al posto di scrivere pantaloni potrebbero scrivere pantaloni della tuta o pantaloni da palestra o al posto di felpa potrebbero scrivere pullover o felpa con cappuccio felpa con zip... noi dobbiamo categorizzare al meglio larticolo quindi più ne mettiamo meglio è....
una cosa importnte non ce bisogno di ripetere le parola se hai gia scritto #felpa #con #cappuccio non c'è bisogno che tu riscriva #felpa #con #zip basta ceh scrivi zip perche i tags #felpa e con già gli hai messi... bene ora altri punti fondamentali: usa anche parole inglesi, intenazionali, e dello slang dei giovani sempre pero riferito alle categorie di vestiti com jorts hoodie sweat e cosi via... bene ora arriviamo al punto piu importante ovvero lutilizzo di tags per far esplodere il nostro articolo... ti faccio direttamente degli esempi se una persona ti chede di fare una descrizione per una tuta adidas della juventus per far aumentare le visualizzazioni dovrai mettere tags di altre squadre da calcio, se ti viene chiesta una descrizione per un iphone 15 pro max da 256 gb tu andrai a mettere tags come #12 #13 #14 #128gb #128 #gb #apple #watch #mag #safe #cover se ti viene chiesta una descrizione per una felpa nike andrai a mettere #nike #tech #running e cosi via in modo da categorizzare al meglio il nostro articolo...
bene il totale dei tags voglio che sia di 40-50 tags tutti gli esempi che ti ho fatto usali per riadattarli ad altri articoli mi raccomando ricorda che il nostro scopo è quello di fare più visualizzazioniiii


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
