// change underscore to use {{ }}
_.templateSettings = {
	evaluate : /\{\[([\s\S]+?)\]\}/g,
	interpolate : /\{\{([\s\S]+?)\}\}/g
};

window.daily = new Marionette.Application();

daily.addRegions({
    main: ".announcements",
    filters: ".filters"
});

var announcement = Backbone.Model.extend({
	defaults: {
		title: "",
		body: ""
	}
});

var announcementCollection = Backbone.Collection.extend({
	model: announcement,
	comparator: "startDate"
});

var singleAnnouncement = Backbone.Marionette.ItemView.extend({
	template: "#singleAnnouncement",
	tagName: "li"
});
var announcementsList = Backbone.Marionette.CollectionView.extend({
	tagName: "ul",
	itemView: singleAnnouncement
});

var filters = Backbone.Marionette.ItemView.extend({
	template: "#filterList",
	events: {
		"click a": "filterClicked"
	},
	filterClicked: function(e) {
		e.preventDefault();

		$(e.currentTarget).addClass("active");
		$(e.currentTarget).siblings().removeClass("active");

		var division = $(e.currentTarget).data("division");
		if(division === "Community") {
			daily.trigger("filter");			
		} else {
			daily.trigger("filter", division);			
		}
	}
});

var filterView = new filters();

daily.on("filter", function(division) {

	var filteredData;
	
	filteredData = _.filter(data, function(item) {
		return item.division.indexOf(division) !== -1;
	});			

	var dailyCollection = new announcementCollection(filteredData);
	var dailyCollectionView = new announcementsList({
		collection: dailyCollection
	});
	dailyCollectionView.$el.prepend("<div class='counter'>" + filteredData.length + " announcements for " + division + "</div>");
	daily.main.show(dailyCollectionView);
});

daily.filters.show(filterView);

daily.trigger("filter", "HS");

daily.start();