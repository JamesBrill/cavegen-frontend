var CaveNetwork = function() {}

CaveNetwork.positionsBetweenPoints = function(first, second)
{
	var iterations = Math.max(Math.abs(first.x - second.x), Math.abs((first.y - second.y)));
	var xDifference = second.x - first.x;
	var yDifference = second.y - first.y;
	var distance = Math.sqrt(xDifference * xDifference + yDifference * yDifference);
	var xDirectionComponent = xDifference / distance;
	var yDirectionComponent = yDifference / distance;

	var positions = new Array();
	for (var i = 0.0; i <= 1.0; i += (1.0 / iterations))
	{
		if (distance == 0.0)
		{
			positions.push(first);
		}
		else
		{
			var intermediateXCoordinate = Math.round(first.x + xDirectionComponent * distance * i);
			var intermediateYCoordinate = Math.round(first.y + yDirectionComponent * distance * i);

			positions.push({ x: intermediateXCoordinate, y: intermediateYCoordinate});
		}
	}
	return positions;
}