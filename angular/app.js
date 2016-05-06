angular.module('shopping',[])
  .config(function () {

});

$.afui.ready(function(){
    angular.bootstrap(document, ['shopping']);
});

angular.module('shopping')
    .controller('cartCtrl',function cartCtrl($scope) {
    $scope.headings = 'xxx';
        
});




