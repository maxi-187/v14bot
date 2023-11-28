require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActivityType } = require('discord.js');
const { connect, mongoose } = require('mongoose');
const eventHandler = require('./handlers/eventHandler');
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
        const guild = bot.guilds.cache.get('1169715609446141974'); // guild (server)
        const boostChannel = guild.channels.cache.get('1169715611962707990'); // booster channel

        if (boostChannel && boostChannel.type === 'GUILD_TEXT') {
            boostChannel.send(`${newMember.user.username} hat den Server geboostet! 🚀`);
        }
    }
});