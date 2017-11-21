let func = function(ctx,msg,args){
    if(!args){
		msg.channel.createMessage("Usage: f!poll topic|option 1|option 2|...");
	}else{
		let opt = args.split("|");
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

module.exports = {
    name:"poll",
    desc:"Start a poll for other users to vote on",
    func:func,
    group:"fun"
}