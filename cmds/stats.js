let func = function(ctx,msg,args){
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
		title:"FlexBot Stats",
		fields:[
			{name:"Servers",value:ctx.bot.guilds.size,inline:true},
			{name:"Commands",value:ctx.cmds.size,inline:true},
			{name:"Users Seen",value:ctx.bot.users.size,inline:true},
			{name:"Uptime",value:tstr,inline:true}
		],
		color:0x3498DB
	}});
}

module.exports = {
    name:"stats",
    desc:"Displays bot stats",
    func:func,
    group:"general"
}