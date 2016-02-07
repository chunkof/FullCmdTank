/****
Pipe
*****/
var PipeArm = Object.create(MapObj);
PipeArm.init=function(spec){
	MapObj.init.apply(this,[spec]);
	this.objType	= MapObjType.player;
	this.depth		= DrawDepth.player;
	this.rgb		= spec.rgb;
	this.angleInit	= spec.angle;
	this.angle		= spec.angle;
	this.addAngle	= spec.owner.addAngleL;
	this.owner		= spec.owner;
	this.ctx		= spec.ctx;
	this.staR		= 5;
	this.endR		= 12;
	
	this.acceleCnt		=  0;
	this.acceleCntMax	=  4;
	this.gunCnt			=  0;
	this.gunCntMax		=  8;
	
	this.cx = this.owner.cx;
	this.cy = this.owner.cy;
	this.renewA();
	}

PipeArm.renewA=function()
	{
	this.cosA	= uuCos(this.angle);
	this.sinA	= uuSin(this.angle);
	this.endCx	= this.endR * this.cosA;
	this.endCy	= this.endR * this.sinA;
	this.staCx	= this.staR * this.cosA;
	this.staCy	= this.staR * this.sinA;
	}
PipeArm.procByOwner=function()
	{
	this.cx = this.owner.cx;
	this.cy = this.owner.cy;
	
	this.acceleCnt	= Math.max(this.acceleCnt-1	,0);
	this.gunCnt		= Math.max(this.gunCnt-1	,0);
	
	this.renewA();
	}
PipeArm.doDrawByOwner=function()
	{
	var ctx=this.ctx;
	
	ctx.lineWidth=4;
	ctx.beginPath();
	ctx.strokeStyle = this.rgb;
	ctx.fillStyle = this.rgb;
	ctx.moveTo(this.dcx+this.endCx	, this.dcy+this.endCy);
	ctx.lineTo(this.dcx+this.staCx	, this.dcy+this.staCy)
	ctx.stroke();
	
	ctx.lineWidth=4;
	}

/****
FlashLight
*****/
var FlashLight = Object.create(MapObj);
FlashLight.init=function(spec)
	{
	MapObj.init.apply(this,[spec]);
	this.owner = spec.owner;
	MYAPP.lights.push(this);//todo;popの処理 or 最初から作っておいてactiveだけ切り換え.
	}
FlashLight.proc=function()
	{
	var owner = this.owner;
	//同期.
	this.angle = owner.angle;
	this.cx=owner.cx+ owner.endR*owner.cosA;
	this.cy=owner.cy+ owner.endR*owner.sinA;
	}

/****
Bullete
*****/
var Bullete = Object.create(BulleteBase);
Bullete.init=function(spec)
	{
	BulleteBase.init.apply(this,[spec]);
	this.vX = spec.vX;
	this.vY = spec.vY;
	this.cx-=this.vX;
	this.cy-=this.vY;
	this.atk = 20;
	this.cr = uuDefault(spec.cr,4);
	this.lifeTimeRemain = 60*40;
	}
Bullete.proc=function(){
	this.cx+=this.vX;
	this.cy+=this.vY;
	this.lifeTimeRemain-=1;
	
	var collision = MYAPP.bgMap.getCollisionInfo(this);
	
	var del   =false;
	var burst =false;

	if(this.lifeTimeRemain<0){
		del=true;
		}
	if(collision!=null){
		del=true;burst=true;
		}
	if(this.objType==MapObjType.bulletePlayer && !this.isInDisp(32,32) )
		{
		del=true;
		}
	
	if(del){
		if(burst){
			this.burst();
			}
		this.deActiveObj();
		}
		
	}
Bullete.doDraw=function()
	{
	var ctx=this.ctx;
	ctx.beginPath();
	ctx.strokeStyle = "rgb(240,200,200)";
	ctx.fillStyle = "rgb(240,200,200)";
	ctx.arc(this.dcx, this.dcy, this.cr, 0, Math.PI*2, true);
	ctx.fill();
	
	}


/****
BeamSaber
****/
var BeamSaber = Object.create(MapObj);
BeamSaber.init=function(spec)
	{
	MapObj.init.apply(this,[spec]);
	this.owner = spec.owner;
	this.swingAngle = spec.swingAngle;
	this.cntAdd = 1;
	this.cnt = 0;
	this.cntMax = 10;
	this.len = 0;
	this.lenAdd=5;
	this.lenMax=40;

	this.swingCntMax = 8;
	this.swingCnt = 0;

	this.phase=0;
	}
