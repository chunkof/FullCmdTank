//-----------------
//EnemyPanel
//-----------------
var EnemyPanel = Object.create(GameObj);
EnemyPanel.init=function(spec)
	{
	GameObj.init.apply(this,[spec]);
	this.depth = DrawDepth.bg;
	
	this.buttonManager	= uuCreate(ButtonManager);
	this.compoArray.push(this.buttonManager);
	
	//---------------
	//create buttons
	//---------------
	this.buttonManager.push(
		uuCreate(ButtonImage,{ctx:this.ctx,x: 48,y:100,w:48,h:48,imgPath:"img/pen.png"
		,callBack:function(){
			MYAPP.editInfo.enemy.cursorType = "put";
			}
		}) );
	this.buttonManager.push(uuCreate(ButtonImage,{ctx:this.ctx,x:100,y:100,w:48,h:48,imgPath:"img/trash.png"
		,callBack:function(){
			MYAPP.editInfo.enemy.cursorType = "delete";
			}
		}) );
	
	}
EnemyPanel.clickOn = function(flag,x,y)
	{
	this.buttonManager.clickOn(flag,x,y);
	}

//-----------------
//EnemyCursor
//-----------------
var EnemyCursorPut = {};
var EnemyCursorDelete = {};
var EnemyCursorTypeImple=
	{
	"put"		: EnemyCursorPut,
	"delete"	: EnemyCursorDelete,
	}
EnemyCursorPut.drawImple = function(x,y,w,h)
	{
	this.ctx.strokeStyle = "rgb(255,120,200)";
	this.ctx.strokeRect(x,y,w,h);
	}
EnemyCursorPut.clickImple = function(cx,cy)
	{
	uuCreate(EnemyCircleAim	,{ctx:this.ctx,cx:cx,cy:cy});
	}
EnemyCursorDelete.drawImple = function(x,y,w,h)
	{
	this.ctx.strokeStyle = "rgb(200,220,250)";
	this.ctx.strokeRect(x,y,w,h);
	}
EnemyCursorDelete.clickImple = function(cx,cy)
	{
	var trg = MapObjUtility.getByPos(cx,cy,16,MapObjType.enemy);
	if(trg)
		{
		trg.deActiveObj();
		}
	}

var EnemyCursor = Object.create(GameObj);
EnemyCursor.init=function(spec)
	{
	GameObj.init.apply(this,[spec]);
	this.cx  = spec.cx;
	this.cy  = spec.cy;
	this.depth		= DrawDepth.cursor;
	this.size		= 32;
	this.half		= this.size/2;
	this.imple		= EnemyCursorPut;
	}
EnemyCursor.secureProc=function()
	{
	this.imple = EnemyCursorTypeImple[MYAPP.editInfo.enemy.cursorType];
	}
EnemyCursor.draw=function(spec)
	{
	var ctx = this.ctx;
	var x=this.cx-this.half;
	var y=this.cy-this.half;
	var w=this.size;
	var h=this.size;
	this.ctx.globalAlpha=0.6;
	
	this.imple.drawImple.call(this,x,y,w,h);
	
	this.ctx.globalAlpha=1.0;
	}
EnemyCursor.renewPos=function(x,y)
	{
	var size = this.size;
	
	x *= MYAPP.editInfo.zoomOut;
	y *= MYAPP.editInfo.zoomOut;
	x += MYAPP.gazePoint.lx;
	y += MYAPP.gazePoint.ly;
	this.mapX = Math.floor(x/size)*size;
	this.mapY = Math.floor(y/size)*size;
	this.cx=this.mapX - MYAPP.gazePoint.lx+this.half;
	this.cy=this.mapY - MYAPP.gazePoint.ly+this.half;
	}
	
EnemyCursor.clickOn=function(flag,x,y)
	{
	if(flag)
		{
		//x,yをマップ座標にして渡す.
		var cx = this.cx+MYAPP.gazePoint.lx;
		var cy = this.cy+MYAPP.gazePoint.ly;
		this.imple.clickImple.call(this,cx,cy);
		console.log("put"+x+","+y);
		}
	}

