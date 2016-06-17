(function () {
	var renderBankruptcies = function (bank, $main) {
		var html = bank.bankruptcies.length ? bank.toHTML() : "<h1 class='no-bankruptcies'>No bankruptcies to report.</h1>";
		$main.html(html);
	};

	var setupEvents = function (bank, $main, $header) {
		$header.find("#clear-all").click(function () {
			bank.clear();
			renderBankruptcies(bank, $main);
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

		$(".reopen-bankruptcy").click(function () {
			var bankruptcy_id = $(this).data("bankruptcy-id");
			var restored_bankruptcy = _.find(bank.bankruptcies, function(bankruptcy) {
				if(bankruptcy.id === bankruptcy_id) {
					return bankruptcy;
				}
			});

			_.each(restored_bankruptcy.tabs, function (tab) {
				chrome.tabs.create({ url: tab.raw.url });
			});
		});
	};

	var bank = new TB.Bank("bankruptcies").load();
	var $main = $("#main");
	var $header = $("header");
	renderBankruptcies(bank, $main);
	setupEvents(bank, $main, $header);
}).call(this);
