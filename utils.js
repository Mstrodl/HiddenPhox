let utils = {}

utils.awaitMessage = function(ctx,msg,display,callback,timeout) {
	let dispMsg = msg.channel.createMessage(display);
	timeout = timeout ? timeout : 30000;
	if (!ctx.awaitMsgs.get(msg.channel.id)){
		ctx.awaitMsgs.set(msg.channel.id,{})
	}
	if (ctx.awaitMsgs.get(msg.channel.id)[msg.id]) {
		clearTimeout(ctx.awaitMsgs.get(msg.channel.id)[msg.id].timer);
	}
	ctx.awaitMsgs.get(msg.channel.id)[msg.id] = {
		time:msg.timestamp,
		botmsg:dispMsg
	}

	let func;

	function regEvent() {
		return new Promise((resolve,reject)=>{
			func = function(msg2){
				if (msg2.author.id == msg.author.id){
					let response;
					if(callback){
						response = callback(msg2);
					}else
						response = true;
					if(response){
						ctx.bot.removeListener("messageCreate",func);
						clearTimeout(ctx.awaitMsgs.get(msg.channel.id)[msg.id].timer);
						resolve(msg2);
					}
				}
			}
			ctx.bot.on("messageCreate",func);
			ctx.awaitMsgs.get(msg.channel.id)[msg.id].func = func;
			ctx.awaitMsgs.get(msg.channel.id)[msg.id].timer = setTimeout(()=>{
				ctx.bot.removeListener("messageCreate",func)
				reject("Request timed out.");
			},timeout);
		});
	}

	return regEvent();
}

utils.lookupUser = function(ctx,msg,str){
	return new Promise((resolve,reject)=>{
		if(/[0-9]{17,21}/.test(str)){
			resolve(ctx.bot.requestHandler.request("GET","/users/"+str.match(/[0-9]{17,21}/)[0],true));
		}

		let userpool = [];
		if(msg.channel.guild){
			msg.channel.guild.members.forEach(m=>{
				if(m.username.toLowerCase().indexOf(str.toLowerCase()) > -1 || m.nick && m.nick.toLowerCase().indexOf(str.toLowerCase()) > -1){
					if(m.username.toLowerCase() == str.toLowerCase() || m.nick && m.nick.toLowerCase() == str.toLowerCase()){
						userpool = [m];
					}else{
						userpool.push(m);
					}
				}
			});
		}else{
			ctx.bot.users.forEach(m=>{
				if(m.username.toLowerCase().indexOf(str.toLowerCase()) > -1){
					if(m.username.toLowerCase() == str.toLowerCase()){
						userpool = [m];
					}else{
						userpool.push(m);
					}
				}
			});
		}

		if(userpool.length > 0){
			if(userpool.length > 1){
				let a = [];
				let u = 0;
				for(let i=0;i<(userpool.length > 20 ? 20 : userpool.length);i++){
					a.push("["+(i+1)+"] "+userpool[i].username+"#"+userpool[i].discriminator+(msg.channel.guild ? (userpool[i].nick ? " ("+userpool[i].nick+")" : "") : ""));
				}
				ctx.utils.awaitMessage(ctx,msg,"Multiple users found. Please pick from this list. \n```ini\n"+a.join("\n")+(userpool.length > 20 ? "\n; Displaying 20/"+userpool.length+" results, might want to refine your search." : "")+"\n\n[c] Cancel```",(m)=>{
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

utils.logInfo = function(ctx,string){
	let d = new Date();
	let h = d.getHours();
	let m = d.getMinutes();
	let s = d.getSeconds();
	let time = (h < 10 ? "0"+h : h)+":"+(m < 10 ? "0"+m : m)+":"+(s < 10 ? "0"+s : s);
	ctx.bot.createMessage(ctx.logid,`:page_facing_up: **[INFO] [${time}]** \`${string}\``);
}

utils.logWarn = function(ctx,string){
	let d = new Date();
	let h = d.getHours();
	let m = d.getMinutes();
	let s = d.getSeconds();
	let time = (h < 10 ? "0"+h : h)+":"+(m < 10 ? "0"+m : m)+":"+(s < 10 ? "0"+s : s);
	ctx.bot.createMessage(ctx.logid,`:warning: **[WARN] [${time}]** \`${string}\``);
}

utils.logError = function(ctx,string){
	let d = new Date();
	let h = d.getHours();
	let m = d.getMinutes();
	let s = d.getSeconds();
	let time = (h < 10 ? "0"+h : h)+":"+(m < 10 ? "0"+m : m)+":"+(s < 10 ? "0"+s : s);
	ctx.bot.createMessage(ctx.logid,`<:RedTick:349381062054510604> **[ERROR] [${time}]** \`${string}\`\nCC: <@${ctx.ownerid}>`);
}

utils.google = require("./utils/google.js");

module.exports = utils