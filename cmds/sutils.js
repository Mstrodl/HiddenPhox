let snipe = async function(ctx,msg,args){
    let data = await ctx.db.models.sdata.findOrCreate({where:{id:msg.channel.guild.id}});
    let canSnipe = data[0].dataValues.allow_snipe;
    
    if(!msg.channel.guild){
        msg.channel.createMessage("Not in a guild.");
    }else if(!ctx.snipes.get(msg.channel.id)){
        msg.channel.createMessage("No messages deleted recently to snipe.");
    }else if(canSnipe === false){
        msg.channel.createMessage("This server has opted to disable sniping of messages and edits.");
    }else{
        let m = ctx.snipes.get(msg.channel.id);
        msg.channel.createMessage({embed:{
            author:{
                name:`${m.author.username}#${m.author.discriminator}`,
                icon_url:m.author.avatarURL
            },
            description:m.content,
            footer:{
                text:`Sniped by ${msg.author.username}#${msg.author.discriminator}`,
                icon_url:msg.author.avatarURL
            },
            image:{
                url:m.attachments.length > 0 && m.attachments[0].url || ""
            },
            timestamp:new Date(m.timestamp)
        }});
    }
}

let esnipe = async function(ctx,msg,args){
    let data = await ctx.db.models.sdata.findOrCreate({where:{id:msg.channel.guild.id}});
    let canSnipe = data[0].dataValues.allow_snipe;

    if(!msg.channel.guild){
        msg.channel.createMessage("Not in a guild.");
    }else if(!ctx.esnipes.get(msg.channel.id)){
        msg.channel.createMessage("No messages edited recently to snipe.");
    }else if(canSnipe === false){
        msg.channel.createMessage("This server has opted to disable sniping of messages and edits.");
    }else{
        let om = ctx.esnipes.get(msg.channel.id).omsg;
        let m = ctx.esnipes.get(msg.channel.id).msg;
        msg.channel.createMessage({embed:{
            author:{
                name:`${m.author.username}#${m.author.discriminator}`,
                icon_url:m.author.avatarURL
            },
            fields:[
                {name:"Old Message",value:om.content,inline:true},
                {name:"New Message",value:m.content,inline:true}
            ],
            footer:{
                text:`Edit sniped by ${msg.author.username}#${msg.author.discriminator}`,
                icon_url:msg.author.avatarURL
            },
            timestamp:new Date(m.timestamp)
        }});
    }
}

let dehoist = function(ctx,msg,args){
	if(!args){
		msg.channel.createMessage("Arguments required.");
	}else if(!msg.channel.permissionsOf(msg.author.id).has("manageNicknames")){
		msg.channel.createMessage("You do not have `Manage Nicknames` permission.");
	}else if(!msg.channel.permissionsOf(ctx.bot.user.id).has("manageNicknames")){
		msg.channel.createMessage("I do not have `Manage Nicknames` permission.");
	}else{
		ctx.utils.lookupUser(ctx,msg,args || "")
		.then(u=>{
			u = msg.channel.guild.members.get(u.id);
            if(u.nick && u.nick.startsWith("\uD82F\uDCA2")){
                msg.channel.createMessage("User already dehoisted.");
                return
            }
			u.edit({nick:`\uD82F\uDCA2${u.nick && u.nick.slice(0,30) || u.username.slice(0,30)}`})
			.then(()=>{
				msg.channel.createMessage(":ok_hand:");
			})
			.catch(r=>{
				msg.channel.createMessage(`Could not set nick:\n\`\`\`\n${r}\`\`\``);
			});
		});
	}
}

