let statusIcons = {
    online:"<:online:313956277808005120>",
    idle:"<:away:313956277220802560>",
    dnd:"<:dnd:313956276893646850>",
    offline:"<:offline:313956277237710868>"
}

let elevated = [
    "132297363233570816",
    "151344471957569536"
]

let _eval = function(ctx,msg,args){
    if(msg.author.id === ctx.ownerid || elevated.includes(msg.author.id)){
        let errored = false;
        let out = "";
        try{
            out = require("util").inspect(eval(args),{depth:0});
        }catch(e){
            out = e.message;
            errored = true;
        }

        out = out.replace(ctx.bot.token,"lol no key 4 u");

        if(errored){
            msg.channel.createMessage(":warning: Output (errored):\n```js\n"+out+"\n```");
        }else{
            if ((out.toString()).length > 1980){
                let output = out.toString();
                ctx.libs.request.post("https://hastebin.com/documents",{body:output},function(err,res,body){
                    if(res.statusCode == 200){
                        let key = JSON.parse(body).key;
                        msg.channel.createMessage(`\u2705 Output too long to send in a message: https://hastebin.com/${key}.js`);
                    }else{
                        msg.channel.createMessage(":warning: Cannot upload output to Hastebin.");
                    }
                })
            }else{
                msg.channel.createMessage("\u2705 Output:\n```js\n"+out+"\n```");
            }
        }
    }else{
        msg.channel.createMessage("https://i.imgur.com/yU94Rhp.png");
    }
}

let restart = function(ctx,msg,args){
    if(msg.author.id === ctx.ownerid){
        msg.channel.createMessage(`Restarting ${ctx.bot.user.username}...`);
        setTimeout(process.exit,500);
    }else{
        msg.channel.createMessage("No permission.");
    }
}

let reload = function (ctx, msg, args) {
    if (msg.author.id === "150745989836308480") {
        if (ctx.libs.fs.existsSync(__dirname + "/" + args + ".js")) {
            try {
                let c = ctx.libs.reload(__dirname + "/" + args + ".js");

                if (c.name && c.func) {
                    ctx.cmds.set(c.name, c);
                } else if (c.length) {
                    for (let i = 0; i < c.length; i++) {
                        let a = c[i];
                        if (a.func && a.name) {
                            ctx.cmds.set(a.name, a);
                        }
                    }
                }
                msg.channel.createMessage(":ok_hand:");
            } catch (e) {
                msg.channel.createMessage(`:warning: Error reloading: \`${e.message}\``);
            }
        } else {
            msg.channel.createMessage("Command not found.")
        }
    } else {
        msg.channel.createMessage("No permission.");
    }
}

let ereload = function(ctx,msg,args){
    if (msg.author.id === "150745989836308480") {
        if (ctx.libs.fs.existsSync(__dirname + "/" + args + ".js")) {
            try {
                let e = ctx.libs.reload(__dirname + "/../events/" + args + ".js");

                if(e.event && e.func && e.name){
                    let _e = ctx.events.get(e.event+"|"+e.name)
                    ctx.bot.removeListener(e.event,_e.func)
                    ctx.events.set(e.event+"|"+e.name,e);
                    ctx.utils.createEvent(ctx.bot,e.event,e.func,ctx);
                    ctx.utils.logInfo(ctx,`Reloaded event: ${e.event}|${e.name} (${args})`);
                }else if(e.length){
                    for(let i=0;i<e.length;i++){
                        let a = e[i];
                        if(a.event && a.func && a.name){
                            let _e = ctx.events.get(a.event+"|"+a.name)
                            ctx.bot.removeListener(a.event,_e.func)
                            ctx.events.set(a.event+"|"+a.name,a);
                            ctx.utils.createEvent(ctx.bot,a.event,a.func,ctx);
                            ctx.utils.logInfo(ctx,`Reloaded event: ${a.event}|${a.name} (${args})`);
                        }
                    }
                }
                msg.channel.createMessage(":ok_hand:");
            } catch (e) {
                msg.channel.createMessage(`:warning: Error reloading: \`${e.message}\``);
            }
        } else {
            msg.channel.createMessage("Event not found.")
        }
    } else {
        msg.channel.createMessage("No permission.");
    }
}

