let func = function(ctx,msg,args){
    msg.channel.createMessage({embed:{
        description:"[Click here to invite](https://discordapp.com/oauth2/authorize?client_id=173441062243663872&scope=bot)\n\nNeed support? Have command ideas? Find a bug? [Join the support channel.](https://discord.gg/vW9fsgW)",
        color:0x50596D,
    }});
}

module.exports = {
    name:"invite",
    desc:"Get bot invite.",
    func:func,
    group:"general"
}