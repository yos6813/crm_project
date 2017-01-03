/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("login");

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
            data: {
                pageTitle: 'Example view'
            }
        })
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            data: {
                pageTitle: 'Login'
            }
        })
        .state('index.admin', {
            url: "/admin",
            templateUrl: "views/admin.html",
            data: {
                pageTitle: 'Admin'
            }
        })
        .state('index.userList', {
            url: "/userList",
            templateUrl: "views/userList.html",
            data: {
                pageTitle: 'userList'
            }
        })
        .state('registerModify', {
            url: "/registerModify",
            templateUrl: "views/registerModify.html",
            data: {
                pageTitle: 'Register Modify'
            }
        })
        .state('index.typeList', {
            url: "/typeList",
            templateUrl: "views/typeList.html",
            data: {
                pageTitle: 'typeList'
            }
        })
        .state('index.jobList', {
            url: "/jobList",
            templateUrl: "views/jobList.html",
            data: {
                pageTitle: 'jobList'
            }
        })
        .state('index.departmentList', {
            url: "/departmentList",
            templateUrl: "views/departmentList.html",
            data: {
                pageTitle: 'departmentList'
            }
        })
        .state('index.user', {
            url: "/user",
            templateUrl: "views/user.html",
            data: {
                pageTitle: 'user'
            }
        })
        .state('register', {
            url: "/register",
            templateUrl: "views/register.html",
            data: {
                pageTitle: 'register'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['js/plugins/moment/moment.min.js']
                    }, {
                        name: 'datePicker',
                        files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                    }, {
                        files: ['js/plugins/jasny/jasny-bootstrap.min.js']
                    }, {
                        name: 'daterangepicker',
                        files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                    }]);
                }
            }
        })
       .state('index.chart', {
            url: "/chart",
            templateUrl: "views/chart.html",
            data: { pageTitle: 'chart' }
        })
        .state('index.call_list', {
            url: "/call_list",
            templateUrl: "views/call_list.html",
            data: {
                pageTitle: 'Call List'
            },
        })
        .state('index.client_user_list', {
            url: "/client_user_list",
            templateUrl: "views/client_user_list.html",
            data: {
                pageTitle: '고객리스트'
            },
        })
        .state('index.client_company_list', {
            url: "/client_company_list",
            templateUrl: "views/client_company_list.html",
            data: {
                pageTitle: '고객사리스트'
            },
        })
        .state('company', {
            url: "/company",
            templateUrl: "views/company.html",
            data: {
                pageTitle: 'company'
            },
        })
        .state('customer', {
            url: "/customer",
            templateUrl: "views/customer.html",
            data: {
                pageTitle: 'customer'
            },
        })
        .state('index.form_call_record', {
            url: "/form_call_record",
            templateUrl: "views/form_call_record.html",
            data: {
                pageTitle: 'Form Call Record'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ["js/inspinia.js"]
                    }])
                }
            }
        })
        .state('index.view_call_record', {
            url: "/view_call_record?no",
            templateUrl: "views/view_call_record.html",
            controller: function ($scope, $stateParams) {
                $scope.no = $stateParams.no;
            },
            data: {
                pageTitle: 'Form Call Record'
            }
        })
        .state('index.form_call_record_modify', {
            url: "/form_call_record_modify?no",
            templateUrl: "views/form_call_record_modify.html",
            controller: function ($scope, $stateParams) {
                $scope.no = $stateParams.no;
            },
            data: {
                pageTitle: 'Form Call Record Modify'
            }
        })
}
angular
    .module('inspinia')
    .config(config)
    .run(function ($rootScope, $state) {
        $rootScope.$state = $state;
    });