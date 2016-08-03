'use strict';

angular.module('biaMap')
  .controller('MainCtrl', function($scope, $location, $localStorage, $timeout, Term, $ionicPopup) {
      // guarda o status anterior dos objetos de local
	  $scope.$storage = $localStorage;
    $scope.term = null;
    $scope.getTerm = function(){
        Term.all().success(function (result) {
          $scope.term = result.term;
        }).error(function (error) {
          $ionicPopup.confirm({
            title: "Sem conexão com Servidor",
            content: "Falha na conexão com servidor central. Contactar administrador da plataforma.",
            buttons: [{
              text: 'Cancelar',
              type: 'button-default',
              onTap: function(e) {
                return false;
              }
            }, {
              text: 'Sair',
              type: 'button-energized',
              onTap: function(e) {
                return true;
              }
            }]
          })
          .then(function (result) {
            if (result) {
              ionic.Platform.exitApp();
            }
          })
        });
	  }

  })
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
                reader = $scope.decoded = decodeURIComponent(escape($base64.decode(reader)));
            });
        }
    }
}])
// funcional
  .controller('AppCtrl', function($scope, $http){
    $scope.data = {};

    $scope.submit = function(){
      $scope.file_changed = function(element) {

     $scope.$apply(function(scope) {
         var photofile = element.files[0];
         var reader = new FileReader();
         reader.onload = function(e) {
            // handle onload
         };
         reader.readAsDataURL(photofile);
     });
};
      $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
    var dados = $.param({
            'disappeared':{
               name:$scope.data.name, phone:$scope.data.phone, bo:$scope.data.bo,
               email :$scope.data.email, name_disappeared : $scope.data.name_disappeared, birth : $scope.data.birth,
                height : $scope.data.height, weight : $scope.data.weight, sex : $scope.data.sex, hair : $scope.data.hair,
               eye : $scope.data.eye, skin : $scope.data.skin, description : $scope.data.description, location : $scope.data.location,
               lat : '1', long : '1', image : $scope.data.image, terms : $scope.data.terms
             }, commit:'Adicionar', api: true});

          $http.post('http:/localhost:3000/disappeareds', dados);
          window.open('#/home', '_self');
      }
    }
  )
