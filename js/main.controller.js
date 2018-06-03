var app = angular.module('saathiApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngMessages'])

	.filter('unique', function () {
		return function (items, group, postedby) {
			var options = [];
			for (var i = 0; i < items.length; i++) {
				var groupItem = items[i].group;
				var groupItem = group? items[i].group:items[i].postedBy;
				if ((jQuery.inArray(groupItem, options)) == -1) {
					options.push(groupItem);
				}
			}

			return options;
		}
	})

	.filter('searchBy', function () {
		return function (items, groupSearch, catagorySearch, postedBySearch) {
			var filtered = [], groupSearchCondition, catagorySearchCondition,
			postedBySearchCondition;

			
			/*for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (groupSearch != '' && groupSearch != undefined) {
					if (item.group == groupSearch) {
						filtered.push(item);
					}
				}
				if (catagorySearch != '' && catagorySearch != undefined) {
					if (item.catagory == catagorySearch) {
						filtered.push(item);
					}
				}
				if (postedBySearch != '' && postedBySearch != undefined) {
					if (item.postedBy == postedBySearch) {
						filtered.push(item);
					}
				}
				//if (letterMatch.test(item.name.substring(0, 1))) {
				//filtered.push(item);
				//}
			}*/
			var filtter = items.filter(function(item){
				if (groupSearch != '' && groupSearch != undefined) {
					groupSearchCondition = (item.group == groupSearch);
				}
				if (catagorySearch != '' && catagorySearch != undefined) {
					catagorySearchCondition = (item.catagory == catagorySearch);
				}
				if (postedBySearch != '' && postedBySearch != undefined) {
					postedBySearchCondition = (item.postedBy == postedBySearch)
				}
				return groupSearchCondition ||
					   catagorySearchCondition ||
					   postedBySearchCondition;
			})
			if (filtter.length == 0) {
				filtter = items;
			}
			return filtter;
		};
	})

	.controller('modalInstanceCtrl', ['$timeout', '$rootScope', 'saathiService', 'editOpen', 'delOpen', 'delData', '$uibModalInstance', '$filter', 'editData', '$scope', 'catagories',
		function ($timeout, $rootScope, saathiService, editOpen, delOpen, delData, $uibModalInstance, $filter, editData, $scope, catagories) {
			if (editOpen) {
				$scope.editDataId = editData.Id;
				$(function () {
					$("body").delegate(".datepicker", "focusin", function () {
						$(this).datepicker();
					});
				});

				$scope.catagoryOptions = catagories.filter(function (obj) {
					return obj.catagory !== 'Misc';
				});;
				$scope.catagoryOptions.push({ Id: 0, catagory: "Misc" });
				angular.forEach($scope.catagoryOptions, function (catagory) {
					if (catagory.catagory == editData.catagory) {
						if (editData.catagory == 'Misc') {
							$scope.editCatagory = 0;
						} else {
							$scope.editCatagory = catagory.Id;
						}

					}
				})
				$scope.postDate = $filter('date')(editData.postDate, 'MM/dd/yyyy');;
				$scope.postedBy = editData.postedBy;
				$scope.groupName = editData.group;
				$scope.postUrl = editData.postUrl;
				catagories = undefined;

				$scope.updatePost = function (frm) {
					var editPost = {};
					editPost.postDate = $scope.postDate;
					editPost.postedBy = $scope.postedBy;
					editPost.postUrl = $scope.postUrl;
					editPost.catagory = $scope.editCatagory;
					editPost.group = $scope.groupName;
					editPost.edit = 1;
					editPost.Id = $scope.editDataId;
					saathiService.post(editPost).then(function (response) {
						if (response.data == '1') {
							$scope.saathiData();
							$rootScope.success = "Post has been Updated successfully"
							$timeout(function () {
								$rootScope.success = null;
							}, 4000);
						}

					}, function () {
						$scope.error = "error";
					})
					$uibModalInstance.dismiss('cancel');
				}
			}

			if (delOpen) {
				$scope.delData = delData;
				$scope.delDataId = delData.Id;

				$scope.deletePost = function () {
					var archivePost = {};
					archivePost.Id = $scope.delData.Id;
					archivePost.edit = 2;
					archivePost.Id = $scope.delDataId;
					saathiService.post(archivePost).then(function (response) {
						if (response.data == '1') {
							$rootScope.success = "Post has been Archived successfully"
							$scope.saathiData();
							$timeout(function () {
								$rootScope.success = null;
							}, 4000);
						}

					}, function () {
						$scope.error = "error";
					})
					$uibModalInstance.dismiss('cancel');
				}
			}

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			}



		}])
	.controller('saathiCtrl', ['$rootScope', '$uibModal', 'saathiService', '$scope', '$http', '$q', '$timeout', function ($rootScope, $uibModal, saathiService, $scope, $http, $q, $timeout) {

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

				$scope.filter = $scope.getFilters($scope.viewData);
				$scope.showLoader = false;
				$scope.showdata = true
			}, function () {
				$scope.saathidata.error = "error";
			})
		}

		$scope.resetFilters = function(){
			//$scope.groupSearch = "-1";
			//$scope.catagorySearch = "-1";
			//$scope.postedBySearch = "-1";
		}
		$scope.getFilters = function (items) {
			var options={};
			options.groups = [];
			options.postedBy = [];
			for (var i = 0; i < items.length; i++) {
				var groupItem = items[i].group;
				var postedItem = items[i].postedBy;
				if ((jQuery.inArray(groupItem, options.groups)) == -1) {
					options.groups.push(groupItem);
				}
				if ((jQuery.inArray(postedItem, options.postedBy)) == -1) {
					options.postedBy.push(postedItem);
				}
			}

			return options;
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
			post.edit = 0;
			$('#tabs a[href="#Posts"]').tab('show');
			saathiService.post(post).then(function (response) {
				if (response.data == '1') {
					$scope.reset();
					$scope.saathiData();
					$rootScope.success = "A new post has been submitted"
					$timeout(function () {
						$rootScope.success = null;
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
				scope: $scope,
				controller: 'modalInstanceCtrl',
				//controllerAs: '$saathiCtrl',
				size: "md",
				resolve: {
					editData: function () {
						return data;
					},
					catagories: function () {
						return $scope.dataSaathi.catagories
					},
					delData: false,
					editOpen: true,
					delOpen: false
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$ctrl.selected = selectedItem;
			}, function () {
			});
		};


		$scope.delete = function (data) {

			var modalDelInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'deletePost.html',
				scope: $scope,
				controller: 'modalInstanceCtrl',
				//controllerAs: '$saathiCtrl',
				size: "sm",
				resolve: {
					delData: function () {
						return data;
					},
					editData: false,
					catagories: false,
					delOpen: true,
					editOpen: false
				}
			});

			modalDelInstance.result.then(function (selectedItem) {
				$ctrl.selected = selectedItem;
			}, function () {
			});
		};

	}]);


app.filter('startFrom', function () {
	return function (data, start) {
		return data.slice(start);
	}
});