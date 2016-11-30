angular
    .module('posts', ['ngRoute', 'firebase'])
    .constant('FirebaseUrl', 'https://crmapp-32675.firebaseio.com')
    .service('rootRef', ['FirebaseUrl', firebase])
    .service('title',Title)
    .controller('MyCtrl', postsController)
    .config(PostConfig);

function postsController($routeProvider){
	$routeProvider.when('/', {
		controller: 'MyCtrl as ctrl',
		templateUrl: 'views/call_list',
	})
}

function posts(rootRef, $firebaseObject, $firebaseArray) {
	var titleRef = rootRef.child('title');
	this.get = function get(id){
		return $firebaseObject(usersRef.child(id));
	};
	this.all = function all(){
		return $firebaseArray(titleRef);
	}
}

function postsController(titles){
	this.titles = titles.all();
}