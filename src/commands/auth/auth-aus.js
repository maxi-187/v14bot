const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const authSchema = require('../../models/auth');

module.exports = {
  name: 'auth-aus',
  description: 'Konfiguriere das Auth-Setup System',
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],

  callback: async (client, interaction) => {
    const { guild, member } = interaction;

    authSchema.deleteMany({ GuildID: interaction.guild.id }, async (err, data) => {
        await interaction.reply({
            content: `Das Verifzierungs System wurde erfolgreich ausgeschaltet!`,
            ephemeral: true
        })

        const channel = interaction.channel;

        try {
            const messages = await channel.messages.fetch();
            const authSetupMessage = messages.find((msg) =>
                msg.embeds.length && msg.embeds[0].title === 'Verifzierungs System'
            );

            if (authSetupMessage) {
                await authSetupMessage.delete();
            }

        } catch (error) {
            console.log('Fehler beim Löschen vom Verifzierungs System', error)
            return;
        }
    })
  }
};