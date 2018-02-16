let webcam = async function(ctx,msg,args){
	let data = await ctx.libs.jimp.read(`http://braixen.club:2095/out.jpg`);
	data.getBuffer(ctx.libs.jimp.MIME_PNG,(e,f)=>{
		msg.channel.createMessage("",{file:f,name:"bricam.jpg"});
	});
}

module.exports = [
	{
		name:"cam",
		desc:"See the webcam behind Bri's monitor.",
		func:webcam,
		group:"Guild Specific",
		guild:"216292020371718146"
	}
]