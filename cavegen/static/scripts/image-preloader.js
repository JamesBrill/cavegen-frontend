function ImagePreloader() {}

ImagePreloader.imageMap = [];

ImagePreloader.preloadImages = function()
{
	ImagePreloader.preloadImageLoop(0);
}

ImagePreloader.preloadImageLoop = function(index)
{
	var fileName = TileUtils.tileMap[index].fileName;
	var image = new Image();
    image.onload = function() 
    {
        ImagePreloader.imageMap.push({ fileName: fileName, image: this});
        index++;

        if(index < TileUtils.tileMap.length) 
        {
            ImagePreloader.preloadImageLoop(index);
        }
    }	
	image.src = "images/" + fileName + ".png";	
}

ImagePreloader.getImageFromFileName = function(fileName)
{
	for (var i = 0; i < ImagePreloader.imageMap.length; i++) 
	{
		if (ImagePreloader.imageMap[i].fileName == fileName)
		{
			return ImagePreloader.imageMap[i].image;
		}
	}
	console.log("Attempted to get image from invalid filename: " + fileName + ".");
}