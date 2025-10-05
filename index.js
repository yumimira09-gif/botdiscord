require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember]
});

const prefix = "-ban";

client.once('ready', () => {
  console.log(`✅ Bot online! Logado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.toLowerCase().startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const member = message.mentions.members.first();

  // Só quem tem o cargo "Moderador App" pode usar
  if (!message.member.roles.cache.some(r => r.name === "Moderador App")) {
    return message.reply("⚠️ Você não tem permissão para usar esse comando!");
  }

  if (!member) return message.reply("❌ Mencione quem você quer expulsar!");

  if (member.roles.highest.position >= message.member.roles.highest.position) {
    return message.reply("🚫 Você não pode expulsar alguém com cargo igual ou maior que o seu!");
  }

  if (!member.kickable) return message.reply("🚫 Não posso expulsar esse usuário!");

  const reason = args.slice(1).join(" ") || "Não informado";

  try {
    await member.kick(reason);
    message.channel.send(`✅ ${message.author.tag} expulsou ${member.user.tag}\nMotivo: ${reason}`);
  } catch (err) {
    console.error(err);
    message.reply("❌ Ocorreu um erro ao tentar expulsar o usuário.");
  }
});

// Login usando token do .env
client.login(process.env.TOKEN);
