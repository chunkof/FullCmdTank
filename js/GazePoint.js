/****
GazePoint
****/
var GazePoint =Object.create(GameObj);
GazePoint.init = function(spec){
		GameObj.init.apply(this,[spec]);
		this.cx = 100;
		this.cy = 100;
		this.cnvsW = spec.cnvsW;
		this.cnvsH = spec.cnvsH;
		this.lxOfst = spec.cnvsW/2.0;
		this.lyOfst = spec.cnvsH/2.0;
		this.lx = this.cx - this.lxOfst;
		this.ly = this.cy - this.lyOfst;
	}
GazePoint.setTrg = function(trg)
	{
	this.trg = trg;
	}
GazePoint.posAdd = function(addX,addY)
	{
	this.cx += addX;
	this.cy += addY;
	this.posNtfy();
	}
	
GazePoint.posNtfy = function(){
		this.lx = this.cx - this.lxOfst;
		this.ly = this.cy - this.lyOfst;
	}
GazePoint.draw = function(){
	if(this.trg)
		{
		this.cx = this.trg.cx;
		this.cy = this.trg.cy;
		this.posNtfy();
		}
		
	
	$('#posDisp').text(
		"cx:" + Math.floor(this.cx/10) +","+ Math.floor(this.cy/10)
		);
	}

