let test = function(ctx,msg,args){
    msg.channel.createMessage("Hello world!");
}

let modpoll = function(ctx,msg,args){
    if(msg.member.roles.includes("303293460360986624")){
        if(msg.channel.id == "303294535771881473"){
            if(!args){
                msg.channel.createMessage(`Usage: hf!modpoll "topic" "option 1" "option 2" ...`);
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
                    msg.channel.createMessage(`<@&303293460360986624>\n\n**${msg.author.username}#${msg.author.discriminator}** has started a poll:\n**__${topic}__**\n${opts.join("\n")}`)
                    .then(m=>{
                        for(let i = 0;i<opt.length;i++){
                            setTimeout(()=>{
                                m.addReaction((i+1)+"\u20e3");
                            },750*i);
                        }
                    });
                }
            }
        }else{
            msg.channel.createMessage("You can only use this command in <#303294535771881473>.");
        }
    }else{
        msg.channel.createMessage("You must be Mod or higher to use this command.");
    }
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