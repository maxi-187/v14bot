const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('benutzer').value;
    const reason = interaction.options.get('grund')?.value || 'Kein Grund!';

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setDescription(`Diesen User gibt es Nicht!`)
        .setColor('Red')
        .setFooter({ text: '© RG System' })
        .setTimestamp()
      ], ephemeral: true });
      return;
    }
    
    if (targetUser.id === interaction.user.id) {
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setDescription(`Du kannst dich nicht selber kicken!`)
        .setColor('Red')
        .setFooter({ text: '© RG System' })
        .setTimestamp()
      ], ephemeral: true });
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setDescription(`Du kannst den Server Besitzer nicht kicken!`)
        .setColor('Red')
        .setFooter({ text: '© RG System' })
        .setTimestamp()
      ], ephemeral: true });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position; 
    const botRolePosition = interaction.guild.members.me.roles.highest.position; 

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setDescription(`Du kannst ${targetUser} nicht kick! Da er die gleiche Rolle hat oder über dir steh.`)
        .setColor('Red')
        .setFooter({ text: '© RG System' })
        .setTimestamp()
      ], ephemeral: true });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply
      return;
    }

    try {
      await targetUser.kick({ reason });
      await interaction.reply({ embeds: [new EmbedBuilder()
        .setDescription(`Benutzer ${targetUser} wurde gekickt!\nGrund: ${reason}`)
        .setColor('Red')
        .setFooter({ text: '© RG System' })
        .setTimestamp()
      ], ephemeral: true });
    } catch (error) {
      console.log(`Da ist ein Fehler beim kicken: ${error}`);
    }
  },

  name: 'kick',
  description: 'Kickt einen Benutzer vom Server.',
  options: [
    {
      name: 'benutzer',
      description: 'Den Benutzer den Du kicken möchtest!',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'grund',
      description: 'Wieso möchtest Du den Benutzer kicken?',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],
};