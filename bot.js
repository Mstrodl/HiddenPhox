const Eris = require("eris");
const config = require("./config.json");
const client = new Eris(config.token);

const ctx = {};
ctx.client = client;
ctx.bot = client;
ctx.libs = {
	eris:Eris,
	jimp:require("jimp"),
	request:require("request"),
	fs:require("fs"),
	reload:require("require-reload")(require),
	math:require("expr-eval").Parser,
};

ctx.utils = require("./utils.js");

ctx.vc        = new Eris.Collection();
ctx.cmds      = new Eris.Collection();
ctx.events    = new Eris.Collection();
ctx.snipes    = new Eris.Collection();
ctx.esnipes   = new Eris.Collection();
ctx.awaitMsgs = new Eris.Collection();

ctx.prefix  = "hf!";
ctx.ownerid = "150745989836308480";
ctx.logid = "349368487472529410";

ctx.apikeys = require("./apikeys.json");

client.on("ready",()=>{
	console.log("HiddenPhox Instance Loaded.");
	console.log("Logged in as: "+client.user.username);

	client.getDMChannel(ctx.ownerid).then(c=>{
		c.createMessage(":white_check_mark: Loaded HiddenPhox.");
	});

	ctx.libs.request.post("https://bots.discord.pw/api/bots/"+ctx.bot.user.id+"/stats",{headers:{"Authorization":ctx.apikeys.dbots},json:{server_count:ctx.bot.guilds.size}});
});

client.on("guildCreate",function(guild){
	let bots = 0;
	guild.members.forEach(m=>{if(m.bot) ++bots;})

	ctx.libs.request.post("https://bots.discord.pw/api/bots/"+ctx.bot.user.id+"/stats",{headers:{"Authorization":ctx.apikeys.dbots},json:{server_count:ctx.bot.guilds.size}});
	ctx.utils.logInfo(ctx,`Joined Guild: '${guild.name}' (${guild.id}) | Percentage: ${Math.floor((bots/guild.memberCount)*100)}%, Bots: ${bots}, Humans: ${guild.memberCount-bots}, Total: ${guild.memberCount} | Now in ${ctx.bot.guilds.size} guilds.`);

	if(bots >= 50 && Math.floor((bots/guild.memberCount)*100) >= 70){
		ctx.utils.logInfo(ctx,`'${guild.name}' (${guild.id}) detected as a bot collection, leaving!`);
		guild.leave();
	}
});

client.on("guildDelete",function(guild){
	ctx.libs.request.post("https://bots.discord.pw/api/bots/"+ctx.bot.user.id+"/stats",{headers:{"Authorization":ctx.apikeys.dbots},json:{server_count:ctx.bot.guilds.size}});
	ctx.utils.logInfo(ctx,`Left Guild: '${guild.name}' (${guild.id}) | Now in ${ctx.bot.guilds.size} guilds.`);
});

var files = ctx.libs.fs.readdirSync(__dirname+"/cmds");
for(let f of files){
	let c = require(__dirname+"/cmds/"+f);

	if(c.name && c.func){
		ctx.cmds.set(c.name,c);
		console.log(`Loaded Command: ${c.name}`);
	}else if(c.length){
		for(let i=0;i<c.length;i++){
			let a = c[i];
			if(a.func && a.name){
				ctx.cmds.set(a.name,a);
				console.log(`Loaded Command: ${a.name} (${f})`);
			}
		}
	}
}

let createEvent = function(client,type,func,ctx){
	if(type == "messageCreate"){
		client.on("messageCreate",msg=>func(msg,ctx));
	}else if(type == "messageReactionAdd"){
		client.on("messageReactionAdd",(msg,emoji,uid)=>func(msg,emoji,uid,ctx));
	}else if(type == "messageReactionRemove"){
		client.on("messageReactionRemove",(msg,emoji,uid)=>func(msg,emoji,uid,ctx));
	}else if(type == "messageUpdate"){
		client.on("messageUpdate",(msg,oldMsg)=>func(msg,oldMsg,ctx));
	}else if(type == "messageDelete"){
		client.on("messageDelete",msg=>func(msg,ctx));
	}else if(type == "channelUpdate"){
		client.on("channelUpdate",(channel,oldChannel)=>func(channel,oldChannel,ctx));
	}else{
		console.log("Message type not defined, attempting with only passing `msg`");
		client.on(type,msg=>func(msg,ctx));
	}
}

var files = ctx.libs.fs.readdirSync(__dirname+"/events");
for(let f of files){
	let e = require(__dirname+"/events/"+f);
	if(e.event && e.func && e.name){
		ctx.events.set(e.event+"|"+e.name,e);
		createEvent(client,e.event,e.func,ctx);
		console.log(`Loaded event: ${e.event}|${e.name} (${f})`);
	}else if(e.length){
		for(let i=0;i<e.length;i++){
			let a = e[i];
			if(a.event && a.func && a.name){
				ctx.events.set(a.event+"|"+a.name,a);
				createEvent(client,a.event,a.func,ctx);
				console.log(`Loaded event: ${a.event}|${a.name} (${f})`);
			}
		}
	}
}

client.on("messageCreate",msg=>{
	if(msg.author && !msg.author.bot){
		let prefix = ctx.prefix;

		let [cmd, ...args] = msg.content.split(" ");

		let [cmd2, ...args2] = msg.cleanContent.split(" ");

		ctx.cmds.forEach(c=>{
			if(cmd == prefix+c.name){
				try{
					c.func(ctx,msg,args.join(" "));
					ctx.utils.logInfo(ctx,`'${msg.author.username}' (${msg.author.id}) ran command '${cmd2} ${cmd2 == prefix+"eval" ? "<eval redacted>" : args2.join(" ").split("").splice(0,50).join("")}${args2.join(" ").length > 50 ? "..." : ""}' in '#${msg.channel.name ? msg.channel.name : msg.channel.id}' on '${msg.channel.guild ? msg.channel.guild.name : "DMs"}'${msg.channel.guild ? " ("+msg.channel.guild.id+")" : ""}`);
				}catch(e){
					msg.channel.createMessage(":warning: An error occured.\n```\n"+e.message+"\n```");
					ctx.utils.logWarn(ctx,`'${cmd2} ${cmd2 == prefix+"eval" ? "<eval redacted>" : args2.join(" ").split("").splice(0,50).join("")}${args2.join(" ").length > 50 ? "..." : ""}' errored with '${e.message}'`);
				}
			}
		})
	}
});

process.on("unhandledRejection",e=>{
	console.log("Uncaught rejection: "+e.message);
	ctx.utils.logWarn(ctx,`Uncaught rejection: '${e.message}'`);
});

client.on("error", e=>{
    console.log("Bot error: "+e.message);
	ctx.utils.logWarn(ctx,`Error: '${e.message}'`);
});

client.connect();