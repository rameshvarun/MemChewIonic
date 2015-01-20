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
var module = angular.module('starter', ['ionic'])
module.run(function($ionicPlatform) {
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

module.controller('HallsCtrl', ['$scope', '$http', '$ionicLoading', function($scope, $http, $ionicLoading) {
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

    $scope.rate = function(hall, action) {
        var request = BASE_URL + "rate?item=" + hall.mealid + "&user=" + USER_ID + "&action=" + action;

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
    $scope.refresh();
}]);