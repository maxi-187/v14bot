require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  ActivityType,
  EmbedBuilder,
} = require("discord.js");
const { connect, mongoose } = require("mongoose");
const eventHandler = require("./handlers/eventHandler");
const { errorHandler } = require("./handlers/errorHandler");
const fs = require("fs").promises;
const config = require("../config.json");
const statuse = ["🎄", "🪐 .gg/gangwar 🌌", "🔫 RG 🔫", "Made with ❤️", "🎄"];
const maintrance = ["🔴 Wartungen 🔴"];
let current = 0;

require("@colors/colors");

let maintenanceMode = false;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

eventHandler(client);
errorHandler(client);


client
  .login(config.token)
  .then(() => {
    console.clear();
    console.log(
      "[Discord API] ".green + client.user.username + " hat sich eingeloggt!"
    );
    updateStatus();

    setInterval(updateStatus, 5 * 1000);

    mongoose.set("strictQuery", true);
    connect(config.database, {}).then(() => {
      console.log("[Datenbank] ".green + "ist verbunden.");
    });
  })
  .catch((err) => console.log("[Datenbank] Es gab ein Fehler! ".green + err));

async function updateStatus() {
  const presenceData = {
    activities: [{ name: statuse[current], type: ActivityType.Watching }],
  };

  if (maintenanceMode) {
    presenceData.status = "idle";
    presenceData.activities = maintrance.map((status) => ({
      name: status,
      type: ActivityType.Watching,
    }));
  } else {
    presenceData.status = "dnd";
  }

  client.user.setPresence(presenceData);

  if (!maintenanceMode) {
    current = (current + 1) % statuse.length;
  }
}

async function checkMaintenanceMode() {
  const Config = require("../src/models/maintenance");
  const config = await Config.findOne();
  maintenanceMode = config ? config.maintenanceMode : false;

  updateStatus();
}

checkMaintenanceMode();

setInterval(checkMaintenanceMode, 30 * 1000);
client.on("interactionCreate", async (interaction) => {
  if (!interaction.inGuild()) return;
  if (!interaction.isCommand()) return;

  const channel = client.channels.cache.get("1178400238168449024");
  const server = interaction.guild.name;
  const userID = interaction.user.id;

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("🌐 Chat-Befehl verwendet")
    .addFields({ name: "Servername", value: `${server}` })
    .addFields({ name: "Chat-Befehl", value: `${interaction.commandName}` })
    .addFields({ name: "Befehlsbenutzer", value: `<@${userID}> / ${userID}` })
    .setFooter({ text: "© RG System" })
    .setTimestamp();

  await channel.send({ embeds: [embed] });
});

client.on("guildMemberAdd", async (interaction) => {
  const channel = interaction.guild.channels.cache.get("1169715611643945137");
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setAuthor({
      name: client.user?.username,
      iconURL: client.user?.displayAvatarURL({ dynamic: true }),
    })
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/1036746018601062402/1181699261457502248/Download.png?ex=65820232&is=656f8d32&hm=81f7b089a331f7efc23b0a7db9459a25ae3818713403620d6994dbe6ae71c51b&"
    )
    .setDescription(
      `\nHey <@${interaction.user.id}>, Willkommen auf **${interaction.guild.name}**! \n\n**Verifizierung**\nGehe zu <#1178803426973470760> um alle Kanäle einsehen zu können!`
    )
    .setColor(`#ED4245`)
    .setFooter({ text: "© RG System" })
    .setTimestamp(Date.now());

  channel.send({
    embeds: [embed],
  });

  client.channels.cache
    .get("1169715611195150456")
    .setName(`🌎All User: ${interaction.guild.memberCount}`);
  client.channels.cache
    .get("1169715611195150458")
    .setName(
      `✅ Members: ${
        interaction.guild.members.cache.filter((m) => !m.user.bot).size
      }`
    );
  client.channels.cache
    .get("1169715611195150457")
    .setName(
      `🤖Bots: ${
        interaction.guild.members.cache.filter((m) => m.user.bot).size
      }`
    );
});

