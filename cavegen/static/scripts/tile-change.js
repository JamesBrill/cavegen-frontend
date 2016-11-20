function TileChange(xCoordinate, yCoordinate, before, after)
{
	this.x = xCoordinate;
    this.y = yCoordinate;
    this.before = before;
    this.after = after;
}

TileChange.prototype.equals = function(other) 
{
	if (!other)	{ return false;	}

	return this.x == other.x && this.y == other.y &&
			this.before == other.before && this.after == other.after;
}