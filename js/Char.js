/****
EnemyCircle
****/
var EnemyCircle = Object.create(EnemyBase);
EnemyCircle.init=function(spec){
	EnemyBase.init.apply(this,[spec]);
	this.bulleteCnt  = 0;
	this.bulleteInter= 10;
	this.cr= 10;
	this.bulletAngle = 1;
	this.baseColor = "rgb(90,90,220)";
	}
EnemyCircle.doDraw = function( ){
	this.ctx.beginPath();
	this.ctx.strokeStyle   = this.baseColor;
	this.ctx.arc(this.dcx, this.dcy, this.cr, 0, Math.PI*2, true);
	this.ctx.closePath();
	this.ctx.stroke();
	}
EnemyCircle.doProc = function( ){
	this.bulleteCnt+=1;
	if( this.bulleteCnt > this.bulleteInter )
		{
		this.bulletAngle = uuAngleAdjust(this.bulletAngle+0.2);
		
		var cosT=uuCos(this.bulletAngle);
		var sinT=uuSin(this.bulletAngle);
		uuCreate(Bullete,{ctx:this.ctx
					, cx:this.cx+(this.cr)*cosT
					, cy:this.cy+(this.cr)*sinT
					, vX:1.5 * cosT
					, vY:1.5 * sinT
					, cr:4
					, objType:MapObjType.bulleteEnemy
					});
		this.bulleteCnt=0;
		}
	}


var EnemyCircleAim = Object.create(EnemyCircle);
EnemyCircleAim.init=function(spec){
	EnemyCircle.init.apply(this,[spec]);
	this.bulleteInter= 30;
	}
EnemyCircleAim.doProc = function( ){
	this.bulleteCnt+=1;
	if( this.bulleteCnt > this.bulleteInter )
		{
		var player = MYAPP.player;
		var angle = Math.atan2(player.cy-this.cy,player.cx-this.cx);
		var cosT=Math.cos(angle);
		var sinT=Math.sin(angle);
		uuCreate(Bullete,{ctx:this.ctx
					, cx:this.cx+(this.cr)*cosT
					, cy:this.cy+(this.cr)*sinT
					, vX:2 * cosT
					, vY:2 * sinT
					, cr:4
					, objType:MapObjType.bulleteEnemy
					});
		this.bulleteCnt=0;
		}
	
	}
	
