(function ($) {
  "use strict";

  /**====== SET ME =====**/
  /**====== SET ME =====**/
  /**====== SET ME =====**/
  // Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    databaseURL: "https://crmapp-32675.firebaseio.com/"
  };

  // TODO: Replace this with the path to your ElasticSearch queue
  // TODO: This is monitored by your app.js node script on the server
  // TODO: And this should match your seed/security_rules.json
  var PATH = 'search';
  /**====== /SET ME =====**/
  /**====== /SET ME =====**/
  /**====== /SET ME =====**/

  // Get a reference to the database service
  var database = firebase.database();

  // handle form submits and conduct a search
  // this is mostly DOM manipulation and not very
  // interesting; you're probably interested in
  // doSearch() and buildQuery()
  $('#searchBtn').on('click', function(e) {
    e.preventDefault();
    var $form = $('#postList');
    $('#postList').children('.call_list').remove();
    if( $('#searchInput').val() ) {
      doSearch(buildQuery($form));
    }
  });

  function buildQuery($form) {
    // this just gets data out of the form
    var index = 'firebase';
    var type = $('#searchSelect option:selected').val();
    var term = $('#searchInput').val();
    var size = parseInt($('#sizeSel option:selected').val());

    // skeleton of the JSON object we will write to DB
    var query = {
      index: index,
      type: type
    };

    // size and from are used for pagination
    if( !isNaN(size) ) { query.size = size; }
    console.log(size);
    buildQueryBody(query, term);

    return query;
  }

  function buildQueryBody(query, term) {
      query.q = term;
    }

  // conduct a search by writing it to the search/request path
  function doSearch(query) {
	  var ref = database.ref().child(PATH);
	    var key = ref.child('request').push(query).key;

	    console.log('search', key, query);
	    console.log(JSON.stringify(query, null, 2));
	    ref.child('response/'+key).on('value', showResults);
  }

  // when results are written to the database, read them and display
  function showResults(snap) {
	  var dat = snap.val();
	  console.log(dat);
	    if( dat === null ) { return; } // wait until we get data

	    // when a value arrives from the database, stop listening
	    // and remove the temporary data from the database
	    snap.ref.off('value', showResults);
	    snap.ref.remove();

	    // the rest of this just displays data in our demo and probably
	    // isn't very interesting
	    var totalText = dat.total;
	    if( dat.hits && dat.hits.length !== dat.total ) {
	      totalText = dat.hits.length + ' of ' + dat.total;
	    }
	    console.log(totalText);

	    var $pair = console.log(JSON.stringify(dat, null, 2))
	      .removeClass('error zero');
	    if( dat.error ) {
	      $pair.addClass('error');
	    }
	    else if( dat.total < 1 ) {
	      $pair.addClass('zero');
	    }
  }
})(jQuery);
