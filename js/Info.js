/****
InfoBar
****/
var InfoBar = Object.create(GameObj);
InfoBar.init=function(spec){
	GameObj.init.apply(this,[spec]);
	this.colorBase = spec.colorBase;
	this.colorActv = spec.colorActv;
	this.x=spec.x;
	this.y=spec.y;
	this.w=spec.w;
	this.h=spec.h;
	this.maxValue=spec.maxValue;
	this.curValue=spec.curValue;
	}
InfoBar.drawByOwner=function(){
	
	var ctx = this.ctx;
	
	ctx.fillStyle = this.colorBase;
	ctx.fillRect(this.x,this.y,this.w,this.h);
	
	ctx.fillStyle = this.colorActv;
	var w = this.w * this.curValue/this.maxValue;
	ctx.fillRect(this.x,this.y,w,this.h);
	
	}

/****
PlayerInfoPanel
****/
var PlayerInfoPanel = Object.create(GameObj);
PlayerInfoPanel.init=function(spec){
	GameObj.init.apply(this,[spec]);
	this.depth		= DrawDepth.info;
	this.trg = spec.trg;
	this.hpBar = uuCreate( InfoBar,{
						ctx:this.ctx
						,x:10,y:10,w:200,h:20
						,colorActv:"rgb(255,128,128)"
						,colorBase:"rgb(100, 64, 64)"
						} );
	this.hpBar.maxValue = this.trg.maxHP;

	}
PlayerInfoPanel.draw=function(){
	
	this.hpBar.curValue = this.trg.curHP;
	this.hpBar.drawByOwner();
	
	}



