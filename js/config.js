/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/index/main");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "views/main.html",
            data: { pageTitle: 'Example view' }
        })
        .state('index.call_list', {
            url: "/call_list",
            templateUrl: "views/call_list.html",
            data: { pageTitle: 'Call List' }
        })
        .state('index.company', {
            url: "/company",
            templateUrl: "views/company.html",
            data: { pageTitle: 'company' },
        })
        .state('index.customer', {
            url: "/customer",
            templateUrl: "views/customer.html",
            data: { pageTitle: 'customer' },
        })
        .state('index.form_call_record', {
        	url: "/form_call_record",
        	templateUrl: "views/form_call_record.html",
        	data: { pageTitle: 'Form Call Record'}
        })
}
angular
    .module('inspinia', ['ngRoute', 'firebase'])
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
