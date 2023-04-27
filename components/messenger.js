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
const guildID = process.env.NOTIFIER_GUILD_ID;
const roleID = process.env.NOTIFIER_ROLE_ID;

let oldRare = '';

const RareMessenger = (category, name, credits, bits, isFree, url, stock, img) => {
  const channelID = client.channels.cache.get(process.env.NOTIFIER_CHANNEL_ID);

  if (name === oldRare || name === undefined) {
    return;
  }

  oldRare = name;

  let embedData = new MessageEmbed()
    .setColor(0xdc143c)
    .setAuthor({ name: category })
    .setTitle(name)
    .setURL(url)
    .setThumbnail(img)
    .setTimestamp();
  if (bits === undefined && credits === undefined && isFree !== undefined) {
    return;
  }

  if (credits !== undefined) {
    embedData.addFields({
      name: 'Credits',
      value: credits,
      inline: true
    });
  }

  if (bits !== undefined) {
    embedData.addFields({
      name: 'Bits',
      value: bits,
      inline: true
    });
  }

  if (stock !== undefined) {
    const fixedStock = stock.replace('remaining', ' ');
    embedData.addFields({
      name: 'Stock',
      value: fixedStock,
      inline: true
    });
  }

  let linkButton = new MessageActionRow().addComponents(
    new MessageButton().setLabel('Link').setStyle('LINK').setURL(url)
  );

  channelID.send({
    content: '<@&' + roleID + '>',
    embeds: [embedData],
    components: [linkButton]
  });
};

const DealMessenger = (name, price, img, url) => {
  const channelID = client.channels.cache.get(process.env.NOTIFIER_CHANNEL_ID);

  if (name === undefined || url === undefined) {
    return;
  }

  let embedData = new MessageEmbed()
    .setColor(0xdc143c)
    .setAuthor({ name: 'New snipe!' })
    .setTitle(name)
    .setURL(url)
    .setThumbnail(img)
    .addFields({
      name: 'Credits: ',
      value: price
    })
    .setTimestamp();

  let linkButton = new MessageActionRow().addComponents(
    new MessageButton().setLabel('Link').setStyle('LINK').setURL(url)
  );

  channelID.send({
    content: '<@&' + roleID + '>',
    embeds: [embedData],
    components: [linkButton]
  });
};

export { DealMessenger, RareMessenger };
