require('dotenv').config();
const { Client, IntentsBitField, ActivityType, EmbedBuilder } = require('discord.js');
const { connect, mongoose } = require('mongoose');
const eventHandler = require('./handlers/eventHandler');
const fs = require('fs').promises;
const config = require('../config.json');
const statuse = ['🎄', '🪐 .gg/gangwar 🌌', '🔫 RG 🔫', 'Made with ❤️', '🎄'];
const maintrance = ['🔴 Wartungen 🔴'];
let current = 0;

require('@colors/colors');

let maintenanceMode = false;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
});

eventHandler(client);

client.login(config.token)
  .then(() => {
    console.clear();
    console.log('[Discord API] '.green + client.user.username + ' hat sich eingeloggt!');
    updateStatus();

    setInterval(updateStatus, 5 * 1000);

    mongoose.set('strictQuery', true);
    connect(config.database, {}).then(() => {
      console.log('[Datenbank] '.green + 'ist verbunden.');
    });
  })
  .catch((err) => console.log('[Datenbank] Es gab ein Fehler! '.green + err));

async function updateStatus() {
  const presenceData = {
    activities: [{ name: statuse[current], type: ActivityType.Watching }],
  };

  if (maintenanceMode) {
    presenceData.status = 'idle';
    presenceData.activities = maintrance.map(status => ({ name: status, type: ActivityType.Watching }));
  } else {
    presenceData.status = 'dnd';
  }

  client.user.setPresence(presenceData);

  if (!maintenanceMode) {
    current = (current + 1) % statuse.length;
  }
}

async function checkMaintenanceMode() {
  const Config = require('../src/models/maintenance');
  const config = await Config.findOne();
  maintenanceMode = config ? config.maintenanceMode : false;

  updateStatus();
}

checkMaintenanceMode();

setInterval(checkMaintenanceMode, 30 * 1000);
client.on('interactionCreate', async (interaction) => {
  if (!interaction.inGuild()) return;
  if (!interaction.isCommand()) return;

  const channel = client.channels.cache.get('1178400238168449024');
  const server = interaction.guild.name;
  const user = interaction.user.username;
  const userID = interaction.user.id;

  const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('🌐 Chat-Befehl verwendet')
    .addFields({ name: 'Servername', value: `${server}` })
    .addFields({ name: 'Chat-Befehl', value: `${interaction.commandName}` })
    .addFields({ name: 'Befehlsbenutzer', value: `${user} / ${userID}` })
    .setFooter({ text: '© RG System' })
    .setTimestamp();

  await channel.send({ embeds: [embed] });
});

client.on('guildMemberAdd', async interaction => {
  const channel = interaction.guild.channels.cache.get('1169715611643945137');
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setAuthor({
      name: client.user?.username,
      iconURL: client.user?.displayAvatarURL({ dynamic: true }),
    })
    .setThumbnail('https://cdn.discordapp.com/attachments/1036746018601062402/1181699261457502248/Download.png?ex=65820232&is=656f8d32&hm=81f7b089a331f7efc23b0a7db9459a25ae3818713403620d6994dbe6ae71c51b&')
    .setDescription(`\nHey <@${interaction.user.id}>, Willkommen auf **${interaction.guild.name}**! \n\n**Verifizierung**\nGehe zu <#1178803426973470760> um alle Kanäle einsehen zu können!`)
    .setColor(`#ED4245`)
    .setFooter({ text: '© RG System' })
    .setTimestamp(Date.now());

  channel.send({
    embeds: [embed]
  });

  client.channels.cache.get('1169715611195150456').setName(`🌎All User: ${interaction.guild.memberCount}`);
  client.channels.cache.get('1169715611195150458').setName(`✅ Members: ${interaction.guild.members.cache.filter(m => !m.user.bot).size}`);
  client.channels.cache.get('1169715611195150457').setName(`🤖Bots: ${interaction.guild.members.cache.filter(m => m.user.bot).size}`);
});

client.on('guildMemberRemove', async interaction => {
  const channel = interaction.guild.channels.cache.get('1174054278348935228'); // leave channel
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setAuthor({
      name: client.user?.username,
      iconURL: client.user?.displayAvatarURL({ dynamic: true }),
    })
    .setThumbnail('https://cdn.discordapp.com/attachments/1036746018601062402/1181699261457502248/Download.png?ex=65820232&is=656f8d32&hm=81f7b089a331f7efc23b0a7db9459a25ae3818713403620d6994dbe6ae71c51b&')
    .setDescription(`\n<@${interaction.user.id}>, hat **${interaction.guild.name}** Verlassen!`)
    .setColor(`#ED4245`)
    .setFooter({ text: '© RG System' })
    .setTimestamp(Date.now());

  channel.send({
    embeds: [embed]
  });

  client.channels.cache.get('1169715611195150456').setName(`🌎All User: ${interaction.guild.memberCount}`);
  client.channels.cache.get('1169715611195150458').setName(`✅ Members: ${interaction.guild.members.cache.filter(m => !m.user.bot).size}`);
  client.channels.cache.get('1169715611195150457').setName(`🤖Bots: ${interaction.guild.members.cache.filter(m => m.user.bot).size}`);
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
  const oldBoost = oldMember.premiumSinceTimestamp;
  const newBoost = newMember.premiumSinceTimestamp;

  if (oldBoost !== newBoost && newBoost) {
    const guild = client.guilds.cache.get('1169715609446141974'); // guild (server)
    const boostChannel = guild.channels.cache.get('1169715611962707990'); // booster channel

    if (boostChannel && boostChannel.type === 'GUILD_TEXT') {
      boostChannel.send(`${newMember.user.username} hat den Server geboostet! 🚀`);
    }
  }
});

