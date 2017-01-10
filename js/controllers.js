/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */

function MainCtrl() {
    this.userName = 'Example user';
    this.helloText = 'Welcome in CRM';
    this.descriptionText = '';
};

function wizardCtrl($scope, $rootScope) {
    $scope.processForm = function() {
        alert('완료');
    };
};

//function sweetAlertCtrl($scope, SweetAlert) {
//	$scope.
//}

angular
    .module('inspinia')
    .controller('MainCtrl', MainCtrl)
//    .controller('sweetAlertCtrl', sweetAlertCtrl)

