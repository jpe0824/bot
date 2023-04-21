const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Replies with info about available commands!"),
  async execute(interaction) {
    const helpText = fs.readFileSync("./assets/help.txt", "utf8");
    await interaction.reply(`\n${helpText}\n\n`);
  },
};