// teste

  .controller('SponsorCtrl', function($scope, $location, $localStorage, $timeout, Sponsors) {
    $scope.sponsors = null;
	  $scope.getSponsors = function(){
	    var temp = Sponsors.all().then(function(data){
			$scope.sponsors = data.sponsors;
		});
		$timeout(function() {
        if($localStorage.agreement != true){
		      $location.path('/main');
		    } else {
			    $location.path('/home');
		    }
      }, 5000);
	  }

	  $scope.getSponsors();

  })
  .controller('AcceptCtrl', function($scope, $location, $localStorage){
	  $scope.accept = function(){
		  $scope.$storage.agreement = true;
	    $location.path('/home');
	  }
  })
  .controller("HomeCtrl", function($scope, $location, $localStorage, Missing, missingProperties, $ionicScrollDelegate, backPage, $ionicPopup) {

    $scope.moreData = true;

	  $scope.nextPage = null;

    $scope.missing = missingProperties.getMissingProperty();

    $scope.set_back_page = function(){
        backPage.setBackPage(false);
    },

	  $scope.getMissing = function(){
      if(!missingProperties.getMissingProperty().length){
        Missing.all().success(function (result) {
          if(missingProperties.getMissingProperty())
            missingProperties.setMissingProperty(result.missing);
          else
            missingProperties.setMissingProperty(missingProperties.getMissingProperty().concat(result.missing));
          $scope.missing = missingProperties.getMissingProperty();
          if(result.paginate.next){
            $scope.nextPage = result.paginate.next;
            missingProperties.setMoreData(true);
          } else
            missingProperties.setMoreData(false);

        }).error(function (error) {
          $ionicPopup.confirm({
            title: "Sem conexão com Servidor",
            content: "Falha na conexão com servidor central. Contactar administrador da plataforma.",
            buttons: [{
              text: 'Cancelar',
              type: 'button-default',
              onTap: function(e) {
                return false;
              }
            }, {
              text: 'Sair',
              type: 'button-energized',
              onTap: function(e) {
                return true;
              }
            }]
          })
          .then(function (result) {
            if (result) {
              ionic.Platform.exitApp();
            }
          })
        });
      }
      $scope.set_back_page();
	  },

	  $scope.loadMore = function(){
      if(missingProperties.getMoreData()){
        Missing.next_page($scope.nextPage).success(function (result) {
          missingProperties.setMissingProperty(missingProperties.getMissingProperty().concat(result.missing));
          $scope.missing = missingProperties.getMissingProperty();
          if(result.paginate.next){
            $scope.nextPage = result.paginate.next;
            missingProperties.setMoreData(true);
          } else
            missingProperties.setMoreData(false);
        }).error(function (error) {
          $ionicPopup.confirm({
            title: "Sem conexão com Servidor",
            content: "Falha na conexão com servidor central. Contactar administrador da plataforma.",
            buttons: [{
              text: 'Cancelar',
              type: 'button-default',
              onTap: function(e) {
                return false;
              }
            }, {
              text: 'Sair',
              type: 'button-energized',
              onTap: function(e) {
                return true;
              }
            }]
          })
          .then(function (result) {
            if (result) {
              ionic.Platform.exitApp();
            }
          })
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
      } else {
        missingProperties.setMoreData(false);
      }
	  },

    $scope.reset_agreement = function(){
	    $localStorage.$reset();
		  $location.path('/');
	  },

    $scope.moreData = function(){
      return missingProperties.getMoreData();
    },

    $scope.getScrollPosition = function(){
      missingProperties.setScrollPosition($ionicScrollDelegate.getScrollPosition().top);
    };
  })
  .controller("MissingCtrl", function($scope, $routeParams, Missing, missingProperties, backPage) {

      $scope.disappeared = null;

	    var temp = missingProperties.getMissingProperty();
		  for (var i = 0; i < temp.length; i++) {
        if (temp[i].id === parseInt($routeParams.disid)) {
          $scope.disappeared = temp[i];
        }
      }

      $scope.set_back_page = function(){
        backPage.setBackPage(true);
      }

      $scope.set_back_page();

      $scope.back = function () {
        $timeout(function(){
          $window.history.back();
        }, 50);
      };
  })
  .controller("DefaultActionsCtrl", function($scope, $ionicModal, $timeout, $window, Complaint, $cordovaDevice, $ionicPopup, $ionicActionSheet, $log, $state, Geolocation, Geofence, $ionicLoading, Geo){
    $scope.lat = 0;
    $scope.long = 0;
    	var init = function () {
        try {
          $scope.uuid = $cordovaDevice.getUUID();
        }
        catch (err) {
        }
      };
      $ionicModal.fromTemplateUrl('views/about.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modalDragStart = { active: true, value: 0 }
      })
      $scope.openModal = function() {
        $scope.modal.show()
      },
      $scope.closeModal = function() {
        return $scope.modal.hide();
      },
	  $scope.shareContent = function(dis){
  	    $window.plugins.socialsharing.share('Desaparecido(a) ' + dis.name + ' foi compartilhado via BiaMap ', null, null, dis.url_static);
	  },
	  $scope.callTo = function(){
      var call = "tel:";
      $log.log("Buscando sua localizaçāo...");
      $ionicLoading.show({
        template: "Buscando sua localizaçāo..."
        //hideOnStateChange: true
      });
      Geolocation.getCurrentPosition()
        .then(function (position) {
          $log.info("Localizaçāo encontrada", position);

          Geo.get_location(position.coords.latitude, position.coords.longitude).success(function (result) {
          //Geo.get_location(-23.622876, -46.781665).success(function (result) { //taboao
            call = call + result;
          }).error(function(error){
            call = call + "190";
          }).then(function(){
            document.location.href = call;
          });
          $ionicLoading.hide();
        }, function (reason) {
        //  $ionicLoading.hide();
        $ionicLoading.show({
          template: "Nāo foi possível obter sua localizaçāo: " + reason.code + " message:" + reason.message
          //duration: 1500
        });
          /*$log.error("Nao foi possivel obter sua localizacao", reason);
          $ionicLoading.show({
            template: "Nāo foi possível obter sua localizaçāo",
            duration: 1500
          });*/
          document.location.href = call + "190";
        });
	  },
    $scope.send_complaint = function(disappeared_id){
      Complaint.create(disappeared_id, $scope.uuid);
    };

    ionic.Platform.ready(function(){
      init();
    });

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
  })
  .controller("AboutCtrl", function($scope, $cordovaAppAvailability, $ionicPopup){

	  $scope.openFacebook = function(){
	    var scheme;

        if(ionic.Platform.platform() === 'android') {
		  scheme = 'com.facebook.katana';
        }
        else {
          scheme = 'fb://';
        }

		$cordovaAppAvailability
        .check(scheme)
        .then(function(success) {
          window.open('fb://page/449005925121704', '_system', 'location=yes');
        },
        function (error) {
		  window.open('http://www.facebook.com/BiaMapOficial/', '_system', 'location=yes');
        });
	  },

	  $scope.openWebSite = function(){
	    window.open('http://www.biamap.com.br/', '_system', 'location=yes');
	  },

    // rota nova
    $scope.addMissing = function(){
      window.open('#/addDisappeareds', '_self');
    },
    $scope.quitApp = function() {
      $ionicPopup.confirm({
        title: "Aviso!",
        content: "Deseja realmente fechar o aplicativo?",
        buttons: [{
          text: 'Cancelar',
          type: 'button-default',
          onTap: function(e) {
            return false;
          }
        }, {
          text: 'Sair',
          type: 'button-energized',
          onTap: function(e) {
            return true;
          }
        }]
      })
      .then(function (result) {
        if (result) {
          ionic.Platform.exitApp();
        }
      })
    },

    $scope.deviceIos = function(){
      return ionic.Platform.isIOS();
    },

    $scope.commingSoon = function(){
      $ionicPopup.confirm({
        title: "Atençāo!",
        content: "Funçāo está em desenvolvimento.",
        buttons: [{
          text: 'Ok',
          type: 'button-energized',
          onTap: function(e) {
            return true;
          }
        }]
      })
    };
  })
  .controller('index', function($scope, $rootScope, $ionicSideMenuDelegate, backPage, $location, $window){
    $rootScope.have_back_page = backPage.haveBackPage();

	  $rootScope.$on('$routeChangeStart', function($scope, event, currRoute, prevRoute){
      if($location.path() != "/home" && $location.path() != "/main" && $location.path() != "/"){
        backPage.setBackPage(true);
      } else {
        backPage.setBackPage(false);
      }
      $rootScope.have_back_page = backPage.haveBackPage();
		  $rootScope.animation = currRoute.animation;
	  });

    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    },

    $rootScope.back = function () {
      $rootScope.have_back_page = false;
      $window.history.back();
    }
  });
