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
    }else if(args == "t" || args == "taxbanks"){
        let list = await ctx.db.models.taxbanks.findAll();

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
            let g = ctx.bot.guilds.get(list[i].id);
            _list.push(`${i+1}. ${g.name} - ${list[i].currency}FC`);
        }

        msg.channel.createMessage(`__**Top 10 Taxbanks**__\`\`\`\n${_list.join("\n")}\`\`\``);
    }
}

let noreact = async function(ctx,msg,args){
    let acc = await ctx.db.models.econ.findOne({where:{id:msg.author.id}});
    if(acc){
        let state = !acc.noreact;
        ctx.db.models.econ.update({noreact:state},{where:{id:msg.author.id}});
        msg.channel.createMessage(`No reactions for \`${msg.author.id}\` set to \`${state}\``);
    }else{
        msg.channel.createMessage("No account found.");
    }
}

let donate = async function(ctx,msg,args){
    if(!args || isNaN(parseInt(args))){
        msg.channel.createMessage("Arguments missing or not a number.");
        return;
    }

    if(!msg.channel.guild){
        msg.channel.createMessage("This command can only be used in guilds.");
        return;
    }

    let acc = await ctx.db.models.econ.findOne({where:{id:msg.author.id}});
    if(acc){
        let value = Math.round(parseInt(args));
        if(value > acc.currency){
            msg.channel.createMessage("Value exceeds funds in wallet.");
        }else if(value > -1){
            ctx.db.models.econ.update({currency:acc.currency-value},{where:{id:msg.author.id}});
            let taxbank = await ctx.db.models.taxbanks.findOrCreate({where:{id:msg.channel.guild.id}});
            ctx.db.models.taxbanks.update({currency:taxbank[0].dataValues.currency+value},{where:{id:msg.channel.guild.id}});
            msg.channel.createMessage(`**${msg.author.username}#${msg.author.discriminator}** has donated **${value}FC** to this server's taxbank. The taxbank is now ${taxbank[0].dataValues.currency+value}FC.`)
        }else{
            msg.channel.createMessage("lol no. you're not getting free money.");
        }
    }else{
        msg.channel.createMessage("No account found.");
    }
}

let semoji = [
    ":cherries:",
    ":spades:",
    ":lemon:",
    ":diamonds:",
    ":seven:",
    ":clubs:",
    ":apple:",
    ":eyes:",
    ":hearts:",
    ":money_with_wings:"
]

let slots = async function(ctx,msg,args){
    if(!args || isNaN(parseInt(args))){
        msg.channel.createMessage("Arguments missing or not a number.");
        return;
    }

    let rl = ctx.ratelimits.get(msg.author.id)

    if(rl && rl.slots && rl.slots > new Date().getTime()) {
        msg.channel.createMessage(`You are being ratelimited. Time remaining: ${ctx.utils.remainingTime(new Date(rl.slots)-new Date())}`);
        return;
    }

    let acc = await ctx.db.models.econ.findOne({where:{id:msg.author.id}});
    if(acc){
        let value = Math.round(parseInt(args));
        if(value > acc.currency){
            msg.channel.createMessage("Value exceeds funds in wallet.");
        }else if(value < 0){
            msg.channel.createMessage("lol no. you're not getting free money.");
        }else{
            ctx.db.models.econ.update({currency:acc.currency-value},{where:{id:msg.author.id}});

            //old code cause lazy :^)
            let res = "";

        	let s = [
        		[],
        		[],
        		[]
            ];

        	for(let i=0;i<3;i++){
        		let rnd = Math.floor(Math.random()*semoji.length)
        		s[i] = []
                s[i][0] = rnd==0 ? semoji[semoji.length-1] : semoji[rnd-1];
        		s[i][1] = semoji[rnd];
        		s[i][2] = rnd==semoji.length-1 ? semoji[0] : semoji[rnd+1];
            }

        	res+=":black_large_square:"+s[0][0]+s[1][0]+s[2][0]+":black_large_square:";
        	res+="\n:arrow_forward:"+s[0][1]+s[1][1]+s[2][1]+":arrow_backward:";
        	res+="\n:black_large_square:"+s[0][2]+s[1][2]+s[2][2]+":black_large_square:";

        	if(s[0][1] == s[1][1] && s[1][1] == s[2][1]){
        		res+=`\n\nYou won **${value*2}FC**.`;
        		ctx.db.models.econ.update({currency:acc.currency+(value*2)},{where:{id:msg.author.id}});
        	}else{
        		res+="\n\nSorry, you lost.";
            }

            if(rl){
                rl.slots = new Date().getTime()+15000;
                ctx.ratelimits.set(msg.author.id,rl);
            }else{
                ctx.ratelimits.set(msg.author.id,{slots:new Date().getTime()+15000});
            }

        	msg.channel.createMessage(res);
        }
    }else{
        msg.channel.createMessage("No account found.");
    }
}

