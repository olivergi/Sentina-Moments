var app = angular.module('SentinaMoments');
app.factory("VariableFactory", function($log, $http) {
	// User object
	var user = [];
	// Audio nonces for getting the audio file from backend
	var nonces = [];
	// Index for the nonce, since it can be used only once for an audio file
	var nonceIndex = 0;
	// Array for audio files for the playlist
	var audios = [];
	// Song index for the current playing audio file
	var currentSong = 0;
	// URL using webpack's proxy to the Sentina server for requesting data
	var apiurl =  "http://localhost:8080/services/";

	return {
		// variables
		user,
		nonces,
		nonceIndex,
		currentSong,
		audios,
		apiurl
	};
});