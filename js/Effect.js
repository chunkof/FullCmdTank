var EffectBase = Object.create(MapObjBase);
EffectBase.init=function(spec)
	{
	MapObjBase.init.apply(this,[spec]);
	this.depth		= DrawDepth.effect;
	}

/****
AccelSmoke
*****/
var AccelSmoke = Object.create(EffectBase);
AccelSmoke.init=function(spec)
	{
	EffectBase.init.apply(this,[spec]);
	this.alpha = 0.6;
	}
AccelSmoke.doDraw=function()
	{
	var ctx =this.ctx;
	ctx.globalAlpha = this.alpha;
	ctx.beginPath();
	ctx.fillStyle = "rgb(200,200,215)";
	ctx.arc(this.dcx, this.dcy, 4, 0, Math.PI*2, true);
	ctx.fill();
	ctx.closePath();
	ctx.globalAlpha = 1.0;
	this.alpha -= 0.02;
	if(this.alpha<0)
		{
		this.deActiveObj();
		}
	}

/****
Particle
*****/
var Particle = Object.create(EffectBase);
Particle.init=function(spec)
	{
	EffectBase.init.apply(this,[spec]);
	
	this.particles = new Array();

	var theta = -1+uuGetRnd(-1,1);
	this.lifeCnt= uuDefault(spec.life,16);
	var num		= uuDefault(spec.num,8);
	this.color	= uuDefault(spec.baseColor,"rgb(200,200,200)");
	for(var i=0; i<num; i++)
		{
		theta += 2*i/num +uuGetRnd(-0.02,0.02);
		var particle = {};
		particle.cx = uuGetRnd(-1,1);
		particle.cy = uuGetRnd(-1,1);
		particle.vx = uuCos(theta) * uuGetRnd(2,3);
		particle.vy = uuSin(theta) * uuGetRnd(2,3);
		this.particles.push(particle);
		}
	}
Particle.proc=function()
	{
	this.lifeCnt -= 1;
	if(this.lifeCnt<=0)
		{
		this.deActiveObj();
		}
	for(var i=0;i<this.particles.length;i++)
		{
		var particle = this.particles[i];
		particle.cx += particle.vx;
		particle.cy += particle.vy;
		}
	}
Particle.doDraw=function()
	{
	var ctx = this.ctx;
	ctx.fillStyle = this.color;
	for(var i=0;i<this.particles.length;i++)
		{
		var particle = this.particles[i];
		var x = this.dcx + particle.cx;
		var y = this.dcy + particle.cy;
		ctx.fillRect( x,y,4,4 );
		}
	}

