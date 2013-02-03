(function () {
	// Opens the main HTML page, which shows all bankruptcies.
	var viewBankruptcies = function () {
		chrome.tabs.create({
			url: chrome.extension.getURL("pages/index.html")
		});
	};

	// Saves data about open tabs, and then closes them.
	var declareBankruptcy = function (tabs) {
		// Don't bankrupt Chrome URLs or data URIs.
		var REJECTOR = /^(data|chrome):/;
		tabs = _.compact(_.reject(tabs, function (t) {
			return REJECTOR.test(t.url);
		}));
		
		// Pour Chrome's "Tab" objects into our own representation.
		var bankruptcy = new TB.Bankruptcy({
			timestamp: new Date().getTime(),
			tabs: tabs
		});

		// Setup/get localStorage.
		var bank = new TB.Bank("bankruptcies").load();
		// Add new bankruptcies, and save.
		bank.bankruptcies.push(bankruptcy);
		bank.save();

		// Open the bankruptcy-viewer page.
		viewBankruptcies();

		// Close all saved tabs.
		chrome.tabs.remove(_.pluck(tabs, "id"));
	};

	var setupEvents = function ($main) {
		// Declare bankruptcy on all non-pinned tabs.
		$main.find("button#declare").click(function () {
			chrome.tabs.query({
				pinned: false
			}, declareBankruptcy);
		});

		// View previously-bankrupted tabs without 
		// declaring bankruptcy
		$main.find("#view a").click(viewBankruptcies);
	};

	var $main = $("#main");
	setupEvents($main);
}).call(this);
