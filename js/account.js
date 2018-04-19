  $(document).ready(function(){

        
        //$("#includedContent").load("../View/main.html");         

        angular.element(document).ready(function(){
          angular.bootstrap(document, ['saathiApp'])
        })

   /* $("#loginfrm").submit(function() {
        FB.login(function(response) {
            if(response.status === 'connected' && response.authResponse.accessToken){
              fbApi(response)
            }
        }, {
            scope:'user_posts',
            auth_type: 'rerequest'
        });
        return false;
    })
      

    function fbApi(response){
            FB.api(
            '/1518684985017044/?fields=members',
            'GET',
                handleResponse 
            );
             
    }

    function handleResponse(response){

      if(response.members.data){

        var maindata= response.members.data;
        var saathiApp = angular.module('saathiApp', []);
        saathiApp.value("adminData", maindata)

        angular.element(document).ready(function(){
          angular.bootstrap(document, ['saathiApp'])
        })
      }      
                        
    }*/

    
  })


  