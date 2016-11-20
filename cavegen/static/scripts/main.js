var width = 40;
var height = 40;
var grid;
var caveView;
var caveViewModel;
var caveStorage;
var currentBrush;
var brushSize = 1;
var lastUsedBrushSize = 0;
var CAVE_DISPLAY_WIDTH = 1000;
var CAVE_DISPLAY_HEIGHT = 800;
var client;

$(document).ready(function () 
{  
	var init = function()
	{
		ImagePreloader.preloadImages();
		grid = new Cave(width, height);
		var tileSize = getTileSize(width, height);	
		var border = getBorder(width, height);
		caveView = new CaveView(width, height, tileSize, border);
		caveView.draw(grid); 
		caveViewModel = new CaveViewModel();
		caveStorage = new CaveStorage();
		EventListenerBuilder.addMouseEventListeners();
		EventListenerBuilder.addKeyboardEventListeners();
		initCopyToClipboardButton();
		ko.applyBindings(new PaletteViewModel(), $('#palette-container')[0]);
		ko.applyBindings(caveViewModel, $('#cave-settings')[0]);
		ko.applyBindings(caveViewModel, $('#undo-redo')[0]);
		ko.applyBindings(caveStorage, $('#load')[0]);
		ko.applyBindings(caveStorage, $('#save')[0]);
		currentBrush = { fileName: "terrain", symbol: "x" };
		initBrushSizeSlider();
	}

	var initCopyToClipboardButton = function()
	{
		var client = new ZeroClipboard($('#copyToClipboard'));
		client.on('ready', function(event) 
		{
			client.on('copy', function(event) 
			{
				var caveText = caveViewModel.getUploadableCaveString();
				event.clipboardData.setData('text/plain', caveText);
				_gaq.push(['_trackEvent', 'Copying', 'Copy To Clipboard', caveViewModel.caveName(), 
							caveViewModel.caveWidth() * caveViewModel.caveHeight()]);
			});
		});

		client.on( 'error', function(event) 
		{
			ZeroClipboard.destroy();
		});
	}

	var initBrushSizeSlider = function()
	{
		$("#brushSizeSlider").slider({
			value:1,
			min: 1,
			max: 6,
			step: 1,
			width: 100,
			slide: function( event, ui ) 
			{
				$("#brushSizeText").html("Brush size: " + ui.value);
				brushSize = ui.value;
			}
		});
		$("#brushSizeText").html("Brush size: " + $("#brushSizeSlider").slider("value"));
	}

	init();
});