function EventListenerBuilder() {}

EventListenerBuilder.addMouseEventListeners = function()
{
	caveView.canvas.addEventListener("mousemove", function (event) 
	{
		var pixelX = event.pageX - this.offsetLeft - this.offsetParent.offsetLeft;
		var pixelY = event.pageY - this.offsetTop - this.offsetParent.offsetTop;
		caveViewModel.continuePaintingAtMousePosition(pixelX, pixelY);
	});

	caveView.canvas.addEventListener("mousedown", function (event) 
	{
		if (!caveView.zoomer.panning)
		{
			var pixelX = event.pageX - this.offsetLeft - this.offsetParent.offsetLeft;
			var pixelY = event.pageY - this.offsetTop - this.offsetParent.offsetTop;
			caveViewModel.startPaintingAtMousePosition(pixelX, pixelY);     
		}   
	});

	caveView.canvas.addEventListener("mouseup", function (event) 
	{
		caveViewModel.finishPainting();
	});

	caveView.canvas.addEventListener("mouseleave", function (event) 
	{
		caveViewModel.finishPainting();
		caveViewModel.previousCursorSize = caveViewModel.currentCursorSize;
	});
}

EventListenerBuilder.addKeyboardEventListeners = function()
{
	EventListenerBuilder.addCommandKeyBindings();
	EventListenerBuilder.addTileKeyBindings();
	EventListenerBuilder.addPanningKeyBindings();
}

EventListenerBuilder.addCommandKeyBindings = function()
{	
	$(document).bind('keydown', 'shift+z', function() { caveViewModel.undo(); });
	$(document).bind('keydown', 'shift+y', function() { caveViewModel.redo(); });
	$(document).bind('keydown', 'shift+g', function() { caveViewModel.generateCave(); });
	$(document).bind('keydown', 'shift+s', function() { caveStorage.storeCave(); });	
	$(document).bind('keydown', 'ctrl', function() { caveView.zoomer.enablePanning(); });	
	$(document).bind('keyup', 'ctrl', function() { caveView.zoomer.disablePanning(); });
}

EventListenerBuilder.addTileKeyBindings = function()
{
	$(document).bind('keydown', 's', function() { currentBrush = TileUtils.getTileFromSymbol(' '); });

	$('body').keypress(function(e)
	{
		var keyPressed = String.fromCharCode(e.which);
		if (TileUtils.isTile(keyPressed))
		{
			currentBrush = TileUtils.getTileFromSymbol(keyPressed);
		}
	});	
}

EventListenerBuilder.addPanningKeyBindings = function()
{
	window.onkeydown = function(e)
	{
		if (e.which == 37)
		{
			caveView.zoomer.startPanningLeft();
		}
		if (e.which == 38)
		{
			caveView.zoomer.startPanningUp();
		}
		if (e.which == 39)
		{
			caveView.zoomer.startPanningRight();
		}
		if (e.which == 40)
		{
			caveView.zoomer.startPanningDown();
		}
	}

	window.onkeyup = function(e)
	{
		if (e.which == 37)
		{
			caveView.zoomer.stopPanningLeft();
		}
		if (e.which == 38)
		{
			caveView.zoomer.stopPanningUp();
		}
		if (e.which == 39)
		{
			caveView.zoomer.stopPanningRight();
		}
		if (e.which == 40)
		{
			caveView.zoomer.stopPanningDown();
		}
	}
}