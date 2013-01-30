(function () {
	var viewBankruptcies = function () {
		chrome.tabs.create({
			url: chrome.extension.getURL('index.html')
		});
	};
	var declareBankruptcy = function (tabs) {
		var the_goods = {
			timestamp: new Date().getTime(),
			tabs: tabs
		};
		var bankruptcies = JSON.parse(localStorage.getItem("bankruptcies") || "[]");
		bankruptcies.push(the_goods);
		localStorage.setItem("bankruptcies", JSON.stringify(bankruptcies));
		viewBankruptcies();
		chrome.tabs.remove(_.pluck(tabs, "id"));
	};

	$("button#declare").click(function () {
		chrome.tabs.query({ pinned: false }, declareBankruptcy);
	});
	$("div#view a").click(viewBankruptcies);
}).call(this);
