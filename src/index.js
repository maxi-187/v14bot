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

const authSchema = require('./models/auth');

client.on('interactionCreate', async interaction => {

    if(!interaction.isButton()) return;
    if(interaction.customId === 'heartFace') {
      const guildID = interaction.guild.id;

      authSchema.find({ GuildID: guildID }, async (err, data) => { // Fix the typo here
        if (data) {
          const roleID = data.RoleID;
          const member = interaction.member;

          const channel = new EmbedBuilder()
              .setTitle(`${interaction.guild.name} | Verifzierungs System`)
              .setDescription(`Hallo ${member}, Du wurdest Erfolgreich Verifziert! du siehst nun alle Channel von ${interaction.guild.name}`)
              .setColor('Red')

          const role = interaction.guild.roles.cache.get(roleID);
          if (role) {
            await member.roles.add(role);
            interaction.reply({ embeds: [channel], ephemeral: true });
          } else {
            await interaction.reply({
              content: `Die Rolle gibt es nicht!`,
              ephemeral: true
            });
          }
        }
      });
    } else {
      await interaction.reply({
        content: `Falscher Emoji! Bitte versuche es erneut!`,
        ephemeral: true
      });
    }
});