let roleme = async function(ctx,msg,args){
    args = args.split(" ");
    let sub = args[0];
    let sargs = args.splice(1,args.length).join(" ");

    if(sub == "add"){
        if(!msg.channel.permissionsOf(msg.author.id).has("manageRoles")){
            msg.channel.createMessage("You do not have `Manage Roles` permission.");
            return;
        }
        if(!msg.channel.permissionsOf(ctx.bot.user.id).has("manageRoles")){
            msg.channel.createMessage("I do not have `Manage Roles` permission.");
            return;
        }

        lookupRole(ctx, msg, sargs || "")
        .then(async r=>{
            let data = await ctx.db.models.sdata.findOrCreate({where:{id:msg.channel.guild.id}});
            let rme = JSON.parse(data[0].dataValues.roleme) || [];

            if(rme.includes(r.id)){
                msg.channel.createMessage("Role already in roleme list.")
            }else{
                rme.push(r.id);
                ctx.db.models.sdata.update({roleme:JSON.stringify(rme)},{where:{id:msg.channel.guild.id}});
                msg.channel.createMessage(`Added **${r.name}** to server roleme list.`);
            }
        }).catch(m=>{
            if(m == "No results." || m == "Canceled"){
                msg.channel.createMessage(m);
            }else{
                ctx.utils.logWarn(ctx,`[roleme] ${m}`);
            }
        });
    }else if(sub == "del" || sub == "delete"){
        if(!msg.channel.permissionsOf(msg.author.id).has("manageRoles")){
            msg.channel.createMessage("You do not have `Manage Roles` permission.");
            return;
        }
        if(!msg.channel.permissionsOf(ctx.bot.user.id).has("manageRoles")){
            msg.channel.createMessage("I do not have `Manage Roles` permission.");
            return;
        }

        lookupRole(ctx, msg, sargs || "")
        .then(async r=>{
            let data = await ctx.db.models.sdata.findOrCreate({where:{id:msg.channel.guild.id}});
            let rme = JSON.parse(data[0].dataValues.roleme) || [];

            if(rme.includes(r.id)){
                ctx.db.models.sdata.update({roleme:JSON.stringify(rme.filter(v=>v !== r.id))},{where:{id:msg.channel.guild.id}});
                msg.channel.createMessage(`Removed **${r.name}** from server roleme list.`);
            }else{
                msg.channel.createMessage("Role was never added to roleme list.");
            }
        }).catch(m=>{
            if(m == "No results." || m == "Canceled"){
                msg.channel.createMessage(m);
            }else{
                ctx.utils.logWarn(ctx,`[roleme] ${m}`);
            }
        });
    }else if(sub == "give"){
        if(!msg.channel.permissionsOf(ctx.bot.user.id).has("manageRoles")){
            msg.channel.createMessage("I do not have `Manage Roles` permission.");
            return;
        }

        lookupRole(ctx, msg, sargs || "")
        .then(async r=>{
            let data = await ctx.db.models.sdata.findOrCreate({where:{id:msg.channel.guild.id}});
            let rme = JSON.parse(data[0].dataValues.roleme) || [];

            if(rme.includes(r.id)){
                msg.member.addRole(r.id,"[HiddenPhox] Added via roleme.");
                msg.channel.createMessage(":ok_hand:");
            }else{
                msg.channel.createMessage("Role not elegible for roleme.");
            }
        }).catch(m=>{
            if(m == "No results." || m == "Canceled"){
                msg.channel.createMessage(m);
            }else{
                ctx.utils.logWarn(ctx,`[roleme] ${m}`);
            }
        });
    }else if(sub == "rem" || sub == "remove"){
        if(!msg.channel.permissionsOf(ctx.bot.user.id).has("manageRoles")){
            msg.channel.createMessage("I do not have `Manage Roles` permission.");
            return;
        }

        lookupRole(ctx, msg, sargs || "")
        .then(async r=>{
            let data = await ctx.db.models.sdata.findOrCreate({where:{id:msg.channel.guild.id}});
            let rme = JSON.parse(data[0].dataValues.roleme) || [];

            if(rme.includes(r.id)){
                msg.member.removeRole(r.id,"[HiddenPhox] Removed via roleme.");
                msg.channel.createMessage(":ok_hand:");
            }else{
                msg.channel.createMessage("Role not elegible for roleme. If this role was previously added to roleme, contact someone that can manage roles.");
            }
        }).catch(m=>{
            if(m == "No results." || m == "Canceled"){
                msg.channel.createMessage(m);
            }else{
                ctx.utils.logWarn(ctx,`[roleme] ${m}`);
            }
        });
    }else if(sub == "list"){
        let data = await ctx.db.models.sdata.findOrCreate({where:{id:msg.channel.guild.id}});
        let rme = JSON.parse(data[0].dataValues.roleme) || [];

        if(rme.length > 0){
            let roles = [];
            for(let i=0;i<rme.length;i++){
                roles.push(msg.channel.guild.roles.get(rme[i]).name);
            }
            msg.channel.createMessage(`__**Elegible roles for roleme**__\n\`\`\`\n${roles.join(", ")}\n\`\`\``);
        }else{
            msg.channel.createMessage("No roles have been added to this server's roleme.");
        }
    }else if(sub == "preset"){
        /*if(!msg.channel.permissionsOf(ctx.bot.user.id).has("manageRoles")){
            msg.channel.createMessage("I do not have `Manage Roles` permission.");
            return;
        }*/
        msg.channel.createMessage("soon:tm:");
    }else{
        let sub = [
            "  \u2022 add - Add a role to server roleme list.",
            "  \u2022 del(ete) - Remove a role from server roleme list.",
            "  \u2022 give - Give a roleme set role.",
            "  \u2022 rem(ove) - Remove a roleme set role.",
            "  \u2022 list - List servers set of elegible roles.",
            "  \u2022 preset - Add a list of preset roles to your server."
        ];

        msg.channel.createMessage(`__**Subcommands for roleme**__\n${sub.join("\n")}`);
    }
}

