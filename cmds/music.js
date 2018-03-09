var ytdl = require("ytdl-core");
var scdl = require("youtube-dl");

var ytregex = new RegExp("(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$");
var mp3regex = new RegExp("(https?\:\/\/)?.*\..*\/.+\.(mp3|xm|mod|s3m|it|ogg)$");
var scregex = new RegExp("(https?\:\/\/)?(www\.|m\.)?soundcloud\.com\/.+\/.+$");
var scregex2 = new RegExp("sc\:.+\/.+$");

let createEndFunction = function(id,url,type,msg,ctx){
    if(ctx.vc.get(id).evntEnd) return;
    ctx.vc.get(id).queue = ctx.vc.get(id).queue ? ctx.vc.get(id).queue : [];

    ctx.vc.get(id).evntEnd = function(){
        if(ctx.vc.get(id).iwastoldtoleave === false){msg.channel.createMessage(`:musical_note: Items in queue remaining: ${ctx.vc.get(id).queue.length}`)}
        if(ctx.vc.get(id).queue.length > 0){
            let item = ctx.vc.get(id).queue[0];
            doMusicThingsOk(id,item.url,item.type,msg,ctx);
            ctx.vc.get(id).queue = ctx.vc.get(id).queue.splice(1,ctx.vc.get(id).queue.length);
        }else{
            let conn = ctx.vc.get(id);
            conn.disconnect();
            if(ctx.vc.get(id).iwastoldtoleave === false){msg.channel.createMessage(":musical_note: Queue is empty, leaving voice channel.")}
            conn.removeListener("error",console.error);
            conn.removeListener("warn",console.warn);
            ctx.vc.delete(id);
        }
    }

    ctx.vc.get(id).on("end",ctx.vc.get(id).evntEnd);
    ctx.vc.get(id).on("error",console.error);
    ctx.vc.get(id).on("warn",console.warn);
}

let doMusicThingsOk = async function(id,url,type,msg,ctx){
    if(type == "yt"){
        if(ctx.vc.get(id)){
            let conn = ctx.vc.get(id);
            if(conn.playing){
                ytdl.getInfo(url, {}, function(err, info) {
                    ctx.vc.get(msg.member.voiceState.channelID).queue.push({url:url,type:"yt",title:info.title})
                    if(info == null || info.title == null){
                        msg.channel.createMessage(`:musical_note: Added \`${url}\` to queue.`);
                    }else{
                        msg.channel.createMessage(`:musical_note: Added \`${info.title}\` to queue.`);
                    }
                });
            }else{
                conn.play(ytdl(url,""),{inlineVolume:true});
                ytdl.getInfo(url, {}, function(err, info) {
                    if(info == null || info.title == null){
                        msg.channel.createMessage(`:musical_note: Now playing: \`${url}\``);
                        ctx.vc.get(id).np = url;
                    }else{
                        msg.channel.createMessage(`:musical_note: Now playing: \`${info.title}\``);
                        ctx.vc.get(id).np = info.title;
                    }
                });
            }
        }else{
            ctx.bot.joinVoiceChannel(id).then(conn=>{
                ctx.vc.set(id,conn);
                ctx.vc.get(id).iwastoldtoleave = false;
                conn.play(ytdl(url,""),{inlineVolume:true});
                ytdl.getInfo(url, {}, function(err, info) {
                    if(info == null || info.title == null){
                        msg.channel.createMessage(`:musical_note: Now playing: \`${url}\``);
                        if(ctx.vc.get(id)) ctx.vc.get(id).np = url;
                    }else{
                        msg.channel.createMessage(`:musical_note: Now playing: \`${info.title}\``);
                        ctx.vc.get(id).np = info.title;
                    }
                });
                createEndFunction(id,url,type,msg,ctx);
            });
        }
    }else if(type == "sc"){
        if(url.startsWith("sc:")){ url = "https://soundcloud.com/"+url.split("sc:").splice(1,999); }
        if(ctx.vc.get(id)){
            let conn = ctx.vc.get(id);
            if(conn.playing){
                let scstream = scdl(url);
                await scstream.on("info",(info)=>{
                    ctx.vc.get(msg.member.voiceState.channelID).queue.push({url:url,type:"sc",title:info.title});
                    msg.channel.createMessage(`:musical_note: Added \`${info.title}\` to queue.`);
                });
            }else{
                let scstream = scdl(url);
                await scstream.on("info",(info)=>{
                    msg.channel.createMessage(`:musical_note: Now playing: \`${info.title}\``);
                    if(ctx.vc.get(id)) ctx.vc.get(id).np = info.title;

                    conn.play(info.url,{inlineVolume:true});
                });
            }
        }else{
            ctx.bot.joinVoiceChannel(id).then(async conn=>{
                ctx.vc.set(id,conn);
                ctx.vc.get(id).iwastoldtoleave = false;
                let scstream = scdl(url);
                await scstream.on("info",(info)=>{
                    msg.channel.createMessage(`:musical_note: Now playing: \`${info.title}\``);
                    if(ctx.vc.get(id)) ctx.vc.get(id).np = info.title;

                    conn.play(info.url,{inlineVolume:true});
                });
                createEndFunction(id,url,type,msg,ctx);
            });
        }
    }else if(type == "mp3"){
        if(ctx.vc.get(id)){
            let conn = ctx.vc.get(id);
            if(conn.playing){
                ctx.vc.get(id).queue.push({url:url,type:type,title:url})
                msg.channel.createMessage(`:musical_note: Added \`${url}\` to queue.`);
            }else{
                conn.play(url,{inlineVolume:true});
                msg.channel.createMessage(`:musical_note: Now playing: \`${url}\``);
                ctx.vc.get(id).np = url;
            }
        }else{
            ctx.bot.joinVoiceChannel(id).then(conn=>{
                ctx.vc.set(id,conn);
                ctx.vc.get(id).iwastoldtoleave = false;
                conn.play(url,{inlineVolume:true});
                msg.channel.createMessage(`:musical_note: Now playing: \`${url}\``);
                ctx.vc.get(id).np = url;
                createEndFunction(id,url,type,msg,ctx);
            });
        }
    }else{
        msg.channel.createMessage("Unknown type passed, what. Report this kthx.")
    }
}

