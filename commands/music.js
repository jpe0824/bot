const {
  SlashCommandBuilder,
  Client,
  GatewayIntentBits,
} = require("discord.js");
const { Player } = require("discord-player");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  intents: [GatewayIntentBits.GuildVoiceStates],
});
const player = new Player(client);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The name of the song")
        .setRequired(true)
    ),
  async execute(interaction) {
    const song = interaction.options.getString("song");

    if (!interaction.member.voice.channel) {
      await interaction.reply(
        "You need to be in a voice channel to use this command."
      );
      return;
    }

    if (!song) {
      await interaction.reply("Please specify a song.");
      return;
    }

    const queue = player.createPlaylist(interaction.guild, {
      metadata: {
        channel: interaction.channel,
      },
    });

    try {
      if (!queue.connection) {
        await queue.connect(interaction.member.voice.channel);
      }
    } catch {
      //   queue.();
      await interaction.reply("Error connecting to the voice channel.");
      return;
    }

    await interaction.reply(`Now playing ${song}`);

    const track = await player
      .search(song, {
        requestedBy: interaction.user,
      })
      .then((x) => x.tracks[0]);

    queue.addTrack(track);
  },
};