let exec = function(ctx,msg,args){
    if(msg.author.id === ctx.ownerid || elevated.includes(msg.author.id)){
        args = args.replace(/rm \-rf/,"echo")
        require('child_process').exec(args,(e,out,err)=>{
            if(e){
                msg.channel.createMessage("Error\n```"+e+"```");
            }else{
                msg.channel.createMessage("```\n"+out+"\n```");
            }
        });
    }else{
        msg.channel.createMessage("No permission.");
    }
}

let avatar = function(ctx,msg,args){
    ctx.utils.lookupUser(ctx,msg,args ? args : msg.author.mention)
    .then(u=>{
        let av = `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${(u.avatar.startsWith("a_") ? "gif" : "png?size=1024")}`;
        msg.channel.createMessage({embed:{title:`Avatar for **${u.username}#${u.discriminator}**:`,image:{url:av}}});
    })
}

let cflake = function(ctx,msg,args){
    if(!isNaN(parseInt(args))){
        let snowflake = parseInt(args).toString(2);
        snowflake = "0".repeat(64-snowflake.length) + snowflake;
        let date = snowflake.substr(0,42);
        let timestamp = parseInt(date,2)+1420070400000;

        msg.channel.createMessage(`The timestamp for \`${args}\` is ${new Date(timestamp)}`);
    }else{
        msg.channel.createMessage("Arguments not a number.");
    }
}

let linvite = function(ctx,msg,args){
    let options = {
        url:`https://discordapp.com/api/v6/invites/${args}?with_counts=1`,
        headers:{
            "User-Agent":"FlexBot (version 9, Eris)",
            "Content-Type":"application/json",
            "Authorization":ctx.bot.token
        }
    };

    ctx.libs.request.get(options,function(err,res,body){
        if(!err && res.statusCode == 200 || res.statusCode == 404){
            let inv = JSON.parse(body);

            if(inv.message && inv.message == "Unknown Invite"){
                msg.channel.createMessage("Invite provided is not valid.");
            }else if(inv.guild && inv.channel){
                let edata = {
                    title:`Invite Info: \`${inv.code}\``,
                    fields:[
                        {name:"Guild",value:`**${inv.guild.name}** (${inv.guild.id})`,inline:true},
                        {name:"Channel",value:`**#${inv.channel.name}** (${inv.channel.id})`,inline:true},
                        {name:"Partnered?",value:(inv.guild.features.includes("VANITY_URL") || inv.guild.features.includes("INVITE_SPLASH") || inv.guild.features.includes("VIP_REGIONS")) ? "Yes" : "No",inline:true},
                        {name:"Verified?",value:inv.guild.features.includes("VERIFIED") ? "Yes" : "No",inline:true},
                        {name:"Channel Count",value:`${inv.guild.text_channel_count} text, ${inv.guild.voice_channel_count} voice`,inline:true},
                        {name:"Member Count (aprox.)",value:`${inv.approximate_member_count} members, ${inv.approximate_presence_count} online`,inline:true},
                    ],
                    thumbnail:{url:`https://cdn.discordapp.com/icons/${inv.guild.id}/${inv.guild.icon}.png`}
                }

                if(inv.inviter){
                    edata.fields.push({name:"Inviter",value:`**${inv.inviter.username}#${inv.inviter.discriminator}** (${inv.inviter.id})`,inline:true});
                }

                if(inv.guild.features.length > 0){
                	edata.fields.push({name:"Flags",value:`\`\`\`${inv.guild.features.join(", ")}\`\`\``,inline:false});
                }

                edata.fields.push({name:"\u200b",value:`[Icon](https://cdn.discordapp.com/icons/${inv.guild.id}/${inv.guild.icon}.png?size=1024)${inv.guild.splash !== null ? " | [Splash](https://cdn.discordapp.com/splashes/${inv.guild.id}/${inv.guild.splash}.png?size=2048)" : ""}`,inline:false});

                if(inv.guild.splash !== null){
                    edata.image = {url:`https://cdn.discordapp.com/splashes/${inv.guild.id}/${inv.guild.splash}.png?size=256`}
                }

                msg.channel.createMessage({embed:edata});
            }
        }else{
            msg.channel.createMessage(`An error has occured.\n\`\`\`\nStatus code: ${res.statusCode}\nError:\n${err}\n\`\`\``);
        }
    });
}

