function Zoomer(canvas) 
{
	this.canvas = canvas;
	this.context = canvas.getContext('2d');
	this.lastX = this.canvas.width / 2;
	this.lastY = this.canvas.height / 2;
	this.totalXTranslation = 0;
    this.totalYTranslation = 0;
	this.dragStart;
	this.panning = false;
	this.panningLeft = false;
	this.panningUp = false;
	this.panningRight = false;
	this.panningDown = false;
	this.canvas.addEventListener('DOMMouseScroll', function(evt) { this.handleScroll(evt) }.bind(this), false);
	this.canvas.addEventListener('mousewheel', function(evt) { this.handleScroll(evt) }.bind(this), false);

	this.canvas.addEventListener('mousedown', function(evt)
	{	
		if (evt.button == 1)
		{
			this.enablePanning();
		}
		if (this.panning)
		{
			document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
			this.lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft);
			this.lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop);
			this.dragStart = this.context.transformedPoint(this.lastX, this.lastY);
		}

	}.bind(this), false);

	this.canvas.addEventListener('mousemove', function(evt)
	{
		this.lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft);
		this.lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop);
		if (this.dragStart)
		{
			var point = this.context.transformedPoint(this.lastX, this.lastY);
			this.context.translate(point.x - this.dragStart.x, point.y - this.dragStart.y);
			this.totalXTranslation += (point.x - this.dragStart.x);
			this.totalYTranslation += (point.y - this.dragStart.y);
			this.redraw();
		}
	}.bind(this), false);

	this.canvas.addEventListener('mouseup', function(evt) 
	{ 
		if (evt.button == 1)
		{
			this.disablePanning();
		}
		this.dragStart = null; 
	}.bind(this), false);
}

Zoomer.zoomerInstance = null;

Zoomer.getZoomer = function(canvas)
{
	if (Zoomer.zoomerInstance == null)
	{
		Zoomer.zoomerInstance = new Zoomer(canvas);
	}
	var context = Zoomer.zoomerInstance.context;
	Zoomer.zoomerInstance.trackTransforms(context);
	Zoomer.zoomerInstance.totalXTranslation = 0;
	Zoomer.zoomerInstance.totalYTranslation = 0;
	return Zoomer.zoomerInstance;
}

Zoomer.prototype.redraw = function()
{
	var p1 = this.context.transformedPoint(0, 0);
	var p2 = this.context.transformedPoint(this.canvas.width, this.canvas.height);
	this.context.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
	caveView.draw(grid);
	var gridX = caveView.getGridX(this.lastX);
	var gridY = caveView.getGridY(this.lastY);
	caveViewModel.updateCursor(gridX, gridY);
}

Zoomer.prototype.trackTransforms = function(context)
{
	var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
	var xform = svg.createSVGMatrix();
	context.getTransform = function(){ return xform; };
	
	var savedTransforms = [];
	var save = context.save;
	context.save = function()
	{
		savedTransforms.push(xform.translate(0, 0));
		return save.call(context);
	}
	var restore = context.restore;
	context.restore = function()
	{
		xform = savedTransforms.pop();
		return restore.call(context);
	}
	var scale = context.scale;
	context.scale = function(sx, sy)
	{
		xform = xform.scaleNonUniform(sx, sy);
		return scale.call(context, sx, sy);
	}
	var rotate = context.rotate;
	context.rotate = function(radians)
	{
		xform = xform.rotate(radians * 180 / Math.PI);
		return rotate.call(context, radians);
	}
	var translate = context.translate;
	context.translate = function(dx, dy)
	{
		xform = xform.translate(dx, dy);
		return translate.call(context, dx, dy);
	}
	var transform = context.transform;
	context.transform = function(a, b, c, d, e, f)
	{
		var matrix = svg.createSVGMatrix();
		matrix.a = a;
		matrix.b = b;
		matrix.c = c;
		matrix.d = d; 
		matrix.e = e;
		matrix.f = f;
		xform = xform.multiply(matrix);
		return transform.call(context, a, b, c, d, e, f);
	}
	var setTransform = context.setTransform;
	context.setTransform = function(a, b, c, d, e, f)
	{
		xform.a = a;
		xform.b = b;
		xform.c = c;
		xform.d = d;
		xform.e = e;
		xform.f = f;
		return setTransform.call(context, a, b, c, d, e, f);
	}
	var point = svg.createSVGPoint();
	context.transformedPoint = function(x, y)
	{
		point.x = x; 
		point.y = y;
		return point.matrixTransform(xform.inverse());
	}
}

Zoomer.prototype.zoom = function(mouseWheelDelta)
{
	if (mouseWheelDelta >= 1)
	{
		caveView.multiplyScalingFactor(1 + (0.2 * mouseWheelDelta));
	}
	else
	{
		caveView.multiplyScalingFactor(1 / (1 + (0.2 * -mouseWheelDelta)));
	}

	var tilesBetweenMouseAndContextLeft = this.getNumberOfTilesFromContextLeft(this.lastX);
	var tilesBetweenMouseAndContextTop = this.getNumberOfTilesFromContextTop(this.lastY);
	caveView.scaleTileSize();
	var oldXContextMouseDistance = this.lastX - this.totalXTranslation;
	var oldYContextMouseDistance = this.lastY - this.totalYTranslation;
	var newXContextMouseDistance = caveView.tileSize * tilesBetweenMouseAndContextLeft;
	var newYContextMouseDistance = caveView.tileSize * tilesBetweenMouseAndContextTop;
	var xDifference = Math.round(newXContextMouseDistance - oldXContextMouseDistance);
	var yDifference = Math.round(newYContextMouseDistance - oldYContextMouseDistance);

	this.context.translate(-xDifference, -yDifference);
	this.totalXTranslation -= xDifference;
	this.totalYTranslation -= yDifference;

	this.redraw();
}

