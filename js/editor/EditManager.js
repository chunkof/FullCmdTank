var EditPanel = {	
				"dummy"		:  0,
				"mapchip"	:  1,
				"enemy"		:  2,
				"condition"	:  3,
				"system"	:  4,
				};
//-----------------
//EditPanelInfo
//-----------------
var EditPanelInfo={};
EditPanelInfo.init = function(spec)
	{
	this.zoomOut = 1.0;
	//mapChip
	this.mapChip={};
	this.mapChip.chipNo = 1;
	this.mapChip.chipSize = 1;
	//enemy
	this.enemy={};
	this.enemy.cursorType = "put";
	}

//-----------------
//EditPanelManager
//-----------------
var EditPanelManager = Object.create(GameObj);
EditPanelManager.init=function(spec)
	{
	GameObj.init.apply(this,[spec]);
	MYAPP.editPanel = this;
	this.buttonManager	= uuCreate(ButtonManager);
	
	var ctxW = MYAPP.workCtx;
	var ctxT = MYAPP.toolCtx;
	
	
	//-----------
	//Panel
	//-----------
	this.activePanelType=EditPanel.mapchip;
	this.panelCreate(ctxT,ctxW);
	
	//-----------
	//Tab
	//-----------
	//ƒ^ƒu
	var tabNum = 4;
	var tabX=0;
	var tabY=0;
	var tabWintvl=1;//w‚ÌŒ„ŠÔ.
	var tabW=(this.ctx.canvas.width-tabWintvl)/tabNum;
	var tabH=32;
	for(var i=0; i<tabNum; i++)
		{
		var btn = uuCreate(PanelChangeTab,{ctx:ctxT
				,x:tabX , y:tabY
				,w:tabW , h:tabH
				,tabID:EditPanel.mapchip+i
				,owner:this});
		this.buttonManager.push( btn );
		tabX = tabX+tabW+tabWintvl;
		}
	
	//---------------------
	//ƒCƒxƒ“ƒg“o˜^
	//---------------------
	//main canvas(•`‰æ‚Íwork canvas)
	MYAPP.mainCanvasO.unbind("mousemove");
	MYAPP.mainCanvasO.bind  ("mousemove",function(event){
		if(!MYAPP.isEditMode){return;}
		var mousePos = uuMouseXY(event);
		MYAPP.editPanel.mouseMoveWorkCanvas(mousePos.x,mousePos.y);
		});
	MYAPP.mainCanvasO.unbind("mousedown");
	MYAPP.mainCanvasO.bind  ("mousedown",function(event){
		if(!MYAPP.isEditMode){return;}
		var mousePos = uuMouseXY(event);
		MYAPP.editPanel.clickOnWorkCanvas(true,mousePos.x,mousePos.y);
		});
	//tool canvas.
	MYAPP.toolCanvasO.unbind("mousedown");
	MYAPP.toolCanvasO.bind(  "mousedown",function(event){
		if(!MYAPP.isEditMode){return;}
		var mousePos = uuMouseXY(event);
		MYAPP.editPanel.clickOnToolCanvas(true,mousePos.x,mousePos.y);
		});
	//common
	$("*").unbind("mouseup");
	$("*").bind  ("mouseup",function(event){
		if(!MYAPP.isEditMode){return;}
		MYAPP.editPanel.clickOnWorkCanvas(false);
		MYAPP.editPanel.clickOnToolCanvas(false);
		});
	
	}

EditPanelManager.panelCreate=function()
	{
	
	var ctxW = MYAPP.workCtx;
	var ctxT = MYAPP.toolCtx;
	
	switch( this.activePanelType )
		{
	case EditPanel.mapchip:
		this.activePanel	= uuCreate(MapChiprPanel,{ctx:ctxT,x:0,y:0});
		this.activeCursor	= uuCreate(MapChipCursor,{ctx:ctxW,cx:0,cy:0});
		break;
	case EditPanel.enemy:
		this.activePanel	= uuCreate(EnemyPanel,{ctx:ctxT,x:0,y:0});
		this.activeCursor	= uuCreate(EnemyCursor,{ctx:ctxW,cx:0,cy:0});
		break;
		}
	}
EditPanelManager.uiCtrl=function()
	{
	}
EditPanelManager.deActiveObj=function()
	{
	MYAPP.mainCanvasO.mousemove(function(event){});
	MYAPP.mainCanvasO.mousedown(function(event){});
	MYAPP.toolCanvasO.mousedown(function(event){});
	$("*").mouseup(function(event){});
	
	this.activePanel.deActiveObj();
	this.activeCursor.deActiveObj();
	
	this.buttonManager.deActiveObj();
	
	
	uuHidden(MYAPP.toolCanvasO);
	GameObj.deActiveObj.apply(this);
	}
EditPanelManager.mouseMoveWorkCanvas=function(x,y)
	{
	this.activeCursor.renewPos(x,y);
	}
EditPanelManager.clickOnWorkCanvas=function(flg,x,y)
	{
	this.activeCursor.clickOn(flg,x,y);
	}
EditPanelManager.clickOnToolCanvas=function(flg,x,y)
	{
	this.buttonManager.clickOn(flg,x,y);
	this.activePanel.clickOn(flg,x,y);
	}
EditPanelManager.panelTabEv=function(tabID)
	{
	if( this.activePanelType != tabID )
		{
		this.activePanelType = tabID;
		this.activePanel.deActiveObj();
		this.activeCursor.deActiveObj();
		this.panelCreate();
		}
	}
EditPanelManager.draw=function()
	{
	var ctx=this.ctx;
	
	ctx.fillStyle = MYAPP.EditPanelBgColor;
	ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

	ctx.strokeStyle = MYAPP.EditPanelStrokeColor;
	ctx.lineWidth = 4;
	
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(0,ctx.canvas.height);
	ctx.stroke();
	
	}

//-----------------
//PanelChangeTab
//-----------------
var PanelChangeTab = Object.create(ButtonBase);
PanelChangeTab.init=function(spec){
	ButtonBase.init.apply(this,[spec]);
	this.owner = spec.owner;
	this.tabID = spec.tabID;
	}
PanelChangeTab.draw = function(){
	var ctx = this.ctx;
	var yOffset;
	
	ctx.lineWidth = 2;
	ctx.strokeStyle = MYAPP.EditPanelStrokeColor;
	
	var x= this.x;
	var y= this.y-1;
	var w= this.w;
	var h= this.h-1;

	if(this.tabID == this.owner.activePanelType)
		{
		//¶
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x,y+h);
		ctx.stroke();
		
		//ã
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x+w,y);
		ctx.stroke();

		//‰E
		ctx.beginPath();
		ctx.moveTo(x+w,y);
		ctx.lineTo(x+w,y+h);
		ctx.stroke();
		
		}
	else
		{
		ctx.strokeRect(x,y,w,h);
		}
	}
PanelChangeTab.doPush = function(x,y){
	this.owner.panelTabEv(this.tabID);
	}

