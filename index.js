const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, Events } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  presence: { status: 'online' },
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const tagPresets = {
  felpa: ['#felpa', '#hoodie', '#pullover', '#zip', '#sweatshirt', '#maglione'],
  tuta: ['#tute', '#ensemble', '#tuta', '#chandal', '#survetement', '#tracksuit', '#track', '#pants', '#pull', '#jacket', '#trackpants', '#vintage', '#y2k', '#streetwear', '#central', '#cee', '#london', '#drip', '#skinny', '#jeans', '#flared', '#baggy', '#completo', '#da', '#calcio', '#tech', '#running', '#raro', '#modello', '#psg', '#manchester', '#united', '#real', '#madrid'],
  pantaloni: ['#pantloni', '#pants', '#track', '#trackpants', '#baggy', '#flared', '#jeans', '#carpenter', '#work', '#worker', '#pant', '#ultra', '#della', '#tuta', '#bas', '#de', '#du', '#des', '#survetement', '#parachute', '#oversize', '#slim', '#skinny', '#cargo', '#joggers', '#tracksuit', '#tuta', '#vintage', '#y2k', '#jorts'],
  polo: ['#tshirt', '#t', '#shirt', '#longsleeve', '#bintage', '#baggy', '#dubai', '#los', '#angeles', '#miami', '#tokyo', '#italy', '#chief', '#keef', '#new', '#york', '#polo', '#france', '#berlin', '#germany', '#city', '#citta', '#con']
};

const findTagsFromKeywords = (text) => {
  const lowered = text.toLowerCase();
  for (const [key, tags] of Object.entries(tagPresets)) {
    if (tagPresets[key].some(tag => lowered.includes(tag.replace('#', '')))) {
      return tags;
    }
  }
  return [];
};

client.once('ready', () => {
  console.log(`✅ Bot online come ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content === '!start') {
    const isAdmin = message.member.roles.cache.has('1185323530175381706');
    if (!isAdmin) {
      return message.reply({ content: '❌ Solo chi ha il ruolo Amministratore può usare questo comando.', ephemeral: true });
    }

    const button = new ButtonBuilder()
      .setCustomId('genera_descrizione')
      .setLabel('📝 Genera Descrizione')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({
      content: 'Clicca il bottone per generare una descrizione con tag personalizzati:',
      components: [row],
    });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton() && interaction.customId === 'genera_descrizione') {
    const modal = new ModalBuilder()
      .setCustomId('modale_descrizione')
      .setTitle('Genera Descrizione Vinted');

    const input = new TextInputBuilder()
      .setCustomId('articolo_input')
      .setLabel("Titolo articolo + scrivi meglio è")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(input);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === 'modale_descrizione') {
    const input = interaction.fields.getTextInputValue('articolo_input');
    await interaction.reply({ content: "🧠 Sto ragionando sull'articolo...", ephemeral: true });

    try {
      const extraTags = findTagsFromKeywords(input);

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

ora ti faccio un esempio di descrizione dove spiego il perche dei tag che ho messo, questa descrizione che ti darò dovrai usarla per comprendere meglio il funzionamento di come vogliamo la descrizione prendila come spunto e dovrai riadattarla alle altre richieste....

andiamo con l' esempio:

voglio una descrizione per la mia felpa adidas 

risultato:

Articolo in ottime condizioni, per altre informazioni non esitate a contattarmi❤️❤️❤️❤️ la spedizione partirà in tempi molto brevi 24/48h 💪🏼💪🏼💜

Tags: #felpa #adidas #pull #sweat #felpa #con #cappuccio #crazy #jacket #maglione #trackjacket #pullover #zip (ho messo questi tag perche sono categorie simili in questo modo se qualcuno cercherà maglione adidas gli uscirà il mio articolo...) #sportiva #sportiva #ultra #baggy #vintage #retro #y2k #cropped #boxy #fit (ho messo questi tag cosi se qualcuno cerca felpa sportiva gli esce il mio articolo, se cerca pull vintage gli esce il mio articolo, se cerca maglione y2k gli esce il mio articolo, le descrizioni devi farle come se fossero un puzzle)  #equipment #juventus #real #madrid #bayern #munich #monaco (ho messo questi tag perche quipment e molto ricercato nel vintage adidas, poi le squadre da calcio perche se uno cerca felpa adidas juventus gli uscira il mio articolo e io in questo modo farò più visualizzazioni) #jorts #trackpants #ensemble #tracksuit #tuta #completo #pantaloni #tshirt #shirt #polo #flared #jeans (concludo con altre categorie in modo da avere più visualizzazini)

ogni descrizione che farai dovra essere studiata in questo modo...
`;

      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo-0125',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200,
      });

      let descrizione = completion.data.choices[0].message.content.trim();

      // Inserisci i tag extra trovati all'inizio dei tag
      if (extraTags.length > 0) {
        const tagSectionIndex = descrizione.indexOf('Tags:');
        if (tagSectionIndex !== -1) {
          const before = descrizione.substring(0, tagSectionIndex + 6);
          const after = descrizione.substring(tagSectionIndex + 6);
          descrizione = `${before} ${extraTags.join(' ')} ${after}`;
        }
      }

      await interaction.followUp({ content: `📦 **Descrizione pronta**:
${descrizione}`, ephemeral: true });
    } catch (err) {
      console.error('Errore:', err);
      await interaction.followUp({ content: '❌ Errore nella generazione della descrizione.', ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
