var app = angular.module('saathiApp', ['ui.bootstrap']);

app.factory('saathiService', function ($http, $q) {

	var returnData = {};
	return {
		catagories: function () {
			var def = $q.defer();
			$http({
				method: 'GET',
				url: 'http://localhost:63472/api/catagory'
			}).then(function (response) {
				def.resolve(response);
			}, function (error) {
				def.reject("Failed to get albums");
			});
			return def.promise;
		},

        post: function (postData) {
            var def = $q.defer();
            var post = {};
            post.postDate = postData.postDate;
            post.postedBy = postData.postedBy;
            post.postUrl = postData.postUrl;
            post.catagory = postData.catagory;
            $http({
                url: 'http://localhost:63472/api/post',
                method: "POST",
				dataType: "json",
                data: JSON.stringify(post),
                ContentType: 'application/json'
            }).then(function (data, status, headers, config) {
                 def.resolve(data); 
            }).then(function (data, status, headers, config) {
                def.reject("Failed to get albums");
            });
            return def.promise;
        }
	}

})

app.controller('saathiCtrl', ['saathiService', '$scope', '$http', '$q', function (saathiService, $scope, $http, $q) {

	$scope.saathidata = {};
	$scope.currentPage = 1;
	$scope.itemsPerPage = 4;


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

	$scope.getSheets();

	$scope.saathiData = function () {
		var promises = [saathiService.catagories()];
		$q.all(promises).then(function (response) {
			$scope.saathidata.catagories = response[0].data;
		}, function () {
			$scope.saathidata.error = "error";
		})
	}

	$scope.submitPost = function(){
		var post = {};
		post.postDate = $scope.postDate;
		post.postedBy = $scope.postedBy;
		post.postUrl = $scope.postUrl;
		post.catagory = $scope.selectedCatagory.catagory;
		saathiService.post(post).then(function(response){
			var cc= response;
		}, function(){
			$scope.saathidata.error = "error";
		})

	}

	$scope.saathiData();

}]);

app.filter('startFrom', function () {
	return function (data, start) {
		return data.slice(start);
	}
});