let mods = function(ctx,msg,args){
    if(msg.channel.guild){
        if(!args){
            let res = "Moderators for **"+msg.channel.guild.name+"**:"

            let a = {
                online:"",
                idle:"",
                dnd:"",
                offline:""
            }

            msg.channel.guild.members.forEach((u)=>{
                if((msg.channel.permissionsOf(u.id).has("kickMembers") || msg.channel.permissionsOf(u.id).has("manageMessages")) && !u.bot){
                    a[u.status]+="\n"+statusIcons[u.status]+ u.username+"#"+u.discriminator+(u.nick ? " ("+u.nick+")" : "")
                }
            })

            for(s in a){
                res+=a[s]
            }
            msg.channel.createMessage(res)
        }else if(args == "online" || args == "o"){
            let res = "Online moderators for **"+msg.channel.guild.name+"**:"

            msg.channel.guild.members.forEach((u)=>{
                if((msg.channel.permissionsOf(u.id).has("kickMembers") || msg.channel.permissionsOf(u.id).has("manageMessages")) && !u.bot && u.status != "offline"){
                    res+="\n"+statusIcons[u.status]+ u.username+"#"+u.discriminator
                }
            })
            msg.channel.createMessage(res)
        }
    }else{
        msg.channel.createMessage("Command cannot be used outside of servers.")
    }
}

let binfo = function(ctx,msg,args){
    ctx.utils.lookupUser(ctx,msg,args || msg.author.mention)
    .then(u=>{
        if(u.bot){
            ctx.libs.request.get("https://bots.discord.pw/api/bots/"+u.id,{headers:{"Authorization":ctx.apikeys.dbots}},(err,res,body)=>{
                if(!err && res.statusCode == 200){
                    let data = JSON.parse(body);

                    let owners = [];
                    for(let b in data["owner_ids"]){
                        owners.push(`<@${data["owner_ids"][b]}>`);
                    };

                    let edata = {
                        color:0x7289DA,

                        title:`Bot Info: \`${u.username}#${u.discriminator}\``,
                        description:data.description,
                        fields:[
                            {name:"ID",value:u.id,inline:true},
                            {name:"Owner(s)",value:owners.join("\n"),inline:true},
                            {name:"Library",value:data.library,inline:true},
                            {name:"Prefix",value:"`"+data.prefix+"`",inline:true},
                        ],
                        footer:{
                            text:"Info provided by bots.discord.pw",
                        },
                        thumbnail:{
                            url:"https://cdn.discordapp.com/avatars/"+u.id+"/"+u.avatar
                        }
                    }

                    if(data.invite_url !== null){
                        edata.fields.push({name:"Invite",value:"[Click For Invite]("+data.invite_url+")",inline:true});
                    }

                    msg.channel.createMessage({embed:edata})
                }else{
                    let data = JSON.parse(body);
                    if(data.error == "Bot user ID not found"){
                        msg.channel.createMessage("No bot info found, may not be on botlist.")
                    }else{
                        msg.channel.createMessage("An error occured.")
                    }
                }
            });
        }else{
            ctx.libs.request.get("https://bots.discord.pw/api/users/"+u.id,{headers:{"Authorization":ctx.apikeys.dbots}},async (err,res,body)=>{
            if(!err && res.statusCode == 200){
                let data = JSON.parse(body);
                let bots = [];
                for(let b in data.bots){
                    bots.push(`<@${data.bots[b].user_id}>`)
                }

                let edata = {
                    color:0x7289DA,

                    title:`Bots for user: \`${u.username}#${u.discriminator}\``,
                    description:`**${u.username}#${u.discriminator}** owns **${bots.length} bot(s)**:\n\n`+bots.join("\n"),
                    thumbnail:{
                        url:"https://cdn.discordapp.com/avatars/"+u.id+"/"+u.avatar
                    }
                }

                msg.channel.createMessage({embed:edata})
            }else{
                let data = JSON.parse(body);
                if(data.error == "User ID not found"){
                    msg.channel.createMessage(`No bots found for **${u.username}#${u.discriminator}**`);
                }else{
                    msg.channel.createMessage("An error occured.");
                }
            }
        });
        }
    }).catch(m=>{
        if(m == "No results." || m == "Canceled"){
            msg.channel.createMessage(m);
        }
    });
}

