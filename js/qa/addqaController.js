var app = angular.module('saathiApp')

.controller('qsAddController', ['$scope', 'saathiService',function($scope, saathiService){ 
    $scope.answerset = {answers:[]};
    $scope.answerset.answers = []
    $scope.answerset.answers.push('');
  

    $scope.addAnswer = function () {
        $scope.answerset.answers.push('');
    };

    $scope.removeAnswer = function (z) {
        //var lastItem = $scope.choiceSet.choices.length - 1;
        if($scope.answerset.answers.length > 1){
            $scope.answerset.answers.splice(z,1);
        }
        
    }
    
    
}])