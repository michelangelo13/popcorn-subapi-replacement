var request = require('cache-quest')({expirationTimeout: 10000});

exports.popular = function(req, res){
	console.log(req.query);
	var params = {};
	//TODO handle req.query.page parameter !!!
	var set = 1;
	if(req.query.page !== undefined){
		params['set'] = req.query.page;
	}

	var url = "http://yts.re/api/list.json";

	getMovies(url, params, function (result) {

		proccessMovieList(result,function(movies){
			res.send(JSON.stringify({movies:movies})); 
		});
	});
};

exports.search = function(req, res){
	console.log(req.query);
	var params = {};
	//TODO handle req.query.page parameter !!!
	var set = 1;
	if(req.query.page !== undefined){
		params['set'] = set;
	}

	if(req.query.query !== undefined){
		params['query'] = req.query.query;
	}

	var url = "http://yts.re/api/list.json";

	getMovies(url, params, function (result) {

		proccessMovieList(result,function(movies){
			res.send(JSON.stringify({movies:movies})); 
		});
	});
};


exports.genre = function(req, res){
	console.log(req.params);
	var params = {};
	//TODO handle req.query.page parameter !!!
	var set = 1;
	if(req.query.page !== undefined){
		set = req.query.page
	}

	if(req.params[0] !== undefined){
		params['genre'] = req.params[0];
	}

	params['set'] = set;
	var url = "http://yts.re/api/list.json";

	getMovies(url, params, function (result) {

		proccessMovieList(result,function(movies){
			res.send(JSON.stringify({movies:movies})); 
		});
	});
};

function getMovies(url,params,callback,error){


	var paramList = [];
	for(var i in params){
		paramList.push(i+'='+params[i]);
	}

	url = url +'?'+ paramList.join('&');
	
	if(error === undefined){
		error = function(){
			console.log('error on loading url = ',url);		
		}
	}
	console.log('fetching url ',url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(JSON.parse(body));
		}else{
			error();
		}
	});
}

/*
	processes movies and returns new array
*/
function proccessMovieList(result, callback){
	var movies = [];

    for(var i = 0; i< result.MovieList.length;i++){
    	var resmov = result.MovieList[i];

    	movies.push({
    		imdb_id : resmov.ImdbCode,
    		title : resmov.MovieTitle,
    		year : resmov.MovieYear,
    		runtime : 0, //TODO: fix this later
    		synopsis : '', //TODO: fix this later
    		vote_average : resmov.MovieRating,
    		poster : resmov.CoverImage,
    		backdrop : resmov.CoverImage,
    		seeders : resmov.TorrentSeeds,
    		leechers : resmov.TorrentPeers,
    		videos : [{
    			quality : resmov.Quality,
    			url : resmov.TorrentUrl
    		}],
    		torrents : [{
    			quality : resmov.Quality,
    			url : resmov.TorrentUrl
    		}],
    		subtitles : []
    	});

    }

    callback(movies);
}

