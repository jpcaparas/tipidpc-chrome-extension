/** Main function (used as a callback) **/
var main = (function(){
	return function(currentTab) {
		var form, keywords, val, tpcURL,
		recentSearches, recentSearchesInner;

		form = $("#search");
		keywords = form.find('#keywords');
		
		$('.show-advanced').on('click', function() {
			alert("This feature will come soon enough. Stay tuned!");
		});
		
		/********************* 
		<-- BEGIN HOUSEKEEPING
		 ********************/
		
		/** Populate fields with existing storage data **/
		chrome.storage.sync.get('fields', function(data) {
			keywords.val(data.fields.keywords || '');
		});
		
		/** Get list of recent searches **/
		chrome.storage.sync.get('recentSearches', function(data) {
			recentSearches = data.recentSearches || [];
			
			/** If there are recent searches, show them **/
			if (recentSearches.length) {
				/** Set the maximum recent searches to just five (5) **/
				if (recentSearches.length > 5) {
					recentSearches = recentSearches.slice(recentSearches.length - 5);
				}
			
				$.each(recentSearches, function(index, data) {
					$('.recent-searches')
						.append(
							$('<a />')
								.attr({
									href: data.url
								})
								.text(data.keywords)
						)
						if (index < (recentSearches.length - 1)) {
							$('.recent-searches')
								.append(
									$('<span />')
										.addClass('sep')
										.text(' | ')
								)
						}
				});
				
				recentSearchesInner = $('<p />')
					.text('Recent searches: ');
				
				$('.recent-searches').wrapInner(recentSearchesInner);
				
				$('.recent-searches').find('a').on('click', function() {
					chrome.tabs.update({
						url: $(this).attr('href')
					});
				});
			}
		});
		
		/** Focus on main input field **/
		form.find('#keywords').focus();
		
		/********************
		 END HOUSEKEEPING -->
		 *******************/
		
		/********************
		<-- BEGIN EVENT HANDLING
		********************/
		
		/** Submit the form **/ 
		form.on("submit", function(e) {
			e.preventDefault();
			/** Remove errors first **/
			keywords.removeError();
			
			/** Set the value **/
			val = $.trim(keywords.val());

			/** Proceed only if a value was passed **/
			if (val.length) {
				/** Save the query to chrome.storage **/
				chrome.storage.sync.set({
					fields: {
						keywords: val
					}
				});
			
				/** Build the redirecct URL **/
				tpcURL = $.tpcURL({
					namekeys: val
				});
				
				/** Add the data to recent searches **/
				recentSearches.push({
					keywords: val,
					url: tpcURL
				})
				
				chrome.storage.sync.set({
					recentSearches: recentSearches
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
				keywords.addError();
				alert("You can't search for nothing, doofus!");
			}
		});
		
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