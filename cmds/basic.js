let help = function(ctx,msg,args){
    if(!args){
        let groups = {"unsorted":{name:"unsorted",cmds:[]}};
        ctx.cmds.forEach(c=>{
            if(c.group && groups[c.group]){
                groups[c.group].cmds.push(c);
            }else if(c.group && !groups[c.group]){
                groups[c.group] = {name:c.group,cmds:[]};
                groups[c.group].cmds.push(c);
            }else if(!c.group){
                groups["unsorted"].cmds.push(c);
            }
        });

        let text = `__Commands for ${ctx.bot.user.username}__\n\`\`\`\n`

        for(let i in groups){
            let g = groups[i];

            if(g.cmds.length>0){
                text=text+g.name.charAt(0).toUpperCase()+g.name.slice(1)+"\n";
                g.cmds.forEach(c=>{
                    text=text+"  \u2022 "+c.name+" - "+c.desc+"\n";
                });
            }
        }

        msg.channel.createMessage(`${msg.author.mention}, Sending help via DM.`);
        ctx.client.getDMChannel(msg.author.id).then((c)=>{
            c.createMessage(text+"```");
        });
    }else{
        if(ctx.cmds.get(args)){
            let c = ctx.cmds.get(args);

            msg.channel.createMessage({embed:{
                color:0xEB0763,
                title:"Command info: "+c.name,
                fields:[
                    {name:"Description",value:c.desc,inline:true},
                    {name:"Group",value:c.group.charAt(0).toUpperCase()+c.group.slice(1),inline:true},
                    {name:"Usage",value:`${ctx.prefix}${c.name} `+(c.usage ? c.usage : ""),inline:true},
                ]
            }});
        }else{
            msg.channel.createMessage("Command not found.");
        }
    }
}

let ping = function(ctx,msg,args){
    msg.channel.createMessage("Pong.").then((m)=>{
        m.edit(`Pong. RTT: \`${Math.floor(m.timestamp-msg.timestamp)}ms\`, Gateway: \`${ctx.bot.shards.get(ctx.bot.guildShardMap[ctx.bot.channelGuildMap[msg.channel.id]] || 0).latency}ms\``)
    })
}

let stats = function(ctx,msg,args){
    let uptime = ctx.bot.uptime
    let s = uptime/1000
    let d = parseInt(s/86400)
    s=s%86400
    let h = parseInt(s/3600)
    s=s%3600
    let m = parseInt(s/60)
    s=s%60
    s=parseInt(s)

    let tstr = (d < 10 ? "0"+d : d)+":"+(h < 10 ? "0"+h : h)+":"+(m < 10 ? "0"+m : m)+":"+(s < 10 ? "0"+s : s)

    msg.channel.createMessage({embed:{
        title:`${ctx.bot.user.username} Stats`,
        fields:[
            {name:"Servers",value:ctx.bot.guilds.size,inline:true},
            {name:"Channels",value:ctx.bot.guilds.map(g=>g.channels.size).reduce((a,b)=>{return a+b}),inline:true},
            {name:"Commands",value:ctx.cmds.size,inline:true},
            {name:"Users Seen",value:ctx.bot.users.size,inline:true},
            {name:"Humans",value:ctx.bot.users.filter(u=>!u.bot).length,inline:true},
            {name:"Bots",value:ctx.bot.users.filter(u=>u.bot).length,inline:true},
            {name:"Uptime",value:tstr,inline:true}
        ],
        color:0x50596D
    }});
}

let invite = function(ctx,msg,args){
    msg.channel.createMessage({embed:{
        description:"[Click here to invite](https://discordapp.com/oauth2/authorize?client_id=173441062243663872&scope=bot)\n\nNeed support? Have command ideas? Find a bug? [Join the support channel.](https://discord.gg/vW9fsgW)",
        color:0x50596D,
    }});
}

let info = function(ctx,msg,args){
    msg.channel.createMessage({embed:{
        title:"HiddenPhox, continuation of FlexBot v9",
        description:"A general use bot written by **Cynthia Foxwell** `Cynthia\uD83D\uDC9A#0501`.",
        color:0x50596D,
        fields:[
            {name:"Language",value:"JavaScript",inline:true},
            {name:"Library",value:"Eris",inline:true},
            {name:"Node.js Version",value:process.version,inline:true},
            {name:"Contributors",value:"**jane#0009** - Contributor\n**Brianna The Braixen#4109** - Contributor\n**KaosHeaven#0730** - Ex-host, ex-co-developer\n**Katie#8080** - Host\n**oplexz#0105** - Running support for FlexBot\n**luna#4677 & Memework\u2122** - Ideas, general help"},
            {name:"Links",value:"[GitHub](https://github.com/BoxOfFlex/HiddenPhox) | [Donate](https://paypal.me/boxofflex)"}
        ]
    }});
}

module.exports = [
    {
        name:"ping",
        desc:"Pong",
        func:ping,
        group:"general"
    },
    {
        name:"stats",
        desc:"Displays bot stats",
        func:stats,
        group:"general"
    },
    {
        name:"invite",
        desc:"Get bot invite.",
        func:invite,
        group:"general"
    },
    {
        name:"help",
        desc:"Lists commands",
        func:help,
        usage:"[command]",
        group:"general"
    },
    {
        name:"about",
        desc:"Displays bot info",
        func:info,
        group:"general"
    }
]