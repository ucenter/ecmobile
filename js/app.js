/*
 * Please see the included README.md file for license terms and conditions.
 */


// This file is a suggested starting place for your code.
// It is completely optional and not required.
// Note the reference that includes it in the index.html file.


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */


// For improved debugging and maintenance of your app, it is highly
// recommended that you separate your JavaScript from your HTML files.
// Use the addEventListener() method to associate events with DOM elements.

// For example:

// var el ;
// el = document.getElementById("id_myButton") ;
// el.addEventListener("click", myEventHandler, false) ;



// The function below is an example of the best way to "start" your app.
// This example is calling the standard Cordova "hide splashscreen" function.
// You can add other code to it or add additional functions that are triggered
// by the same event or other events.


function onAppReady() {
    if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
        navigator.splashscreen.hide();
    }

    //监听返回事件
    document.addEventListener("backbutton",eventBackButton, false);  
    function eventBackButton() {
        document.addEventListener("backbutton", exitApp, false);// 绑定退出事件
        var intervalID = window.setTimeout(function() {
                window.clearTimeout(intervalID);
                document.removeEventListener("backbutton", exitApp, false); // 注销返回键
                document.addEventListener("backbutton", eventBackButton, false); // 返回键
        }, 800);                
        if (window.history.state == 'main') {
            return false;
        }else{
            window.history.back();            
        } 
    }
    //退出app
    function exitApp() {   
        navigator.notification.confirm(
            '确定要退出应用吗', // message
             onConfirm,            // callback to invoke with index of button pressed
            '退出提示',           // title
            ['确定','取消']     // buttonLabels
        ); 
        function onConfirm(index){
            if (index == '1') {
                navigator.app.exitApp();
                console.log('退出');
            }else{
                return false;
            }
        }                           
    }


}//  onAppReady()   end /*******************/


document.addEventListener("app.Ready", onAppReady, false) ;
document.addEventListener("deviceready", onAppReady, false) ;
// document.addEventListener("onload", onAppReady, false) ;


//获取城市名称
var City = function(){
    var cityName;
    var req = function(){
        return $.ajax({
            url:'http://api.map.baidu.com/location/ip?ak=485a9e87c98054c55b50404385e10ed1',
            type:'GET',
            dataType:'json'       
        })
    }
}

//模板html转义
template.config('escape',false)
var now = Date.now();
var api = {
    _myAjax: function(obj){    
        var baseUrl = 'http://test.shizhencaiyuan.com/PHP/?url='+obj.url;
        return $.ajax({type:'post',url: baseUrl,dataType:'json',data:obj.data});
    },
    config: function(){
        return this._myAjax({url:'/config'})
    },
    signin: function(data){    
        return this._myAjax({url:'/user/signin',data:data})
    },
    userInfo: function(data){    
        return this._myAjax({url:'/user/info',data:data})
    },    
    homeData:function(){
        //站点信息
        return this._myAjax({url:'/home/data',data:''})
    },
    searchKeywords:function(){
        //标签数据
        return this._myAjax({url:'/searchKeywords',data:''})
    },
    search: function(data){
        //关键词搜索
        return this._myAjax({url:'/search',data:data})
    },
    homeCategory: function(){
        //首页分类
        return this._myAjax({url:'/home/category',data:''})
    },
    category: function(){
        //全部分类
        return this._myAjax({url:'/category',data:''})
        //return $.getJSON('./server/goodsCategory.json',function(json, textStatus) {});
    },
    goods:function(id,session){
        return this._myAjax({url:'/goods',data:{'goods_id':id,'session':session}})
    },
    goodsDesc:function(id){
        return this._myAjax({url:'/goods/desc',data:{'goods_id':id}})
    },
    cartCreat:function(session,goodsId,num,spec){
        return this._myAjax({url:'/cart/create',data:{'session':session,"goods_id":goodsId,"number":num,"spec":spec}})
    },
    cartList:function(session){
        return this._myAjax({url:'/cart/list',data:{'session':session}})
    },
    cartUpdate:function(session,rec_id,new_number){
        return this._myAjax({url:'/cart/update',data:{"session":session,"rec_id":rec_id,"new_number":new_number}})
    }    
}



var cartModule = (function(){
    var cartlist={};
    var add = function(id){
        cartlist.push(id)
    }
    var remove = function(id){
        cartlist.shift(id)
    }
    return {
        addCart:function(){
            if(userModel.checkUser){

            }else{

            }
        },
        updatCart:function(){

        },
        removeCart:function(){

        },
        listCart:function(){

        }   
    }
})()

var panelView = {};
panelView.cart = function(){    
    $('#cart').empty().html(template('cartTpl',false));
    $.when(api.cartList()).then(function(res){
        console.log(res)
        if (res.status.succeed) {
            $.afui.loadContent('cart',false,false,'fade')
        }else{
            //$.afui.toast({message:res.status.error_desc,position:"tc",delay:2000,autoClose:true,type:"error"})
            setTimeout(function(){
                //$.afui.loadContent('#login',false,false,'fade')                            
            },2000)
        }
    },function(){
        console.log('网络错误')
    })
}

panelView.category = function(){
    $.afui.hideMask();
    var catelist = $('#category .cart-list');
    if (catelist.find('li').length > 0) {
        return false;
    }else{
        var tpl = '<ul>'
                + '<%for(var i=0;i<data.length;i++){%>'
                + '<li><a href="#list/<%=data[i].id%>" data-goodlist="<%=data[i].id%>"><%=data[i].name%></a></li>'
                + '<%}%>'
                +'</ul>';
        $.when(api.category())
        .then(function(res){
            //console.log(res);
            if (res.status.succeed) {
                var render = template.compile(tpl);
                var html = render(res);
                catelist.html(html)
            }
            return $.getJSON('./server/init.json')
        })
        .then(function(res){
            var colors = new Array();
            colors = res.categoryColor;
            var li = catelist.find('li');
            $.each(li, function(index, val) {
                 val.style.backgroundColor = colors[index].color
            });
        })
    }
}

