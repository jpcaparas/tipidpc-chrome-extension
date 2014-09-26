(function(){
	/** Set up the variables **/
	var form, keywords, val, buildURL, redirectURL;

	form = $("#search");
	keywords = form.find('#keywords');

	(function() {
		var errClass, elem, parent, parentClass;
		
		errClass = 'has-error';
		parentClass = 'form-group';
		
		$.fn.extend({
			addError: function() {
				elem = $(this);
				parent = elem.parents("." + parentClass);
				parent.addClass(errClass);
			},
			removeError: function() {
				elem = $(this);
				parent = elem.parents("." + parentClass);
				parent.removeClass(errClass);
			}
		});
		
	}).call(this);
	
	/** Build the TPC URL **/
	buildURL = (function() {
		var endpoint, queryString;

		endpoint = 'http://www.tipidpc.com/itemsearch.php';
		queryString = '?sec=s';
		return function(params) {
			if (typeof params !== 'object') {
				/** Exit prematurely **/
				return endpoint + queryString;
			}
			$.each(params, function(key, val) {
				if (typeof val === 'string') {
					/** Concatenate the query string for each key/value pair **/
					queryString = queryString + "&" + key + "=" + encodeURIComponent(val);
				}
			});
			/** Return the final URL **/
			return endpoint + queryString;
		}
	}).call(this);
	
	$('.show-advanced').on('click', function() {
		alert("This feature will come soon enough. Stay tuned!");
	});
	
	form.find('#keywords').focus();
	
	form.on("submit", function(e) {
		e.preventDefault();
		keywords.removeError();
		
		val = $.trim(keywords.val());

		if (val.length) {
			redirectURL = buildURL({
				namekeys: keywords.val()
			});
			
			chrome.tabs.create({
				url: redirectURL
			});
		} else {
			keywords.addError();
			alert("You can't search for nothing, doofus!");
		}
	});
}).call(this);