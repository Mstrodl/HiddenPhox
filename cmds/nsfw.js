let e621 = function(ctx,msg,args){
	if(!msg.channel.guild || msg.channel.nsfw){
		if(msg.channel.topic && msg.channel.topic.length > 0 && msg.channel.topic.includes("[hf:no-nsfw]")){ msg.channel.createMessage("Channel flagged to prevent NSFW posts."); return};
		let tags = [];
		if(args) tags = args.split(" ");

		let query = tags.join("%20");
		ctx.libs.request.get("https://e621.net/post/index.json?limit=75&tags="+query,{headers:{"User-Agent":"HiddenPhox/9.0 (cynfoxwell)"}},function(e,res,body){
			if(!e && res.statusCode == 200){
				let data = JSON.parse(body)
				if(data.length>0){
				let post = data[Math.floor(Math.random()*data.length)]

				msg.channel.createMessage({embed:{
					color:0x000080,
					description:"**Author**: "+post.author+"\n**Score**: "+post.score+"\n**Rating**: "+post.rating+"\n**Tags**: \n```"+post.tags+"```",
					fields:[
						{name:"Image",value:"[Full Sized]("+encodeURI(post.file_url)+")"}
					],
					image:{
						url:post.sample_url
					}
				}})
				}else{
					msg.channel.createMessage("Nothing found. Try using _ for multi word tags as space seperates tags.")
				}
			}
		})
	}else{
		msg.channel.createMessage("Channel not flagged as NSFW.")
	}
}

let gb = function(ctx,msg,args){
	if(!msg.channel.guild || msg.channel.nsfw){
		if(msg.channel.topic && msg.channel.topic.length > 0 && msg.channel.topic.includes("[hf:no-nsfw]")){ msg.channel.createMessage("Channel flagged to prevent NSFW posts."); return};
		let tags = [];
		if(args) tags = args.split(" ");

		let query = tags.join("%20");
		ctx.libs.request.get("https://gelbooru.com/index.php?page=dapi&s=post&json=1&q=index&limit=75&tags="+query,{headers:{"User-Agent":"HiddenPhox/9.0 (cynfoxwell)"}},function(e,res,body){
			if(!e && res.statusCode == 200){
				let data = JSON.parse(body)
				if(data.length>0){
				let post = data[Math.floor(Math.random()*data.length)]

				msg.channel.createMessage({embed:{
					color:0x0080FF,
					description:"**Score**: "+post.score+"\n**Rating**: "+post.rating+"\n**Tags**: \n```"+post.tags+"```",
					fields:[
						{name:"Image",value:"[Full Sized]("+encodeURI(post.file_url)+")"}
					],
					image:{
						url:post.sample_url
					}
				}})
				}else{
					msg.channel.createMessage("Nothing found. Try using _ for multi word tags as space seperates tags.")
				}
			}
		})
	}else{
		msg.channel.createMessage("Channel not flagged as NSFW.")
	}
}

let r34 = function(ctx,msg,args){
	if(!msg.channel.guild || msg.channel.nsfw){
		if(msg.channel.topic && msg.channel.topic.length > 0 && msg.channel.topic.includes("[hf:no-nsfw]")){ msg.channel.createMessage("Channel flagged to prevent NSFW posts."); return};
		let tags = [];
		if(args) tags = args.split(" ");

		let query = tags.join("%20");
		ctx.libs.request.get("http://rule34.xxx/index.php?page=dapi&s=post&json=1&q=index&limit=75&tags="+query,{headers:{"User-Agent":"HiddenPhox/9.0 (cynfoxwell)"}},function(e,res,body){
			if(!e && res.statusCode == 200){
				let data = JSON.parse(body)
				if(data.length>0){
				let post = data[Math.floor(Math.random()*data.length)]

				msg.channel.createMessage({embed:{
					color:0xAAE5A3,
					description:"**Score**: "+post.score+"\n**Rating**: "+post.rating+"\n**Tags**: \n```"+post.tags+"```",
					fields:[
						{name:"Image",value:"[Full Sized]("+encodeURI(post.file_url)+")"}
					],
					image:{
						url:post.sample_url
					}
				}})
				}else{
					msg.channel.createMessage("Nothing found. Try using _ for multi word tags as space seperates tags.")
				}
			}
		})
	}else{
		msg.channel.createMessage("Channel not flagged as NSFW.")
	}
}

let ibs = function(ctx,msg,args){
	if(!msg.channel.guild || msg.channel.nsfw){
		if(msg.channel.topic && msg.channel.topic.length > 0 && msg.channel.topic.includes("[hf:no-nsfw]")){ msg.channel.createMessage("Channel flagged to prevent NSFW posts."); return};
		let tags = [];
		if(args) tags = args.split(" ");

		let query = tags.join("%20");
		ctx.libs.request.get("http://ibsearch.xxx/api/v1/images.json?limit=75&shuffle=20&q="+query,{headers:{"User-Agent":"HiddenPhox/9.0 (cynfoxwell)"}},function(e,res,body){
			if(!e && res.statusCode == 200){
				let data = JSON.parse(body)
				if(data.length>0){
				let post = data[Math.floor(Math.random()*data.length)]

				msg.channel.createMessage({embed:{
					color:Math.floor(Math.random()*16777216),
					description:"**Rating**: "+post.rating+"\n**Tags**: \n```"+post.tags+"```",
					fields:[
						{name:"Image",value:"[Full Sized]("+encodeURI("https://"+post.server+".ibsearch.xxx/"+post.path)+")"}
					],
					image:{
						url:"https://"+post.server+".ibsearch.xxx/"+post.path
					}
				}})
				}else{
					msg.channel.createMessage("Nothing found. Try using _ for multi word tags as space seperates tags.")
				}
			}
		})
	}else{
		msg.channel.createMessage("Channel not flagged as NSFW.")
	}
}

module.exports = [
    {
        name:"e621",
        desc:"Search E621. Put `[hf:no-nsfw]` into topic to disable.",
        func:e621,
        usage:"<string>",
        group:"NSFW"
    },
    {
        name:"gelbooru",
        desc:"Search Gelbooru. Put `[hf:no-nsfw]` into topic to disable.",
        func:e621,
        usage:"<string>",
        group:"NSFW"
    },
    {
        name:"r34",
        desc:"Search Rule34. Put `[hf:no-nsfw]` into topic to disable.",
        func:e621,
        usage:"<string>",
        group:"NSFW"
    },
    {
        name:"ibsearch",
        desc:"Search ibsearch. Put `[hf:no-nsfw]` into topic to disable.",
        func:e621,
        usage:"<string>",
        group:"NSFW"
    }
]