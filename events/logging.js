//Util functions
let isLoggingEnabled = async function(ctx,msg){
	if(!msg.channel.guild) return false;
	let data = await ctx.db.models.sdata.findOne({where:{id:msg.channel.guild.id}});
  
  return data ? data.logging : false;
}

let getLogChannel = async function(ctx,msg){
	let data = await ctx.db.models.sdata.findOne({where:{id:msg.channel.guild.id}});
  let channel = data.logchan;
  
  return msg.channel.guild.channels.get(channel);
}

//Events
let messageUpdate = async function(msg,oldMsg,ctx){
	if(!msg.channel.guild) return;
	if(await isLoggingEnabled(ctx,msg) === true){
		if(msg.content === oldMsg.content) return;
		let log = await getLogChannel(ctx,msg);
		log.createMessage({embed:{
			title:":pencil2: Message Update",
			color:0xFFAA00,
			fields:[
				{name:"ID",value:msg.id ? msg.id : "<no id given>",inline:true},
				{name:"Old Message",value:oldMsg.content,inline:true},
				{name:"New Message",value:msg.content,inline:true},
				{name:"User",value:`<@${msg.author.id}>`,inline:true}
			]
		}});
	}
}

let reactionAdd = async function(msg,emoji,uid,ctx){
	if(!msg.channel.guild) return;
	if(await isLoggingEnabled(ctx,msg) === true){
		let log = await getLogChannel(ctx,msg); 
		log.createMessage({embed:{
			title:":heart: Reaction Added",
			color:0x00AA00,
			fields:[
				{name:"Message ID",value:msg.id,inline:true},
				{name:"Emoji",value:emoji.id ? `:${emoji.name}: <${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>` : emoji.name,inline:true},
				{name:"User",value:`<@${uid}>`,inline:true}
			]
		}});
	}
}

let reactionDelete = async function(msg,emoji,uid,ctx){
	if(!msg.channel.guild) return;
		if(await isLoggingEnabled(ctx,msg) === true){
		let log = await getLogChannel(ctx,msg); 
		log.createMessage({embed:{
			title:":black_heart: Reaction Removed",
			color:0xAA0000,
			fields:[
				{name:"Message ID",value:msg.id,inline:true},
				{name:"Emoji",value:emoji.id ? `:${emoji.name}: <${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>` : emoji.name,inline:true},
				{name:"User",value:`<@${uid}>`,inline:true}
			]
		}});
	}
}

let messageDelete = async function(msg,ctx){
	if(!msg.channel.guild) return;
	if(await isLoggingEnabled(ctx,msg) === true){
		let fields = [
			{name:"ID",value:msg.id ? msg.id : "<no id given>",inline:true},
			{name:"Message",value:msg.content,inline:true},
			{name:"Sender",value:`<@${msg.author.id}>`,inline:true}
		];
		
		let log = await getLogChannel(ctx,msg); 
		log.createMessage({embed:{
			title:":x: Message Delete",
			color:0xAA0000,
			fields:fields
		}});
	}
}

let channelUpdate = async function(channel,oldChannel,ctx){
	if(!channel.guild) return;
	if(await isLoggingEnabled(ctx,{channel:channel}) === true){
		let fields = [
			{name:"ID",value:channel.id ? channel.id : "<no id given>",inline:true},
			{name:"Name",value:channel.name,inline:true},
			{name:"Type",value:`${channel.type == 2 ? "Voice" : (channel.type == 1 ? "Text" : "Category")}`,inline:true}
		]

		if(channel.name != oldChannel.name){
			fields.push({name:"Name",value:`${channel.name} (was ${oldChannel.name})`,inline:true});
		}
		if(channel.position != oldChannel.position){
			fields.push({name:"Position",value:`${channel.position} (was ${oldChannel.position})`,inline:true});
		}
		if(channel.bitrate != oldChannel.bitrate){
			fields.push({name:"Bitrate",value:`${channel.bitrate} (was ${oldChannel.bitrate})`,inline:true});
		}
		if(channel.permissionOverwrites.size != oldChannel.permissionOverwrites.size){
			fields.push({name:"Permissions Size",value:`${channel.permissionOverwrites.size} (was ${oldChannel.permissionOverwrites.size})`,inline:true});
		}
		if(channel.nsfw != oldChannel.nsfw){
			fields.push({name:"NSFW Flag",value:`${channel.nsfw} (was ${oldChannel.nsfw})`,inline:true});
		}
		if(channel.topic != oldChannel.topic){
			fields.push({name:"Topic",value:`${channel.topic} (was ${oldChannel.topic})`,inline:true});
		}

		let log = await getLogChannel(ctx,{channel:channel}); 
		log.createMessage({embed:{
			title:":pencil2: Channel Update",
			color:0xFFAA00,
			fields:fields
		}});
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
	},
	{
		event:"channelUpdate",
		name:"ServerLogging",
		func:channelUpdate
	}
]