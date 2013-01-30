(function () {
	var bankruptcies = JSON.parse(localStorage.getItem("bankruptcies") || "[]").reverse();

	var template = function (bankruptcies) {
		// Gah, Chrome extensions aren't allowed to execute `eval`, and hence can't use _.template.
		var html = _.map(bankruptcies, function (b, i) {
			var tab_html = _.map(b.tabs, function (tab, j) {
				return "<div class='tab'><img class='favicon' src='" + tab.favIconUrl + "'><a target='_blank' href='" + tab.url + "'>" + tab.title + "</a></div>";
			}).join("");
			var section_header_html = "<h3 class='section-header'><span class='timestamp'>" + moment(b.timestamp).calendar() + "</span><span class='number-of-tabs'> &mdash; " + b.tabs.length + " tab" + (b.tabs.length === 1 ? "" : "s") + " bankrupted</span></h3>"
			return "<section class='bankruptcy'>" + section_header_html + "<div class='tabs'>" + tab_html + "</div></section>";	
		}).join("");
		return html;
	}; 


	$("#main").html(template(bankruptcies));
}).call(this);
