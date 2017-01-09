/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
//    $urlRouterProvider.otherwise("login");
//    $urlRouterProvider.otherwise("clientLogin");

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
        .state('cIndex', {
            abstract: true,
            url: "/cIndex",
            templateUrl: "views/common/content2.html",
        })
        .state('cIndex.notifyPage', {
            url: "/notifyPage",
            templateUrl: "views/notifyPage.html",
            data: {
                pageTitle: '공지사항'
            }
        })
        .state('index.notifyPage', {
            url: "/notifyPage",
            templateUrl: "views/notifyPage.html",
            data: {
                pageTitle: '공지사항 관리'
            }
        })
        .state('cIndex.view_notify', {
            url: "/view_notify",
            templateUrl: "views/view_notify.html",
            data: {
                pageTitle: '공지보기'
            }
        })
        .state('index.view_notify', {
            url: "/view_notify",
            templateUrl: "views/view_notify.html",
            data: {
                pageTitle: '공지보기'
            }
        })
        .state('index.notifyWrite', {
            url: "/notifyWrite",
            templateUrl: "views/notifyWrite.html",
            data: {
                pageTitle: '공지사항 쓰기'
            }
        })
        .state('cIndex.main', {
            url: "/main",
            templateUrl: "views/main.html",
            data: {
                pageTitle: 'Home'
            }
        })
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            data: {
                pageTitle: 'Login'
            }
        })
        .state('clientRegister', {
            url: "/clientRegister",
            templateUrl: "views/clientRegister.html",
            data: {
                pageTitle: '회원가입'
            },
        })
        .state('clientLogin', {
            url: "/clientLogin",
            templateUrl: "views/clientLogin.html",
            data: {
                pageTitle: '로그인'
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
        .state('cIndex.postWrite', {
            url: "/postWrite",
            templateUrl: "views/postWrite.html",
            data: {
                pageTitle: '글쓰기'
            },
            controller: function(){
            	var checkUnload = true;
            	$(window).on("beforeunload", function(){
            	    if(checkUnload) return "페이지를 벗어나시겠습니까?";
            	});
            }
        })
        .state('cIndex.qnaList', {
            url: "/qnaList",
            templateUrl: "views/qnaList.html",
            data: {
                pageTitle: '문의리스트'
            }
        })
        .state('cIndex.view_qna', {
            url: "/view_qna",
            templateUrl: "views/view_qna.html",
            data: {
                pageTitle: '문의 글 보기'
            }
        })
        .state('clientInfo', {
            url: "/clientInfo",
            templateUrl: "views/clientInfo.html",
            data: {
                pageTitle: '회원정보입력'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        }
                    ]);
                }
            }
        })
        .state('cIndex.user', {
            url: "/user",
            templateUrl: "views/user.html",
            data: {
                pageTitle: '알림함'
            }
        })
        .state('index.group', {
            url: "/group",
            templateUrl: "views/group.html",
            data: {
                pageTitle: '분류 관리'
            }
        })
        .state('ready', {
            url: "/ready",
            templateUrl: "views/ready.html",
            data: {
                pageTitle: '준비중'
            }
        })
//        .state('verifyEmail', {
//            url: "/verifyEmail",
//            templateUrl: "views/verifyEmail.html",
//            data: {
//                pageTitle: '이메일 인증'
//            }
//        })
}
angular
    .module('inspinia')
    .config(config)
    .run(function ($rootScope, $state) {
        $rootScope.$state = $state;
    });