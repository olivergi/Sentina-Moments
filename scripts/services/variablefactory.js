var app = angular.module('SentinaMoments');
app.factory("VariableFactory", function($log, $http) {
	// URL using webpack's proxy to the Sentina server for requesting data
	var apiurl =  "http://192.168.43.149:8080/services/";
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
	// boolean for audio player's music category mode
	var categoryMode = false;
	// Music Category Id to have the current chosen category at hand, specified as an array for multiple categories
	var currentCategories = [0];
	// Store for the curŕent recipe's name to be shown on the user interface
	var currentRecipeName = "";
	// Variable for the current playlist for the audio player
	var currentRecipe = [];
	// Store the todays recipe in an object so the information can be fetched easily
	var todaysRecipe = [];
    
	return {
		// return the values when the factory is called upon
		apiurl,
		user,
		nonces,
		nonceIndex,
		audios,
		currentSong,
		categoryMode,
		currentCategories,
		currentRecipeName,
		currentRecipe,
		todaysRecipe
	};
});