const AutoModSchema = require('./models/AutoMod');
const LinkSchema = require('./models/Links');
const BadWordSchema = require('./models/BadWord');
const WarnHistorySchema = require('./models/WarnHistory');

const deleteDelay = 5000; // 5000 Millisekunden (5 Sekunden)

async function readBadWords() {
  try {
    const badWords = await BadWordSchema.find();
    return badWords.map((wordDoc) => wordDoc.word);
  } catch (error) {
    console.error('Fehler beim Lesen der Schimpfwörter:', error);
    return [];
  }
}

async function readNotAllowedLinks() {
  try {
    const links = await LinkSchema.find();
    return links.map((linkDoc) => linkDoc.link);
  } catch (error) {
    console.error('Fehler beim Lesen der nicht erlaubten Links:', error);
    return [];
  }
}

function checkExemptRoles(message) {
  const memberRoles = message.member?.roles.cache;
  return memberRoles?.some((role) => ['1169715609878138995'].includes(role.id));
}

function isDiscordInviteLink(link) {
  return link.startsWith('discord.gg/url') || link.startsWith('discord.gg/gangwar');
}

async function importBadWordsFromJson() {
  try {
    const data = await fs.readFile('./src/json/badwords.json', 'utf-8');
    const json = JSON.parse(data);

    await BadWordSchema.deleteMany({});
    const badWordsToInsert = json.badwords.map((word) => ({ word }));
    await BadWordSchema.insertMany(badWordsToInsert);

    console.log('[AutoMod] '.red + 'Schimpfwörter aus JSON importiert.');
  } catch (error) {
    console.error('[AutoMod] '.red + 'Fehler beim Importieren von Schimpfwörtern aus der JSON-Datei:', error);
  }
}

async function importNotAllowedLinksFromJson() {
  try {
    const data = await fs.readFile('./src/json/links.json', 'utf-8');
    const json = JSON.parse(data);

    await LinkSchema.deleteMany({});
    const linksToInsert = json.notallowedLinks.map((link) => ({ link }));
    await LinkSchema.insertMany(linksToInsert);

    console.log('[AutoMod] '.red + 'Nicht erlaubte Links aus JSON importiert.');
    console.log('[AutoMod] '.red + 'AutoMod ist verbunden!');
  } catch (error) {
    console.error('[AutoMod] '.red + 'Fehler beim Importieren von nicht erlaubten Links aus der JSON-Datei:', error);
  }
}

async function logBan(author) {
  const logChannelId = '1180155996639862834';
  const logChannel = await client.channels.fetch(logChannelId);

  if (!logChannel) {
    console.error('Log-Kanal nicht gefunden.');
    return;
  }

  const logEmbed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('Ban durch Auto Mod')
    .setDescription(`:alarm_clock: <@${author.id}> wurde für **Rassismus** gebannt!.`)
    .addFields(
      { name: 'Dauer', value: 'Permanent', inline: true },
      { name: 'Grund', value: 'Rassismus', inline: true },
      { name: 'Falscher Ban?', value: `Überprüfe bitte die Logs <#1180194498010161192>`, inline: false },
    )
    .setFooter({ text: '© RG System' })
    .setTimestamp();

  logChannel.send({ embeds: [logEmbed] });
}

