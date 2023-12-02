const { EmbedBuilder } = require('discord.js');

module.exports = {
  customId: "verify",
  permissionsRequired: [],
  botPermissions: [],

  callback: async (client, interaction) => {
    const role = interaction.guild.roles.cache.get('1169715609861365800');
    if (role) {
      return interaction.member.roles
        .add(role)
        .then(() => {
          return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Erfolgreich verifiziert!').setColor('#57F287')], ephemeral: true });
        })
        .catch((error) => {
          console.error(error);
          return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Es ist ein Fehler passiert!').setColor('Red')], ephemeral: true });
        });
    } else {
      return;
    }
  }
};
