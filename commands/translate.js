const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate text from one language to another")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text you want to translate")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("to")
        .setDescription("The language code of the language to translate to.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("from")
        .setDescription(
          "The language code of the text to translate from. Defaults to auto-detect."
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    const text = interaction.options.getString("text");
    const from = interaction.options.getString("from") || "en";
    const to = interaction.options.getString("to");

    let key = process.env.MICROSOFT_TRANSLATOR_KEY;
    let endpoint = "https://api.cognitive.microsofttranslator.com";
    let location = process.env.LOCATION;

    let translatedText = " ";

    await axios({
      baseURL: endpoint,
      url: "/translate",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Ocp-Apim-Subscription-Region": location,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": "3.0",
        from: from,
        to: to,
      },
      data: [
        {
          text: text,
        },
      ],
      responseType: "json",
    }).then((response) => {
      translatedText = response.data[0].translations[0].text;
    });

    await interaction.reply(
      `${text} translated (to ${to}):\n ${translatedText}`
    );
  },
};
