/****
CommandManager
****/
//var CommandManager ={};
var CommandManager =Object.create(GameObj);
CommandManager.init=function(spec){
	GameObj.init.apply(this,[spec]);
	this.keyConv={
		32:" ",
		59:";",
		49:"1",
		50:"2",
		51:"3",
		53:"5",
		};
	this.oldCode = null;
	this.sameCode= false;
	this.count = 0;//0の時だけキーを拾う.
	this.countSame    = 2;
	this.countAnother = 1;
	//---------------
	//通常モード
	//---------------
	this.keyMapStr={
		"R":function(){var trg=MYAPP.player;	trg.commandPipeAngleAdd(trg.redPipe,+1*0.05);},
		"F":function(){var trg=MYAPP.player;	trg.commandPipeAngleAdd(trg.redPipe,+1*0.20);},
		"D":function(){var trg=MYAPP.player;	trg.commandAirAccele(trg.redPipe);},
		"S":function(){var trg=MYAPP.player;	trg.commandPipeAngleAdd(trg.redPipe,-1*0.20);},
		"W":function(){var trg=MYAPP.player;	trg.commandPipeAngleAdd(trg.redPipe,-1*0.05);},

		"E":function(){var trg=MYAPP.player;	trg.commandGun(trg.redPipe);},
		"A":function(){var trg=MYAPP.player;	trg.commandPiepeAngleInitSet(trg.redPipe);},
		"V":function(){var trg=MYAPP.player;	trg.commandFlashLight(trg.redPipe);},

		"U":function(){var trg=MYAPP.player;	trg.commandPipeAngleAdd(trg.bluePipe,-1*0.05);},
		"J":function(){var trg=MYAPP.player;	trg.commandPipeAngleAdd(trg.bluePipe,-1*0.20);},
		"K":function(){var trg=MYAPP.player;	trg.commandAirAccele(trg.bluePipe);},
		"L":function(){var trg=MYAPP.player;	trg.commandPipeAngleAdd(trg.bluePipe,+1*0.20);},
		"O":function(){var trg=MYAPP.player;	trg.commandPipeAngleAdd(trg.bluePipe,+1*0.05);},

		"M":function(){var trg=MYAPP.player;	trg.commandFlashLight(trg.bluePipe);},
		"I":function(){var trg=MYAPP.player;	trg.commandGun(trg.bluePipe);},
		";":function(){var trg=MYAPP.player;	trg.commandPiepeAngleInitSet(trg.bluePipe);},

		//for Debug.
		/*
		"5":function(){this.commandDebugMove( 0,-1);},
		"1":function(){this.commandDebugMove(-1, 0);},
		"3":function(){this.commandDebugMove( 1, 0);},
		"2":function(){this.commandDebugMove( 0, 1);},
		*/
		
		"Q":function(){CommandManager.changeMode();}
		};
	//---------------
	//エディットモード
	//---------------
	this.keyMapStrEditMode={
		"W":function(){MYAPP.gazePoint.posAdd(  0,-32);},
		"A":function(){MYAPP.gazePoint.posAdd(-32,  0);},
		"D":function(){MYAPP.gazePoint.posAdd( 32,  0);},
		"S":function(){MYAPP.gazePoint.posAdd(  0, 32);},
		
		"1":function(){MYAPP.editInfo.zoomOut=1;
					MYAPP.workCanvas.width  = MYAPP.mainCanvas.width *MYAPP.editInfo.zoomOut;
					MYAPP.workCanvas.height = MYAPP.mainCanvas.height*MYAPP.editInfo.zoomOut;
					},
		"2":function(){MYAPP.editInfo.zoomOut=2;
					MYAPP.workCanvas.width  = MYAPP.mainCanvas.width *MYAPP.editInfo.zoomOut;
					MYAPP.workCanvas.height = MYAPP.mainCanvas.height*MYAPP.editInfo.zoomOut;
					},
		
		
		"Q":function(){CommandManager.changeMode();}
		};
	}
CommandManager.changeMode = function(){
	if(MYAPP.isEditMode)
		{
		MYAPP.isEditMode = false;
		DeleteEditors();
		}
	else
		{
		MYAPP.isEditMode = true;
		InitEditors();
		}
	}
	
CommandManager.secureProc=function(){
	this.count -= 1;
	if(this.count<=0){
		this.count=0;
		this.oldCode = null;
		}
	}
CommandManager.keyEvt=function(evt){
	//keyChar決定.
	
	var keyChar = "";
	if( this.keyConv[evt.which] )
		{
		keyChar = this.keyConv[evt.which];
		}
	else
		{
		keyChar = String.fromCharCode(evt.which).toUpperCase();
		}
	
	if(0!=this.count)
		{
		this.oldCode = keyChar;
		return;
		}
	var same = false;
	if(keyChar==this.oldCode)
		{
		same = true;
		}
	
	//コマンド実行.
	var keyMap = this.keyMapStr;
	if(MYAPP.isEditMode)
		{
		keyMap = this.keyMapStrEditMode;
		}
	if( keyMap[keyChar] )
		{
		if(same)
			{
			this.count = this.countSame;
			}
		else
			{
			this.count = this.countAnother;
			}
		keyMap[keyChar].apply(this.trg);
		}
	
	//キー履歴保存.
	this.oldCode = keyChar;
	}


