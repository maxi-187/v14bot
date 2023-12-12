const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const Config = require('../../models/maintenance');

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const config = await Config.findOne();
  const maintenanceMode = config ? config.maintenanceMode : false;

  if (maintenanceMode && !devs.includes(interaction.member.id)) {
    interaction.reply({
      content: 'Der Bot befindet sich im Wartungsmodus. Nur Entwickler können Befehle verwenden.',
      ephemeral: true,
    });
    return;
  }

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: 'Nur der Developer kann den Befehl ausführen!',
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        interaction.reply({
          content: 'Ich kann den Befehl hier nicht ausführen!',
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: 'Keine Rechte!',
            ephemeral: true,
          });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "Ich habe keine Rechte dafür!",
            ephemeral: true,
          });
          return;
        }
      }
    }

    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(`Da ist ein Fehler beim ausführen vom Befehl: ${error}`);
  }
};
