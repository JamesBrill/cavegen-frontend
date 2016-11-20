var CaveView = function(x, y, tileSize, border)
{
	this.location = { x: 0, y: 0 };
	this.tileSize = tileSize;
	this.unscaledTileSize = tileSize;
	this.border = (border == undefined) ? { top: 0, left: 0 } : border;
	this.leftBorder = function()
	{
		return Math.round(this.border.left * this.scalingFactor);	
	}
	this.topBorder = function()
	{
		return Math.round(this.border.top * this.scalingFactor);	
	}
	this.pixelWidth = CAVE_DISPLAY_WIDTH;
	this.pixelHeight = CAVE_DISPLAY_HEIGHT;
	this.width = x;
	this.height = y;
	this.canvas = document.getElementById("caveGridCanvas");
	this.canvas.width = this.pixelWidth;
	this.canvas.height = this.pixelHeight;
	this.context = this.canvas.getContext("2d");
	this.previousPaintedPoint = { x: -1, y: -1 };
	this.paintLineMode = false;
	this.isMouseDown = false;
	this.linePainter = new LinePainter(this.context);
	this.zoomer = Zoomer.getZoomer(this.canvas);
	this.scalingFactor = 1;
	this.MIN_SCALING_FACTOR = 1;
	this.MAX_SCALING_FACTOR = this.setMaxScalingFactor();
}

CaveView.prototype.draw = function(gridModel)
{
	this.drawMeasuringGrid();
	for (var i = 0; i < this.width; i++)
	{
		for (var j = 0; j < this.height; j++)
		{
			this.drawAtGridCoordinates(i, j, gridModel.getTileAtCoordinates(i, j));
		}
	}
}

CaveView.prototype.drawMeasuringGrid = function()
{
	var view = this;
	var offset = view.tileSize;
	this.linePainter.setColour("#FFFFFF");
	for (var i = 1; i < this.width; i++) 
	{
		var x = i * view.tileSize + this.leftBorder();
		this.linePainter.plotVerticalLine(x, view.topBorder() + offset,  
			view.topBorder() + view.height * view.tileSize - offset);
	}

	for (var i = 1; i < this.height; i++) 
	{
		var y = i * view.tileSize + view.topBorder();
		this.linePainter.plotHorizontalLine(view.leftBorder() + offset,  
			view.leftBorder() + view.width * view.tileSize - offset, y);
	}
}

CaveView.prototype.drawAtGridCoordinates = function(x, y, tile)
{
	var view = this;
	var left = x * view.tileSize + view.leftBorder();
	var top = y * view.tileSize + view.topBorder();
	var size = view.tileSize;
	if (tile.symbol == 'x')
	{
		this.drawSquare(left, top, size, "gray");
	}
	else if (tile.symbol == ' ')
	{
		this.drawSquare(left, top, size, "black");	
	}
	else
	{
		this.drawImage(left, top, size, tile.fileName);
	}
}

CaveView.prototype.drawSquare= function(left, top, size, colour)
{
	this.context.beginPath();
	this.context.rect(left + 1, top + 1, size - 1, size - 1);
	this.context.fillStyle = colour;
	this.context.fill();		
}

CaveView.prototype.drawImage = function(left, top, size, fileName)
{
	var image = ImagePreloader.getImageFromFileName(fileName);
	this.context.drawImage(image, left + 1, top + 1, size - 1, size - 1);
}	

CaveView.prototype.getGridX = function(pixelX)
{
	pixelX = this.zoomer.transformPixelX(pixelX);
	pixelX -= this.leftBorder();
	return ((pixelX - (pixelX % this.tileSize)) / this.tileSize);   
}

CaveView.prototype.getGridY = function(pixelY)
{
	pixelY = this.zoomer.transformPixelY(pixelY);
	pixelY -= this.topBorder();	
	return ((pixelY - (pixelY % this.tileSize)) / this.tileSize);   
}

CaveView.prototype.applyTileChanges = function(tileChanges)
{
	for (var i = 0; i < tileChanges.length; i++) 
	{
		this.drawAtGridCoordinates(tileChanges[i].x, tileChanges[i].y, tileChanges[i].after);
	}
}

CaveView.prototype.drawCursor = function(column, row)
{
	this.drawSquareOutline(column, row, "#FF0000");
}

CaveView.prototype.drawSquareOutline = function(column, row, colour, previousCursorSize)
{
	if (colour == undefined)
	{
		colour = "#FFFFFF";
	}
	column = Math.min(Math.max(column, 1), this.width - 2);
	row = Math.min(Math.max(row, 1), this.height - 2);
	var squareSize = (previousCursorSize == undefined) ? brushSize : previousCursorSize;
	var unboundedTop = (row - Math.floor(squareSize / 2)) * this.tileSize + this.topBorder();
	var unboundedLeft = (column - Math.floor(squareSize / 2)) * this.tileSize + this.leftBorder();
	var unboundedBottom = unboundedTop + squareSize * this.tileSize;
	var unboundedRight = unboundedLeft + squareSize * this.tileSize;
	var top = Math.max(unboundedTop, this.topBorder() + this.tileSize);
	var left = Math.max(unboundedLeft, this.leftBorder() + this.tileSize);
	var bottom = Math.min(unboundedBottom, this.topBorder() + this.tileSize * (this.height - 1));
	var right = Math.min(unboundedRight, this.leftBorder()  + this.tileSize * (this.width - 1));

	this.linePainter.setColour(colour);
	this.linePainter.plotVerticalLine(left, top, bottom);
	this.linePainter.plotHorizontalLine(left, right, bottom);
	this.linePainter.plotVerticalLine(right, bottom, top);
	this.linePainter.plotHorizontalLine(right, left, top);
}

CaveView.prototype.paintPositions = function(paintedPositions)
{
	for (var i = 0; i < paintedPositions.length; i++) 
	{
		this.drawAtGridCoordinates(paintedPositions[i].x, paintedPositions[i].y, paintedPositions[i].brush);
	}
}

CaveView.prototype.setMaxScalingFactor = function()
{
	var largestDimension = Math.max(this.width, this.height);
	return 3 + (largestDimension / 10) * 1.5;
}

CaveView.prototype.multiplyScalingFactor = function(coefficient)
{
	this.scalingFactor *= coefficient;
	this.boundScalingFactor();
}

CaveView.prototype.boundScalingFactor = function()
{
	if (this.scalingFactor < this.MIN_SCALING_FACTOR)
	{
		this.scalingFactor = this.MIN_SCALING_FACTOR;
	}
	if (this.scalingFactor > this.MAX_SCALING_FACTOR)
	{
		this.scalingFactor = this.MAX_SCALING_FACTOR;
	}
}

CaveView.prototype.scaleTileSize = function()
{
	this.tileSize = Math.round(this.scalingFactor * this.unscaledTileSize);
}