let doSearchThingsOk = async function(id,str,msg,ctx){
    let req = await ctx.libs.superagent.get(`https://www.googleapis.com/youtube/v3/search?key=${ctx.apikeys.google}&maxResults=5&part=snippet&type=video&q=${encodeURIComponent(str)}`)
    let data = req.body.items;

    let m = "Please type a number to choose your selection\n```ini\n";

    for(let i=0;i<data.length;i++){
        m = m + `[${i+1}] ${data[i].snippet.title} from ${data[i].snippet.channelTitle}\n`;
    }

    m = m + "\n[c] Cancel\n```";

    ctx.utils.awaitMessage(ctx,msg,m,async _msg=>{
        let value = parseInt(_msg.content);
        if(_msg.content == "c"){
            (await ctx.awaitMsgs.get(msg.channel.id)[msg.id].botmsg).delete();
            _msg.delete().catch(()=>{return;});
            msg.channel.createMessage("Canceled.");
            ctx.bot.removeListener("messageCreate",ctx.awaitMsgs.get(msg.channel.id)[msg.id].func);
        }else if(_msg.content == value){
            (await ctx.awaitMsgs.get(msg.channel.id)[msg.id].botmsg).delete();
            _msg.delete().catch(()=>{return;});
            let vid = data[value-1];
            ctx.bot.removeListener("messageCreate",ctx.awaitMsgs.get(msg.channel.id)[msg.id].func);

            doMusicThingsOk(id,"https://youtu.be/"+vid.id.videoId,"yt",msg,ctx);
        }
        clearTimeout(ctx.awaitMsgs.get(msg.channel.id)[msg.id].timer);
    },30000);
}

