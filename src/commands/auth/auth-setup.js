const { EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const authSchema = require('../../models/auth');

module.exports = {
  name: 'auth-setup',
  description: 'Konfiguriere das Auth-Setup System',
  options: [
    {
      name: 'channel',
      description: 'In Welchen Channel soll die Nachricht geschickt werden?',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: 'role',
      description: 'Wähle eine Rolle aus, Welche der User bekommen soll',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],
  
  callback: async (client, interaction) => {
    const { guild, member } = interaction;

    const channel = interaction.options.getChannel('channel')
    const role = interaction.options.getRole('role')

    authSchema.findOne({ GuildID: interaction.guild.id}, async (err, data) => {

        if(!data) {
            authSchema.create({
                GuildID: interaction.guild.id,
                ChannelID: channel.id,
                RoleID: role.id
            });
        } else {
            await interaction.reply({
                content: 'Verifzierungs System wurde eingestellt, um es zu deaktivieren benutze `/auth-aus`',
                ephemeral: true
            });
            return;
        }

        const exhalingFace = new ButtonBuilder()
            .setCustomId('exhalingFace')
            .setEmoji(':face_exhaling:')
            .setStyle(ButtonStyle.Primary);
    
        const nerdFace = new ButtonBuilder()
            .setCustomId('nerdFace')
            .setEmoji(':nerd:')
            .setStyle(ButtonStyle.Primary);

        const laughFace = new ButtonBuilder()
            .setCustomId('laughFace')
            .setEmoji(':rofl:')
            .setStyle(ButtonStyle.Primary);

        const heartFace = new ButtonBuilder()
            .setCustomId('heartFace')
            .setEmoji(':heart_eyes:')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(exhalingFace, nerdFace, laughFace, heartFace);

        const embed = new EmbedBuilder()
            .setTitle('Verifzierungs System')
            .setDescription('Clicke auf das **Augen Herz** Emoji um dich zu Verifzieren!')
            .setColor('Red');

        await channel.send({
            embeds: [embed],
            components: [row]
        });

        await interaction.reply({
            content: `Das Verifizierungssystem wurde erfolgreich erstellt`,
            ephemeral: true
        })
    })
  }
};
