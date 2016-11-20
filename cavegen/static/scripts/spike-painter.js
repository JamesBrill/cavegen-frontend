function SpikePainter() {}

SpikePainter.prototype.getTileFromSpikeFiller = function(row, column)
{
    if (grid.getTileAtCoordinates(column, row).symbol != ' ')
    {
        return grid.getTileAtCoordinates(column, row);
    }

    if (grid.getTileAtCoordinates(column, row - 1).symbol == 'x')
    {
        return TileUtils.getTileFromSymbol('w');
    }

    if (grid.getTileAtCoordinates(column, row + 1).symbol == 'x')
    {
        return TileUtils.getTileFromSymbol('m');
    }

    return TileUtils.getTileFromSymbol(' ');
}

SpikePainter.prototype.getTileFromSpikeRemover = function(row, column)
{
    if (grid.getTileAtCoordinates(column, row).symbol != 'w' && grid.getTileAtCoordinates(column, row).symbol != 'm')
    {
        return grid.getTileAtCoordinates(column, row);
    }
    return TileUtils.getTileFromSymbol(' ');
}