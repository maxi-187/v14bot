const { EmbedBuilder } = require("discord.js");

module.exports = {
  customId: "sagen",
  permissionsRequired: [],
  botPermissions: [],

  callback: async (client, interaction) => {
    let channel = interaction.channel;
    try {
      let sagenFrage = interaction.fields.getTextInputValue("text");
      let sagenEmbed = interaction.fields.getTextInputValue('embed');

      if (sagenEmbed === "ein" || sagenEmbed === "aus") {
        const embed = new EmbedBuilder()
          .setDescription(sagenFrage)
          .setColor('Red')
          .setFooter({ text: '© RG System' })  

        if (sagenEmbed === "ein") {
          await channel.send({ embeds: [embed] });
        } else {
          await channel.send(sagenFrage);
        }

        await interaction.reply({ content: "Deine Nachricht wurde erfolgreich gesendet", ephemeral: true });
      } else {
        await interaction.reply({ content: "Ungültige Option für embed: Bitte wähle 'ein' oder 'aus'.", ephemeral: true });
      }
    } catch (error) {
      console.error(error);
    }
  }
};