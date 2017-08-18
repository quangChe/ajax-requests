function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    $nytHeaderElem.text("New York Times Articles Pertaining to");

    // load streetview and image source
    var streetStr = $('#street').val();
    var cityStr = $('#city').val()
    var imgSource = "http://maps.googleapis.com/maps/api/streetview?size=1400x600"
        + "&location=" + streetStr + "," + cityStr;

    // render image background and heading with street address
    $body.append('<img class="bgimg" src="' + imgSource + '">');

    if (streetStr) {
        $greeting.text("Here's a glance of " + streetStr + ", " + cityStr + ":");
    } else {
        $greeting.text("Here's a glance of " + cityStr + ":");
    }

    // load new york times articles
    var nytUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?" +
        "api-key=5600ade10aba4735aaf75f003b2bcc52&q=" + cityStr + "&sort=newest";

    $.getJSON(nytUrl)
        .done(function(data){
            $nytHeaderElem.append(" " + cityStr);
            results = data.response.docs;
            $.each(results, function(key, val){
                $nytElem.append('<li class="article"><a href="' + val['web_url']
                + '">' + val['headline']['main'] + '</a><p>"' + val['lead_paragraph']
                + '"</p>');
            });
        })
        .fail(function(){
            $nytHeaderElem.text("Error: Failed to Load Articles from The New York Times");
        });

    // load wikipedia links
    var wikiUrl = "https://en.wikipedia.org/w/api.php?&action=opensearch&search="
        + cityStr + "&format=json";

    // for errors (since jsonp has no built-in error handling)
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Error: Failed to Load Wikipedia Resources")
    }, 8000);

    $.ajax({
        type: "GET",
        url: wikiUrl,
        dataType: "jsonp",
        success: function(data){
            title = data[1];
            links = data[3];
            for (var i = 0; i < title.length; i++) {
                $wikiElem.append('<li><a href="' + links[i] + '">' + title[i]
                    + '</a></li>');
            };
            // clear or stop timeout from error since we got results
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
