import dotenv from 'dotenv';
dotenv.config();

import { Client, Intents, MessageActionRow, MessageButton } from 'discord.js';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.application.commands.set([]);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'kick') {
    // Check permission
    if (!interaction.member.permissions.has('KICK_MEMBERS')) {
      return interaction.reply({
        content: 'You do not have permission to kick members.',
        ephemeral: true,
      });
    }

    const member = options.getMember('user');
    if (!member) {
      return interaction.reply({
        content: 'Please mention a valid member to kick.',
        ephemeral: true,
      });
    }

    member.kick()
      .then(() => interaction.reply(`Successfully kicked ${member.user.tag}.`))
      .catch(() => interaction.reply('Unable to kick the member. Please check the bot\'s permissions.'));
  } else if (commandName === 'ban') {
    // Check permission
    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply({
        content: 'You do not have permission to ban members.',
        ephemeral: true,
      });
    }

    const member = options.getMember('user');
    if (!member) {
      return interaction.reply({
        content: 'Please mention a valid member to ban.',
        ephemeral: true,
      });
    }

    member.ban()
      .then(() => interaction.reply(`Successfully banned ${member.user.tag}.`))
      .catch(() => interaction.reply('Unable to ban the member. Please check the bot\'s permissions.'));
  } else if (commandName === 'unban') {
    // Check permission
    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply({
        content: 'You do not have permission to unban members.',
        ephemeral: true,
      });
    }

    const userId = options.getString('user_id');
    if (!userId) {
      return interaction.reply({
        content: 'Please provide a valid user ID to unban.',
        ephemeral: true,
      });
    }

    interaction.guild.bans.fetch()
      .then((bans) => {
        const bannedUser = bans.find((ban) => ban.user.id === userId);
        if (!bannedUser) {
          return interaction.reply({
            content: 'The user is not banned.',
            ephemeral: true,
          });
        }

        interaction.guild.bans.remove(bannedUser.user)
          .then(() => interaction.reply(`Successfully unbanned ${bannedUser.user.tag}.`))
          .catch(() => interaction.reply('Unable to unban the user. Please check the bot\'s permissions.'));
      });
  } else if (commandName === 'mute') {
    // Check permission
    if (!interaction.member.permissions.has('MUTE_MEMBERS')) {
      return interaction.reply({
        content: 'You do not have permission to mute members.',
        ephemeral: true,
      });
    }

    const member = options.getMember('user');
    if (!member) {
      return interaction.reply({
        content: 'Please mention a valid member to mute.',
        ephemeral: true,
      });
    }

    const muteRole = interaction.guild.roles.cache.find((role) => role.name === 'Muted');
    if (!muteRole) {
      return interaction.reply({
        content: 'The "Muted" role does not exist.',
        ephemeral: true,
      });
    }

    member.roles.add(muteRole)
      .then(() => interaction.reply(`Successfully muted ${member.user.tag}.`))
      .catch(() => interaction.reply('Unable to mute the member. Please check the bot\'s permissions.'));
  } else if (commandName === 'unmute') {
    // Check permission
    if (!interaction.member.permissions.has('MUTE_MEMBERS')) {
      return interaction.reply({
        content: 'You do not have permission to unmute members.',
        ephemeral: true,
      });
    }

    const member = options.getMember('user');
    if (!member) {
      return interaction.reply({
        content: 'Please mention a valid member to unmute.',
        ephemeral: true,
      });
    }

    const muteRole = interaction.guild.roles.cache.find((role) => role.name === 'Muted');
    if (!muteRole) {
      return interaction.reply({
        content: 'The "Muted" role does not exist.',
        ephemeral: true,
      });
    }

    member.roles.remove(muteRole)
      .then(() => interaction.reply(`Successfully unmuted ${member.user.tag}.`))
      .catch(() => interaction.reply('Unable to unmute the member. Please check the bot\'s permissions.'));
  } else if (commandName === 'warn') {
    // Check permission
    if (!interaction.member.permissions.has('KICK_MEMBERS')) {
      return interaction.reply({
        content: 'You do not have permission to warn members.',
        ephemeral: true,
      });
    }

    const member = options.getMember('user');
    if (!member) {
      return interaction.reply({
        content: 'Please mention a valid member to warn.',
        ephemeral: true,
      });
    }

    // TODO: Implement warn logic

    interaction.reply(`Successfully warned ${member.user.tag}.`);
  }
});

client.login(process.env.DISCORD_TOKEN);