let ptypes = [
	"Playing",
	"Streaming",
	"Listening to",
	"Watching"
]

let uinfo = function(ctx,msg,args){
    ctx.utils.lookupUser(ctx,msg,args || msg.member.mention)
    .then(u=>{
        if(msg.channel.guild && msg.channel.guild.members.get(u.id)){
            u = msg.channel.guild.members.get(u.id);
            msg.channel.createMessage({embed:{
                color:ctx.utils.topColor(ctx,msg,u.id),

                title:`User Info: \`${u.username}#${u.discriminator}\``,
                fields:[
                        {name:"ID",value:u.id,inline:true},
                        {name:"Nickname",value:u.nick ? u.nick : "None",inline:true},
                        {name:"Status",value:u.game ? (u.game.url ? "<:streaming:313956277132853248> [Streaming]("+u.game.url+")" : statusIcons[u.status]+" "+u.status ) : statusIcons[u.status]+" "+u.status,inline:true},
                        {name:ptypes[u.game && u.game.type || 0],value:u.game ? u.game.name : "Nothing",inline:true},
                        {name:"Roles",value:u.guild ? (u.roles.length > 0 ? u.roles.map(r=>`<@&${r}>`).join(", ") : "No roles") : "No roles",inline:true},
                        {name:"Created At",value:new Date(u.createdAt).toUTCString(),inline:true},
                        {name:"Joined At",value:new Date(u.joinedAt).toUTCString(),inline:true},
                        {name:"Avatar",value:"[Full Size]("+`https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${(u.avatar.startsWith("a_") ? "gif" : "png")}?size=1024`+")",inline:true}
                    ],
                thumbnail:{
                    url:`https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${(u.avatar.startsWith("a_") ? "gif" : "png?size=256")}`
                }
            }})
        }else{
            let snowflake = parseInt(u.id).toString(2);
            snowflake = "0".repeat(64-snowflake.length) + snowflake;
            let date = snowflake.substr(0,42);
            let timestamp = parseInt(date,2)+1420070400000;

            msg.channel.createMessage({embed:{
                color:0x7289DA,

                title:`User Info: \`${u.username}#${u.discriminator}\``,
                fields:[
                        {name:"ID",value:u.id,inline:true},
                        {name:"Created At",value:new Date(timestamp).toUTCString(),inline:true},
                        {name:"Avatar",value:"[Full Size]("+`https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${(u.avatar.startsWith("a_") ? "gif" : "png")}?size=1024`+")",inline:true}
                    ],
                thumbnail:{
                    url:`https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${(u.avatar.startsWith("a_") ? "gif" : "png?size=256")}`
                }
            }});
        }
    }).catch(m=>{
        if(m == "No results." || m == "Canceled"){
            msg.channel.createMessage(m);
        }else{
            ctx.utils.logWarn(ctx,"Exception in command: "+m);
        }
    });
}

