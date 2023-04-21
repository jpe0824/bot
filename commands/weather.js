const { SlashCommandBuilder } = require("discord.js");
const weather = require("weather-js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Gives you a local weather blurb!")
    .addStringOption((option) =>
      option
        .setName("city")
        .setDescription("The name of the city")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("state")
        .setDescription("The two-letter state code")
        .setRequired(true)
    ),
  async execute(interaction) {
    const city = interaction.options.getString("city");
    const state = interaction.options.getString("state");
    const searchQuery = `${city}, ${state}`;

    let response = "";
    await weather.find(
      { search: searchQuery, degreeType: "F" },
      (err, result) => {
        if (err) {
          console.log(err);
          interaction.reply(
            "An error occurred while fetching the weather information."
          );
          return;
        }

        if (!result || result.length === 0) {
          interaction.reply(`No weather information found for ${searchQuery}.`);
          return;
        }

        const location = result[0].location.name;
        const currentTemp = result[0].current.temperature;
        const high = result[0].forecast[0].high;
        const low = result[0].forecast[0].low;

        response = `The current temperature in ${location} is ${currentTemp} F. The forecasted high for today is ${high} F and the low is ${low} F.`;
        interaction.reply(response);
      }
    );
  },
};