BeamSaber.proc=function()
	{
	var owner=this.owner;
	
	switch(this.phase)
		{
	//ソード射出.
	case 0:
		{
		this.len += this.lenAdd;
		if(this.len>=this.lenMax)
			{
			this.len = this.lenMax;
			this.phase = 1;
			}
		}
		break;
	//スイング.
	case 1:
		{
		this.swingCnt++;
		owner.angle += this.swingAngle;
		if(this.swingCnt>=this.swingCntMax)
			{
			this.phase = 2;
			}
		}
		break;
	case 2:
		{
		this.len -= this.lenAdd;
		if(this.len <= 0)
			{
			this.len = 0;
			this.deActiveObj();
			}
		}
		break;
		}
	
	//角度同期.
	this.cx=owner.cx+ owner.endR*owner.cosA;
	this.cy=owner.cy+ owner.endR*owner.sinA;
	}
BeamSaber.doDraw=function()
	{
	var ctx=this.ctx;
	
	var staX = this.dcx;
	var staY = this.dcy;
	var len = this.len;
	var endX1 = this.dcx+this.owner.cosA*(len+1);
	var endY1 = this.dcy+this.owner.sinA*(len+1);
	var endX0 = this.dcx+this.owner.cosA*(len+0);
	var endY0 = this.dcy+this.owner.sinA*(len+0);
	
	ctx.globalAlpha = 0.5;
	ctx.beginPath();
	ctx.lineWidth=3;
	ctx.strokeStyle   = "rgb(255,200,200)";
	ctx.moveTo(staX,staY);
	ctx.lineTo(endX1,endY1)
	ctx.stroke();

	ctx.beginPath();
	ctx.globalAlpha = 2.0;
	ctx.lineWidth=1;
	ctx.strokeStyle   = "rgb(255,240,240)";
	ctx.moveTo(staX,staY);
	ctx.lineTo(endX0,endY0)
	ctx.stroke();
	
	ctx.lineWidth=4;
	ctx.globalAlpha = 1.0;
	}

/****
Tank
****/
var PlayerTank = Object.create(MapObj);
PlayerTank.init=function(spec){
	MapObj.init.apply(this,[spec]);
	this.objType = MapObjType.player;
	this.depth		= DrawDepth.player;

	this.vX = 0;
	this.vY = 0;
	this.vMaxAbs = 3;
	this.cr =  8;
	
	//Pipe.
	this.addAngleL = 0.2;
	this.addAngleS = 0.05;
//	this.addAngle = this.addAngleL;	
	this.redPipe = uuCreate(PipeArm,{	angle:1.025,
										rgb:"rgb(255,150,150)",
										owner:this , ctx:this.ctx});
	this.bluePipe = uuCreate(PipeArm,{	angle:0.0,
										rgb:"rgb(150,150,255)",
										owner:this , ctx:this.ctx});
	

	//加速.
	this.aAbs = 0.5;
	
	
	//status.
	this.maxHP=100;
	this.curHP=100;
	
	}
PlayerTank.proc=function(){
	this.renewState()
	
	this.moveProc();
	
	if( MapObjState.normal == this.objState )
		{
		this.collisionProc();
		}
	
	this.redPipe.procByOwner();
	this.bluePipe.procByOwner();
	
	}
PlayerTank.moveProc=function(){
	var myMath = Math;
	
	//v set.
	this.v =Math.sqrt(this.vX*this.vX+this.vY*this.vY);
	var v = this.v;

	//limit.
	if(this.v > this.vMaxAbs)
		{
		this.v = this.vMaxAbs;
		}
	if(this.v < 0.05 )
		{
		this.v = 0;
		}
	//resit.
	this.v = this.v*0.99;
	
	//v renew.
	if(v > 0)    v = 1 / v;
	this.vX = this.vX*v*this.v;
	this.vY = this.vY*v*this.v;
	this.v =Math.sqrt(this.vX*this.vX+this.vY*this.vY);
	
	//pos renew.
	this.cx+=this.vX;
	this.cy+=this.vY;
	}
