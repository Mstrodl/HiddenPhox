let func = function(ctx,msg,args){
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

module.exports = {
    name:"me_irl",
    desc:"selfies of the soul. Pulls a post from r/me_irl",
    func:func,
    group:"fun"
}