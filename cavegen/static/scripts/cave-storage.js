function CaveStorage() 
{
	var initialCaveNames = this.loadAllCaveNames();
	this.caveNames = ko.observableArray(initialCaveNames);
	this.selectedCaveName = ko.observable("");
}

CaveStorage.prototype.loadCave = function(caveName)
{
	if (caveName == undefined || caveName == "")
	{
		return;
	}
	var caveString = localStorage["cavegen_" + caveName];
	_gaq.push(['_trackEvent', 'Storage', 'Load Cave', caveViewModel.caveName(), caveViewModel.caveWidth() * caveViewModel.caveHeight()]);
	caveViewModel.loadCave(caveName, caveString);
}

CaveStorage.prototype.loadAllCaveNames = function()
{
	var caveNames = [];
	for (var i = 0; i < localStorage.length; i++)
	{
		var key = localStorage.key(i);
		if (key.indexOf("cavegen_") == 0)
		{
			caveNames.push(key.substring(8));
		}
	}
	return caveNames;
}

CaveStorage.prototype.storeCave = function() 
{
	var caveName = caveViewModel.caveName();
	var caveString = caveViewModel.getCaveString();
	var addToCaveNameList = false;
	if (localStorage["cavegen_" + caveName] == undefined)
	{
		addToCaveNameList = true;		
	}

	localStorage["cavegen_" + caveName] = caveString;
	_gaq.push(['_trackEvent', 'Storage', 'Save Cave', caveViewModel.caveName(), caveViewModel.caveWidth() * caveViewModel.caveHeight()]);
	
	// The flag seems redundant, but need to make sure storage did not fail before 
	// adding the name to the list
	if (addToCaveNameList)
	{
		this.caveNames.push(caveName);
	}
}