let sconfig = async function(ctx,msg,args){
    if(!msg.channel.permissionsOf(msg.author.id).has("manageGuild") && msg.author.id !== ctx.ownerid){
        msg.channel.createMessage("You do not have `Manage Server` permission.");
        return;
    }
    
    let keys = [
        {name:"logging",desc:"[WIP] Enable server logging to a channel",type:"boolean"},
        {name:"logchan",desc:"[WIP] Server logging channel ID",type:"string"},
        {name:"allow_snipe",desc:"Allow sniping of deleted and edited messages",type:"boolean"}
    ]
  
    args = args.split(" ");
    
    let cmd = args[0];
    let key = args[1];
    let val = args[2];
    
    if(cmd == "set"){
        if(!key){
            msg.channel.createMessage("No key given.");
            return;
        }
        if(!val){
            msg.channel.createMessage("No value given.");
            return;
        }
        
        if(keys.find(k=>k.name == val) == "undefined"){
            msg.channel.createMessage(`Cannot find specified key \`${key}\`. Do \`${ctx.prefix}config list\` for valid keys.`);
            return;
        }
        
        let data = {};
        data[key] = val;
        
        try{
            await ctx.db.models.sdata.findOrCreate({where:{id:msg.channel.guild.id}});
            await ctx.db.models.sdata.update(data,{where:{id:msg.channel.guild.id}});

            msg.channel.createMessage(`Set \`${key}\` to value \`${val}\`.`);
        }catch(e){
            msg.channel.createMessage("Could not set value, try again later.");
            ctx.utils.logWarn(ctx,e);
        }
    }else if(cmd == "get"){
        if(!key){
            msg.channel.createMessage("No key given.");
            return;
        }
        
        let isKey = keys.map(k=>k.name == val)[0];
        if(!isKey){
            msg.channel.createMessage(`Cannot find specified key \`${key}\`. Do \`${prefix}config list\` for valid keys.`);
            return;
        }
        
        let data = await ctx.db.models.sdata.findOrCreate({where:{id:msg.channel.guild.id}});
        
        msg.channel.createMessage(`Key \`${key}\` has value \`${data[0].dataValues[key]}\`.`);
    }else if(cmd == "list"){
        let data = [];
        keys.map(k=>data.push(`${k.type} | ${k.name} | ${k.desc}`));
        
        msg.channel.createMessage(`__Config Options__\n\`\`\`\n${data.join("\n")}\n\`\`\``);
    }else{
        msg.channel.createMessage("__**Subcommands for config**__\n  set - Set value\n  get - Get value\n  list - List all possible keys");
    }
}

module.exports = [
  {
      name:"snipe",
      desc:"Snipe recently deleted messages.",
      func:snipe,
      group:"Server Utils"
  },
  {
      name:"esnipe",
      desc:"Snipe recently edited messages.",
      func:esnipe,
      group:"Server Utils"
  },
  {
      name:"dehoist",
      desc:"Dehoist a user's name or nickname.",
      func:dehoist,
      group:"Server Utils"
  },
  {
      name:"roleme",
      desc:"Allow users to get set roles on your server.",
      func:roleme,
      group:"Server Utils"
  },
  {
      name:"config",
      desc:"Configure server specific values of HiddenPhox.",
      func:sconfig,
      group:"Server Utils",
      usage:"<subcommand> [key] [value]"
  }
]