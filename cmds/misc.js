let calc = function(ctx,msg,args){
    let a = args.split("|");
	let exp = a[0];
	let _x = a[1];
	_x = _x ? _x : 1;
	let parser = new ctx.libs.math();
	msg.channel.createMessage("Result: "+parser.parse(exp).evaluate({x:_x}));
}

let yt = async function(ctx,msg,args){
    if(!args){
        msg.channel.createMessage("Arguments are required!");
    }else{
        let req = await ctx.libs.superagent.get(`https://www.googleapis.com/youtube/v3/search?key=${ctx.apikeys.google}&maxResults=5&part=snippet&type=video&q=${encodeURIComponent(args)}`)
        .catch(e=>{
            msg.channel.createMessage("An error occured getting data from YouTube.");
        });
        let data = req.body.items;

        let others = [];
        for(let i=1;i<data.length;i++){
            others.push(`- **${data[i].snippet.title}** | By: \`${data[i].snippet.channelTitle}\` | <https://youtu.be/${data[i].id.videoId}>`);
        }

        msg.channel.createMessage(`**${data[0].snippet.title}** | \`${data[0].snippet.channelTitle}\`\nhttps://youtu.be/${data[0].id.videoId}\n\n**__See Also:__**\n${others.join("\n")}`);
    }
}

let fyt = async function(ctx,msg,args){
    if(!args){
        msg.channel.createMessage("Arguments are required!");
    }else{
        let req = await ctx.libs.superagent.get(`https://www.googleapis.com/youtube/v3/search?key=${ctx.apikeys.google}&maxResults=2&part=snippet&type=video&q=${encodeURIComponent(args)}`)
        .catch(e=>{
            msg.channel.createMessage("An error occured getting data from YouTube.");
        });
        let data = req.body.items;

        msg.channel.createMessage(`**${data[0].snippet.title}** | \`${data[0].snippet.channelTitle}\`\nhttps://youtu.be/${data[0].id.videoId}`);
    }
}

let search = function(ctx,msg,args){
    if(!args){
        msg.channel.createMessage("Arguments are required!");
    }else{
        ctx.utils.google.search(args,msg.channel && msg.channel.nsfw)
        .then(({ card, results }) => {
            if (card) {
                msg.channel.createMessage(card);
            } else if (results.length) {
                const links = results.map((r) => r.link);
                msg.channel.createMessage(`${links[0]}\n\n**See Also:**\n${links.slice(1, 5).map((l) => `<${l}>`).join('\n')}`.trim());
            } else {
                msg.channel.createMessage("No results found.");
            }
        });
    }
}

let gimg = function(ctx,msg,args){
    if(!args){
        msg.channel.createMessage("Arguments are required!");
    }else{
        ctx.libs.request.get("https://api.cognitive.microsoft.com/bing/v7.0/images/search?q="+encodeURIComponent(args),{headers:{"Ocp-Apim-Subscription-Key":ctx.apikeys.microshaft}},function(err,res,body){
            let data = JSON.parse(body).value;
            let image = data[Math.floor(Math.random()*data.length)];

            msg.channel.createMessage({embed:{
                title:image.name,
                url:image.hostPageUrl,
                image:{url:image.contentUrl}
            }});
        });
    }
}

let me_irl = function(ctx,msg,args){
    ctx.libs.request.get("http://www.reddit.com/r/me_irl/top.json?sort=default&count=50",function(e,r,b){
        if(!e && r.statusCode == 200){
            let data = JSON.parse(b).data.children;
            let post = data[Math.floor(Math.random()*data.length)].data;
            post.url = post.url.replace(/http(s)?:\/\/(m\.)?imgur\.com/g,"https://i.imgur.com");
            post.url = post.url.replace(new RegExp('&amp;','g'),"&");
            post.url = post.url.replace("/gallery","");
            post.url = post.url.replace("?r","");

            if(post.url.indexOf("imgur") > -1 && post.url.substring(post.url.length-4,post.url.length-3) != "."){
                post.url+=".png";
            }

            msg.channel.createMessage({embed:{
                title:post.title,
                url:"https://reddit.com"+post.permalink,
                author:{
                    name:"u/"+post.author
                },
                description:"[Image/Video]("+post.url+")",
                image:{
                    url:encodeURI(post.url)
                },
                footer:{
                    text:"Powered by r/me_irl"
                }
            }});
        }else{
            msg.channel.createMessage("An error occured, try again later.\n\n```\n"+e+"```")
        }
    });
}