let daily = async function(ctx,msg,args){
    let acc = await ctx.db.models.econ.findOne({where:{id:msg.author.id}});
    if(acc){
        let now = new Date().getTime();
        if(now >= acc.lastdaily){
            let value = 10+(Math.floor(Math.random()*20)+1);

            ctx.db.models.econ.update({currency:acc.currency+value,lastdaily:now+86400000},{where:{id:msg.author.id}});
            msg.channel.createMessage(`**${msg.author.username}#${msg.author.discriminator}** has claimed their daily PhoxCoins and got **${value}FC**.`);
        }else{
            msg.channel.createMessage(`${msg.author.mention}, your daily resets in ${ctx.utils.remainingTime(acc.lastdaily-now)}`);
        }
    }else{
        msg.channel.createMessage("No account found.");
    }
}

let transfer = async function(ctx,msg,args){
    let owo = args.split(",");

    if(!args || !owo[0]){
        msg.channel.createMessage(`No arguments specified, usage: \`${ctx.prefix}transfer user,amount\``);
        return;
    }

    let acc = await ctx.db.models.econ.findOne({where:{id:msg.author.id}});
    if(acc){
        let u;

        try{
            u = await ctx.utils.lookupUser(ctx,msg,owo[0] || msg.author.mention);
        }catch(e){
            msg.channel.createMessage(e);
        }
        if(msg.author.id == u.id){ msg.channel.createMessage(`Sending money to yourself has been disabled due to an exploit.`); return; }

        let target = await ctx.db.models.econ.findOne({where:{id:u.id}});

        if(target){

            if(!owo[1]){ msg.channel.createMessage(`No amount specified, usage: \`${ctx.prefix}transfer user,amount\``); return; }
            let value = Math.round(parseInt(owo[1]));
            let tax = Math.round(value*0.1);

            if(isNaN(value) || value < 1){ msg.channel.createMessage(`Amount not a number or less than 1.`); return; }
            if(value > acc.currency){ msg.channel.createMessage("Value exceeds funds in wallet."); return; }

            let pin = `${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`;

            ctx.utils.awaitMessage(ctx,msg,`${msg.author.mention}, you're about to send **${value}FC** to **${u.username}#${u.discriminator}**.\n\`\`\`diff\n- ${value}FC | transfer\n- ${tax}FC | 10% tax\n%%%%\n% ${value-tax}FC sent\`\`\`\n\nTo complete transaction, type \`${pin}\`, else type \`c\` or \`cancel\``,
            async m=>{
                if(m.content == "c" || m.content == "cancel"){
                    msg.channel.createMessage("Canceled.");
                    return "Canceled.";
                }else if(m.content == pin){
                    ctx.db.models.econ.update({currency:acc.currency-value},{where:{id:msg.author.id}});
                    ctx.db.models.econ.update({currency:target.currency+(value-tax)},{where:{id:u.id}});

                    if(msg.channel.guild){
                        let taxbank = await ctx.db.models.taxbanks.findOrCreate({where:{id:msg.channel.guild.id}});
                        ctx.db.models.taxbanks.update({currency:taxbank[0].dataValues.currency+tax},{where:{id:msg.channel.guild.id}});
                    }

                    let dm = await ctx.bot.getDMChannel(u.id);
                    dm.createMessage(`**${msg.author.username}#${msg.author.discriminator}** sent you **${value-tax}FC**.`);

                    msg.channel.createMessage("Transaction complete.");
                    return "Transaction complete.";
                }
            })
        }else{
            msg.channel.createMessage("No account found for target.");
        }
    }else{
        msg.channel.createMessage("No account found for sender.");
    }
}

/* Start Steal Code Stuffs */

let jail = function(ctx,user){

}

let grace = function(ctx,user){

}

/* End Steal Code Stuffs */

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
    },
    {
        name:"hidecoins",
        desc:"Hide reacts when you get PhoxCoins",
        func:noreact,
        group:"economy"
    },
    {
        name:"donate",
        desc:"Donate PhoxCoins to the server's taxbank",
        func:donate,
        group:"economy"
    },
    {
        name:"slots",
        desc:"Gamble away your \"hard earned\" PhoxCoins",
        func:slots,
        group:"economy"
    },
    {
        name:"daily",
        desc:"Get 10-30 daily PhoxCoins",
        func:daily,
        group:"economy"
    },
    {
        name:"transfer",
        desc:"Send PhoxCoins to someone",
        func:transfer,
        group:"economy"
    }
];