const {REST,Routes}= require('discord.js')
const {token,clientId,guildId} = require('./config.json');
const fs = require('node:fs')
const path =require('node:path')



const commands =[];

const commandPath = path.join(__dirname,'commands');
const commandFolder = fs.readdirSync(commandPath);

for(const folder of commandFolder)
{
    const commandpath  = path.join(commandPath,folder);
    const commandfile =fs.readdirSync(commandpath).filter(file =>file.endsWith('.js'));
    for(const file of commandfile)
    {
        const filepath = path.join(commandpath,file);
        const command = require(filepath);

        if('data' in command && 'execute' in command ){
        commands.push(command.data.toJSON());}
        else {
			console.log(`[WARNING] The command at ${filepath} is missing a required "data" or "execute" property.`);
		}
    }
}


// Rest moudle instance created 

const rest = new REST().setToken(token);

// deploy your command 

(

    async ()=>{
        try {
            console.log(`Started refreshing ${commands.length} application (/)  commands.`)
           const data = await rest.put(
            Routes.applicationGuildCommands(clientId,guildId),
            {body : commands},
           );

           console.log(`Successfully reloaded ${data.length} application (/) commands.`);

        } catch (error) {
            console.log(error)
        }
    }
)();

