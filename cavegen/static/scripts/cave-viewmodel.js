function CaveViewModel()
{
	this.caveName = ko.observable("_");
	this.validatedCaveName = ko.computed(function()
	{
		var text = this.caveName();
		if (text == "")
		{
			return "_";
		}
		var regex = /[^a-zA-Z0-9_]/g;
		var validName = text.replace(regex, "");
		if (validName.length > 20)
		{
			validName = validName.substring(0, 20);
		}
		if (validName.Length < 1)
		{
			validName = "_";
		}
		return validName;
	}, this);
	this.caveWidth = ko.observable(40);
	this.caveHeight = ko.observable(40);
	this.terrainType = ko.observable("1"); 
	this.waterType = ko.observable("clear"); 
	this.changeController = new ChangeController();
	this.previousCursorPosition = { x: 1, y: 1 };
	this.previousCursorSize = -1;
	this.currentCursorSize = -1;
}

CaveViewModel.prototype.updateDimensions = function(cave)
{
	var width = this.caveWidth();
	var height = this.caveHeight();
	var border = getBorder(width, height);
	var tileSize = getTileSize(width, height);	

	grid = (cave == undefined) ? new Cave(width, height) : cave;
	caveView = new CaveView(width, height, tileSize, border);
	caveView.draw(grid); 
}

CaveViewModel.prototype.validateDimensions = function()
{	
	var validationReport = "";

	if (isNaN(this.caveWidth()))
	{
		this.caveWidth(40);
		validationReport += "Width must be an integer.\n";
	}
	if (isNaN(this.caveHeight()))
	{
		this.caveHeight(40);
		validationReport += "Height must be an integer.\n";
	}

	this.caveWidth(Math.round(this.caveWidth()));
	this.caveHeight(Math.round(this.caveHeight()));

	if (this.caveWidth() < 5)
	{
		this.caveWidth(5);
		validationReport += "Width too small. Must be at least 5.\n";
	}
	if (this.caveHeight() < 5)
	{
		this.caveHeight(5);
		validationReport += "Height too small. Must be at least 5.\n";
	}

	var area = this.caveWidth() * this.caveHeight();
	if (area > 8000)
	{
		this.caveWidth(89);
		this.caveHeight(89);
		validationReport += "Area too large. Must be no more than 8000.\n";
	}
	if (area < 256)
	{
		this.caveWidth(16);
		this.caveHeight(16);
		validationReport += "Area too small. Must be no less than 256.\n";
	}

	if (validationReport != "")
	{
		alert(validationReport);
		return false;
	}
	return true;
}

CaveViewModel.prototype.continuePaintingAtMousePosition = function(pixelX, pixelY) 
{
	var gridX = caveView.getGridX(pixelX);
	var gridY = caveView.getGridY(pixelY);

	if (gridX == this.previousCursorPosition.x && gridY == this.previousCursorPosition.y)
	{
		return
	}

	if (!grid.withinLimits(gridX, gridY))
	{		
		var x = (gridX < 0) ? 0 : ((gridX > this.width - 1) ? this.width - 1 : gridX);
		var y = (gridY < 0) ? 0 : ((gridY > this.height - 1) ? this.height - 1 : gridY);
		caveView.previousPaintedPoint = { x: x, y: y };
	}

	if (caveView.isMouseDown)
	{
		caveView.paintLineMode = true;
	}

	if (caveView.isMouseDown && grid.withinLimits(gridX, gridY))
	{
		this.applyBrushAtPosition(gridX, gridY, currentBrush);
	}

	if (grid.withinLimits(gridX, gridY))
	{
		this.updateCursor(gridX, gridY);
	}
}

CaveViewModel.prototype.startPaintingAtMousePosition = function(pixelX, pixelY) 
{
	caveView.isMouseDown = true;
	var gridX = caveView.getGridX(pixelX);
	var gridY = caveView.getGridY(pixelY);
	if (grid.withinLimits(gridX, gridY))
	{
		this.applyBrushAtPosition(gridX, gridY, currentBrush);
		caveView.paintLineMode = true;
	}   

	if (brushSize != lastUsedBrushSize)
	{
		lastUsedBrushSize = brushSize;
		_gaq.push(['_trackEvent', 'Painting', 'Use New Brush Size', this.caveName(), brushSize]);
	}
}