let sinfo = function(ctx,msg,args){
    if(msg.channel.guild){
        let g = msg.channel.guild;

        let bots = 0;
        g.members.forEach(m=>{if(m.bot) ++bots;});

        let emojis = [];
        g.emojis.forEach(e=>{
            emojis.push("<:a:"+e.id+">")
        });

        let info = {
            color:0x7289DA,
            title:`Server Info for \`${g.name}\``,
            fields:[
                {name:"ID",value:g.id,inline:true},
                {name:"Owner",value:`<@${g.ownerID}>`,inline:true},
                {name:"Members",value:g.memberCount,inline:true},
                {name:"Bots",value:bots+" ("+Math.floor((bots/g.memberCount)*100)+"% of members)",inline:true},
                {name:"Channels",value:g.channels.size,inline:true},
                {name:"Region",value:g.region,inline:true},
                {name:"Shard",value:g.shard.id,inline:true},
                {name:"Roles",value:g.roles.size,inline:true},
                {name:"Emoji Count",value:g.emojis.length,inline:true},
                {name:"Icon",value:"[Full Size](https://cdn.discordapp.com/icons/"+g.id+"/"+g.icon+".png?size=1024)",inline:true},
            ],
            thumbnail:{
                url:"https://cdn.discordapp.com/icons/"+g.id+"/"+g.icon+".png?size=256"
            }
        };

        if(emojis.length > 0){
            info.fields.push({name:"Emojis (1-25)",value:emojis.slice(0,25).join(" "),inline:true});
        }

        if(emojis.length > 25){
            info.fields.push({name:"Emojis (26-"+emojis.length+")",value:emojis.slice(26).join(" "),inline:true});
        }

        if(g.features.length > 0){
            info.fields.push({name:"Flags",value:`\`\`\`${g.features.join(", ")}\`\`\``,inline:true});
        }

        msg.channel.createMessage({embed:info});
    }else{
        msg.channel.createMessage("This command can only be used in servers.");
    }
}

lookupRole = function(ctx,msg,str){
    return new Promise((resolve,reject)=>{
        if(/[0-9]{17,21}/.test(str)){
            resolve(msg.channel.guild.roles.get(str.match(/[0-9]{17,21}/)[0]));
        }

        let userpool = [];
        msg.channel.guild.roles.forEach(r=>{
            if(r.name.toLowerCase().indexOf(str.toLowerCase()) > -1){
                userpool.push(r);
            }
        });

        if(userpool.length > 0){
            if(userpool.length > 1){
                let a = [];
                let u = 0;
                for(let i=0;i<(userpool.length > 20 ? 20 : userpool.length);i++){
                    a.push("["+(i+1)+"] "+userpool[i].name)
                }
                ctx.utils.awaitMessage(ctx,msg,"Multiple roles found. Please pick from this list. \n```ini\n"+a.join("\n")+(userpool.length > 20 ? "\n; Displaying 20/"+userpool.length+" results, might want to refine your search." : "")+"\n\n[c] Cancel```",(m)=>{
                    let value = parseInt(m.content);
                    if(m.content == "c"){
                        reject("Canceled");
                        ctx.bot.removeListener("messageCreate",ctx.awaitMsgs.get(msg.channel.id)[msg.id].func);
                    }else if(m.content == value){
                        resolve(userpool[value-1]);
                        ctx.bot.removeListener("messageCreate",ctx.awaitMsgs.get(msg.channel.id)[msg.id].func);
                    }
                    clearTimeout(ctx.awaitMsgs.get(msg.channel.id)[msg.id].timer);
                },30000).then(r=>{
                    resolve(r);
                });
            }else{
                resolve(userpool[0]);
            }
        }else{
            if(!/[0-9]{17,21}/.test(str)){
                reject("No results.");
            }
        }
    });
}

