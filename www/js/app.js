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
      StatusBar.styleDefault();
    }
  });
})

module.controller('HallsCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.halls = [];
    $scope.refresh = function() {
        $http.get('http://varunramesh.net:3000/halls').success(function(data) {
            $scope.halls = data;
        }).finally(function() {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });;
    }
    $scope.refresh();
}]);