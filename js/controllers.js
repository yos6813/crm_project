/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */

function MainCtrl() {
    this.userName = 'Example user';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';

};

//function search($scope, $firebase){
//	$scope.firebase = $firebase(new Firebase("https://crmapp-32675.firebaseio.com/posts"));
//}


angular
    .module('inspinia')
    .controller('MainCtrl', MainCtrl)

