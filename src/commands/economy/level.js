const { Client, Interaction, ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const canvacord = require('canvacord');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/Level');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply('Du kannst den Befehl nur aufm dem Server ausführen.');
            return;
        }

        await interaction.deferReply();

        const mentionedUserId = interaction.options.get('benutzer')?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id,
        });

        if (!fetchedLevel) {
            interaction.editReply(
                mentionedUserId ? `${targetUserObj.user.tag} Hat kein Level, er muss in Chat schreiben!` : 'Du hast kein Level, schreibe mehr in den Chat'
            );
            return;
        }

        let allLevels = await Level.find({ guildId: interaction.guild.id }).select('-_id userId level xp');

        allLevels.sort((a, b) => {
            if (a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });

        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) +1;

        const rank =new canvacord.Rank()
            .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
            .setRank(currentRank)
            .setLevel(fetchedLevel.level)
            .setCurrentXP(fetchedLevel.xp)
            .setRequiredXP(calculateLevelXp(fetchedLevel.level))
            .setBackground('IMAGE', 'https://cdn.discordapp.com/attachments/1174070459176845332/1178730967913992252/Untitled.png?ex=657735c2&is=6564c0c2&hm=f3c7e6e4f8feeb3efb1a1ec8a09f08e3849b3b76ed99754ff60b57a651fbbddd&')
            .setProgressBar('#FFC300', 'COLOR')
            .setUsername(targetUserObj.user.username)
            .setDiscriminator(targetUserObj.user.discriminator);

            const data = await rank.build();
            const attchment = new AttachmentBuilder(data);
            interaction.editReply({ files: [attchment] });
    },

    name: 'level',
    description: 'Zeigt dein Level',
    options: [
        {
            name: 'benutzer',
            description: 'Das Level das du sehen möchtest',
            type: ApplicationCommandOptionType.Mentionable,
        }
    ]
}