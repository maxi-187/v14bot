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
            await interaction.editReply(
                mentionedUserId ? `${targetUserObj.user.tag} hat kein Level, er muss in den Chat schreiben!` : 'Du hast kein Level, schreibe mehr in den Chat'
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

        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
        let img = 'https://cdn.discordapp.com/attachments/1036746018601062402/1179809421250003116/level.png?ex=657b2225&is=6568ad25&hm=d4abe089d69868a0e38aec4f1df984fdfec31135d01812eb7c3e28321e682fd8&';

        const rank = new canvacord.Rank()
            .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
            .setRank(currentRank)
            .setLevel(fetchedLevel.level)
            .setCurrentXP(fetchedLevel.xp)
            .setRequiredXP(calculateLevelXp(fetchedLevel.level))
            .setBackground('IMAGE', img)
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