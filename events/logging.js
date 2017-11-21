/*//Util functions
let isLoggingEnabled = function(ctx,msg){
	return ctx.libs.rethink.table("serverdata").get(msg.channel.guild.id).run(ctx.db).then(d=>{
		if(d === null){
			ctx.libs.rethink.table("serverdata").insert({id:msg.channel.guild.id,logging:0,logid:""}).run(ctx.db);
			return false;
		}else{
			if(d.logging == true){
				if(d.logid !== ""){
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}
	});
}

let messageUpdate = async function(msg,oldMsg,ctx){
	if(!msg.channel.guild) return;
	if(await isLoggingEnabled(ctx,msg) == true){
		ctx.libs.rethink.table("serverdata").get(msg.channel.guild.id).run(ctx.db).then(d=>{
			if(msg.content === oldMsg.content) return;
			ctx.bot.createMessage(d.logid,{embed:{
				title:":pencil2: Message Update",
				color:0xFFAA00,
				fields:[
					{name:"ID",value:msg.id ? msg.id : "<no id given>"},
					{name:"Old Message",value:oldMsg.content},
					{name:"New Message",value:msg.content},
					{name:"User",value:`<@${msg.author.id}>`}
				]
			}}).catch(()=>false);
		});
	}
}

let reactionAdd = async function(msg,emoji,uid,ctx){
	if(!msg.channel.guild) return;
	if(await isLoggingEnabled(ctx,msg) == true){
		ctx.libs.rethink.table("serverdata").get(msg.channel.guild.id).run(ctx.db).then(d=>{
			ctx.bot.createMessage(d.logid,{embed:{
				title:":heart: Reaction Added",
				color:0x00AA00,
				fields:[
					{name:"Message ID",value:msg.id},
					{name:"Emoji",value:emoji.id ? `:${emoji.name}: <:${emoji.name}:${emoji.id}>` : emoji.name},
					{name:"User",value:`<@${uid}>`}
				]
			}}).catch(()=>false);
		});
	}
}

let reactionDelete = async function(msg,emoji,uid,ctx){
	if(!msg.channel.guild) return;
	if(await isLoggingEnabled(ctx,msg) == true){
		ctx.libs.rethink.table("serverdata").get(msg.channel.guild.id).run(ctx.db).then(d=>{
			ctx.bot.createMessage(d.logid,{embed:{
				title:":black_heart: Reaction Removed",
				color:0xAA0000,
				fields:[
					{name:"Message ID",value:msg.id},
					{name:"Emoji",value:emoji.id ? `:${emoji.name}: <:${emoji.name}:${emoji.id}>` : emoji.name},
					{name:"User",value:`<@${uid}>`}
				]
			}}).catch(()=>false);
		});
	}
}

let messageDelete = async function(msg,ctx){
	if(!msg.channel.guild) return;
	if(await isLoggingEnabled(ctx,msg) == true){
		ctx.libs.rethink.table("serverdata").get(msg.channel.guild.id).run(ctx.db).then(d=>{
			ctx.bot.createMessage(d.logid,{embed:{
				title:":x: Message Delete",
				color:0xAA0000,
				fields:[
					{name:"ID",value:msg.id ? msg.id : "<no id given>"},
					{name:"Message",value:msg.content},
					{name:"User",value:`<@${msg.author.id}>`}
				]
			}}).catch(()=>false);
		});
	}
}

let channelUpdate = async function(channel,oldChannel,ctx){
	if(!channel.guild) return;
	if(await isLoggingEnabled(ctx,msg) == true){
		ctx.libs.rethink.table("serverdata").get(channel.guild.id).run(ctx.db).then(d=>{
			let fields = [
				{name:"ID",value:channel.id ? channel.id : "<no id given>"},
				{name:"Name",value:channel.name},
				{name:"Type",value:channel.type == 2 ? "Voice" : "Text"}
			]

			if(channel.name != oldChannel.name){
				fields.push({name:"Old Name",value:oldChannel.name});
				fields.push({name:"New Name",value:channel.name});
			}
			if(channel.position != oldChannel.position){
				fields.push({name:"Old Position",value:oldChannel.position});
				fields.push({name:"New Position",value:channel.position});
			}
			if(channel.bitrate != oldChannel.bitrate){
				fields.push({name:"Old Bitrate",value:oldChannel.bitrate});
				fields.push({name:"New Bitrate",value:channel.bitrate});
			}
			if(channel.permissionOverwrites.size != oldChannel.permissionOverwrites.size){
				fields.push({name:"Old Permissions Size",value:oldChannel.permissionOverwrites.size});
				fields.push({name:"New Permissions Size",value:channel.permissionOverwrites.size});
			}

			ctx.bot.createMessage(d.logid,{embed:{
				title:":pencil2: Channel Update",
				color:0xFFAA00,
				fields:fields
			}}).catch(()=>false);
		});
	}
}

module.exports = [
	{
		event:"messageUpdate",
		name:"ServerLogging",
		func:messageUpdate
	},
	{
		event:"messageDelete",
		name:"ServerLogging",
		func:messageDelete
	},
	{
		event:"messageReactionAdd",
		name:"ServerLogging",
		func:reactionAdd
	},
	{
		event:"messageReactionRemove",
		name:"ServerLogging",
		func:reactionDelete
	}
]*/