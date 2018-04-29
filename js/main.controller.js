var app = angular.module('saathiApp', ['ui.bootstrap', 'ngMessages']);



app.controller('saathiCtrl', ['saathiService', '$scope', '$http', '$q', '$timeout', function (saathiService, $scope, $http, $q, $timeout) {

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

	$scope.getSheets = function () {
		var mainUrl = "https://spreadsheets.google.com/feeds/list/",
			sheetId = "1KB-xw6t5b9wILjpZEZidSVJYmuT_GyNb2WEhg3RDkwU",
			lastUrl = "/od6/public/values?alt=json",
			finalUrl = mainUrl + sheetId + lastUrl;

		$scope.saathiSheets = [];
		$scope.viewData = [];

		$http({
			method: "GET",
			url: finalUrl
		}).then(function mySuccess(response) {
			var allData, sheetIds = [], uniqueSheets = [];
			allData = response.data.feed.entry;
			allData.forEach(function (currentValue, index, arr) {
				var sheetId = currentValue.gsx$sheetid.$t;
				sheetIds.push(sheetId);
				//$scope.saathiSheets.push( $http.get(mainUrl + sheetId + lastUrl));
			})

			uniqueSheets = $scope.getUnique(sheetIds);

			uniqueSheets.forEach(function (currentValue, index, arr) {
				var sheetId = currentValue;
				$scope.saathiSheets.push($http.get(mainUrl + sheetId + lastUrl));
			})

			$q.all($scope.saathiSheets).then(function (response) {
				var idx = 1;
				for (var count = 0; count < response.length; count++) {
					var allData = response[count].data.feed.entry;
					allData.forEach(function (currentValue, index, arr) {
						var groupIndex, urlIndex, sheetData = {};

						sheetData.sno = idx;
						sheetData.groupName = currentValue.gsx$groupname.$t;
						sheetData.publishedDate = currentValue.gsx$publishedon.$t;
						sheetData.postUrlText = 'View Post';
						sheetData.postUrl = currentValue.gsx$post.$t;
						sheetData.user = currentValue.gsx$user.$t;

						/*groupIndex = sheetData.groupName.indexOf("(http");
						sheetData.groupName = (groupIndex != -1)? sheetData.groupName.slice(0, groupIndex):"";

						urlIndex = sheetData.postUrl.indexOf("(http");
						sheetData.postUrl = (groupIndex != -1)? sheetData.postUrl.slice(urlIndex +1 , sheetData.postUrl.length-6):"";
*/
						$scope.viewData.push(sheetData);
						idx++;
					})
				}
				console.log(response);
			});
		}, function myError(response) {
			$scope.error = "fatal error occured";
		});
	}

	//$scope.getSheets();


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
		$scope.reset();
		saathiService.post(post).then(function (response) {
			if (response.data == '1') {
				$('#tabs a[href="#Posts"]').tab('show');
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

}]);


app.filter('startFrom', function () {
	return function (data, start) {
		return data.slice(start);
	}
});