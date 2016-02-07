/****
BgFill
****/
var BgFill = Object.create(GameObj);
BgFill.init = function(spec){
	GameObj.init.apply(this,[spec]);
	this.depth		= DrawDepth.bgfill;
	}
BgFill.draw = function( ){
	this.ctx.globalAlpha = 1.0;
	this.ctx.fillStyle = "rgb(8, 12, 8)";
	this.ctx.fillRect(0, 0, MYAPP.gazePoint.cnvsW , MYAPP.gazePoint.cnvsH);
	this.ctx.globalAlpha = 1.0;
	}

/****
FgFill
****/
var FgFill = Object.create(GameObj);
FgFill.init = function(spec){
	GameObj.init.apply(this,[spec]);
	this.depth		= DrawDepth.fg;
	this.workCanvas = spec.workCanvas;
	this.workCtx =spec.workCanvas.getContext('2d');
	}
FgFill.makeFg = function()
	{
	var ctx = this.workCtx;
	ctx.globalCompositeOperation="source-over";
	ctx.globalAlpha = 1.0;//ここいじればライトの残光表現はできる.
	ctx.fillStyle = "rgb(8, 12, 8)";
	ctx.fillRect(0, 0, MYAPP.gazePoint.cnvsW , MYAPP.gazePoint.cnvsH);
	
	ctx.globalCompositeOperation="destination-out";
	
	ctx.globalAlpha = 0.9;
	ctx.beginPath();
	ctx.arc(MYAPP.gazePoint.cnvsW/2, MYAPP.gazePoint.cnvsH/2, 100, 0, Math.PI*2, true);
	ctx.fill();
	for( var cnt=0; cnt<MYAPP.lights.length; cnt++ )
		{
		var light = MYAPP.lights[cnt];
		ctx.globalAlpha = 1.0;
		var owner = light.owner;
		var r = MYAPP.gazePoint.cnvsW;
		ctx.beginPath();
		ctx.moveTo(owner.dcx+owner.endCx,owner.dcy+owner.endCy);
		ctx.lineTo(
				owner.dcx
					+uuCos(owner.angle-0.1)*r,
				owner.dcy
					+uuSin(owner.angle-0.1)*r
				);
		ctx.lineTo(
				owner.dcx
					+uuCos(owner.angle+0.1)*r,
				owner.dcy
					+uuSin(owner.angle+0.1)*r
				);
		ctx.closePath();
		ctx.fill();
		}


	
	}
FgFill.draw = function( ){
	var ctx=this.ctx;
	this.makeFg();
	ctx.globalCompositeOperation="source-over";
	ctx.globalAlpha = 0.15;
	ctx.fillStyle = "rgb(255, 255, 150)";
	ctx.fillRect(0,0,MYAPP.gazePoint.cnvsW,MYAPP.gazePoint.cnvsH);
	ctx.globalAlpha = 1.0;
	ctx.drawImage(this.workCanvas,0,0,MYAPP.gazePoint.cnvsW,MYAPP.gazePoint.cnvsH);
	}
