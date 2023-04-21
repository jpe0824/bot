const { SlashCommandBuilder } = require('@discordjs/builders');
const nodemailer = require('nodemailer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendmail')
    .setDescription('Sends an email')
    .addStringOption(option =>
      option.setName('to')
        .setDescription('Recipient email address')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('subject')
        .setDescription('Email subject')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Email content')
        .setRequired(true)),
  async execute(interaction) {
    const { user } = interaction;

    // Retrieve email data from slash command options
    const to = interaction.options.getString('to');
    const subject = interaction.options.getString('subject');
    const text = interaction.options.getString('text');

    // Create nodemailer transporter object
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    // Define email options
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      text
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        interaction.reply(`Failed to send email to ${to}`);
      } else {
        console.log(`Email sent: ${info.response}`);
        interaction.reply(`Email sent to ${to}`);
      }
    });
  },
};
