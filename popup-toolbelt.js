/** Add error classes **/

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
(function() {
	var endpoint, queryString;

	endpoint = 'http://www.tipidpc.com/itemsearch.php';
	queryString = '?sec=s';
	
	$.tpcURL = function(params){
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