/*
** PingSmart guru
** Bandung 1 Jan 2019
*/

var appguru =  angular.module('app', ['onsen','ipCookie','highcharts-ng','ngRoute','angular-md5','angular-loading-bar']);


//server
//var _URL        = "http://pingsmart.webcood.com/api/";
//var BASE_URL    = "http://pingsmart.webcood.com";

//local
var _URL        = "http://localhost:7777/apismart/api/";
var BASE_URL    = "http://localhost:7777/apismart";


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

        member_id_guru  = window.localStorage.getItem("member_id_guru");
        token_guru     = window.localStorage.getItem("token_guru");

            if (member_id_guru == '' || member_id_guru == null || token_guru == '' || token_guru == null) {
                fn.load('landing-page.html');
                return false;
            } else {
                fn.load('dashboard.html');
            }
    }
};

//config loading bar
appguru.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 400;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = true;
  }]);

appguru.controller('getCurrentInfoWeek', ['$scope', '$http','ipCookie', function($scope, $http,ipCookie) {

    //Data Msg
    $scope.data = {
           msg: ''
    };

    //Date 
    $scope.date = new Date();

    $scope.logout = function(){
        window.localStorage.removeItem("member_id_guru");
        window.localStorage.removeItem("token_guru");
        window.localStorage.removeItem("nip_guru");
        window.localStorage.removeItem("nama");
        window.localStorage.removeItem("avatar");

        fn.load('landing-page.html');
    };

    $scope.refresh = function(){
        fn.load('dashboard.html');
    };

}]);


appguru.controller('PageController', ['$scope', '$http','ipCookie', 'md5', function($scope, $http, ipCookie, md5) {


    $scope.login = function(){

        function login_action() {
        
        //var device_id = device.uuid;
        var device_id = '12345678';

        var username = $scope.username;
        var password = $scope.password;


             $http.get( _URL+"auth-guru?user=" + username + "&pass=" + password)
             .success(function (response) {
                 if (response.response_code == 1) {

                    window.localStorage.setItem("member_id_guru", response.data[0].MemberId);
                    window.localStorage.setItem("token_guru", response.data[0].Token);
                    window.localStorage.setItem("nip_guru", response.data[0].NIP);
                    //--
                    window.localStorage.setItem("nama", response.data[0].Nama);
                    window.localStorage.setItem("avatar", response.data[0].Avatar);

                    fn.load('dashboard.html');

                 } else if (response.response_code != 1) {
                    ons.notification.alert({
                      messageHTML: 'Username dan password yang anda kirimkan salah.',
                      title: 'Notifikasi',
                      buttonLabel: 'OK',
                      animation: 'default',
                      callback: function() {
                        // Alert button is closed!
                      }
                    });
                    return false;
                 }
             });

        }


        if ( $scope.username == undefined ) {
                ons.notification.alert({
                  messageHTML: 'Username Harus Diisi',
                  title: 'Notifikasi',
                  buttonLabel: 'OK',
                  animation: 'default', // or 'none'
                  // modifier: 'optional-modifier'
                  callback: function() {
                    // Alert button is closed!
                  }
                });
                
                return false;
            }

        if ( $scope.password == undefined ) {
                ons.notification.alert({
                  messageHTML: 'Password Harus Diisi',
                  title: 'Notifikasi',
                  buttonLabel: 'OK',
                  animation: 'default', // or 'none'
                  // modifier: 'optional-modifier'
                  callback: function() {
                    // Alert button is closed!
                  }
                });
                
                return false;
            }


        login_action();


    };


}]);

appguru.controller('Pagedashboard', ['$scope', '$http', function($scope, $http) {

  $scope.Nama = window.localStorage.getItem("nama");
  $scope.NIP = window.localStorage.getItem("nip_guru");
  $scope.Avatar = window.localStorage.getItem("avatar");

  $scope.URL_Avatar = BASE_URL + "/" + $scope.Avatar;

  token_guru  = window.localStorage.getItem("token_guru");

  $http.get( _URL+"ajar?token=" + token_guru)
      .success(function (response) {

        $scope.JumJamAjar = response.data[0].JumJamAjar;
        $scope.Pelajaran = response.data[0].Pelajaran;
        $scope.JamAjar = response.data[0].JamAjar;

  });

}]);

appguru.controller('PageKelas', ['$scope', '$http', function($scope, $http) {

    token_guru  = window.localStorage.getItem("token_guru");

    $http.get( _URL+"show-my-class?token=" + token_guru)
        .success(function (response) {

        $scope.list_kelas = response.data;

    });

}]);

appguru.controller('PageMataPelajaran', ['$scope', '$http', function($scope, $http) {

    token_guru  = window.localStorage.getItem("token_guru");

    $http.get( _URL+"pelajaran-by-guru?token=" + token_guru)
        .success(function (response) {

        $scope.list_mata_pelajaran = response.data;

    });

}]);

appguru.controller('PageJadwal', ['$scope', '$http', function($scope, $http) {

    token_guru  = window.localStorage.getItem("token_guru");
    nip_guru    = window.localStorage.getItem("nip_guru");

    $http.get( _URL+"jadwal-ajar?token=" + token_guru)
        .success(function (response) {

        $scope.list_jadwal = response.data;

    });

}]);

appguru.controller('PageNilaiUlangan', ['$scope', '$http', function($scope, $http) {

    token_guru  = window.localStorage.getItem("token_guru");
    nip_guru    = window.localStorage.getItem("nip_guru");

    $http.get( _URL+"nilai-by-guru?token=" + token_guru)
        .success(function (response) {

        $scope.list_nilai_ulangan = response.data;

    });

    this.showDialog = function(Id) {
      if (this.dialog) {
        this.dialog.show();
      } else {
        
        $scope.Id = Id;
        ons.createElement('detail-nilai-ulangan.html', { parentScope: $scope, append: true })
          .then(function(dialog) {
            this.dialog = dialog;
            dialog.show();
          }.bind(this));
      }
    }.bind(this);

}]);

appguru.controller('PagePengumuman', ['$scope', '$http', function($scope, $http) {

    token_guru  = window.localStorage.getItem("token_guru");
    nip_guru    = window.localStorage.getItem("nip_guru");

    $http.get( _URL+"guru-pengumuman?token=" + token_guru)
        .success(function (response) {

        $scope.list_pengumuman = response.data;

    });

}]);

appguru.controller('PageAgenda', ['$scope', '$http', function($scope, $http) {

    token_guru  = window.localStorage.getItem("token_guru");
    nip_guru    = window.localStorage.getItem("nip_guru");

    $http.get( _URL+"guru-agenda?token=" + token_guru)
        .success(function (response) {

        $scope.list_agenda = response.data;

    });

}]);

appguru.controller('PageAlbum', ['$scope', '$http', function($scope, $http) {

    token_guru  = window.localStorage.getItem("token_guru");
    nip_guru    = window.localStorage.getItem("nip_guru");

    $scope.BASE_URL = BASE_URL;

    $http.get( _URL+"guru-album?token=" + token_guru)
        .success(function (response) {

        $scope.list_album = response.data;

    });

}]);

appguru.controller('PageEvent', ['$scope', '$http', function($scope, $http) {

    token_guru  = window.localStorage.getItem("token_guru");
    nip_guru    = window.localStorage.getItem("nip_guru");

    $http.get( _URL+"guru-event")
        .success(function (response) {

        $scope.list_event = response.data;

    });

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