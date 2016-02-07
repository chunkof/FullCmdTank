//-----------------
//MapChipStore
//-----------------
var MapChipStore = {};
MapChipStore.init = function(spec){
	this.chipSpec=new Array();
	this.chipSpec[0]={	name:"blank"				,collision:false,damage:  0 ,drawType:"fill", fillColor:"rgb( 10, 10, 10)"	 ,text:""};
	this.chipSpec[1]={	name:"grayBlock1"			,collision:true ,damage:  0 ,drawType:"fill", fillColor:"rgb( 80, 80, 80)"	 ,text:""};
	this.chipSpec[2]={	name:"grayBlock2"			,collision:true ,damage:  0 ,drawType:"fill", fillColor:"rgb(120,120,120)"	 ,text:""};
	this.chipSpec[3]={	name:"grayBlock3"			,collision:true ,damage:  0 ,drawType:"fill", fillColor:"rgb(160,160,160)"	 ,text:""};
	this.chipSpec[4]={	name:"grayBlock4"			,collision:true ,damage:  0 ,drawType:"fill", fillColor:"rgb(140,100,100)"	 ,text:""};
	this.chipSpec[5]={	name:"grayBlock5"			,collision:true ,damage:  0 ,drawType:"fill", fillColor:"rgb(100,140,100)"	 ,text:""};
	this.chipSpec[6]={	name:"grayBlock6"			,collision:true ,damage:  0 ,drawType:"fill", fillColor:"rgb(100,100,140)"	 ,text:""};
	}
MapChipStore.drawFunc = function(chipNo,ctx,x,y,w,h){
	ctx.fillStyle = this.chipSpec[chipNo].fillColor;
	ctx.fillRect(x, y, w, h)
	}
MapChipStore.isCollision = function(chipNo){
	if( chipNo==undefined || this.chipSpec.size <= chipNo )
		{
		return false;
		}
	else
		{
		return this.chipSpec[chipNo].collision;
		}
	}
	
	
/****
BgMap
****/
var ChipType = {	
				"normal"			:0,
				"damage"			:1,
				};
var BgMap = Object.create(GameObj);
BgMap.init = function(spec){
	GameObj.init.apply(this,[spec]);
	this.depth		= DrawDepth.bg;
	this.mapW = 32;
	this.mapH = 32;
	this.size = 32;
	this.mapArray=[
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,
1,1,1,1,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,
0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		];
	}
BgMap.getChip = function( x , y ){
	var xPos = Math.floor(x/this.size);
	var yPos = Math.floor(y/this.size);
	
	
	return this.mapArray[xPos+yPos*this.mapW];
	
	}
BgMap.chipType = function(chipNo){
	if( chipNo==2 )
		{
		return ChipType.damage;
		}
	return ChipType.normal;
	}
BgMap.getCollisionInfo = function(trg){
	var posX = Math.floor(trg.cx/this.size);
	var posY = Math.floor(trg.cy/this.size);
	//ÚGƒ`ƒbƒv’Tõ.
	for(var y=posY-1; y<=posY+1 ; y++ )
		{
		for(var x=posX-1; x<=posX+1 ; x++ )
			{
			if(MYAPP.MapChipStore.isCollision(this.mapArray[x+y*this.mapW]))
				{
				//ÚG”»’è‚ÆÚGî•ñ(ret)‚ÌŽæ“¾.
				var ret = uuIsCollisionRectAndCircle(trg
											,{x:x*this.size
											, y:y*this.size
											, w:this.size
											, h:this.size} );
				if( ret.isCollision )
					{
					return ret;
					}
				}
			}
		}
	return null;
	}
BgMap.draw = function( ){
	this.ctx.globalAlpha = 1.0;
	//todo:–ˆ‰ñŒÂ•Ê•`‰æ‚¶‚á‚È‚­‚Äì‹Æ—p‚Ì‚Æ‚±‚ÉÅ‰•`‰æ‚µ‚Ä‹éŒ`‚ðmain‚É•`‰æ‚·‚è‚á‚¢‚¢‚©.
	var mapArray=this.mapArray;
	var mapW=this.mapW;
	var mapH=this.mapH;
	var size=this.size;
	var ctx = this.ctx;
	var chipSpec = MYAPP.MapChipStore.chipSpec;
	for( var cntH=0; cntH<mapH ; cntH++ )
		{
		var hOffset=cntH*mapW;
		var y = cntH*size-MYAPP.gazePoint.ly;
		for( var cntW=0; cntW<mapW ; cntW++ )
			{
			var chip = mapArray[cntW+hOffset];
			var x = cntW*size-MYAPP.gazePoint.lx;
			MYAPP.MapChipStore.drawFunc(chip,ctx,x, y, size+1, size+1);
			
			}
		}
		
	this.ctx.globalAlpha = 1.0;
	}

