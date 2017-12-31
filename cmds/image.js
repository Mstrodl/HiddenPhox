let _hooh = function(jimp,msg,url){
	jimp.read(url)
	.then(im=>{
		let a = im.clone();
		let b = im.clone();

		a.crop(0,im.bitmap.height/2,im.bitmap.width,im.bitmap.height/2);
		b.crop(0,im.bitmap.height/2,im.bitmap.width,im.bitmap.height/2);
		b.mirror(false,true);

		let out = new jimp(im.bitmap.width,im.bitmap.height,(e,i)=>{
			i.composite(a,0,im.bitmap.height/2);
			i.composite(b,0,0);
		});

		out.getBuffer(jimp.MIME_PNG,(e,f)=>{
			msg.channel.createMessage("",{name:"hooh.png",file:f});
		});
	});
}

let hooh = function(ctx,msg,args){
	msg.channel.sendTyping();

	let jimp = ctx.libs.jimp;
	if(args && args.indexOf("http")>-1){
		_hooh(jimp,msg,args)
	}else if(msg.attachments.length>0){
		_hooh(jimp,msg,msg.attachments[0].url)
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
}

let _haah = function(jimp,msg,url){
	jimp.read(url)
	.then(im=>{
		let a = im.clone();
		let b = im.clone();

		a.crop(0,0,im.bitmap.width/2,im.bitmap.height);
		b.crop(0,0,im.bitmap.width/2,im.bitmap.height);
		b.mirror(true,false);

		let out = new jimp(im.bitmap.width,im.bitmap.height,(e,i)=>{
			i.composite(a,0,0);
			i.composite(b,im.bitmap.width/2,0);
		});

		out.getBuffer(jimp.MIME_PNG,(e,f)=>{
			msg.channel.createMessage("",{name:"haah.png",file:f});
		});
	});
}

let haah = function(ctx,msg,args){
	msg.channel.sendTyping();

	let jimp = ctx.libs.jimp;
	if(args && args.indexOf("http")>-1){
		_haah(jimp,msg,args)
	}else if(msg.attachments.length>0){
		_haah(jimp,msg,msg.attachments[0].url)
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
}

let _woow = function(jimp,msg,url){
	jimp.read(url)
	.then(im=>{
		let a = im.clone();
		let b = im.clone();

		a.crop(0,0,im.bitmap.width,im.bitmap.height/2);
		b.crop(0,0,im.bitmap.width,im.bitmap.height/2);
		b.mirror(false,true);

		let out = new jimp(im.bitmap.width,im.bitmap.height,(e,i)=>{
			i.composite(a,0,0);
			i.composite(b,0,im.bitmap.height/2);
		});

		out.getBuffer(jimp.MIME_PNG,(e,f)=>{
			msg.channel.createMessage("",{name:"woow.png",file:f});
		});
	});
}

let woow = function(ctx,msg,args){
	msg.channel.sendTyping();

	let jimp = ctx.libs.jimp;
	if(args && args.indexOf("http")>-1){
		_woow(jimp,msg,args)
	}else if(msg.attachments.length>0){
		_woow(jimp,msg,msg.attachments[0].url)
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
}

let _waaw = function(jimp,msg,url){
	jimp.read(url)
	.then(im=>{
		let a = im.clone();
		let b = im.clone();

		a.crop(im.bitmap.width/2,0,im.bitmap.width/2,im.bitmap.height);
		b.crop(im.bitmap.width/2,0,im.bitmap.width/2,im.bitmap.height);
		a.mirror(true,false);

		let out = new jimp(im.bitmap.width,im.bitmap.height,(e,i)=>{
			i.composite(a,0,0);
			i.composite(b,im.bitmap.width/2,0);
		});

		out.getBuffer(jimp.MIME_PNG,(e,f)=>{
			msg.channel.createMessage("",{name:"waaw.png",file:f});
		});
	});
}

let waaw = function(ctx,msg,args){
	msg.channel.sendTyping();

	let jimp = ctx.libs.jimp;
	if(args && args.indexOf("http")>-1){
		_waaw(jimp,msg,args)
	}else if(msg.attachments.length>0){
		_waaw(jimp,msg,msg.attachments[0].url)
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
}

let _invert = function(jimp,msg,url){
	jimp.read(url)
	.then(im=>{
		let inv = im.clone();
		inv.invert();

		inv.getBuffer(jimp.MIME_PNG,(e,f)=>{
			msg.channel.createMessage("",{name:"invert.png",file:f});
		});
	});
}

let invert = function(ctx,msg,args){
	msg.channel.sendTyping();

	let jimp = ctx.libs.jimp;
	if(args && args.indexOf("http")>-1){
		_invert(jimp,msg,args)
	}else if(msg.attachments.length>0){
		_invert(jimp,msg,msg.attachments[0].url)
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
}

//flippity floop
let flip = function(ctx,msg,args){
	msg.channel.sendTyping();

	let jimp = ctx.libs.jimp;
	if(args && args.indexOf("http")>-1){
		jimp.read(args)
		.then(im=>{
			im.mirror(true,false);
			im.getBuffer(jimp.MIME_PNG,(e,f)=>{
				msg.channel.createMessage("",{name:"flip.png",file:f});
			});
		});
	}else if(msg.attachments.length>0){
		jimp.read(msg.attachments[0].url)
		.then(im=>{
			im.mirror(true,false);
			im.getBuffer(jimp.MIME_PNG,(e,f)=>{
				msg.channel.createMessage("",{name:"flip.png",file:f});
			});
		});
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
}

let flop = function(ctx,msg,args){
	msg.channel.sendTyping();

	let jimp = ctx.libs.jimp;
	if(args && args.indexOf("http")>-1){
		jimp.read(args)
		.then(im=>{
			im.mirror(false,true);
			im.getBuffer(jimp.MIME_PNG,(e,f)=>{
				msg.channel.createMessage("",{name:"flop.png",file:f});
			});
		});
	}else if(msg.attachments.length>0){
		jimp.read(msg.attachments[0].url)
		.then(im=>{
			im.mirror(false,true);
			im.getBuffer(jimp.MIME_PNG,(e,f)=>{
				msg.channel.createMessage("",{name:"flop.png",file:f});
			});
		});
	}else{
		msg.channel.createMessage("Image not found. Please give URL or attachment.")
	}
}

let orly = function(ctx,msg,args){
	msg.channel.sendTyping();

    let [title, text, top, author] = ctx.utils.formatArgs(args);
    let img = Math.floor(Math.random()*40)+1;
    let theme = Math.floor(Math.random()*16)+1;

    title = title.split("").splice(0,41).join("");
    top = top ? top.split("").splice(0,61).join("") : "";
	text = text.split("").splice(0,26).join("");

	author = author ? author.split("").splice(0,26).join("") : msg.author.username.split("").splice(0,26).join("");

    if(!args || !title || !text){
        msg.channel.createMessage("Usage: `"+ctx.prefix+"orly \"title\" \"bottom text\" \"top text\" (optional)\"author\" (optional)`");
    }else{
		let jimp = ctx.libs.jimp;
        jimp.read(`https://orly-appstore.herokuapp.com/generate?title=${encodeURIComponent(title)}&top_text=${encodeURIComponent(top)}&author=${encodeURIComponent(author)}&image_code=${img}&theme=${theme}&guide_text=${encodeURIComponent(text)}&guide_text_placement=bottom_right`)
		.then(im=>{
			let out = new jimp(im.bitmap.width,im.bitmap.height,(e,i)=>{
				i.composite(im,0,0);
			});

			out.getBuffer(jimp.MIME_PNG,(e,f)=>{
				msg.channel.createMessage("",{name:"orly.png",file:f});
			});
		});
    }
}

module.exports = [
    {
        name:"hooh",
        desc:"Mirror bottom to top",
        func:hooh,
        group:"image"
    },
    {
        name:"haah",
        desc:"Mirror right half of an image to the left",
        func:haah,
        group:"image"
    },
    {
        name:"woow",
        desc:"Mirror top to bottom",
        func:woow,
        group:"image"
    },
    {
        name:"waaw",
        desc:"Mirror left half of an image to the right",
        func:waaw,
        group:"image"
    },

    {
        name:"flip",
        desc:"Flip an image horizontally",
        func:flip,
        group:"image"
    },
    {
        name:"flop",
        desc:"Flip an image vertically",
        func:flop,
        group:"image"
    },
    
    {
        name:"invert",
        desc:"Invert an image's colors",
        func:invert,
        group:"image"
    },

    {
        name:"orly",
        desc:"Creates an O RLY parody book cover.",
        func:orly,
        group:"image",
        usage:"title|bottom text|top text (optional)|author (optional)"
    }
]