let poll = function(ctx,msg,args){
    if(!args){
        msg.channel.createMessage(`Usage: hf!poll "topic" "option 1" "option 2" ...`);
    }else{
        let opt = ctx.utils.formatArgs(args);
        let topic = opt[0];
        opt = opt.splice(1,9);

        if(opt.length <2){
            msg.channel.createMessage("A minimum of two options are required.");
        }else{
            let opts = [];

            for(let i = 0;i<opt.length;i++){
                opts.push((i+1)+"\u20e3: "+opt[i]);
            }
            msg.channel.createMessage("**"+msg.author.username+"#"+msg.author.discriminator+"** has started a poll:\n**__"+topic+"__**\n"+opts.join("\n"))
            .then(m=>{
                for(let i = 0;i<opt.length;i++){
                    setTimeout(()=>{
                        m.addReaction((i+1)+"\u20e3");
                    },750*i);
                }
            });
        }
    }
}

let vote = function(ctx,msg,args){
    if(!args){
        msg.channel.createMessage(`Usage: hf!vote topic`);
    }else{
        msg.channel.createMessage(`**${msg.author.username}#${msg.author.discriminator}** has started a vote:\n**__${args}__**\n<:GreenTick:349381062176145408>: Yes\n<:RedTick:349381062054510604>: No`)
        .then(m=>{
            m.addReaction(":GreenTick:349381062176145408");
            setTimeout(()=>m.addReaction(":RedTick:349381062054510604"),750);
        });
    }
}

let cmdstats = async function(ctx,msg,args){
    let analytics = await ctx.db.models.analytics.findOne({where:{id:1}});
	let usage = JSON.parse(analytics.dataValues.cmd_usage);
	let names = Object.keys(usage);
	
	let toSort = [];
	
	for(let i in names){
	    toSort.push({name:names[i],value:usage[names[i]]});
	}
	
	let sorted = toSort.sort((a,b)=>{
	    if (a.value < b.value) return 1;
	    if (a.value > b.value) return -1;
	    return 0;
	});
	
	sorted = sorted.splice(0,10);
	
	let _list = new ctx.utils.table(["#","Command","Usages"]);
    for(let i in sorted){
        _list.addRow([parseInt(i)+1,`${ctx.prefix}${sorted[i].name}`,`${sorted[i].value}`]);
    }

    msg.channel.createMessage(`__**Top 10 Used Commands**__\`\`\`\n${_list.render()}\`\`\``);
}

module.exports = [
    {
        name:"calc",
        desc:"Do maths",
        func:calc,
        group:"misc"
    },
    {
        name:"yt",
        desc:"Search YouTube.",
        func:yt,
        group:"misc"
    },
    {
        name:"fyt",
        desc:"Search YouTube and grab first result only.",
        func:fyt,
        group:"misc"
    },
    {
        name:"google",
        desc:"Search Google.",
        func:search,
        group:"misc",
        aliases:["g","search"]
    },
    {
        name:"me_irl",
        desc:"selfies of the soul. Pulls a post from r/me_irl",
        func:me_irl,
        group:"fun"
    },
    {
        name:"poll",
        desc:"Start a poll with multiple options.",
        func:poll,
        group:"fun"
    },
    {
        name:"vote",
        desc:"Start a yes/no vote",
        func:vote,
        group:"fun"
    },
    {
        name:"cmdstats",
        desc:"Analytics.",
        func:cmdstats,
        group:"fun"
    }
]