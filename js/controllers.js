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
    
//    firebase.database().ref('posts/').on("value", function(snapshot) {
//    	  this.maxSize = 5;
//    	  this.bigTotalItems = snapshot.numChildren() + 100;
//    	  console.log(bigTotalItems);
//    	  this.bigCurrentPage = 1;
//    })
    
    	  
};


angular
    .module('inspinia')
    .controller('MainCtrl', MainCtrl)

