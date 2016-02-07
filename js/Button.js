/****
ButtonManager
****/
var ButtonManager = {};
ButtonManager.init = function()
	{
	this.buttons = new Array();
	}
ButtonManager.push = function(button)
	{
	this.buttons.push(button);
	}
ButtonManager.remove = function(button)
	{
	uuArraySpecRemove(this.buttons,button);
	}
ButtonManager.deActiveObj = function()
	{
	for( var i=0; i<this.buttons.length; i++){
		this.buttons[i].deActiveObj();
		}
	}
ButtonManager.renewPos = function(x,y)
	{
	}
ButtonManager.clickOn = function(flag,x,y)
	{
	var isUse=false;
	if(!flag)
		{
		return isUse;
		}
	for( var i=0; i<this.buttons.length; i++){
		isEnd = this.buttons[i].evPush(x,y);
		if(isUse)
			{
			break;
			}
		}
	return isUse;
	}

/****
ButtonBase
****/
var ButtonBase = Object.create(GameObj);
ButtonBase.init=function(spec){
	GameObj.init.apply(this,[spec]);
	this.depth = DrawDepth.btn;
	this.x=spec.x;
	this.y=spec.y;
	this.w=spec.w;
	this.h=spec.h;
	this.callBack = spec.callBack;
	}
ButtonBase.deActiveObj = function(){
	GameObj.deActiveObj.apply(this);
	}
ButtonBase.activeObj = function(){
	GameObj.activeObj.apply(this);
	}
ButtonBase.isCollision = function(x,y){
	ret = uIsCollisionPointAndRect({x:x,y:y},this);
	return ret;
	}
ButtonBase.evPush = function(x,y){
	if(this.isCollision(x,y))
		{
		if( this.callBack )
			{
			this.callBack.call(this,x,y);
			}
		else
			{
			this.doPush(x,y);
			}
		return true;
		}
	else
		{
		return false;
		}
	}
ButtonBase.doPush = function(){
	}

/****
ButtonImage
****/
var ButtonImage = Object.create(ButtonBase);
ButtonImage.init=function(spec){
	ButtonBase.init.apply(this,[spec]);
	this.img = new Image();
	this.img.src = spec.imgPath;
	}
ButtonImage.draw = function(){
	this.ctx.beginPath();
	if( this.img.complete && this.img.width>0 )
		{
		this.ctx.drawImage( this.img , this.x , this.y );
		}
	else
		{
		this.ctx.fillStyle = "gray";
		this.ctx.fillRect(this.x,this.y,this.w,this.h);
		}
	}

/****
ButtonSample
****/
var ButtonSample = Object.create(ButtonBase);
ButtonSample.init=function(spec){
	ButtonBase.init.apply(this,[spec]);
	}
ButtonSample.draw = function(){
	var ctx = this.ctx;
	ctx.fillStyle = "rgb(255,228,128)";
	ctx.fillRect(this.x,this.y,this.w,this.h);
	}
ButtonSample.doPush = function(x,y){
	alert("pushed!");
	}


