function LinePainter(context)
{
	this.pixel = context.createImageData(1, 1);
	this.pixel.data[0] = 255;
	this.pixel.data[1] = 255;
	this.pixel.data[2] = 255;
	this.pixel.data[3] = 255;
}

LinePainter.prototype.setColour = function(colour)
{
	caveView.context.fillStyle = colour;
	var rgb = this.hexToRgb(colour);
	this.pixel.data[0] = rgb.r;
	this.pixel.data[1] = rgb.g;
	this.pixel.data[2] = rgb.b;
}

LinePainter.prototype.hexToRgb = function(hex) 
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
    {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

LinePainter.prototype.plotVerticalLine = function(x, y0, y1)
{
	var bigY = Math.max(y0, y1);
	var littleY = Math.min(y0, y1);
	caveView.context.fillRect(x, littleY, 1, bigY - littleY + 1);	
}

LinePainter.prototype.plotHorizontalLine = function(x0, x1, y)
{
	var bigX = Math.max(x0, x1);
	var littleX = Math.min(x0, x1);
	caveView.context.fillRect(littleX, y, bigX - littleX + 1, 1);	
}

LinePainter.prototype.plotLine = function(x0, y0, x1, y1)
{
	caveView.context.beginPath(); // Could boost performance by separating this call
	caveView.context.moveTo(x0, y0);
	caveView.context.lineTo(x1, y1);	
	caveView.context.stroke();
}

LinePainter.prototype.plotLineWithNoAntiAliasing = function(x0, y0, x1, y1)
{
	var dx =  Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
	var dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
	var err = dx + dy, e2;                                   

	for (;;)
	{                                                          
		this.setPixelWithNoAntiAliasing(x0, y0);
		if ((x0 == x1 && y0 == y1) || this.outOfBounds(x0, y0)) break;
		e2 = 2 * err;
		if (e2 >= dy) 
		{ 
			err += dy; 
			x0 += sx; 
		}                        
		if (e2 <= dx) 
		{ 
			err += dx;
			y0 += sy; 
		}                        
	}
}

LinePainter.prototype.outOfBounds = function(x, y)
{
	var xLimit = (caveView.width - 1) * caveView.tileSize + caveView.border.left;
	var yLimit = (caveView.height - 1) * caveView.tileSize + caveView.border.top;
	return (x < 0 || y < 0 || x > xLimit || y > yLimit);
}

LinePainter.prototype.setPixelWithNoAntiAliasing = function(x, y)
{
	caveView.context.putImageData(this.pixel, x, y);
}