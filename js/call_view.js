(function() {
	var config = {
    	    apiKey: "AIzaSyBSXRDrVzqppOGW-eZZN5IyHdeZcKjUxR8",
    	    authDomain: "crmapp-32675.firebaseapp.com",
    	    databaseURL: "https://crmapp-32675.firebaseio.com",
    	    storageBucket: "crmapp-32675.appspot.com",
    	    messagingSenderId: "805712434179"
    	  };
    	  firebase.initializeApp(config);
    	  
   
    	  
    angular
    .module('app', ['firebase'])
    .controller('MyCtrl', function($firebaseObject){
    	const rootRef = firebase.database().ref().child('posts');
    	this,object = $firebaseObject(rootRef);
    })
}());