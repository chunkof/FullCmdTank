var DrawDepth = {	
				"cursor"		:-10,
				"info"			:  0,
				"btn"			: 10,
				"fg"			: 20,
				"effect"		: 30,
				"bullete"		: 40,
				"player"		: 50,
				"enemy"			: 60,
				"def"			:100,
				"bg"			:100,
				"bgfill"		:200,
				};
/****
GameObj
****/
var GameObj = ({
	init : function(spec){
		this.activeObj();
		this.ctx = spec.ctx;
		this.depth = DrawDepth.def;
		this.compoArray = new Array();
		},
	deActiveObj : function(){
		this.isActive = false;//これにすると配列から消される.
		for( i=0; i<this.compoArray.length; i++ )
			{
			if(this.compoArray[i])
				{
				this.compoArray[i].deActiveObj();
				this.compoArray[i]=null;
				}
			}
		},
	activeObj: function(){
		this.isActive = true;
		MYAPP.gameObjs.push(this);
		},
	//エディタ中でも動くsecureProc
	secureProc:function(){
		},
	//エディタ中でも動くproc
	proc : function(){
		},
	draw : function( ){
		}
});

/****
Circle
****/
var CircleObj = Object.create(GameObj);
CircleObj.init=function(spec){
	GameObj.init.apply(this,[spec]);
	this.x = spec.cx;
	this.y = spec.cy;
	}
CircleObj.proc=function(){
	this.x = this.x+1;
	}
CircleObj.draw=function( ){
	this.ctx.beginPath();
	this.ctx.strokeStyle = "rgb(90,190,190)";
	this.ctx.arc(this.x, this.y, 20, 0, Math.PI*2, true);
	this.ctx.closePath();
	this.ctx.stroke();
	}


