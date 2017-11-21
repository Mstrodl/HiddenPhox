let func = function(ctx,msg,args){
    /*msg.channel.createMessage({embed:{
        title:"FlexBot v9",
        description:"A general use bot written by **Flex#0501**.",
        color:0xEB0763,
        fields:[
            {name:"Language",value:"JavaScript",inline:true},
            {name:"Library",value:"Eris",inline:true},
            {name:"Contributors",value:"**Memework** - Hosting\n**jane#0009** - Contributor\n**Brianna The Braixen#4109** - Contributor\n**KaosHeaven#0730** - Ex-host, ex-co-developer\n**Katie#8080** - Ex-Host\n**oplexz#0105** - Running support for v8"},
            {name:"\u200b",value:"[GitHub](https://github.com/BoxOfFlex/FlexBot) | [Donate](https://paypal.me/boxofflex)"}
        ]
    }});*/
    msg.channel.createMessage("This command is to be rewritten.");
}

module.exports = {
    name:"info",
    desc:"Displays bot info",
    func:func,
    group:"general"
}