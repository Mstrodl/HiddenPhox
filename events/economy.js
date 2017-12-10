let messageCreate = async function(msg,ctx){
    if(!msg) return;
	if(!msg.channel.guild) return;
    if(msg.author.bot) return;

    let wallet = await ctx.db.models.econ.findOne({where:{id:msg.author.id}});
    if(wallet){
        if(Math.random()*100 > 95){
            let amount = Math.floor(Math.random()*5)+1;

            ctx.db.models.econ.update({currency:wallet.currency + amount},{where:{id:msg.author.id}});
            ctx.utils.logInfo(ctx,`[ECON] Gave ${msg.author.username}#${msg.author.discriminator} ${amount}FC.`);
            if(msg.channel.permissionsOf(ctx.bot.user.id).has("addReactions") && wallet.noreact === false) msg.addReaction("\uD83D\uDCB8");
        }
    }
}

module.exports = {
    event:"messageCreate",
    name:"economy",
    func:messageCreate
}