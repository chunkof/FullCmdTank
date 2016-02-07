/****
MapObjUtility
****/
var MapObjUtility ={};
MapObjUtility.getByPos = function(cx,cy,range,objType)
	{
	var ret = null
	var objs = MYAPP.gameObjs;
	for( var i=0; i<objs.length; i++)
		{
		var obj = objs[i];
		if(obj.objType)
			{
			// check type.
			if( objType )
				{
				if(objType != obj.objType)
					{
					continue;
					}
				
				}
			// check pos.
			if(   (obj.cx >= cx-range)
				&&(obj.cx <= cx+range)
				&&(obj.cy >= cy-range)
				&&(obj.cy <= cy+range)  )
				{
				return obj;
				}
			
			}
		}
	return ret;
	}

/****
MapObjBase
****/
var MapObjBase = Object.create(GameObj);
MapObjBase.init = function(spec){
	GameObj.init.apply(this,[spec]);
	//for circle.
	this.cx  = spec.cx;
	this.cy  = spec.cy;
	
	this.renewDpos();
	}
MapObjBase.renewDpos = function()
	{
	this.dcx = this.cx - MYAPP.gazePoint.lx;
	this.dcy = this.cy - MYAPP.gazePoint.ly;
	}
MapObjBase.draw = function()
	{
	this.renewDpos();
	this.doDraw();
	}
MapObjBase.isInDisp = function(xMargin,yMargin)
	{
	var r = uuDefault(this.cr,10);
	xMargin = uuDefault(xMargin,100);
	yMargin = uuDefault(yMargin,100);
	
	if(this.dcx+r < 0-xMargin){
		return false;
		}
	if(this.dcy+r < 0-yMargin){
		return false;
		}
	if(this.dcx-r > MYAPP.gazePoint.cnvsW+xMargin){
		return false;
		}
	if(this.dcy-r > MYAPP.gazePoint.cnvsH+yMargin){
		return false;
		}
	return true;
	}

/****
MapObj
****/
var MapObjType = {	
				"none"				:0,
				"player"			:1,
				"enemy"				:2,
				"bulletePlayer"		:3,
				"bulleteEnemy"		:4,
				};
var MapObjShape = {	
				"circle"			:0,
				"rect"				:1,
				};
var MapObjState = {	
				"dead"				:0,
				"dying"				:1,
				"normal"			:2,
				"damage"			:3,
				};
var MapObjInfoState = {	
				"none"			:0,
				"hp"			:1,
				};
var MapObjStateCnt = {	//fps.
				"damage"			:4,
				"dying"				:10,
				};

var MapObj = Object.create(MapObjBase);
MapObj.init = function(spec){
	MapObjBase.init.apply(this,[spec]);
	this.objType  = MapObjType.none;
	this.objShape = MapObjShape.circle;
	this.objState = MapObjState.normal;
	this.objStateCnt=0;
	this.objInfoState = MapObjInfoState.none;
	this.objInfoStateCnt = 0;
	
	}
MapObj.renewState = function()
	{
	if(this.objStateCnt>0){
		this.objStateCnt-=1;
		}
	switch( this.objState )
		{
		case MapObjState.damage:
			{
			if( 0>=this.objStateCnt )
				{
				this.objState = MapObjState.normal;
				}
			}
			break;
		case MapObjState.dying:
			{
			if( 0>=this.objStateCnt )
				{
				this.objState = MapObjState.dead;
				this.deActiveObj();
				}
			}
			break;
		}
	}
MapObj.draw = function( ){
	this.renewDpos();
	switch( this.objState )
		{
	case MapObjState.normal:
		this.doDraw();
		break;
	case MapObjState.dying:
		this.ctx.globalAlpha = 1.0*this.objStateCnt/MapObjStateCnt.dying;
		this.doDraw();
		this.ctx.globalAlpha = 1.0
		break;
	case MapObjState.damage:
		this.doDrawDamage();
		break;
	case MapObjState.dead:
		//•`‰æ–³‚µ.
		break;
		}
	}
MapObj.doDraw = function()
	{
	}
MapObj.doDrawDamage = function()
	{
	}
/****
MapCircleObj(sample)
****/
var MapCircleObj = Object.create(MapObj);
MapCircleObj.doDraw = function( ){
	this.ctx.beginPath();
	this.ctx.strokeStyle   = "rgb(220,90,90)";
	this.ctx.arc(this.dcx, this.dcy, 20, 0, Math.PI*2, true);
	this.ctx.closePath();
	this.ctx.stroke();
	}
/****
EnemyBase
****/
var EnemyBase = Object.create(MapObj);
EnemyBase.init = function(spec){
	MapObj.init.apply(this,[spec]);
	this.objType = MapObjType.enemy;
	this.depth = DrawDepth.enemy;
	this.maxHP = 100;
	this.curHP = 100;
	}
EnemyBase.proc = function(){
	
	//doProc.
	if( MapObjState.dying !=  this.objState )
		{
		this.doProc();
		}
	
	//collision.
	if( MapObjState.normal == this.objState )
		{
		this.collisionProc();
		}
	
	//state.
	this.renewState()

	}
EnemyBase.collisionProc = function(){
	var objs = MYAPP.gameObjs;
	for( var i=0; i<objs.length; i++){
		var obj = objs[i];
		if(obj.objType!=MapObjType.bulletePlayer){continue;}
		var ret = uuIsCollisionCircleAndCircle( this , obj );//todo:circleˆÈŠO‚Ìshape.
		if(ret.isCollision)
			{
			obj.deActiveObj();
			this.curHP -= obj.atk;
			this.objState   = MapObjState.damage;
			this.objStateCnt= MapObjStateCnt.damage;
			if(this.curHP<=0){
				this.objState   = MapObjState.dying;
				this.objStateCnt= MapObjStateCnt.dying;
				var spec = this;
				uuCreate(Particle,this);
				}
			break;
			}
		
		}
	}
/****
BulleteBase
****/
var BulleteBase = Object.create(MapObj);
BulleteBase.init = function(spec){
	MapObj.init.apply(this,[spec]);
	this.objType = spec.objType;
	this.depth = DrawDepth.bullete;
	}
BulleteBase.burst = function(){
	var spec = this;
	spec.num=4;
	spec.life=4;
	uuCreate(Particle,spec);
	}



