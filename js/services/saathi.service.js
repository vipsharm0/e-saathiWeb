var app = angular.module('saathiApp', ['ui.bootstrap']);
app.factory('saathiService', function ($scope, $http, $q) {

    var returnData = {};
    return {
        catagories: function () {
            var def = $q.defer();

            $http.get("http://localhost:63472/api/catagory")
                .success(function (data) {
                    def.resolve(data);
                })
                .error(function () {
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
                data: post
                //headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status, headers, config) {
                 def.resolve(data); 
            }).error(function (data, status, headers, config) {
                def.reject("Failed to get albums");
            });
            return def.promise;
        }
    }

})