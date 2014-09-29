/** Main function (used as a callback) **/
var main = (function(){
	return function(currentTab) {
		var form, keywords, tpcURL, fields;

		form = $("#search");
		
		fields = {
			keywords: form.find('#keywords')
		};
		
		fields = $.fn.extend(fields, {
			description: form.find('#description'),
			categories: form.find('#categories'),
			condition: form.find('#condition'),
			warranty: form.find('#warranty'),
			priceMin: form.find('#priceMin'),
			priceMax: form.find('#priceMax'),
			sortBy: form.find('#sortBy'),
			sortOrder: form.find('#sortOrder'),
			isBuying: form.find('#isBuying')
		});
		
		/********************* 
		<-- BEGIN HOUSEKEEPING
		 ********************/
		 
		/** Highlight the entire content of all input fields **/
		fields.keywords.focus();
		 
		/** Show recent searches **/
		chrome.storage.sync.get('searches', function(data) {
			searches = data.searches || [];
			if (searches.length) {
				searches = (searches.length >  5) ? searches.slice(searches.length - 5) : searches;
				$('.recent-searches').searches(searches);
			}
		});
		
		/********************
		 END HOUSEKEEPING -->
		 *******************/
		
		/********************
		<-- BEGIN EVENT HANDLING
		********************/
		
		/** Toggle advanced search **/
		(function() {
			var advanced, toggleAdvanced, glyphicon, chevron, text;
		
			advanced = $('.advanced');
			toggleAdvanced = $('.toggle-advanced');
			glyphicon = toggleAdvanced.find('.glyphicon');
		
			chevron = {
				on: 'glyphicon-chevron-down',
				off: 'glyphicon-chevron-right',
			};
			
			toggleAdvanced.on('click', function(e) {
				e.preventDefault();
				
				if (advanced.is(':hidden')) {
					advanced
						.stop()
						.fadeIn('slow', function() {
							glyphicon
								.removeClass(chevron.off)
								.addClass(chevron.on);
						});
				} else {
					advanced
						.stop()
						.fadeOut('slow', function() {
							glyphicon
								.removeClass(chevron.on)
								.addClass(chevron.off);
						});
				}
			});
		}).call(this);
		
		/** Submit the form **/ 
		(function() {
			form.on('submit', function(e) {
				e.preventDefault();
				
				/** Remove errors first **/
				fields.keywords.removeError();
				
				/** Set the value **/
				keywords = $.trim(fields.keywords.val());

				/** Proceed only if a value was passed **/
				if (keywords.length) {				
					/** Build the redirecct URL **/
					tpcURL = $.tpcURL({
						namekeys: keywords,
						descriptionkeys: fields.description.val(),
						cat: fields.categories.val(),
						condition: fields.condition.val(),
						warranty: fields.warranty.val(),
						pricelow: fields.priceMin.val(),
						pricehigh: fields.priceMax.val(),
						ord: fields.sortBy.val(),
						dir: fields.sortOrder.val()
					}, fields.isBuying.prop('checked'));
					
					/** Add the data to recent searches **/
					searches.push({
						keywords: keywords,
						url: tpcURL
					})
					
					/** Save the search **/
					chrome.storage.sync.set({
						searches: searches
					});
					
					/** Open on new tab if on a domain other than tipidpc.com **/
					if (currentTab.url.indexOf('tipidpc.com') === -1) {
						chrome.tabs.create({
							url: tpcURL
						});
					} else {
						/** Otherwise change the current tab URL **/
						chrome.tabs.update({
							url: tpcURL
						});
					}
				} else {
					/** Advise user on how to fix the issue **/
					fields.keywords.addError();
					alert("You can't search for nothing, doofus!");
				}
			});
		}).call(this);
		
		/************************
		END EVENT HANDLING -->
		************************/
	};
}).call(this);

/** When current tab data has been retrieved, process main function as a callback **/
chrome.tabs.query({
	currentWindow: true,
	active: true
}, function(tab) {
	main(tab[0]);
});