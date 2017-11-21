let func = function(ctx,msg,args){
    msg.channel.createMessage("Pong.").then((m)=>{
        m.edit("Pong, took "+Math.floor(m.timestamp-msg.timestamp)+"ms.")
    })
}

module.exports = {
    name:"ping",
    desc:"Pong",
    func:func,
    group:"general"
}