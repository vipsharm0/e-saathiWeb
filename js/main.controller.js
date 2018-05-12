var app = angular.module('saathiApp', ['ngAnimate','ngSanitize','ui.bootstrap', 'ngMessages'])
.controller('modalInstanceCtrl', ['$filter','editData','$scope','catagories',  function($filter,editData, $scope, catagories){
	
	$(function() {
		$("body").delegate(".datepicker", "focusin", function(){
			$(this).datepicker();
		});
	});
	
	$scope.catagoryOptions = catagories;
	$scope.catagoryOptions.push({Id:0, catagory: "Misc"});
	angular.forEach($scope.catagoryOptions, function(catagory){
		if(catagory.catagory == editData.catagory){
			if(editData.catagory == 'Misc'){
				$scope.catagory1 = 0;
			}else{
				$scope.catagory1 = catagory.Id;
			}
			
		}
	})
	$scope.postDate=$filter('date')(editData.postDate, 'MM/dd/yyyy');;
	$scope.postedBy = editData.postedBy;
	$scope.groupName = editData.group;
	$scope.postUrl = editData.postUrl;


	$scope.updatePost = function(){
		
	}
	
}])
.controller('saathiCtrl', ['$uibModal','saathiService', '$scope', '$http', '$q', '$timeout', function ($uibModal,saathiService, $scope, $http, $q, $timeout) {

	$scope.saathidata = {};
	$scope.currentPage = 1;
	$scope.itemsPerPage = 6;

	$("#datepicker").datepicker({
		dateFormat: "yy-mm-dd"
	});
	$scope.getUnique = function (inputArray) {
		var outputArray = [];

		for (var i = 0; i < inputArray.length; i++) {
			if ((jQuery.inArray(inputArray[i], outputArray)) == -1) {
				outputArray.push(inputArray[i]);
			}
		}

		return outputArray;
	}

	$scope.dataSaathi = {};
	$scope.saathiData = function () {
		$scope.showLoader = true;
		$scope.showdata = false;
		var promises = [saathiService.catagories(), saathiService.getPosts()];
		$q.all(promises).then(function (response) {
			$scope.showLoader = false;
			$scope.showdata = true
			$scope.dataSaathi.catagories = response[0].data;
			$scope.viewData = response[1].data;
			var filtered = [];
			for (var i = 0; i < $scope.viewData.length; i++) {
				if ($scope.viewData[i].catagory == 0) {
					$scope.viewData[i].catagory = 'Misc';
				} else {
					for (var c = 0; c < $scope.dataSaathi.catagories.length; c++) {
						if ($scope.viewData[i].catagory == $scope.dataSaathi.catagories[c].Id) {
							$scope.viewData[i].catagory = $scope.dataSaathi.catagories[c].catagory;
						}
					}
				}


			}

		}, function () {
			$scope.saathidata.error = "error";
		})
	}

	$scope.replacecatagory = function (obj) {
		var viewDataObject = obj;
		var catagoryObj = $scope.dataSaathi.catagories.filter(item => item.Id == parseInt(obj.catagory))
		obj.catagory = catagoryObj[0].catagory;
		return obj;
	}
	$scope.submitPost = function (form) {
		var post = {};
		post.postDate = $scope.postDate;
		post.postedBy = $scope.postedBy;
		post.postUrl = $scope.postUrl;
		post.catagory = $scope.dataSaathi.catagory;
		post.group = $scope.groupName;	
		$('#tabs a[href="#Posts"]').tab('show');	
		saathiService.post(post).then(function (response) {
			if (response.data == '1') {
				$scope.reset();				
				$scope.saathiData();
				$scope.success = "A new post has been submitted"
				$timeout(function () {
					$scope.success = null;
				}, 4000);
			}

		}, function () {
			$scope.saathidata.error = "error";
		})

	}

	$scope.saathiData();

	$scope.reset = function () {
		$scope.postUrl = "";
		$scope.postedBy = "";
		$scope.viewData[0].catagory = 'Misc';
		$scope.groupName = "";
		$scope.postDate = "";
		$scope.postForm.$setPristine();
		$scope.postForm.$setUntouched();
	}

	$scope.open = function (data) {
		
		var modalInstance = $uibModal.open({
		  animation: true,
		  ariaLabelledBy: 'modal-title',
		  ariaDescribedBy: 'modal-body',
		  templateUrl: 'editPost.html',
		  scope:$scope,
		  controller: 'modalInstanceCtrl',
		  //controllerAs: '$saathiCtrl',
		  size: "md",
		  resolve: {
			editData: function () {
			  return data;
			},
			catagories: function(){
				return $scope.dataSaathi.catagories
			}
		  }
		});
	
		modalInstance.result.then(function (selectedItem) {
		  //$ctrl.selected = selectedItem;
		}, function () {
		  //$log.info('Modal dismissed at: ' + new Date());
		});
	};

}]);


app.filter('startFrom', function () {
	return function (data, start) {
		return data.slice(start);
	}
});