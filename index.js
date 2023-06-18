const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.cooldowns = new Collection();
// const commandPath = path.join(__dirname,'command');
// const commandfiles = fs.readdirSync(commandPath).filter(file=> file.endsWith('.js'));

// for(const file of commandfiles)
// {
//     const filePath = path.join(commandPath,file);
//     const command = require(filePath);

//     if('data' in command && 'execute' in command )
//     {
//         client.commands.set(command.data.name,command);
//     }else{
//         console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
//     }
// }

// ******if files are organised in command folder*******

const commandPath = path.join(__dirname, "commands");
const commandfiles = fs.readdirSync(commandPath);

for (const folder of commandfiles) {
  const commandsPath = path.join(commandPath, folder);
  const commandsfile = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandsfile) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // console.log(client.commands);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// console.log(client.cooldowns);
// handleCommand.handleCommand();

const eventsPath = path.join(__dirname, "events");
const eventsFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventsFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.TOKEN);
