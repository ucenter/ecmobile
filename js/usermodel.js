var userModel = (function(){
    var cache = {},
        isLogin = false,
        userData = {},
        info;
    function signin(u,p){
        $.when(
            api.signin({"name":u,"password":p})
        ).then(function(res){
            console.log(res)
            if(res.status.succeed){
                userData.session = res.data.session;
                userData.user = res.data.user
                isLogin = true;
                $.afui.toast({message:'登陆成功'})
                window.localStorage.setItem('uid',userData.session.uid);
                window.localStorage.setItem('sid',userData.session.sid);                
                return {
                    isLogin:isLogin,
                    session:userData
                }
            }else{
                $.afui.toast({message:res.status.error_desc,type:'error'})
            }
        },function(){
            $.afui.toast({message:'网络错误'})
        })
    }
    function info(){
        if (userData.session) {
            return userData;
        }else{
            var uid = window.localStorage.getItem('uid');
            var sid = window.localStorage.getItem('sid');
            if (uid && sid) {
                return api.userInfo({'uid':uid,'sid':sid});                            
            }else{
                return false;
            }
        }
    }
    return {
        checkUser: function(){            
            return isLogin;
        },
        signIn: function(u,p){
            return signin(u,p)            
        },
        signUp: function(){
            return user;
        },
        session:userData,
        info:function(){
            return info()
        }
    }
})();