Zoomer.prototype.getNumberOfTilesFromContextLeft = function(mouseX)
{
	var distanceFromContextLeft = mouseX - this.totalXTranslation;
	return distanceFromContextLeft / caveView.tileSize;
}

Zoomer.prototype.getNumberOfTilesFromContextTop = function(mouseY)
{
	var distanceFromContextTop = mouseY - this.totalYTranslation;
	return distanceFromContextTop / caveView.tileSize;
}

Zoomer.prototype.handleScroll = function(evt)
{
	var delta = evt.wheelDelta ? 
				evt.wheelDelta / 40 : 
				(evt.detail ? -evt.detail : 0);
	if (delta)
	{ 
		var normalisedDelta = delta / Math.abs(delta);
		if (isNaN(normalisedDelta))
		{
			normalisedDelta = 0;
		}
		this.zoom(normalisedDelta);
	}
	return evt.preventDefault() && false;
}

Zoomer.prototype.transformPixelX = function(pixelX)
{
	var transformedPoint = this.context.transformedPoint(pixelX, 0);
	return transformedPoint.x;
}

Zoomer.prototype.transformPixelY = function(pixelY)
{
	var transformedPoint = this.context.transformedPoint(0, pixelY);
	return transformedPoint.y;
}

Zoomer.prototype.enablePanning = function()
{
	this.panning = true;
}

Zoomer.prototype.disablePanning = function()
{
	this.panning = false;
}

Zoomer.prototype.panLeft = function()
{
	if (this.totalXTranslation <= (caveView.tileSize * (caveView.width - 2)))
	{
		var shift = caveView.tileSize; 
		this.context.translate(shift, 0);
		this.totalXTranslation += shift;
		this.redraw();
	}
}

Zoomer.prototype.panRight = function()
{
	if (this.totalXTranslation >= -(caveView.tileSize * (caveView.width - 2)))
	{
		var shift = -caveView.tileSize; 
		this.context.translate(shift, 0);
		this.totalXTranslation += shift;
		this.redraw();
	}
}

Zoomer.prototype.panUp = function()
{
	if (this.totalYTranslation <= (caveView.tileSize * (caveView.height - 2)))
	{
		var shift = caveView.tileSize; 
		this.context.translate(0, shift);
		this.totalYTranslation += shift;
		this.redraw();
	}
}

Zoomer.prototype.panDown = function()
{
	if (this.totalYTranslation >= -(caveView.tileSize * (caveView.height - 2)))
	{
		var shift = -caveView.tileSize; 
		this.context.translate(0, shift);
		this.totalYTranslation += shift;
		this.redraw();
	}
}

Zoomer.prototype.startPanningLeft = function()
{
	if (!this.panningLeft)
	{
		setTimeout(function() { this.continuePanningLeft(); }.bind(this), 10);
	}
	this.panningLeft = true;
}

Zoomer.prototype.continuePanningLeft = function()
{
	if (this.panningLeft)
	{
		this.panLeft();
		setTimeout(function() { this.continuePanningLeft(); }.bind(this), 10);
	}
}

Zoomer.prototype.stopPanningLeft = function()
{
	this.panningLeft = false;
}

Zoomer.prototype.startPanningUp = function()
{
	if (!this.panningUp)
	{
		setTimeout(function() { this.continuePanningUp(); }.bind(this), 10);
	}
	this.panningUp = true;
}

Zoomer.prototype.continuePanningUp = function()
{
	if (this.panningUp)
	{
		this.panUp();
		setTimeout(function() { this.continuePanningUp(); }.bind(this), 10);
	}
}

Zoomer.prototype.stopPanningUp = function()
{
	this.panningUp = false;
}

Zoomer.prototype.startPanningRight = function()
{
	if (!this.panningRight)
	{
		setTimeout(function() { this.continuePanningRight(); }.bind(this), 10);
	}
	this.panningRight = true;
}

Zoomer.prototype.continuePanningRight = function()
{
	if (this.panningRight)
	{
		this.panRight();
		setTimeout(function() { this.continuePanningRight(); }.bind(this), 10);
	}
}

Zoomer.prototype.stopPanningRight = function()
{
	this.panningRight = false;
}

Zoomer.prototype.startPanningDown = function()
{
	if (!this.panningDown)
	{
		setTimeout(function() { this.continuePanningDown(); }.bind(this), 10);
	}
	this.panningDown = true;
}

Zoomer.prototype.continuePanningDown = function()
{
	if (this.panningDown)
	{
		this.panDown();
		setTimeout(function() { this.continuePanningDown(); }.bind(this), 10);
	}
}

Zoomer.prototype.stopPanningDown = function()
{
	this.panningDown = false;
}