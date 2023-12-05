const { devs, Server } = require('../../../config.json');
const getModals = require('../../utils/getModals');

module.exports = async (client, interaction) => {
  if (!interaction.isModalSubmit()) return;

  const modals = getModals();

  try {
    const commandObject = modals.find(
      (modal) => modal.customId === interaction.customId
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