let rinfo = function(ctx,msg,args){
    lookupRole(ctx,msg,args || "")
    .then(r=>{
        let users = 0;
        let bots = 0;
        msg.channel.guild.members.forEach(m=>{
            if(m.roles.indexOf(r.id) > -1){
                if(m.bot) bots++;
                users++;
            }
        });

        let perms = [];
        Object.keys(r.permissions.json).forEach(k=>{
            perms.push(`${r.permissions.json[k] == true ? "<:GreenTick:349381062176145408>" : "<:RedTick:349381062054510604>"} ${k}`);
        });

        if(perms.length == 0){
            perms.push("None");
        }
        msg.channel.createMessage({embed:{
            color:r.color,

            title:`Role Info: \`${r.name}\``,
            fields:[
                {name:"ID",value:r.id,inline:true},
                {name:"Color",value:r.color ? "#"+(r.color.toString(16).length < 6 ? "0".repeat(6-r.color.toString(16).length) : "")+r.color.toString(16).toUpperCase() : "None",inline:true},
                {name:"Users in role",value:users,inline:true},
                {name:"Bots in role",value:bots,inline:true},
                {name:"Mentionable",value:r.mentionable ? r.mentionable : "false",inline:true},
                {name:"Managed",value:r.managed ? r.managed : "false",inline:true},
                {name:"Position",value:r.position,inline:true},
                {name:"Permissions",value:perms.join(", ")}
            ],
        }});
    }).catch(m=>{
        if(m == "No results." || m == "Canceled"){
            msg.channel.createMessage(m);
        }
    });
}

let setav = function(ctx,msg,args){
    if(msg.author.id === "150745989836308480"){
        let url;
        if(args && args.indexOf("http")>-1){
    		url = args;
    	}else if(msg.attachments.length>0){
    		url = msg.attachments[0].url;
    	}else{
    		msg.channel.createMessage("Image not found. Please give URL or attachment.");
    		return;
    	}
    	
    	ctx.libs.request.get(url,function(e,res,body){
			if(!e && res.statusCode == 200){
				let data = "data:"+res.headers["content-type"]+";base64,"+new Buffer(body).toString("base64");
				ctx.bot.editSelf({avatar:data})
				.then(()=>{
					msg.channel.createMessage(emoji.get(":white_check_mark:")+" Avatar set.");
				});
			}
		});
    }else{
        msg.channel.createMessage("No permission.");
    }
}

module.exports = [
    {
        name:"eval",
        desc:"JS Eval",
        func:_eval,
        usage:"<string>",
        group:"utils"
    },
    {
        name:"restart",
        desc:"Restarts bot",
        func:restart,
        group:"utils"
    },
    {
        name: "reload",
        desc: "Reloads a command",
        func: reload,
        usage: "<command>",
        group: "utils"
    },
    {
        name: "ereload",
        desc: "Reloads a set of events",
        func: ereload,
        usage: "<event>",
        group: "utils"
    },
    {
        name: "exec",
        desc: "Bash.",
        func: exec,
        usage: "<command>",
        group: "utils"
    },
    {
        name: "setavatar",
        desc: "Sets bot's avatar.",
        func: setav,
        usage: "<url/attachment>",
        group: "utils"
    },

    {
        name: "avatar",
        desc: "Get the avatar of a user.",
        func: avatar,
        usage: "[user]",
        group: "utils"
    },
    {
        name:"lookupinvite",
        desc:"Lookup an invite",
        func:linvite,
        usage: "<invite>",
        group:"utils"
    },
    {
        name:"mods",
        desc:"Displays list of online mods",
        func:mods,
        group:"utils"
    },
    {
        name:"binfo",
        desc:"Displays info on a bot or lists a users bots if any.",
        func:binfo,
        usage: "[user]",
        group:"utils"
    },
    {
        name:"uinfo",
        desc:"Get info on a user.",
        func:uinfo,
        group:"utils"
    },
    {
        name:"sinfo",
        desc:"Displays info of a server",
        func:sinfo,
        group:"utils"
    },
    {
        name:"rinfo",
        desc:"Displays info of a role",
        func:rinfo,
        group:"utils"
    },
    {
        name:"convertflake",
        desc:"Converts a Discord snowflake to a readable time.",
        func:cflake,
        group:"utils"
    }
]