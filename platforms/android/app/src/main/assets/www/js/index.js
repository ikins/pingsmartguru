/*
** PingSmart Siswa
** Bandung 1 Jan 2019
*/

var appsiswa =  angular.module('app', ['onsen','ipCookie','highcharts-ng','ngRoute','angular-md5','angular-loading-bar']);


//server
var _URL        = "http://pingsmart.gallerysneakers27.com/api/";


var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //var Permission = window.plugins.Permission;
    },
    receivedEvent: function(id) {

        username_bpspams     = window.localStorage.getItem("username_bpspams");
        kode_bps       = window.localStorage.getItem("kode_bps");

            if (username_bpspams == '' || username_bpspams == null || kode_bps == '' || kode_bps == null) {
                fn.load('login.html');
                return false;
            } else {

                fn.load('portal.html');

            }
    }
};

//config loading bar
appsiswa.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 400;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = true;
  }]);

appsiswa.controller('getCurrentInfoWeek', ['$scope', '$http','ipCookie', function($scope, $http,ipCookie) {

    //Data Msg
    $scope.data = {
           msg: ''
    };

    //Date 
    $scope.date = new Date();

    $scope.logout = function(){
        window.localStorage.removeItem("username_bpspams");
        //Kader
        window.localStorage.removeItem("kode_bps");
        window.localStorage.removeItem("nama_petugas");
        window.localStorage.removeItem("id_kader");


        fn.load('login.html');
    };

    $scope.refresh = function(){
        fn.load('portal.html');
    };

}]);


appsiswa.controller('PageController', ['$scope', '$http','ipCookie', 'md5', function($scope, $http, ipCookie, md5) {

}]);

appsiswa.controller('PagePortal', ['$scope', '$http', function($scope, $http) {


}]);
//--------------------------------------------------------------------LINK------------------------------------------

window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page, anim) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};

app.initialize();