panelView.login = function(){
    $.when(api.signin({'name':'test','password':'test888'})).then(function(res){
        console.log(res)
    })
}
panelView.main = function(){
    $.when(api.config()).then(function(res){
        console.log(res)
        if (res.status.succeed) {
            $.afui.setTitle(res.data.shop_desc);
        }
        return api.homeData()
    }).then(function(res){
        console.log(res)
        $('#main .content').html(template('mainTpl',res))
        TouchSlide({ 
            slideCell:"#focus",
            titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell:".bd ul", 
            effect:"leftLoop", 
            interTime:'3000',
            autoPlay:true,//自动播放
            autoPage:true //自动分页
        });
        $("img").unveil(200,function(){
            $(this).load(function() {
                this.style.opacity = 1;
            });        
        });                      
    }).then(function(res){
        return api.homeCategory()
    }).then(function(res){
        console.log(res)
        var html = template('indexListTpl',res);
        $('#main .item-list').empty().html(html)
        $("img").unveil(200,function(){
            $(this).load(function() {
                this.style.opacity = 1;
            });        
        });       
    })
}
panelView.search = function(k,i,p,c){
    var data = {
        "filter":{
            "keywords": k || "",
            "category_id": i || "",
            "price_range":"",
            "brand_id":"",
            "sort_by":"id_desc"
        },
        "pagination":{
            "page": p || "1",
            "count": c || "100"
        }
    }    
    //console.log(data)
    $.when(
        api.search(data)
    ).then(function(res){
        //console.log(res)  
        $.afui.hideMask();      
        if (res.status.succeed) {
            var html = template('listTpl',res);
            $('#list .item-list').empty().html(html);
            $.afui.loadContent('#list',false,false,'fade')
            $("img").unveil(100, function() {
              $(this).load(function() {
                this.style.opacity = 1;
              });
            });       
        }
    },function(){
        console.log('error')
    })
}

panelView.goods = function(id){
    return $.when(api.goods(id,'')).then(function(res){
        console.log(res);
        var html = template('goodsTpl',res);
        $('#goods .content').empty().html(html);
        return api.goodsDesc(id,'')
    }).then(function(res){
        console.log(res)
        var data = res.data.replace(/src="/g,'data-src="http://test.shizhencaiyuan.com');
        //console.log(data)
        return $('#goods .detail').html(data);
    }).then(function(res){
        $.afui.hideMask();
        TouchSlide({ 
            slideCell:".scroller",
            titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell:".slide ul", 
            effect:"leftLoop", 
            interTime:'3000',
            autoPlay:true,//自动播放
            autoPage:true //自动分页
        });
    }).then(function(){
        $('#goods .detail img').unveil(100)
        $("#goods .detail img").trigger("unveil");
    })      
}

$.afui.registerDataDirective('[data-cate]',function(){
    $.afui.showMask();
    panelView.category();
})

$.afui.registerDataDirective('[data-goodlist]',function(e){
    var id = $(e).attr('data-goodlist');
    $.afui.showMask();
    panelView.search('',id)        
})
$.afui.registerDataDirective('[data-goods]',function(e){
    var id = $(e).attr('data-goods');
    //console.log(id);
    $.afui.showMask();
    panelView.goods(id)        

})
$.afui.registerDataDirective('[add-cart]',function(e){
    var id = $(e).attr('add-cart');
    console.log(id,'add-cart')
    $.afui.toast({message:'<div class="addCartMes"><i class="icon info"></i><p>已加入购物车</p></div>',position:"cc",delay:2000,autoClose:true})
})

$.afui.registerDataDirective('[data-buy]',function(e){
    var id = $(e).attr('data-buy');
    console.log(id,'buy')
})

$.afui.ready(function(){
    panelView.main();    
});


$(document).ready(function(){

    $('form[name=search]').submit(function(e){        
        panelView.search(this.keywords.value);
        return false;
    })

    $('#goods').on('scroll',function(e){
        //console.log(e)
    })

    $("#goods").bind("panelbeforeload", function(){
     
    });

    $('#list').on('scroll',function(e){
        $(window).trigger("lookup");
    })

    $('#main').bind('panelbeforeload',panelView.main)
    $('#category').bind('panelbeforeload',panelView.category)
    $('#cart').bind('panelbeforeload',function(){
        //panelView.cart
        $.ajax({
            url:'cart.html',
            success:function(res){
                $('#cart').html(res)
            }
        })
    })

    $("#login").on("click", function(){
        signIn();
    });

    $("#register").on("click", function(){
        signUp();
    });


});

function signIn(){
    // SIGNIN SERVER CALL CODE GOES HERE
    valid_login = false;
    if(valid_login){
        $.afui.loadContent("#main", null, null, "fade");
    }else{
        //Example use of the error toast api
        $.afui.toast({
            message:"Invalid Login Combination",
            position:"tc",
            delay:2000,
            autoClose:true,
            type:"error"
        });
    }
}

function signUp(){
    //example client side validation
    if ($("#password").val() === $("#confirmpassword").val()){
        $.afui.loadContent("#main", null, null, "fade");
        $.afui.toast({
            message:"Account Created",
            position:"tc",
            delay:2000,
            autoClose:true,
            type:"success"
        });
    }else{
        $.afui.toast({
            message:"Passwords Don't Match",
            position:"tc",
            delay:2000,
            autoClose:true,
            type:"error"
        });
    }
}

function startApp(){
    // clears all back button history
    $.afui.clearHistory();
    // your app code here
}