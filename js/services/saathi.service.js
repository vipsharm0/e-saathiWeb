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

		getPosts: function () {
			var def = $q.defer();
			$http({
				method: 'GET',
				url: 'http://localhost:63472/api/post'
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
			post.group = postData.group;
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