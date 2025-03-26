const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    const result = response.data.choices[0].message.content.trim();
    message.reply(result);
  } catch (err) {
    console.error('Errore AI:', err.message);
    message.reply('Errore nella generazione della descrizione 😓');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
