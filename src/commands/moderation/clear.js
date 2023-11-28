const { PermissionFlagsBits, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'clear',
  description: 'Lösche eine bestimmte Anzahl von Nachrichten von einem benutzer oder Kanal.',
  options: [
    {
      name: 'anzahl',
      description: 'Anzahl der zu löschenden Nachrichten',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: 'benutzer',
      description: 'Wähle ein benutzer aus, um seine Nachrichten zu löschen.',
      type: ApplicationCommandOptionType.Mentionable,
      required: false,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],
  callback: async (client, interaction) => {
    const { channel, options } = interaction;

    const anzahl = options.getInteger('anzahl');
    const benutzer = options.getUser("benutzer");

    const nachrichten = await channel.messages.fetch({
      limit: anzahl + 1,
    });

    const res = new EmbedBuilder()
      .setColor('Red');

    if (benutzer) {
      let i = 0;
      const gefiltert = [];

      (await nachrichten).filter((nachricht) => {
        if (nachricht.author.id === benutzer.id && anzahl > i) {
          gefiltert.push(nachricht);
          i++;
        }
      });

      await channel.bulkDelete(gefiltert).then(nachrichten => {
        res.setDescription(`Erfolgreich ${nachrichten.size} Nachrichten von ${benutzer} gelöscht.`);
        interaction.reply({ embeds: [res], ephemeral: true });
      });
    } else {
      await channel.bulkDelete(anzahl, true).then(nachrichten => {
        res.setDescription(`Erfolgreich ${nachrichten.size} Nachrichten aus dem Kanal gelöscht.`);
        interaction.reply({ embeds: [res], ephemeral: true });
      });
    }
  }
};