CaveViewModel.prototype.applyBrushAtPosition = function(x, y, brush)
{
	var tileChanges = this.getTileChanges(x, y, brush);
	grid.applyTileChanges(tileChanges);
	caveView.applyTileChanges(tileChanges);
	this.changeController.addTileChanges(tileChanges);
}

CaveViewModel.prototype.getTileChanges = function(column, row, brush)
{
	var currentPoint = { x: column, y: row };
	var tileChanges = [];

	if (caveView.paintLineMode)
	{
		var lineStart = caveView.previousPaintedPoint;
		var lineEnd = currentPoint;
		var positions = CaveNetwork.positionsBetweenPoints(lineStart, lineEnd)
		positions = positions.slice(1);
		for (var i = 0; i < positions.length; i++)
		{
			var newTileChanges = grid.getTileChangesFromBrush(positions[i].x, positions[i].y, brush);
			tileChanges = mergeTileChanges(tileChanges, newTileChanges);
		}
	}
	else
	{
		var newTileChanges = grid.getTileChangesFromBrush(column, row, brush);
		tileChanges = mergeTileChanges(tileChanges, newTileChanges);
	}
	caveView.previousPaintedPoint = currentPoint;
	return tileChanges;
}

CaveViewModel.prototype.finishPainting = function() 
{
	if (caveView.isMouseDown)
	{
		this.changeController.addPaintedLineChange();	
	}
	caveView.isMouseDown = false;
	caveView.paintLineMode = false; 
}

CaveViewModel.prototype.updateCursor = function(x, y)
{
	if (this.previousCursorSize != brushSize)
	{
		caveView.drawSquareOutline(this.previousCursorPosition.x, this.previousCursorPosition.y, 
									"#FFFFFF", this.previousCursorSize);		
		this.previousCursorSize = brushSize;
	}
	caveView.drawSquareOutline(this.previousCursorPosition.x, this.previousCursorPosition.y);
	caveView.drawCursor(x, y);
	this.previousCursorPosition = { x: x, y: y };	
	this.currentCursorSize = brushSize;
}

CaveViewModel.prototype.getCaveString = function()
{
	var caveString = "";
	caveString += this.validatedCaveName() + "\n";
	caveString += "terrain " + this.terrainType() + "\n";
	caveString += "background 1\n";
	caveString += "water " + this.waterType() + "\n";

	for (var i = 0; i < this.caveHeight(); i++)
	{
		for (var j = 0; j < this.caveWidth(); j++)
		{
			caveString += grid.getTileAtCoordinates(j, i).symbol;
		}
		caveString += "\n";
	}
	return caveString;
}

CaveViewModel.prototype.getUploadableCaveString = function()
{
	var caveString = this.getCaveString();
	return this.addMissingDoorAndStartingPosition(caveString);
}

CaveViewModel.prototype.addMissingDoorAndStartingPosition = function(caveString)
{
	if (caveString.indexOf("#") == -1)
	{
		caveString += "#";
	}
	if (caveString.indexOf("D") == -1)
	{
		caveString += "D";
	}
	return caveString;
}

CaveViewModel.prototype.generateCave = function()
{
	if (this.validateDimensions())
	{	
		this.changeController.addGenerateCaveChange();
		this.updateDimensions();
		_gaq.push(['_trackEvent', 'Generation', 'Generate Cave', "Width", this.caveWidth()]);
		_gaq.push(['_trackEvent', 'Generation', 'Generate Cave', "Height", this.caveHeight()]);
	}
}

CaveViewModel.prototype.loadCave = function(caveName, caveString)
{
	grid.rebuildCaveFromCaveString(caveString);
	this.caveName(caveName);
	this.caveWidth(grid.width);
	this.caveHeight(grid.height);
	this.updateDimensions(grid);
	this.changeController = new ChangeController();
}

CaveViewModel.prototype.undo = function()
{
	this.changeController.applyUndo();
}

CaveViewModel.prototype.redo = function()
{
    this.changeController.applyRedo();
}