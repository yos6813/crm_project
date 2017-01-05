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


angular
    .module('inspinia')
    .controller('MainCtrl', MainCtrl)