client.on("guildMemberRemove", async (interaction) => {
  const channel = interaction.guild.channels.cache.get("1174054278348935228"); // leave channel
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setAuthor({
      name: client.user?.username,
      iconURL: client.user?.displayAvatarURL({ dynamic: true }),
    })
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/1036746018601062402/1181699261457502248/Download.png?ex=65820232&is=656f8d32&hm=81f7b089a331f7efc23b0a7db9459a25ae3818713403620d6994dbe6ae71c51b&"
    )
    .setDescription(
      `\n<@${interaction.user.id}>, hat **${interaction.guild.name}** Verlassen!`
    )
    .setColor(`#ED4245`)
    .setFooter({ text: "© RG System" })
    .setTimestamp(Date.now());

  channel.send({
    embeds: [embed],
  });

  client.channels.cache
    .get("1169715611195150456")
    .setName(`🌎All User: ${interaction.guild.memberCount}`);
  client.channels.cache
    .get("1169715611195150458")
    .setName(
      `✅ Members: ${
        interaction.guild.members.cache.filter((m) => !m.user.bot).size
      }`
    );
  client.channels.cache
    .get("1169715611195150457")
    .setName(
      `🤖Bots: ${
        interaction.guild.members.cache.filter((m) => m.user.bot).size
      }`
    );
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
  const oldBoost = oldMember.premiumSinceTimestamp;
  const newBoost = newMember.premiumSinceTimestamp;

  if (oldBoost !== newBoost && newBoost) {
    const guild = client.guilds.cache.get("1169715609446141974"); // guild (server)
    const boostChannel = guild.channels.cache.get("1169715611962707990"); // booster channel

    if (boostChannel && boostChannel.type === "GUILD_TEXT") {
      boostChannel.send(
        `${newMember.user.username} hat den Server geboostet! 🚀`
      );
    }
  }
});

client.on("messageDelete", (message) => {
  const log = client.channels.cache.get("1180194498010161192");

  if (message.content.trim().length > 0) {
    const deletedlog = new EmbedBuilder()
      .setTitle("Nachricht gelöscht")
      .addFields(
        {
          name: "Gelöscht von",
          value: `${message.author} - (${message.author.id})`,
          inline: false,
        },
        { name: "Im Channel", value: `${message.channel}`, inline: false },
        { name: "Nachricht", value: `${message.content}`, inline: false }
      )
      .setColor("Red")
      .setFooter({ text: "© RG System" })
      .setTimestamp(Date.now());

    log
      .send({ embeds: [deletedlog] })
      .catch((error) =>
        console.error(
          `Fehler beim Senden des gelöschten Logs: ${error.message}`
        )
      );
  }
});
client.on("messageUpdate", async (oldMessage, newMessage) => {
  const log = client.channels.cache.get("1180194498010161192");

  if (newMessage.content.trim().length > 0) {
    const editlog = new EmbedBuilder()
      .setTitle("Nachricht bearbeitet")
      .addFields(
        {
          name: "Editiert von",
          value: `${newMessage.author.tag} - (${newMessage.author.id})`,
          inline: false,
        },
        { name: "Im Channel", value: `${newMessage.channel}`, inline: false },
        {
          name: "Alte Nachricht",
          value: `${oldMessage.content}`,
          inline: false,
        },
        {
          name: "Neue Nachricht",
          value: `${newMessage.content}`,
          inline: false,
        }
      )
      .setColor("Red")
      .setFooter({ text: "© RG System" })
      .setTimestamp(Date.now());

    log
      .send({ embeds: [editlog] })
      .catch((error) =>
        console.error(
          `Fehler beim Senden des Bearbeitungslogs: ${error.message}`
        )
      );
  } else {
    return;
  }
});