async function main() {
  try {
    await importBadWordsFromJson();
    await importNotAllowedLinksFromJson();
  } catch (error) {
    console.error('Fehler beim Initialisieren:', error);
    process.exit(1);
  }

  client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) {
      return;
    }

    const guildId = message.guild.id;
    const memberId = message.author.id;

    try {
    let autoModData = await AutoModSchema.findOne({ guildId, memberId });

    if (!autoModData) {
      autoModData = await AutoModSchema.create({
        guildId,
        memberId,
        warnings: [{ reason: 'Anti-Link / Bad Word', moderatorId: 'System', timestamp: Date.now() }],
      });
    }

      const notAllowedLinks = await readNotAllowedLinks();
      const containsLink = notAllowedLinks.some((link) => message.content.includes(link));

      const containsDiscordInviteLink = isDiscordInviteLink(message.content);

      const badWords = await readBadWords();
      const containsBadWord = badWords.some((word) => message.content.includes(word));

      const isExemptRole = checkExemptRoles(message);

      if (!isExemptRole && (containsLink || containsBadWord || containsDiscordInviteLink)) {
        if (containsBadWord && message.content.toLowerCase().includes('nigga')) {
          try {
            await message.delete();
            const member = await message.guild.members.fetch(memberId);
            await member.ban({ reason: 'Rassismus | Auto Mod System' });

            await logBan(message.author);

          } catch (error) {
            console.error('Fehler beim Bannen des Benutzers:', error);
          }

          const warnHistoryEntry = await WarnHistorySchema.findOne({ guildId, memberId });

          if (!warnHistoryEntry) {
            await WarnHistorySchema.create({
              guildId,
              memberId,
              history: `Warn für: ${message.content}\n`,
            });
          } else {
            warnHistoryEntry.history += `Warn für: ${message.content}\n`;
            await warnHistoryEntry.save();
          }

          if (autoModData.warnings.length + 1 === 3) {
            const member = await message.guild.members.fetch(memberId);
            await member.timeout(86_400_000, 'Dritter Warn');
            updatedData.warnings = 0;
            await updatedData.save();
            console.log('Timeout für Benutzer nach dem dritten Warnen eingeleitet.');

            const logChannelId = '1180155996639862834';
            const logChannel = await client.channels.fetch(logChannelId);

            if (logChannel) {
              const logEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Timeout durch Auto Mod')
                .setDescription(`:alarm_clock: <@${message.author.id}> wurde für **Dritter Warn** getimeouted.`)
                .addFields(
                  { name: 'Dauer', value: '24 Stunden', inline: true },
                  { name: 'Grund', value: 'Dritter Warn', inline: true },
                )
                .setFooter({ text: '© RG System' })
                .setTimestamp();

              logChannel.send({ embeds: [logEmbed] });
            }
          } else {
            try {
              const logChannelId = '1180155996639862834';
              const logChannel = await client.channels.fetch(logChannelId);

              if (logChannel) {
                const logEmbed = new EmbedBuilder()
                  .setColor('Red')
                  .setTitle('Verwarnung durch Auto Mod')
                  .setDescription(`:warning: <@${message.author.id}> hat eine Verwarnung erhalten.`)
                  .addFields(
                    { name: 'Grund', value: 'Verstoß gegen die Regeln', inline: true },
                  )
                  .setFooter({ text: '© RG System' })
                  .setTimestamp();

                logChannel.send({ embeds: [logEmbed] });
              }
            } catch (error) {
              console.error('Fehler beim Senden der Warnungsnachricht an den Log-Kanal:', error);
            }

            try {
              if (message && !message.deleted) {
                await message.delete()
                .catch((error) => {return})
              }
            } catch (error) {
              console.error('Error deleting message:', error);
            }

            if (containsDiscordInviteLink) {
              return;
            } else {
              try {
                await message.delete();
              } catch (error) {
                return;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Fehler in messageCreate handler:', error);
    }
  });
}

main().catch((error) => {
  console.error('Fehler in der Hauptfunktion:', error);
});

client.on('messageDelete', message => {
  const log = client.channels.cache.get('1180194498010161192');

  if (message.content.trim().length > 0) {
    const deletedlog = new EmbedBuilder()
      .setTitle('Nachricht gelöscht')
      .addFields(
        { name: 'Gelöscht von', value: `${message.author} - (${message.author.id})`, inline: false },
        { name: 'Im Channel', value: `${message.channel}`, inline: false },
        { name: 'Nachricht', value: `${message.content}`, inline: false },
      )
      .setColor('Red')
      .setFooter({ text: '© RG System' })
      .setTimestamp(Date.now());

    log.send({ embeds: [deletedlog] })
      .catch(error => console.error(`Fehler beim Senden des gelöschten Logs: ${error.message}`));
  }
});
client.on('messageUpdate', async (oldMessage, newMessage) => {
  const log = client.channels.cache.get('1180194498010161192');

  if (newMessage.content.trim().length > 0) {
    const editlog = new EmbedBuilder()
      .setTitle('Nachricht bearbeitet')
      .addFields(
        { name: 'Editiert von', value: `${newMessage.author.tag} - (${newMessage.author.id})`, inline: false },
        { name: 'Im Channel', value: `${newMessage.channel}`, inline: false },
        { name: 'Alte Nachricht', value: `${oldMessage.content}`, inline: false },
        { name: 'Neue Nachricht', value: `${newMessage.content}`, inline: false },
      )
      .setColor('Red')
      .setFooter({ text: '© RG System' })
      .setTimestamp(Date.now());

    log.send({ embeds: [editlog] })
      .catch(error => console.error(`Fehler beim Senden des Bearbeitungslogs: ${error.message}`));
  } else {
    return;
  }
});