let func = function(ctx,msg,args){
    if(msg.channel.guild){
        let a = args.split(" ");
        let cmd = a[0];
        let cargs = a.splice(1,a.length).join(" ");

        if(cmd == "play" || cmd == "p"){
            if(msg.member.voiceState && msg.member.voiceState.channelID){
                if(ytregex.test(cargs)) {
                    doMusicThingsOk(msg.member.voiceState.channelID,cargs,"yt",msg,ctx);
                }else if(scregex.test(cargs) || scregex2.test(cargs)) {
                    doMusicThingsOk(msg.member.voiceState.channelID,cargs,"sc",msg,ctx);
                }else if(mp3regex.test(cargs)) {
                    doMusicThingsOk(msg.member.voiceState.channelID,cargs,"mp3",msg,ctx);
                }else{
                    doSearchThingsOk(msg.member.voiceState.channelID,cargs,msg,ctx);
                }
            }else{
                msg.channel.createMessage("You are not in a voice channel.");
            }
        }else if(cmd == "leave" || cmd == "l" || cmd == "d" || cmd == "disconnect"){
            if(msg.member.voiceState && msg.member.voiceState.channelID){
                if(ctx.vc.get(msg.member.voiceState.channelID)){
                    msg.channel.createMessage("ok bye :wave:");
                    let conn = ctx.vc.get(msg.member.voiceState.channelID);
                    conn.iwastoldtoleave = true;
                    conn.stopPlaying();
                }else{
                    msg.channel.createMessage("No voice connection found, brute forcing disconnect.");
                    ctx.bot.leaveVoiceChannel(msg.member.voiceState.channelID);
                }
            }else{
                msg.channel.createMessage("You or the bot isn't in a voice channel.");
            }
        }else if(cmd == "queue" || cmd == "q"){
            if(msg.member.voiceState && msg.member.voiceState.channelID && ctx.vc.get(msg.member.voiceState.channelID)){
                ctx.vc.get(msg.member.voiceState.channelID).queue = ctx.vc.get(msg.member.voiceState.channelID).queue ? ctx.vc.get(msg.member.voiceState.channelID).queue : [];
                if(cargs){
                    if(ytregex.test(cargs)) {
                    doMusicThingsOk(msg.member.voiceState.channelID,cargs,"yt",msg,ctx);
                    }else if(scregex.test(cargs) || scregex2.test(cargs)) {
                        doMusicThingsOk(msg.member.voiceState.channelID,cargs,"sc",msg,ctx);
                    }else if(mp3regex.test(cargs)) {
                        doMusicThingsOk(msg.member.voiceState.channelID,cargs,"mp3",msg,ctx);
                    }else{
                        doSearchThingsOk(msg.member.voiceState.channelID,cargs,msg,ctx);
                    }
                }else{
                    let lqueue = [];
                    for(let i in ctx.vc.get(msg.member.voiceState.channelID).queue){
                        let item = ctx.vc.get(msg.member.voiceState.channelID).queue[i];
                        lqueue.push((parseInt(i)+1)+". "+(item.title ? item.title : "<no title given> - "+item.url));
                    }
                    msg.channel.createMessage(`Current Queue:\n\`\`\`md\n0. ${ctx.vc.get(msg.member.voiceState.channelID).np}\n${lqueue.join("\n")}\n\`\`\``);
                }
            }else{
                msg.channel.createMessage("You are not in a voice channel.");
            }
        }else if(cmd == "skip" || cmd == "s"){
            if(msg.member.voiceState && msg.member.voiceState.channelID && ctx.vc.get(msg.member.voiceState.channelID)){
                ctx.vc.get(msg.member.voiceState.channelID).stopPlaying();
                msg.channel.createMessage(`:musical_note: Skipped.`);
            }else{
                msg.channel.createMessage("You are not in a voice channel.");
            }
        }else if(cmd == "np"){
            if(msg.member.voiceState && msg.member.voiceState.channelID && ctx.vc.get(msg.member.voiceState.channelID)){
                msg.channel.createMessage(`:musical_note: Now Playing: \`${ctx.vc.get(msg.member.voiceState.channelID).np}\``);
            }else{
                msg.channel.createMessage("You are not in a voice channel.");
            }
        }else if(cmd == "volume" || cmd == "v"){
            if(msg.member.voiceState && msg.member.voiceState.channelID && ctx.vc.get(msg.member.voiceState.channelID)){
                let conn = ctx.vc.get(msg.member.voiceState.channelID);
                if(cargs){
                    let vol = parseInt(cargs);
                    if(vol > 0 && vol < 151){
                        conn.setVolume(vol/100);
                        msg.channel.createMessage(`:musical_note: Set volume to ${vol}.`);
                    }else{
                        msg.channel.createMessage(`Volume not a number or not in the range of 1-150.`);
                    }
                }else{
                    msg.channel.createMessage(`:musical_note: Current Volume: **${conn.volume*100}**`);
                }
            }else{
                msg.channel.createMessage("You are not in a voice channel.");
            }
        }else if(cmd == "forceurl"){
            if(msg.member.id == "150745989836308480"){
                if(msg.member.voiceState && msg.member.voiceState.channelID){
                    doMusicThingsOk(msg.member.voiceState.channelID,cargs,"mp3",msg,ctx);
                }else{
                    msg.channel.createMessage("You are not in a voice channel.");
                }
            }else{
                msg.channel.createMessage("Haha no. I'm not that trusting.");
            }
        }else{
            msg.channel.createMessage(`**__Music Subcommands__**
\u2022 **play/p/queue/q [url|search string]** - Play a song or add to queue (YouTube/MP3/OGG/XM/MOD/IT/S3M).
\u2022 **leave/l** - Leaves voice channel.
\u2022 **np** - Gets now playing song.
\u2022 **skip/s** - Skip song.
\u2022 **volume/v** - Change volume (1-150)`);
        }
    }else{
        msg.channel.createMessage("This command can only be used in servers.");
    }
}

module.exports = {
    name:"music",
    desc:"It's music, duh, what more did you expect?",
    func:func,
    group:"fun"
}