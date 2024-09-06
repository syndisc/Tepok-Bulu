const dotenv = require('dotenv');
dotenv.config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});

const list = []
let title = ""
let price = 0
let boten = process.env.USERNAME_BOTEN

client.login(process.env.DISCORD_TOKEN);

client.on("messageCreate", async (msg) => {

    if(msg.author.bot) return

    const printList = async() => {
        const formattedList = list.map((item, idx) => 
            `${idx}. Name: ${item.name}; Status: ${item.pay_status}`
        ).join(',\n');
        const individualPrice = price / list.length
        await msg.reply(`Title: ${title}\nCurrent list:\n${formattedList}\nEach person needs to pay Rp. ${individualPrice}`)
    }

    if (msg.content === '/help') {
        await msg.reply(
            "**Bot Tepok Bulu**\n" +
            "=================\n" +
            "- **/add** to join badminton\n" +
            "- **/quit** to leave badminton\n" +
            "- **/list** to view all players\n" +
            "- **/pay** to update payment status\n" +
            "- **/title {Content}** to set badminton title. Ex: /title Garuda Lap:3-4 Jam:16:00-18:00\n" +
            "- **/price {Price}** to set badminton price. Ex: /price 2750000\n" +
            "- **/clear** to clear current list"
        );
    }
    else if(msg.content === '/add'){
        const name = msg.author.displayName
        if(name){
            let flag = false;
            for(let item of list){
                if(item.name == name){
                    flag = true
                    break
                }
            }
            if(flag){
                await msg.reply(`${name} already on the list`)
            }
            else{
                list.push({
                    "name": name,
                    "pay_status": "Has not paid the bill"
                })
                await msg.reply(`added ${name} to the list`)
            }

        }
        printList()
    }
    else if(msg.content === '/quit'){
        const name = msg.author.displayName

        if(name){
            const index = list.findIndex(item => item.name == name)

            if(index !== -1){
                list.splice(index, 1)
                await msg.reply(`Removed ${name} from the list`)
            }
            else {
                await msg.reply(`${name} are not on the list`)
            }
        }
        printList()
    }
    else if(msg.content === '/list'){
        printList()
    }
    else if(msg.content === '/pay'){
        const name = msg.author.displayName
        if(name){
            let flag = false;
            for(let item of list){
                if(item.name == name){
                    item.pay_status = " already paid the bill";
                    flag = true
                    break
                }
            }
            if(flag){
                await msg.reply(`${name} has paid the bill`)
            }
            else{
                await msg.reply(`${name} not found`)
            }
        }
        printList()
    }
    if(msg.author.username !== boten){
        if(msg.content.startsWith("/title")){
            title = msg.content.substring(7).trim()
            await msg.reply(`Title has been set to ${title}`)
        }
        else if(msg.content.startsWith("/price")){
            const newPrice = msg.content.substring(7).trim()
    
            if(newPrice <= 0){
                await msg.reply("The price cannot be lower than 0")
            }
            else{
                price = newPrice
                await msg.reply(`The price has been set to ${newPrice}`)
            }
        }
        else if(msg.content === "/clear"){
            price = 0
            title = ""
            list.length = 0
            await msg.reply(`Title, list, and price has been cleared`)
        }
    }
});