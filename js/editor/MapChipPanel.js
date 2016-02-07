//-----------------
//MapChiprPanel
//-----------------
var MapChiprPanel = Object.create(GameObj);
MapChiprPanel.init=function(spec)
	{
	GameObj.init.apply(this,[spec]);
	this.depth = DrawDepth.bg;
	
	this.buttonManager	= uuCreate(ButtonManager);
	this.compoArray.push(this.buttonManager);
	
	//---------------
	// Chip
	//---------------
	//settings.
	var count = MYAPP.MapChipStore.chipSpec.length;
	var offsetX		= 15;
	var offsetY		= 64;
	var marginX		= 15;
	var marginY		= 15;
	var chipSize	= 32;
	var xMaxNumber	=  4;//horizontal max.
	//create.
	var xCurrentNumber=0;
	var yCurrentNumber=0;
	for( var i=0; i<count; i++ )
		{
		var x = offsetX+xCurrentNumber*(chipSize+marginX);
		var y = offsetY+yCurrentNumber*(chipSize+marginY);
		var btn = uuCreate(MapChipButton,{ chipNo:i , ctx:this.ctx , x:x,y:y,w:chipSize,h:chipSize});
		this.buttonManager.push( btn );
		
		xCurrentNumber++;
		if( xCurrentNumber > xMaxNumber )
			{
			xCurrentNumber=0;
			yCurrentNumber++;
			}
		}

	//---------------
	// Size
	//---------------
	for( var i=0 ; i<4 ;i++ )
		{
		var btn = uuCreate( ChipSizeButton,{ chipSize:i+1 , ctx:this.ctx 
							,x:15+i*(32+i*4),y:600-38-i*2,w:32,h:32+i*2});
		this.buttonManager.push( btn );
		}
		
	
	}
MapChiprPanel.clickOn = function(flag,x,y)
	{
	this.buttonManager.clickOn(flag,x,y);
	}
MapChiprPanel.draw=function(spec)
	{
	}
//-----------------
//MapChipButton
//-----------------
var MapChipButton = Object.create(ButtonBase);
MapChipButton.init=function(spec){
	ButtonBase.init.apply(this,[spec]);
	this.chipNo = spec.chipNo;
	}
MapChipButton.draw = function(){
	var ctx = this.ctx;
	MYAPP.MapChipStore.drawFunc(this.chipNo,ctx,this.x,this.y,this.w,this.h)
	if( MYAPP.editInfo.mapChip.chipNo == this.chipNo )
		{
		ctx.strokeStyle= "rgb(255,255,255)";
		ctx.lineWidth = 2;
		}
	else
		{
		ctx.strokeStyle= "rgb(180,180,180)";
		ctx.lineWidth = 1;
		}
	ctx.strokeRect(this.x,this.y,this.w,this.h);
	}
MapChipButton.doPush = function(x,y){
	MYAPP.editInfo.mapChip.chipNo = this.chipNo;
	}
//-----------------
//ChipSizeButton
//-----------------
var ChipSizeButton = Object.create(ButtonBase);
ChipSizeButton.init=function(spec){
	ButtonBase.init.apply(this,[spec]);
	this.chipSize = spec.chipSize;
	}
ChipSizeButton.draw = function(){
	var ctx = this.ctx;
	if( this.chipSize == MYAPP.editInfo.mapChip.chipSize )
		{
		ctx.strokeStyle= "rgb(255,255,255)";
		ctx.lineWidth = 4;
		}
	else
		{
		ctx.strokeStyle= "rgb(100,100,100)";
		ctx.lineWidth = 4;
		}
	var reduction = 0;
	switch( this.chipSize )
		{
	case 1: reduction = 11;break;
	case 2:	reduction =  8;break;
	case 3:	reduction =  6;break;
	case 4:	reduction =  2;break;
		}
	ctx.strokeRect(	 this.x+reduction
					,this.y+reduction*2
					,this.w-(reduction*2)
					,this.h-(reduction*2) );
	
	}
ChipSizeButton.doPush = function(x,y){
	MYAPP.editInfo.mapChip.chipSize = this.chipSize;
	}
//-----------------
//MapChipCursor
//-----------------
var MapChipCursor = Object.create(GameObj);
MapChipCursor.init=function(spec)
	{
	GameObj.init.apply(this,[spec]);
	this.cx  = spec.cx;
	this.cy  = spec.cy;
	this.depth		= DrawDepth.cursor;
	this.size		= 32;
	this.half		= this.size/2;
	this.putting	= false;	//‚±‚ê‚ªTRUE‚ÌŠÔ‚ÍPutChip‚µ‘±‚¯‚é(‰Ÿ‚µ‚Á‚Ï‚È‚µ‘Î‰ž)
	}
MapChipCursor.draw=function(spec)
	{
	var ctx = this.ctx;
	var x=this.cx-this.half;
	var y=this.cy-this.half;
	var w=this.size;
	var h=this.size;
	
	var chipSize = MYAPP.editInfo.mapChip.chipSize;
	w=w*chipSize;
	h=h*chipSize;
	
	this.ctx.globalAlpha=0.6;
	ctx.fillStyle = MYAPP.MapChipStore.chipSpec[MYAPP.editInfo.mapChip.chipNo].fillColor;
	ctx.fillRect(x,y,w,h);
	ctx.strokeStyle = "rgb(255,255,255)";
	ctx.strokeRect(x,y,w,h);
	
	this.ctx.globalAlpha=1.0;
	
	}
MapChipCursor.renewPos=function(x,y)
	{
	var chipOffset = (MYAPP.editInfo.mapChip.chipSize-1)/2;
	var size = this.size;
	
	x *= MYAPP.editInfo.zoomOut;
	y *= MYAPP.editInfo.zoomOut;
	x += MYAPP.gazePoint.lx -chipOffset*size;
	y += MYAPP.gazePoint.ly -chipOffset*size;
	this.mapX = Math.floor(x/size)*size;
	this.mapY = Math.floor(y/size)*size;
	this.cx=this.mapX - MYAPP.gazePoint.lx+this.half;
	this.cy=this.mapY - MYAPP.gazePoint.ly+this.half;
	if( this.putting )
		{
		this.putChip();
		}
	}
	
MapChipCursor.clickOn=function(flag)
	{
	this.putting = flag;
	if( this.putting )
		{
		this.putChip();
		}
	}
MapChipCursor.putChip=function()
	{
	var bgMap=MYAPP.bgMap;
	for( i=0; i<MYAPP.editInfo.mapChip.chipSize; i++ )
		{
		for( j=0; j<MYAPP.editInfo.mapChip.chipSize; j++ )
			{
			var posX = Math.floor(this.mapX /bgMap.size) + i;
			var posY = Math.floor(this.mapY /bgMap.size) + j;
			bgMap.mapArray[posX+posY*bgMap.mapW] = MYAPP.editInfo.mapChip.chipNo;
			}
		}
	}

