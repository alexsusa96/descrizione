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
Stile: amichevole, utile, breve ma dettagliato.
Scrivi solo la descrizione, senza titoli o emoji.
Lingua: italiano
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
