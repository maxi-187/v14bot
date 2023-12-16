const LinkSchema = require("../../models/Links");
const AutoModSchema = require("../../models/AutoMod");
const WarnHistorySchema = require("../../models/WarnHistory");
const {
  Client,
  GatewayIntentBits,
  intents,
  EmbedBuilder,
} = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
const fs = require("fs").promises;
require("@colors/colors");

const deleteDelay = 5000;
const logChannelId = "1180155996639862834";

async function readNotAllowedLinks() {
  try {
    const links = await LinkSchema.find();
    return links.map((linkDoc) => linkDoc.link);
  } catch (error) {
    console.error("Fehler beim Lesen der nicht erlaubten Links:", error);
    return [];
  }
}

function checkExemptRoles(message) {
  const memberRoles = message.member?.roles.cache;
  return memberRoles?.some((role) => ["1169715609878138995"].includes(role.id));
}

function isDiscordInviteLink(link) {
  return (
    link.startsWith("discord.gg/url") || link.startsWith("discord.gg/gangwar")
  );
}

async function importNotAllowedLinksFromJson() {
  try {
    const data = await fs.readFile("../../json/links.json", "utf-8");
    const json = JSON.parse(data);

    await LinkSchema.deleteMany({});
    const linksToInsert = json.notallowedLinks.map((link) => ({ link }));
    await LinkSchema.insertMany(linksToInsert);
  } catch (error) {
    console.error(
      "[AutoMod] ".red +
        "Fehler beim Importieren von nicht erlaubten Links aus der JSON-Datei:",
      error
    );
  }
}

async function main() {
  try {
    await importNotAllowedLinksFromJson();
  } catch (error) {
    console.error("Fehler beim Initialisieren:", error);
    process.exit(1);
  }

  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) {
      return;
    }

    const guildId = message.guild.id;
    const memberId = message.author.id;

    console.log("Nachricht", message.content);

    try {
      let autoModData = await AutoModSchema.findOne({ guildId, memberId });

      if (!autoModData) {
        autoModData = await AutoModSchema.create({
          guildId,
          memberId,
          warnings: [
            {
              reason: "Anti-Link",
              moderatorId: "System",
              timestamp: Date.now(),
            },
          ],
        });
      }

      const notAllowedLinks = await readNotAllowedLinks();
      const containsLink = notAllowedLinks.some((link) =>
        message.content.includes(link)
      );

      const containsDiscordInviteLink = isDiscordInviteLink(message.content);

      const isExemptRole = checkExemptRoles(message);

      if (!isExemptRole && (containsLink || containsDiscordInviteLink)) {
        const warnHistoryEntry = await WarnHistorySchema.findOne({
          guildId,
          memberId,
        });

        if (!warnHistoryEntry) {
          await WarnHistorySchema.create({
            guildId,
            memberId,
            history: `Warn für: ${message.content}\n`,
          });
        } else {
          warnHistoryEntry.history += `Warn für: ${message.content}\n`;
          await warnHistoryEntry.save();
        }

        if (autoModData.warnings.length + 1 === 3) {
          const member = await message.guild.members.fetch(memberId);
          await member.timeout(86_400_000, "Warn für einen Verboten Link.");
          autoModData.warnings = 0;
          await autoModData.save();

          const logChannel = await client.channels.fetch(logChannelId);

          if (logChannel) {
            const logEmbed = new EmbedBuilder()
              .setColor("Red")
              .setTitle("Timeout durch Auto Mod")
              .setDescription(
                `:alarm_clock: <@${message.author.id}> wurde für **Dritter Warn** getimeouted.`
              )
              .addFields(
                { name: "Dauer", value: "24 Stunden", inline: true },
                { name: "Grund", value: "Dritter Warn", inline: true }
              )
              .setFooter("© RG System")
              .setTimestamp();

            logChannel.send({ embeds: [logEmbed] });
          }
        } else {
          try {
            const logChannel = await client.channels.fetch(logChannelId);

            if (logChannel) {
              const logEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Verwarnung durch Auto Mod")
                .setDescription(
                  `:warning: <@${message.author.id}> hat eine Verwarnung erhalten.`
                )
                .addFields({
                  name: "Grund",
                  value: "Verstoß gegen die Regeln",
                  inline: true,
                })
                .setFooter("© RG System")
                .setTimestamp();

              logChannel.send({ embeds: [logEmbed] });
            }
          } catch (error) {
            console.error(
              "Fehler beim Senden der Warnungsnachricht an den Log-Kanal:",
              error
            );
          }

          try {
            if (message && !message.deleted) {
              await message.delete();
            }
          } catch (error) {
            console.error("Fehler beim Löschen der Nachricht:", error);
          }

          if (containsDiscordInviteLink) {
            return;
          } else {
            try {
              await message.delete();
            } catch (error) {
              console.error("Fehler beim Löschen der Nachricht:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Fehler im messageCreate-Handler:", error);
    }
  });
}

main().catch((error) => {
  console.error("Fehler in der Hauptfunktion:", error);
});
