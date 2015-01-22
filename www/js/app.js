// Ionic Starter App

// Helper function for generating a user ID
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

// If the current user doesn't have an id, generate one
if(window.localStorage.getItem("userid") === null) {
    console.log("Generating a user id...");
    window.localStorage['userid'] = generateUUID();
}
var USER_ID = window.localStorage['userid'];

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/')

    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'home.html'
    }).state('hall', {
        url: '/hall/:id',
        templateUrl: 'hall.html'
    });
})

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleLightContent();
    }
  });
})

var BASE_URL = 'http://varunramesh.net:3000/';

function rate_function($http, $ionicLoading) {
    return function(hall, action) {
        var request = BASE_URL + "rate?item=" + (hall.mealid || hall.id) + "&user=" + USER_ID + "&action=" + action;

        $http.get(request).success(function(data) {
            if(data.error) {
                if(data.error.toLowerCase() == "already voted")
                    $ionicLoading.show({ template: 'Already voted.', noBackdrop: true, duration: 2000 });
            } else {
                if(data.result.toLowerCase() == "downvoted") {
                    hall.downvotes++;
                    hall.rating = "downvote";
                }

                if(data.result.toLowerCase() == "upvoted") {
                    hall.upvotes++;
                    hall.rating = "upvote";
                }
            }

        }).error(function(data, status, headers, config) {
            $ionicLoading.show({ template: 'Could not upvote.', noBackdrop: true, duration: 2000 });
        });
    }
}

app.controller('HallsCtrl', ['$scope', '$http', '$ionicLoading', '$location', '$ionicNavBarDelegate', function($scope, $http, $ionicLoading, $location, $ionicNavBarDelegate) {
    $scope.halls = [];
    $scope.refresh = function() {
        $http.get(BASE_URL + 'halls?user=' + USER_ID).success(function(data) {
            $scope.halls = data;
        }).error(function(data, status, headers, config) {
            $ionicLoading.show({ template: 'Could not load dining halls.', noBackdrop: true, duration: 2000 });
        }).finally(function() {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });;
    }
    $scope.score = function(hall) {
        return hall.upvotes - hall.downvotes;
    }
    $scope.mealdesc = function(hall) {
        if(hall.mealdesc) return hall.mealdesc;
        else return "Open for " + hall.meal.charAt(0).toUpperCase() + hall.meal.slice(1);
    }

    $scope.rate = rate_function($http, $ionicLoading);

    $scope.go = function ( hall ) {
        if(hall.open){
            window.hall = hall;
            $location.path('/hall/' + hall.id);
        }
    };

    $scope.refresh();
}]);

function resize() {
    $(".comment-list").css("top", (50 + $(".hall-header").height()) + "px");
}

$(window).resize(resize);

app.controller('HallCtrl', ['$scope', '$http', '$ionicLoading', '$location', '$stateParams', '$ionicNavBarDelegate', function($scope, $http, $ionicLoading, $location, $stateParams, $ionicNavBarDelegate) {
    var HALL_ID = $stateParams.id;
    $scope.hall = window.hall;
    $scope.comments = [];

    resize();

    $scope.refresh = function() {
        $http.get(BASE_URL + 'halls?user=' + USER_ID).success(function(data) {
            angular.forEach(data, function(hall, index){
               if(hall.id == HALL_ID) {
                    if($scope.hall) {
                        $scope.hall = hall;
                    } else {
                        $scope.hall = hall;
                        $scope.refresh();
                    }
               }
            });

            resize();
        }).error(function(data, status, headers, config) {
            $ionicLoading.show({ template: 'Could not load dining halls.', noBackdrop: true, duration: 2000 });
        }).finally(function() {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });

        if($scope.hall) {
            $http.get(BASE_URL + "comments?user=" + USER_ID + "&meal=" + $scope.hall.mealid).success(function(data) {
                $scope.comments = data;

                // TODO: Scroll to last_posted comment
            });
        }
    }
    $scope.score = function(hall) {
        return hall.upvotes - hall.downvotes;
    }
    $scope.mealdesc = function(hall) {
        if(hall.mealdesc) return hall.mealdesc;
        else return "Open for " + hall.meal.charAt(0).toUpperCase() + hall.meal.slice(1);
    }

    $scope.photo = function() {
        navigator.camera.getPicture(function(imageURI) {

            // imageURI is the URL of the image that we can use for
            // an <img> element or backgroundImage.

        }, function(err) {

            // Ruh-roh, something bad happened

        });
    };

    $scope.rate = rate_function($http, $ionicLoading);

    $scope.last_comment = null;
    $scope.refresh();

    $scope.text = "";
    $scope.comment = function() {
        var text = $scope.text;
        $scope.text = "";

        if(text) {
            var request = $http({
                method: "post",
                url: BASE_URL + "comment",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data : $.param({
                    meal: $scope.hall.mealid,
                    user: USER_ID,
                    comment: text
                })
            });
            request.success(function(data) {
               if(data.result == "Added comment") {
                   $scope.last_comment = data.comment.id;
                   $scope.refresh();
               }
            });
            request.error(function(data) {
                $ionicLoading.show({ template: 'Failed to post comment.', noBackdrop: true, duration: 2000 });
            });
        }
    }
}]);