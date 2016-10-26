(function() {
    'use strict';

    var movies = [];

    var renderMovies = function() {
        $('#listings').empty();

        for (var movie of movies) {
            var $col = $('<div class="col s6">');
            var $card = $('<div class="card hoverable">');
            var $content = $('<div class="card-content center">');
            var $title = $('<h6 class="card-title truncate">');

            $title.attr({
                'data-position': 'top',
                'data-tooltip': movie.title
            });

            $title.tooltip({
                delay: 50,
            });
            $title.text(movie.title);

            var $poster = $('<img class="poster">');

            $poster.attr({
                src: movie.poster,
                alt: `${movie.poster} Poster`
            });

            $content.append($title, $poster);
            $card.append($content);

            var $action = $('<div class="card-action center">');
            var $plot = $('<a class="waves-effect waves-light btn modal-trigger">');

            $plot.attr('href', `#${movie.id}`);
            $plot.text('Plot Synopsis');

            $action.append($plot);
            $card.append($action);

            var $modal = $(`<div id="${movie.id}" class="modal">`);
            var $modalContent = $('<div class="modal-content">');
            var $modalHeader = $('<h4>').text(movie.title);
            var $movieYear = $('<h6>').text(`Released in ${movie.year}`);
            var $modalText = $('<p>').text(movie.plot);

            $modalContent.append($modalHeader, $movieYear, $modalText);
            $modal.append($modalContent);

            $col.append($card, $modal);

            $('#listings').append($col);

            $('.modal-trigger').leanModal();
        }
    };

    // ADD YOUR CODE HERE
    // Get the full plot of each movie result. This must be done in the same scope that the "modal" is created (movie.plot), and must be passed the movie's ID.
    // function getFullPlot (imdbID) {
    //   // console.log(movieID); // for example, tt0118583
    //   var $fullPlotXHR = $.getJSON('http://www.omdbapi.com/?i=' + imdbID + '&plot=full');
    //   $fullPlotXHR.done(function(imdbID) {
    //     // console.log(imdbID.Plot);
    //       // if ($fullPlotXHR.status !== 200) {
    //       //     // return;
    //       // } else {
    //       // console.log("hit");
    //       return 5;
    //       // }
    //   })
    // }

    //Listen for search submission, and form validation
    $('form').submit(function(event) {
        event.preventDefault();
        var $searchPhrase = $('#search').val();
        if ($searchPhrase === '') {
            Materialize.toast('Please enter a movie to search', 4000);
            return;
        } else {
            $('#search').val("");
            movies = [];

            // search success message
            Materialize.toast('Searching movies for ' + $searchPhrase + ' now', 4000);

            //send an JSON HTTP request for the search phrase
            var $xhr = $.getJSON('http://www.omdbapi.com/?s=' + $searchPhrase);

            // received data handler
            $xhr.done(function(data) {
                if ($xhr.status !== 200) {
                    return;
                }
                for (var i in data.Search) {
                    var movie = {};
                    movie.id = data.Search[i].imdbID;
                    movie.poster = data.Search[i].Poster;
                    movie.title = data.Search[i].Title;
                    movie.year = data.Search[i].Year;
                    var $xhrID = $.getJSON('http://www.omdbapi.com/?i=' + movie.id + '&plot=full', function(data2) {
                        movie.plot = data2.Plot;
                    })
                    movies.push(movie);
                }
                renderMovies();
            })
        }
    })

    // Clear previous search on click
    $('#search').on('click', function(event) {
        $('#search').val("");
    });


})();
