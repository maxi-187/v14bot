const { EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  customId: "verify",
  permissionsRequired: [],
  botPermissions: [],

  callback: async (client, interaction) => {
    const randomNumber1 = Math.round(Math.random() * 10);
    const randomNumber2 = Math.round(Math.random() * 10);
    const mathEquation = randomNumber1 + randomNumber2;

    const verifyModal = new ModalBuilder()
      .setTitle("Verifiziere dich!")
      .setCustomId("verifyModal")
      .setComponents(
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setLabel(`Was ergibt ${randomNumber1} + ${randomNumber2}?`)
            .setCustomId("ergebnis")
            .setMinLength(1)
            .setMaxLength(2)
            .setRequired(true)
            .setPlaceholder("Bitte gib das Ergebnis ein, für die User Rolle!")
            .setStyle(TextInputStyle.Short)
        ),
      );

    await interaction.showModal(verifyModal);

    try {
      const modalCollector = await interaction.awaitModalSubmit({ time: 60000 });

      const givenAnswer = modalCollector.fields.getTextInputValue("ergebnis");

      if (!givenAnswer || isNaN(givenAnswer)) {
        return modalCollector.reply({ embeds: [new EmbedBuilder().setDescription('Du hast keine oder eine ungültige Zahl angegeben!').setColor('Red')], ephemeral: true });
      }

      if (mathEquation === parseInt(givenAnswer)) {
        const role = interaction.guild.roles.cache.get('1169715609861365800');
        if (role) {
          return interaction.member.roles
            .add(role)
            .then(() => {
              return modalCollector.reply({ embeds: [new EmbedBuilder().setDescription('Erfolgreich verifiziert!').setColor('#57F287')], ephemeral: true });
            })
            .catch((error) => {
              console.error(error);
              return modalCollector.reply({ embeds: [new EmbedBuilder().setDescription('Es ist ein Fehler passiert!').setColor('Red')], ephemeral: true });
            });
        } else {
          console.log("Rolle nicht gefunden");
        }
      }
    } catch (error) {
      console.error("Error during modal interaction:", error);
    }
  }
};
