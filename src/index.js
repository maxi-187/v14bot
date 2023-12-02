require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActivityType } = require('discord.js');
const { connect, mongoose } = require('mongoose');
const eventHandler = require('./handlers/eventHandler');
const fs = require('fs').promises;
const config = require('../config.json');
const statuse = ['🎄', '.gg/gangwar' , '🔫 RG 🔫', 'Made with ❤️', '🎄']
let current = 0;
require('@colors/colors');

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
client.login(config.token1)
 .then(() => {
    console.clear();
    console.log('[Discord API] '.green + client.user.username + ' hat sich eingeloggt!');
    client.user.setPresence({
      activities: [{ name: statuse[0], type: ActivityType.Watching }],
      status: 'dnd',
    });

    setInterval(() => {
      if(statuse[current]){
        client.user.setActivity(statuse[current] , {type: ActivityType.Watching});
        current++;
      }else{
        current = 0;
        client.user.setActivity(statuse[current] , {type: ActivityType.Watching});
      }
    }, 5*1000);

    mongoose.set('strictQuery', true);
    connect(config.database, {}).then(() => {
      console.log('[MongoDB API] '.green + 'ist jetzt verbunden.')
    });
 })
 .catch((err) => console.log(err));



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
        .setTimestamp()

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
    .setThumbnail(`${interaction.displayAvatarURL({dynamic: true})}`)
    .setDescription(`\nHey <@${interaction.user.id}>, Willkommen auf **${interaction.guild.name}**`)
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
    .setThumbnail(`${interaction.displayAvatarURL({dynamic: true})}`)
    .setDescription(`\n<@${interaction.user.id}> hat den Discord verlassen!`)
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
  } catch (error) {
    console.error('[AutoMod] '.red + 'Fehler beim Importieren von nicht erlaubten Links aus der JSON-Datei:', error);
  }
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
          warnings: 0,
        });
      }

      const notAllowedLinks = await readNotAllowedLinks();
      const containsLink = notAllowedLinks.some((link) => message.content.includes(link));

      const badWords = await readBadWords();
      const containsBadWord = badWords.some((word) => message.content.includes(word));

      const isExemptRole = checkExemptRoles(message);

      if (!isExemptRole && (containsLink || containsBadWord)) {

       const updatedData = await AutoModSchema.findOneAndUpdate({ guildId, memberId }, { $inc: { warnings: 1 } }, { new: true });

        if (updatedData.warnings >= 3) {
          const member = await message.guild.members.fetch(memberId);
          await member.timeout(86_400_000, 'Dritter Warn');
          updatedData.warnings = 0;
          await updatedData.save();
          console.log('Timeout für Benutzer nach dem dritten Warnen eingeleitet.');
        } else {
          const warningMessage = await message.reply('Du hast eine Verwarnung für das Senden eines Links oder Schimpfworts erhalten.');

          setTimeout(() => {
            warningMessage.delete();
          }, 5000);
        }
        try {
          await message.delete();
        } catch (error) {
          console.error('Fehler beim Löschen der Nachricht:', error);
        }
      }
    } catch (error) {
      console.error('Fehler beim Verarbeiten der AutoMod-Aktionen:', error);
    }
  });
}

main().catch((error) => {
  console.error('Fehler in der Hauptfunktion:', error);
});

client.on('messageDelete', message => {
  const log = client.channels.cache.get('1180194498010161192');

  // Überprüfe, ob der Nachrichteninhalt existiert und nicht leer ist
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

  // Überprüfe, ob der Nachrichteninhalt der neuen Nachricht existiert und nicht leer ist
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