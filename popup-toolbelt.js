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
	
	$.tpcURL = function(params, isBuying){
		queryString = '?sec=';
		queryString += (typeof isBuying !== 'undefined' && isBuying) ? 'b' : 's';
	
		if (typeof params !== 'object') {
			/** Exit prematurely **/
			return endpoint + queryString;
		}
		$.each(params, function(key, val) {
			if (typeof val === 'string' && val.length) {
				val = $.trim(val);
				/** Concatenate the query string for each key/value pair **/
				queryString = queryString + "&" + key + "=" + encodeURIComponent(val);
			}
		});
		/** Return the final URL **/
		return endpoint + queryString;
	}
}).call(this);

/** Get list of recent searches **/
(function() {
	var elem, inner, clear;
	
	$.fn.extend({
		searches: function(searches) {
			elem = $(this);
			
			$.each(searches, function(index, data) {
				/** Append the URL **/
				elem
					.append(
						$('<a />')
							.attr({
								href: data.url
							})
							.text(data.keywords)
					)
					/** Put a separator **/
					if (index < (searches.length - 1)) {
						elem
							.append(
								$('<span />')
									.addClass('sep')
									.text(' | ')
							)
					}
			});
			
			inner = $('<p />')
				.text('Recent searches: ');
			
			elem.wrapInner(inner);
			
			/** Highlight the currently selected search time **/
			elem.find('a').on('click', function() {
				chrome.tabs.update({
					url: $(this).attr('href')
				});
				
				elem.find('a')
					.css({
						color: 'inherit',
						background: 'inherit'
					});
				
				$(this)
					.css({
						color: '#FFFFFF',
						background: '#FF9900'
					});
			});
		}
	});
}).call(this);