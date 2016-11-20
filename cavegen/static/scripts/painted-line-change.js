function PaintedLineChange() 
{
    this.tileChanges = [];
}

PaintedLineChange.prototype.addTileChange = function(tileChange)
{
    // This filthy code is to get Undo/Redo to work with Spike Digger. It finds pairs like (Terrain, DownSpike)
    // when given a (DownSpike, Space) pair and merges them together into (Terrain, Space). It basically wipes
    // out the intermediate "CleanUpSpikes" step, which we don't want the user to see when using Undo/Redo.
    var matchingChanges = [];
    for (var i = 0; i < this.tileChanges.length; i++) 
    {
        if (this.tileChanges[i].x == tileChange.x && 
            this.tileChanges[i].y == tileChange.y && 
            this.tileChanges[i].after == tileChange.before)
        {
            matchingChanges.push(this.tileChanges[i]);
        }
    }
    if (matchingChanges.length > 0)
    {
        var merger = matchingChanges[0];
        this.removeChanges(matchingChanges);

        tileChange = new TileChange(tileChange.x, 
                                    tileChange.y, 
                                    merger.before, 
                                    tileChange.after);
    }
    this.tileChanges.push(tileChange);
}
    
// Returns true if not all TileChanges change a tile from one type back to that same type again 
PaintedLineChange.prototype.hasEffect = function()
{
    var hasEffect = false;
    var ineffectiveChanges = [];
    for (var i = 0; i < this.tileChanges.length; i++) 
    {
        var tileChange = this.tileChanges[i];
        if (tileChange.before != tileChange.after)
        {
            hasEffect = true;
        }
        else
        {
            ineffectiveChanges.push(tileChange);
        }
    }

    this.removeChanges(ineffectiveChanges);
    return hasEffect;
}

PaintedLineChange.prototype.equals = function(other)
{
    if (!other || !(other instanceof PaintedLineChange))
    {
        return false;
    }

    if (this.tileChanges.length != other.tileChanges.length)
    {
        return false;
    }

    for (var i = 0; i < this.tileChanges.length; i++) 
    {
        if (this.tileChanges[i] != other.tileChanges[i])
        {
            return false;
        }
    }
    return true;
}

PaintedLineChange.prototype.removeChanges = function(changes)
{
    var indexesOfChangesToRemove = [];
    var offset = 0;
    for (var i = 0; i < this.tileChanges.length; i++) 
    {
        if ($.inArray(this.tileChanges[i], changes) !== -1)
        {
            indexesOfChangesToRemove.push(i - offset);
            offset++;
        }
    }
    for (var i = 0; i < indexesOfChangesToRemove.length; i++) 
    {
        var index = indexesOfChangesToRemove[i];
        this.tileChanges.splice(index, 1);
    }    
}
