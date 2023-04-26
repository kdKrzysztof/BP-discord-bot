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
  MessageButton,
  Collection
} from 'discord.js';
import getProfileData from './components/getProfileData.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './routes/routes.js';
import fetchHandler from './components/fetchHandler.js';
import { json } from 'express';

dotenv.config();

const dbpass = process.env.DBPASS;

mongoose
  .connect(dbpass, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to database');
    app.listen(process.env.PORT, () => {
      console.log(`listening on: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

const client = new DiscordJS.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.login(process.env.TOKEN);

const random = () => {
  return Math.floor(Math.random() * 100000000 + 1000000000);
};

client.on('ready', () => {
  const verifiedRole = process.env.VERIFIED;
  const guildID = '988141673257271386';
  const guild = client.guilds.cache.get(guildID);
  const timeOut = 60000;

  let commands;

  if (guild) {
    commands = guild.commands;
  } else {
    commands = client.application?.commands;
  }

  commands?.create({
    name: 'verify',
    description: 'Verify your brickplanet account',
    options: [
      {
        name: 'username',
        description: 'Type your brickplanet account username',
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
      }
    ]
  });
  commands?.create({
    name: 'unlink',
    description: 'Unlink your discord account from your bp account'
  });

  client.on('interactionCreate', async (interaction) => {
    const discordID = client.users.cache.get(interaction.member.user.id);
    const userRole = interaction.member._roles.find((e) => e == verifiedRole);
    const { commandName, options } = interaction;
    const randomNumber = random();

    try {
      if (interaction.isCommand() && interaction.commandName === 'verify') {
        let commandUsername = options.getString('username');
        let usernameModified = commandUsername.toLowerCase().replace(' ', '-');

        console.log(commandName + ': ' + usernameModified);

        const button = new MessageActionRow().addComponents(
          new MessageButton().setLabel('Verify').setStyle('PRIMARY').setCustomId('VERIFY')
        );

        if (!userRole) {
          let findUser = await fetchHandler.findDiscordAccount(discordID.id);
          if (findUser !== false) {
            await interaction.reply({
              content: `Your discord account is already verified. Use: **/unlink** command to unlink your discord account from already verified brickplanet username`,
              components: [],
              ephemeral: true,
              fetchReply: true
            });
            try {
              await interaction.member.roles.add(verifiedRole);
              await interaction.member.setNickname(findUser.bpUsername);
            } catch (err) {
              console.log(err);
            }
            return;
          }

          let findBpAcc = await fetchHandler.findBpUsername(usernameModified);
          if (findBpAcc !== false) {
            await interaction.reply({
              content: `This brickplanet account is already verified.`,
              components: [],
              ephemeral: true,
              fetchReply: true
            });
            return;
          }

          try {
            await discordID.send("Type this random number in your profile's bio: " + randomNumber);
          } catch (err) {
            console.log(err);
          }

          await interaction
            .reply({
              content: `Please put this number at start or end of your profile's bio: ${randomNumber}`,
              components: [button],
              ephemeral: true,
              fetchReply: true
            })
            .then((msg) => {
              setTimeout(() => {
                interaction.editReply({
                  content: 'times up',
                  components: [],
                  ephemeral: true
                });
              }, timeOut);
            })
            .catch((msg) => {
              console.log('error');
            });

          const filter = (i) => i.customId === 'VERIFY' && i.user.id === discordID.id;

          const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: timeOut
          });

          collector.on('collect', async (i) => {
            const data = await getProfileData(usernameModified);

            if (data[0].startsWith(randomNumber) || data[0].endsWith(randomNumber)) {
              fetchHandler.createUser(usernameModified, discordID.id);

              try {
                await interaction.member.setNickname(commandUsername);
              } catch {
                console.log('no perms');
                return;
              }

              await interaction.member.roles.add(verifiedRole);
              await i.deferUpdate();

              try {
                await discordID.send('Your account has been verified!');
              } catch (err) {
                console.log(err);
              }
            } else {
              interaction.editReply({
                content: 'Incorrect verification code in BIO. Please redo the interaction.',
                components: [],
                ephemeral: true
              });
            }
          });
        } else {
          await interaction.reply({
            content: 'Your account is already verfied',
            components: [],
            ephemeral: true
          });
          interaction.deferred;
        }
      }
      if (interaction.isCommand() && interaction.commandName === 'unlink') {
        let findUser = await fetchHandler.removeDiscordId(discordID.id);

        if (findUser !== false) {
          await interaction.reply({
            content: `Your account has be successfuly unlinked`,
            components: [],
            ephemeral: true,
            fetchReply: true
          });

          try {
            await interaction.member.roles.remove(verifiedRole);
          } catch (err) {
            console.log(err);
          }

          return;
        } else {
          await interaction.reply({
            content: `Your account is not verified.`,
            components: [],
            ephemeral: true,
            fetchReply: true
          });

          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
  console.log('logged in');
});
