(function () {
	var bankruptcies = JSON.parse(localStorage.getItem("bankruptcies") || "[]").reverse();

	var template = function (bankruptcies) {
		if (!bankruptcies.length) {
			return "<h1 class='no-bankruptcies'>No bankruptcies to report.</h1>";
		}

		// Gah, Chrome extensions aren't allowed to execute `eval`, and so can't use _.template.
		var html = _.map(bankruptcies, function (b, i) {
			var tab_html = _.map(b.tabs, function (tab, j) {
				return "<div class='tab'><img class='favicon' src='" + tab.favIconUrl + "'><a target='_blank' href='" + tab.url + "'>" + tab.title + "</a></div>";
			}).join("");
			var section_header_html = "<h3 class='section-header'><span class='timestamp'>" + moment(b.timestamp).calendar() + "</span><span class='number-of-tabs'> &mdash; " + b.tabs.length + " tab" + (b.tabs.length === 1 ? "" : "s") + " bankrupted</span></h3>"
			return "<section class='bankruptcy'>" + section_header_html + "<div class='tabs'>" + tab_html + "</div></section>";	
		}).join("");
		return html;
	}; 

	var renderBankrupties = function (bankruptcies) {
		$("#main").html(template(bankruptcies));
	};

	$("#clear-all").click(function () {
		bankruptcies = [];
		localStorage.setItem("bankruptcies", JSON.stringify(bankruptcies));
		renderBankrupties(bankruptcies);
	});

	$("#export-json").click(function () {
		chrome.tabs.create({
			url: "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bankruptcies))
		});
	});
	$("#export-tsv").click(function () {
		var header = [ "bankruptcy_timestamp", "window_id", "tab_index", "tab_id", "url", "title", "favicon", "pinned", "highlighted", "incognito"].join("\t");
		chrome.tabs.create({
			url: "data:text/plain;charset=utf-8," + encodeURIComponent(header + "\n" + _.map(bankruptcies, function (b, i) {
				return _.map(b.tabs, function (t, j) {
					return [ b.timestamp, t.windowId, t.index, t.id, t.url, t.title, t.favIconUrl, t.pinned, t.highlighted, t.incognito ].join("\t");
				}).join("\n");
			}).join("\n"))
		});
	});

	renderBankrupties(bankruptcies);
}).call(this);
