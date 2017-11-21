let func = function(ctx,msg,args){
    if(!args){
        let groups = {"unsorted":{name:"unsorted",cmds:[]}};
        ctx.cmds.forEach(c=>{
            if(c.group && groups[c.group]){
                groups[c.group].cmds.push(c);
            }else if(c.group && !groups[c.group]){
                groups[c.group] = {name:c.group,cmds:[]};
                groups[c.group].cmds.push(c);
            }else if(!c.group){
                groups["unsorted"].cmds.push(c);
            }
        });

        let text = `__Commands for ${ctx.bot.user.username}__\n\`\`\`\n`

        for(let i in groups){
            let g = groups[i];

            if(g.cmds.length>0){
                text=text+g.name.charAt(0).toUpperCase()+g.name.slice(1)+"\n";
                g.cmds.forEach(c=>{
                    text=text+"  \u2022 "+c.name+" - "+c.desc+"\n";
                });
            }
        }

        msg.channel.createMessage(`${msg.author.mention}, Sending help via DM.`);
        ctx.client.getDMChannel(msg.author.id).then((c)=>{
            c.createMessage(text+"```");
        });
    }else{
        if(ctx.cmds.get(args)){
            let c = ctx.cmds.get(args);

            msg.channel.createMessage({embed:{
                color:0xEB0763,
                title:"Command info: "+c.name,
                fields:[
                    {name:"Description",value:c.desc,inline:true},
                    {name:"Group",value:c.group.charAt(0).toUpperCase()+c.group.slice(1),inline:true},
                    {name:"Usage",value:`${ctx.prefix}${c.name} `+(c.usage ? c.usage : ""),inline:true},
                ]
            }});
        }else{
            msg.channel.createMessage("Command not found.");
        }
    }
}

module.exports = {
    name:"help",
    desc:"Lists commands",
    func:func,
    usage:"[command]",
    group:"general"
}