PlayerTank.collisionProc=function( ){
	var bgMap=MYAPP.bgMap;
	var posX = Math.floor(this.cx /bgMap.size);
	var posY = Math.floor(this.cy /bgMap.size);
	var vxCo=0;
	var vyCo=0;
	//map.
	for(var y=posY-1; y<=posY+1 ; y++ )
		{
		for(var x=posX-1; x<=posX+1 ; x++ )
			{
			var chip = bgMap.mapArray[x+y*bgMap.mapW];
			if(MYAPP.MapChipStore.isCollision(chip))
				{
				var ret = uuIsCollisionRectAndCircle(this
											,{x:x*bgMap.size
											, y:y*bgMap.size
											, w:bgMap.size
											, h:bgMap.size} );
				if( ret.isCollision )
					{
					//めり込み補正.
					var len = uuGetRadius(ret.x,ret.y);
					if(len>0) len=1/len;
					var theta = uuGetTheta(ret.x*len , ret.y*len);
					var cosT = Math.abs(uuCos(theta))*ret.xDir;
					var sinT = Math.abs(uuSin(theta))*ret.yDir;
					var rCo = this.cr-Math.sqrt(ret.sq)+0.1;
					this.cx += cosT*rCo;
					this.cy += sinT*rCo;
					
					//簡易反射.
					this.vX /=2;
					this.vY /=2;
					this.v =Math.sqrt(this.vX*this.vX+this.vY*this.vY);
					this.vX +=cosT*this.v*1.5;
					this.vY +=sinT*this.v*1.5;
					
					if(ChipType.damage==bgMap.chipType(chip))
						{
						this.curHP -= 10;
						if(this.curHP<0){this.curHP=0;}
						this.objState   = MapObjState.damage;
						this.objStateCnt= MapObjStateCnt.damage;
						}
					
					}
				}
			}
		}
	//enemyBullete.
	var objs = MYAPP.gameObjs;
	for( var i=0; i<objs.length; i++){
		var obj = objs[i];
		if(obj.objType!=MapObjType.bulleteEnemy){continue;}
		var ret = uuIsCollisionCircleAndCircle( this , obj );//todo:circle以外のshape.
		if(ret.isCollision)
			{
			obj.deActiveObj();
			this.curHP -= obj.atk;
			if(this.curHP<0){this.curHP=0;}
			this.objState   = MapObjState.damage;
			this.objStateCnt= MapObjStateCnt.damage;
			break;
			}
		
		}
	
	}

PlayerTank.doDraw=function( ){
	var ctx = this.ctx;

	ctx.beginPath();
	ctx.fillStyle = "rgb(250,250,250)";
	ctx.arc(this.dcx, this.dcy, this.cr, 0, Math.PI*2, true);
	ctx.fill();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.fillStyle = "rgb(128,128,128)";
	ctx.arc(this.dcx, this.dcy, this.cr-1, 0, Math.PI*2, true);
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.fillStyle = "rgb(200,200,200)";
	ctx.arc(this.dcx, this.dcy, 5, 0, Math.PI*2, true);
	ctx.fill();
	ctx.closePath();

	this.redPipe.renewDpos();
	this.bluePipe.renewDpos();
	this.redPipe.doDrawByOwner();
	this.bluePipe.doDrawByOwner();

	}
PlayerTank.commandPipeAngleAdd = function(pipe,val){
	pipe.angle = uuAngleAdjust(pipe.angle+val);
	}
PlayerTank.commandAirAccele = function(pipe){

	if(0!=pipe.acceleCnt){return;}
	pipe.acceleCnt = pipe.acceleCntMax;

	//加速.
	this.vX += this.aAbs * pipe.cosA *-1;
	this.vY += this.aAbs * pipe.sinA *-1;
	
	//煙.
	uuCreate(AccelSmoke,{ctx:this.ctx
						, cx:this.cx+pipe.endR*pipe.cosA
						, cy:this.cy+pipe.endR*pipe.sinA });
	
	}

PlayerTank.commandGun = function(pipe){
	
	if(0!=pipe.gunCnt){return;}
	pipe.gunCnt = pipe.gunCntMax;
	
	//弾.
	uuCreate(Bullete,{ctx:this.ctx
						, cx:this.cx+(pipe.endR+1)*pipe.cosA
						, cy:this.cy+(pipe.endR+1)*pipe.sinA 
						, vX:6 * pipe.cosA
						, vY:6 * pipe.sinA
						, cr:4
						, objType:MapObjType.bulletePlayer
						});
	
	}
PlayerTank.commandBeamSaber = function(pipe,swingAngle){
	pipe.hand = uuCreate(BeamSaber,{ctx:this.ctx,owner:pipe,swingAngle:swingAngle});
	}
PlayerTank.commandPiepeAngleInitSet = function(pipe){
	pipe.angle = pipe.angleInit;
	}
	
PlayerTank.commandAcceleScaleChange = function(){
	if(this.addAngleL == this.addAngle )
		{
		this.addAngle = this.addAngleS;
		}
	else
		{
		this.addAngle = this.addAngleL;
		}
	}
PlayerTank.commandFlashLight = function(pipe){
	pipe.hand = uuCreate(FlashLight,{ctx:this.ctx,owner:pipe});
	}
	
PlayerTank.commandDebugMove = function(x,y){
	this.vX = 0;
	this.vY = 0;
	this.cx += x;
	this.cy += y;
	}

PlayerTank.commandAddAngleChange = function(pipe){
	if( this.addAngleL != pipe.addAngle )
		{
		pipe.addAngle = this.addAngleL;
		}
	else
		{
		pipe.addAngle = this.addAngleS;
		}
	}
