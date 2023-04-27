import DiscordJS, {
  ApplicationCommandManager,
  GuildApplicationCommandManager,
  GuildChannel,
  GuildMember,
  Intents,
  Message,
  MessageEmbed,
  Role,
  MessageActionRow,
  MessageButton
} from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new DiscordJS.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.login(process.env.TOKEN);

const button = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId('verify-button')
    .setLabel('Verify')
    .setStyle('PRIMARY')
    .setCustomId('VERIFY')
);

client.on('ready', () => {
  client.on('interactionCreate', async (interaction) => {
    const notifierRole = process.env.NOTIFIER_ROLE_ID;
    const timeOut = 2000;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: timeOut
    });

    collector.on('collect', () => {});
  });
});
