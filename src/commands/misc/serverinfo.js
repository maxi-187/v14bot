const { EmbedBuilder, ChannelType, escapeNumberedList } = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "Server-Info",
  devOnly: false,
  callback: async (client, interaction) => {
    const { guild } = interaction;
    const { members, stickers, role } = guild;
    const { name, ownerId, createdTimestamp, memberCount } = guild;
    const icon = guild.iconURL();
    const roles = guild.roles.cache.size;
    const emojis = guild.emojis.cache.size;
    const id = guild.id;
    const channels = interaction.guild.channels.cache.size;
    const category = interaction.guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildCategory
    ).size;
    const text = interaction.guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildText
    ).size;
    const voice = interaction.guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildVoice
    ).size;
    const annnouncement = interaction.guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildAnnouncement
    ).size;
    const stage = interaction.guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildStageVoice
    ).size;
    const forum = interaction.guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildForum
    ).size;
    const thread = interaction.guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildPublicThread
    ).size;
    const rolelist = guild.roles.cache.toJSON().join(" ");
    const botCount = members.cache.filter((member) => member.user.bot).size;
    const vanity = guild.vanityURLCode || "Keine Vanity";
    const sticker = stickers.cache.size;
    const highestrole = interaction.guild.roles.highest;
    const animated = interaction.guild.emojis.cache.filter(
      (emoji) => emoji.animated
    ).size;
    const description = interaction.guild.description || "Keine Beschreibung";

    const splitPascal = (string, separator) =>
      string.split(/(?=[A-Z])/).join(separator);
    const toPascalCase = (string, separator = false) => {
      const pascal =
        string.charAt(0).toUpperCase() +
        string
          .slice(1)
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
      return separator ? splitPascal(pascal, separator) : pascal;
    };
    const features =
      guild.features
        ?.map((feature) => `- ${toPascalCase(feature, " ")}`)
        ?.join("\n") || "Keine";

    let baseVerification = guild.verificationLevel;

    if (baseVerification == 0) baseVerification = "Keine";
    if (baseVerification == 1) baseVerification = "Niedrig";
    if (baseVerification == 2) baseVerification = "Mittel";
    if (baseVerification == 3) baseVerification = "Hoch";
    if (baseVerification == 4) baseVerification = "Sehr Hoch";

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setThumbnail(icon)
      .setAuthor({ name: name, iconURL: icon })
      .setDescription(`${description}`)
      .setFooter({ text: `Server-ID: ${id}` })
      .setTimestamp()
      .addFields({
        name: "» Erstellt am",
        value: `<t:${parseInt(createdTimestamp / 1000)}:R>`,
        inline: true,
      })
      .addFields({
        name: "» Server-Besitzer",
        value: `<@${ownerId}>`,
        inline: true,
      })
      .addFields({ name: "» Vanity-URL", value: `${vanity}`, inline: true })
      .addFields({
        name: "» Mitgliederanzahl",
        value: `${memberCount - botCount}`,
        inline: true,
      })
      .addFields({ name: "» Bot-Anzahl", value: `${botCount}`, inline: true })
      .addFields({ name: "» Emoji-Anzahl", value: `${emojis}`, inline: true })
      .addFields({
        name: "» Animierte Emojis",
        value: `${animated}`,
        inline: true,
      })
      .addFields({
        name: "» Sticker-Anzahl",
        value: `${sticker}`,
        inline: true,
      })
      .addFields({ name: `» Rollenanzahl`, value: `${roles}`, inline: true })
      .addFields({
        name: `» Höchste Rolle`,
        value: `${highestrole}`,
        inline: true,
      })
      .addFields({
        name: "» Verifikationsstufe",
        value: `${baseVerification}`,
        inline: true,
      })
      .addFields({
        name: "» Boost-Anzahl",
        value: `${guild.premiumSubscriptionCount}`,
        inline: true,
      })
      .addFields({
        name: "» Kanäle",
        value: `Gesamt: ${channels} | <:category:1185710180592275527> ${category} | <:textchannel:1185710200762671298> ${text} | <:voicechannel:1185710183310168186> ${voice} | <:announcement:1185710153631273051> ${annnouncement} | <:stage:1185710184635568178> | ${stage} | <:forum:1185710188041338900> ${forum} | <:thread:1185710186233598074> ${thread}`,
        inline: false,
      })
      .addFields({ name: `» Features`, value: `\`\`\`${features}\`\`\`` });

    await interaction.reply({ embeds: [embed] });
  },
};
