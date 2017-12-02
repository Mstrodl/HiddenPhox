let account = async function(ctx,msg,args){
    try {
        let succ = await ctx.db.models.econ.create({id:msg.author.id});
        msg.channel.createMessage(`Account \`${succ.id}\` created.`);
    }catch(e){
        if (e.name === "SequelizeUniqueConstraintError") {
            msg.channel.createMessage("Account already created.");
        }else{
            msg.channel.createMessage("An error occured: `"+e+"`");
            ctx.utils.logWarn(ctx,`Error occured creating econ account: "${e}"`)
        }
    }
}

let wallet = function(ctx,msg,args){
    ctx.utils.lookupUser(ctx,msg,args || msg.author.mention)
    .then(async (u)=>{
        let wallet = await ctx.db.models.econ.findOne({where:{id:u.id}});
        if(wallet){
            msg.channel.createMessage(`**${u.username}#${u.discriminator}**'s balance is \`${wallet.currency}FC\``);
        }else{
            msg.channel.createMessage(`**${u.username}#${u.discriminator}** does not have an account.`);
        }
    });
}

let top = async function(ctx,msg,args){
    if(args == "g" || args == "global" || !args){
        let list = await ctx.db.models.econ.findAll();

        list = list.sort((a,b)=>{
            if (a.currency < b.currency) {
                return 1;
            }
            if (a.currency > b.currency) {
                return -1;
            }
            return 0;
        });

        list = list.splice(0,9);

        let _list = [];
        for(let i = 0;i < list.length;i++){
            let u = ctx.bot.users.get(list[i].id);
            _list.push(`${i+1}. ${u.username}#${u.discriminator} - ${list[i].currency}FC`);
        }

        msg.channel.createMessage(`__**Top 10 People with Most PhoxCoins [Global]**__\`\`\`\n${_list.join("\n")}\`\`\``);
    }else if(args == "l" || args == "local"){
        if(!msg.channel.guild){
            msg.channel.createMessage(`Not in a guild`);
            return;
        }

        let list = await ctx.db.models.econ.findAll();

        list = list.filter(u=>msg.channel.guild.members.get(u.id));

        list = list.sort((a,b)=>{
            if (a.currency < b.currency) {
                return 1;
            }
            if (a.currency > b.currency) {
                return -1;
            }
            return 0;
        });

        list = list.splice(0,9);

        let _list = [];
        for(let i = 0;i < list.length;i++){
            let u = msg.channel.guild.members.get(list[i].id);
            _list.push(`${i+1}. ${u.user.username}#${u.user.discriminator} - ${list[i].currency}FC`);
        }

        msg.channel.createMessage(`__**Top 10 People with Most PhoxCoins [Local]**__\`\`\`\n${_list.join("\n")}\`\`\``);
    }
}

module.exports = [
    {
        name:"account",
        desc:"Create a PhoxBank:tm: Account",
        func:account,
        group:"economy"
    },
    {
        name:"wallet",
        desc:"Check your PhoxBank:tm: balance",
        func:wallet,
        group:"economy"
    },
    {
        name:"top",
        desc:"Get PhoxBank:tm: top balances",
        func:top,
        group:"economy"
    }
];