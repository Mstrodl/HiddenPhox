let calc = function(ctx,msg,args){
    let a = args.split("|");
	let exp = a[0];
	let _x = a[1];
	_x = _x ? _x : 1;
	let parser = new ctx.libs.math();
	msg.channel.createMessage("Result: "+parser.parse(exp).evaluate({x:_x}));
}

let yt = function(ctx,msg,args){
    if(!args){
        msg.channel.createMessage("Arguments are required!");
    }else{
        ctx.libs.request.get("https://www.googleapis.com/youtube/v3/search?key="+ctx.apikeys.google+"&maxResults=5&part=snippet&type=video&q="+encodeURIComponent(args),(err,res,body)=>{
            if(!err && res.statusCode == 200){
                let data = JSON.parse(body).items;

                let others = [];
                for(let i=1;i<data.length;i++){
                    others.push(`- **${data[i].snippet.title}** | By: \`${data[i].snippet.channelTitle}\` | <https://youtu.be/${data[i].id.videoId}>`);
                }

                msg.channel.createMessage(`**${data[0].snippet.title}** | \`${data[0].snippet.channelTitle}\`\nhttps://youtu.be/${data[0].id.videoId}\n\n**__See Also:__**\n${others.join("\n")}`);
            }else{
                msg.channel.createMessage("An error occured getting data from YouTube.");
            }
        });
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
        })
    }
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
        name:"google",
        desc:"Search Google.",
        func:search,
        group:"misc"
    },
    {
        name:"gimg",
        desc:"Search Google Images.",
        func:gimg,
        group:"misc"
    }
]