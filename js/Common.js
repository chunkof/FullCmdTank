/*
Base
*/
if (typeof Object.create !== 'function') {
	Object.create = function(o) {
		var F = function () { };
		F.prototype = o;
		return new F();
	};
}
function uuCreate(o,spec)
	{
	var F = Object.create(o);
	F.init(spec);
	return F;
	}

function uuDefault(spec,def)
	{
	if(typeof spec === 'undefined')	{return def;}
	else							{return spec;}
	}

/*
Array
*/

function uuArraySpecRemove(aArray,aSpec)
	{
	for(i = 0; i < aArray.length; i++){
		if(aArray[i] == aSpec){
			aArray.splice(i,1);
			}
		}
	}

/*
Mouse
*/
function uuMouseXY(event)
	{
	var ret={};
	
	var x = event.clientX;
	var y = event.clientY;
	var rect = event.target.getBoundingClientRect();
	ret.x = x-rect.left;
	ret.y = y-rect.top;
	
	return ret;
	}

/*
Object
*/
function uuVisible(trg)	{trg.removeClass("hidden");}
function uuHidden(trg)	{trg.addClass("hidden");}


/*
Math
*/
function uuCos(theta)
	{
	return Math.cos(theta* Math.PI);
	}
function uuSin(theta)
	{
	return Math.sin(theta* Math.PI);
	}
function uuGetRadius(aX,aY)
	{
	return Math.sqrt(aX*aX+aY*aY);
	}
function uuGetTheta(aX,aY)
	{
	var a_c = Math.acos( aX );
	var theta = a_c;
	if( Math.asin( aY ) < 0.0 )
		{
		theta = Math.PI*2 - a_c;
		}
	return theta;
	}
function uuGetRnd( aMin , aMax )
	{
	var rnd = aMin + (aMax-aMin)*Math.random();
	return rnd;
	}
function uuGetFloorRnd( aMin , aMax )
	{
	var rnd = Math.floor( Math.random() * (aMax-aMin+1) );
	rnd -= aMin;
	return rnd;
	}
function uuAngleAdjust(angle)
	{
	if(angle>1){
			angle -= 2;
		}
	else if(angle<-1){
			angle += 2;
		}
	return angle;
	}

/*
Collision
*/
function uuGetDistRectAndPoint(r,p)
	{
	var dst={};
	dst.x=0;
	dst.y=0;
	dst.xDir=1;
	dst.yDir=1;
	
	if (p.x < r.x){
		dst.x = r.x - p.x;
		dst.xDir = -1;
		}
	else if (p.x > r.x + r.w){
		dst.x = p.x - (r.x + r.w);
		dst.xDir = 1;
		}
	if (p.y < r.y){
		dst.y = r.y - p.y;
		dst.yDir = -1;
		}
	else if (p.y > r.y + r.h){
		dst.y = p.y - (r.y + r.h);
		dst.yDir = +1;
		}
	dst.sq = dst.x*dst.x + dst.y*dst.y;
	return dst;
	}

function uuIsCollisionRectAndCircle(c,r)
	{
	var dst = uuGetDistRectAndPoint(r,{x:c.cx,y:c.cy});
	if(dst.sq<=c.cr*c.cr)
		{
		dst.isCollision = true;
		}
	else
		{
		dst.isCollision = false;
		}
	return dst;
	}
function uuIsCollisionCircleAndCircle(c1,c2)
	{
	var dst={isCollision:false};
	dst.sq = Math.pow(c1.cx-c2.cx,2)+Math.pow(c1.cy-c2.cy,2);
	if(dst.sq<=Math.pow(c1.cr+c2.cr,2))
		{
		dst.isCollision = true;
		}
	else
		{
		dst.isCollision = false;
		}
	return dst;
	}


function uIsCollisionPointAndRect(p,r)
	{
	if(	
		(r.x	<= p.x)
	&&	(r.x+r.w>= p.x)
	&&	(r.y	<= p.y)
	&&	(r.y+r.h>= p.y)
		)
		{
		return true;
		}
	
	return false;
	
	}


/*
Debug
*/
function uuDebug(aStr)
	{
	$('#debug').text(aStr);
	}

