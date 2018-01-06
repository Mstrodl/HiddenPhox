let test = function(ctx,msg,args){
    msg.channel.createMessage("Hello world!");
}

module.exports = [
    {
        name:"mwtest",
        desc:"henlo worl",
        func:test,
        group:"Guild Specific",
        guild:"295341979800436736"
    }
]