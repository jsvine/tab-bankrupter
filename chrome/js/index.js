(function () {
	var renderBankruptcies = function (bank, $main) {
		var html = bank.bankruptcies.length ? bank.toHTML() : "<h1 class='no-bankruptcies'>No bankruptcies to report.</h1>";
		$main.html(html);
	};

	var setupEvents = function (bank, $header) {
		$header.find("#clear-all").click(function () {
			bank.clear();
			renderBankrupties(bank);
		});

		$header.find("#export-json").click(function () {
			chrome.tabs.create({
				url: "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bank.toJSON()))
			});
		});

		$header.find("#export-tsv").click(function () {
			chrome.tabs.create({
				url: "data:text/plain;charset=utf-8," + encodeURIComponent(bank.toTSV())
			});
		});
	};

	var bank = new TB.Bank("bankruptcies").load();
	var $main = $("#main");
	var $header = $("header");
	renderBankruptcies(bank, $main);
	setupEvents(bank, $header);
}).call(this);
