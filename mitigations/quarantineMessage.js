const { MessageEmbed } = require("discord.js");
const { defangMessageLinks } = require("../helpers/message-helpers.js");

module.exports = (message, reason) => {
  console.log("Quarantine");

  const codeFormat = (str) => "```" + str + "```";

  var previewText = defangMessageLinks(message).substr(0, 150) + "...";

  const quarantineEmbed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("NoSpam quarantined this message")
    .setAuthor(
      message.author.username + "#" + message.author.discriminator,
      message.author.avatarURL()
    )
    .setDescription(
      "For your safety this message has automatically been removed."
    )
    .setThumbnail("https://i.imgur.com/dRI2bdJ_d.webp")
    .addFields(
      { name: "Defanged preview", value: codeFormat(previewText) },
      { name: "Description", value: codeFormat(reason) },
      { name: "Tags", value: codeFormat(message.tags.join(", ")) },
      // { name: "\u200B", value: "\u200B" },
      { name: "Author ID", value: codeFormat(message.author.id), inline: true },
      { name: "Message ID", value: codeFormat(message.id), inline: true },
      {
        name: "Learn more",
        value: "[Github](https://github.com/MrWebMD/NoSpamBot)",
        inline: false,
      }
    )
    .setTimestamp()
    .setFooter(
      "Made with ❤️ by Dom#0107",
      "https://i.imgur.com/dRI2bdJ_d.webp"
    );

  message
    .reply(quarantineEmbed)
    .then(() => {
      console.log("Warning has been issued");
      message
        .delete()
        .then((message) =>
          console.log(
            `Deleted quarantined message from ${message.author.username}`
          )
        )
        .catch(console.log);
    })
    .catch(console.log);
};
