require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActivityType } = require('discord.js');
const { connect, mongoose } = require('mongoose');
const eventHandler = require('./handlers/eventHandler');
const config = require('../config.json');
const statuse = ['.gg/gangwar' , '🔫 RG 🔫', 'Made with ❤️']
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
        .setTimestamp()
        .setFooter({ text: 'Chat-Befehl verwendet' });

    await channel.send({ embeds: [embed] });
});