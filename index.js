const { Client,Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs')
const path = require('node:path')


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

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


const commandPath = path.join(__dirname,'command');
const commandfiles = fs.readdirSync(commandPath);

for(const folder of commandfiles)
{
   const commandsPath = path.join(commandPath,folder);
   const commandsfile = fs.readdirSync(commandPath).filter(file=> file.endsWith('.js'));
   
   for(const file of commandsfile)
   {

       const filePath = path.join(commandsPath,file);
       const command = require(filePath);
       
       if('data' in command && 'execute' in command )
       {
           client.commands.set(command.data.name,command);
       }else{
           console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
       }
   }
}

client.on(Events.InteractionCreate,async interaction =>{
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);
    if(!command)
    {
        console.log(`No command matching ${interaction.commandName} was found`);
        return;
    }

    try{
        await command.execute(interaction);
    }catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});



client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

client.login(token);