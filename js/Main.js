var MYAPP = MYAPP || {};
MYAPP.gameObjs  = new Array();
MYAPP.gazePoint = null;
MYAPP.player = null;
MYAPP.lights = new Array();
MYAPP.enemys = new Array();
MYAPP.isEditMode = true;
MYAPP.editInfo= uuCreate(EditPanelInfo);
MYAPP.MapChipStore = uuCreate(MapChipStore);
MYAPP.EditPanelStrokeColor	= "rgb(100,100,100)";
MYAPP.EditPanelBgColor		= "rgb(20,20,20)";
MYAPP.EditPanelStorage={};
/****
MainLoop
****/
var MainLoop = ({
	init : function(){
		this.fps = 60;
		this.frameInterval = 1000/this.fps;
		this.prvTime = new Date();
		this.frameCnt = 0;
		},
	procStart : function(){
		this.proc();
		},
	proc : function(){
		//renew.
		this.frameCnt++;
		if( this.frameCnt%5 == 0 ){
			uuDebug("fps=" + Math.round(1000/(new Date() -this.prvTime) ));
		}
		if( this.frameCnt > this.fps){
			this.frameCnt = 0;
		}
		this.prvTime = new Date();
		
		//proc.
		var objs = MYAPP.gameObjs;
			{
			for( var i=0; i<objs.length; i++){
				if(objs[i].isActive)
					{
					objs[i].secureProc();
					if( !MYAPP.isEditMode )
						{
						objs[i].proc();
						}
					}
				else
					{
					objs.splice(i,1);
					i-=1;
					}
				}
			}
		//sort.
		objs.sort(function(a,b){return(b.depth-a.depth)});
		
		//draw.
		for( var i=0; i<objs.length; i++){
			if(objs[i].isActive)
				{
				objs[i].draw();
				}
			else
				{
				objs.splice(i,1);
				i-=1;
				}
			}
		
		//DispScale
//		if(MYAPP.isEditMode)
			{
			var ctx = MYAPP.mainCanvas;
			//いったんローカルにサイズ保持しないと、おかしくなった(FireFox).drawImageの処理の中で変に書き換わるのかも.
			var workW=MYAPP.workCanvas.width;
			var workH=MYAPP.workCanvas.height;
			var mainW=MYAPP.mainCanvas.width;
			var mainH=MYAPP.mainCanvas.height;
			MYAPP.mainCtx.drawImage(MYAPP.workCanvas
									,0,0,workW,workH,0,0,mainW,mainH);
			}
		
		//fps control.
		var currTime = new Date();
		var waitTime = this.frameInterval - (currTime - this.prvTime);
		if( 0 > waitTime)
			{
			waitTime = 0;
			}
		setTimeout(this.proc.bind(this),waitTime);
		}
		
});

UserOnLoad = function ()
	{
	
	MYAPP.mainCanvasO= $("#mainCanvas");
	MYAPP.mainCanvas = $("#mainCanvas")[0];
	MYAPP.mainCtx	 = $("#mainCanvas")[0].getContext('2d');
	MYAPP.workCanvasO= $("#workCanvas");
	MYAPP.workCanvas = $("#workCanvas")[0];
	MYAPP.workCtx	 = $("#workCanvas")[0].getContext('2d');
	MYAPP.toolCanvasO= $("#toolCanvas");
	MYAPP.toolCanvas = $("#toolCanvas")[0];
	MYAPP.toolCtx	 = $("#toolCanvas")[0].getContext('2d');
	
	
	var ctx		= MYAPP.mainCtx;
	var canvas	= MYAPP.mainCanvas;
	if(MYAPP.isEditMode)
		{
		ctx		= MYAPP.workCtx;
		canvas	= MYAPP.workCanvas;
		}
	
	MYAPP.mainCanvas.width  = MYAPP.mainCanvas.clientWidth;
	MYAPP.mainCanvas.height = MYAPP.mainCanvas.clientHeight;
	
	MYAPP.workCanvas.width  = MYAPP.mainCanvas.width *MYAPP.editInfo.zoomOut;
	MYAPP.workCanvas.height = MYAPP.mainCanvas.height*MYAPP.editInfo.zoomOut;
	MYAPP.gazePoint = uuCreate( GazePoint,{	cnvsW:canvas.width ,
											cnvsH:canvas.height	});
	
	uuCreate(BgFill,{ctx:ctx});
	
	MYAPP.bgMap = uuCreate(BgMap,{ctx:ctx});
	
	uuCreate(EnemyCircleAim	,{ctx:ctx,cx:100,cy:360});
	uuCreate(EnemyCircleAim	,{ctx:ctx,cx:100,cy:1360});
	uuCreate(EnemyCircle	,{ctx:ctx,cx:220,cy:0});
	uuCreate(EnemyCircle	,{ctx:ctx,cx:300,cy:330});
	uuCreate(EnemyCircleAim	,{ctx:ctx,cx:540,cy:230});
	uuCreate(MapCircleObj	,{ctx:ctx,cx:-200,cy:-200});

	MYAPP.player = uuCreate(PlayerTank,{ctx:ctx,cx:200,cy:100});
	MYAPP.keyEvtListener = uuCreate( CommandManager, {} );
	
	uuCreate(PlayerInfoPanel,{ctx:ctx,trg:MYAPP.player});
	
//	uuCreate(FgFill,{ctx:ctx,workCanvas:workCanvas});
	
	if(MYAPP.isEditMode)
		{
		InitEditors();
		}
	else
		{
		DeleteEditors();
		}
	
	RegistEventListener();
	
	
	var main = uuCreate(MainLoop);
	main.procStart();
	
	};

DeleteEditors=function()
	{
	if(MYAPP.editPanel)
		{
		MYAPP.editPanel.deActiveObj();
		MYAPP.editPanel = null;
		}
	MYAPP.gazePoint.setTrg(MYAPP.player);
	}

InitEditors=function(){
	uuVisible(MYAPP.toolCanvasO);
	MYAPP.toolCanvas.width  = MYAPP.toolCanvas.clientWidth;
	MYAPP.toolCanvas.height = MYAPP.toolCanvas.clientHeight;
	
	
	MYAPP.editPanel = uuCreate(EditPanelManager,{ctx:MYAPP.toolCtx});
	
	MYAPP.gazePoint.setTrg(null);
	MYAPP.gazePoint.cx = MYAPP.bgMap.mapW/2;
	MYAPP.gazePoint.cy = MYAPP.bgMap.mapH/2;
	MYAPP.gazePoint.posNtfy();
	};

RegistEventListener = function ()
	{
	$("*").keypress(function(event){
		MYAPP.keyEvtListener.keyEvt(event);
		});
	
	}
	

