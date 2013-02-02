(function () {
	var root = this;
	var _ = root._;

	// Set up namespace.
	var TB = {};

	// Represents a single tab.
	TB.Tab = function (raw, bankruptcy) {
		this.raw = raw; // Raw JSON from Chrome API
		this.bankruptcy = bankruptcy; // Parent bankruptcy
	};

	TB.Tab.prototype = {
		// For JSON.stringify
		toJSON: function () {
			return this.raw;
		},
		toTSV: function () {
			var raw = this.raw;
			return [ this.bankruptcy.timestamp, raw.windowId, raw.index, raw.id, raw.url, raw.title, raw.favIconUrl, raw.pinned, raw.highlighted, raw.incognito ].join("\t");
		},
		toHTML: function () {
			var raw = this.raw;
			return "<div class='tab'><img class='favicon' src='" + raw.favIconUrl + "'><a target='_blank' href='" + raw.url + "'>" + raw.title + "</a></div>";
		}
	};

	// Represents a single bankruptcy.
	TB.Bankruptcy = function (raw) {
		var _this = this;
		this.raw = raw;
		this.timestamp = raw.timestamp;
		this.tabs = _.map(raw.tabs, function (t, i) {
			return new TB.Tab(t, _this);
		});
	};

	TB.Bankruptcy.prototype = {
		// For JSON.stringify
		toJSON: function () {
			return this.raw;
		},
		toTSV: function () {
			return _.map(this.tabs, function (t, i) {
				return t.toTSV();
			}).join("\n");
		},
		toHTML: function () {
			var section_header_html = "<h3 class='section-header'><span class='timestamp'>" + moment(this.timestamp).calendar() + "</span><span class='number-of-tabs'> &mdash; " + this.tabs.length + " tab" + (this.tabs.length === 1 ? "" : "s") + " bankrupted</span></h3>";
			var tab_html = _.map(this.tabs, function (t, i) {
				return t.toHTML();
			}).join("");
			return "<section class='bankruptcy'>" + section_header_html + "<div class='tabs'>" + tab_html + "</div></section>";	
		}
	};

	// Holds a group of TB.Bankruptcy objects, and handles storage.
	TB.Bank = function (localStorageKey) {
		this.localStorageKey = localStorageKey;	
	};

	TB.Bank.prototype = {
		load: function () {
			var raw = JSON.parse(localStorage.getItem(this.localStorageKey) || "[]").reverse();
			this.bankruptcies = _.map(_.compact(raw), function (b, i) {
				return new TB.Bankruptcy(b);
			});
			return this;
		},
		save: function () {
			localStorage.setItem(this.localStorageKey, JSON.stringify(this.bankruptcies));
			return this;
		},
		clear: function () {
			this.bankruptcies = [];
			this.save();
		},
		// For JSON.stringify
		toJSON: function () {
			return this.bankruptcies;
		},
		toTSV: function () {
			var header = [ "bankruptcy_timestamp", "window_id", "tab_index", "tab_id", "url", "title", "favicon", "pinned", "highlighted", "incognito"].join("\t");
			var data = _.map(this.bankruptcies, function (b, i) {
				return b.toTSV();
			});
			return header + "\n" + data;
		},
		toHTML: function () {
			return _.map(this.bankruptcies, function (b, i) {
				return b.toHTML();
			}).join("");
		}

	};
	
	// Make namespace global.
	root.TB = TB;
}).call(this);
