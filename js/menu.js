    var searchModel = {
        url: 'server/proxy.php',
        detail:{},
        menuData:{},
        menuCateData:{},
        getMenuDemo:function(){
            $.ajax({
                url: 'server/menu-demo-data.json',
                dataType:'json',
                timeout:5000,
                success:function(res){
                    //console.log(res);              
                    handler(res);
                }
            });
        }
    }

    function handler(res){
        $.afui.hideMask();
        if (typeof res != 'object') {
            res = $.parseJSON(res);
        }
        searchModel.menuData = res.result;
        var tpl = template('menuListTpl',searchModel.menuData);
        $('#menu-search .result .list').empty().append(tpl);
        $.afui.loadContent('#menu-search',false,false);
    }

    //查找单品
    function getMenu(menu){
        $.afui.showMask();  
        if (menu) {
            $.ajax({
                url:searchModel.url+'?menu='+menu,
                type:'GET',
                timeout:5000,
                success:function(res){
                    console.log(typeof res);                
                    handler(res);           
                },
                complete:function(XMLHttpRequest,textStatus){
                    //console.log(XMLHttpRequest,textStatus);
                }
            });
        }
    }

    function getSingleById(id){
        return $.getJSON('server/menu-single-data.json');
    }

    //获取全部菜谱分类
    function getCategory(){
        $.ajax({
            type:'get',
            url: 'server/menu-category.json',
            dataType:'json',
            timeout:5000,
            success:function(res){
                console.log('分类数据：',res);
                searchModel.menuCateData = res;
                var tpl = template('categoryTpl',searchModel.menuCateData);
                $('#menu-category .cate').append(tpl);            
            }
        }); 
    }

    //获取分类列表全部数据
    function getCateMenuData(cid){
        $.afui.showMask();
        $.ajax({
            //url: searchModel.url,
            url: 'server/menu-demo-data.json',
            type: 'GET',
            dataType: 'json',
            data: {cid: cid},
        })
        .done(function(res) {
            console.log("success",res);
            handler(res);
        })
        .fail(function() {
            console.log("error");
            $.afui.hideMask();
        });
        
    }


$(function(){


    //初始化测试数据
    //searchModel.getMenuDemo();
    getCategory();

    $('#menu-search').on('panelbeforeload',function(what){       
        setTimeout(function(){
            var hash = what.currentTarget.baseURI.split('?')[1];
            console.log(hash)
            getCateMenuData(hash);
        },0)
    })

    $.afui.registerDataDirective('[data-link]',function(e){
        var id = $(e).attr('data-link');
        searchModel.detail.data = searchModel.menuData.data[id];

        //加载菜单详情panel页面
        var tpl = template('menuDetailTpl',searchModel.detail);
        //console.log(searchModel.detail)
        $('#menu-detail').html(tpl);
        $.afui.setTitle(searchModel.detail.data.title);        
    })

    // $('#menu-detail').bind('panelbeforeload',function(what){
    //     setTimeout(function(){
    //         console.log(what)
    //         var hash = what.currentTarget.baseURI.split('?')[1];
    //         var i = hash.split('/')[0];
    //         var id= hash.split('/')[1];
    //         console.log('i='+i,'id='+id);
    //         if(searchModel.menuData.data){
    //             //将缓存数据赋值
    //             searchModel.detail.data = searchModel.menuData.data[i];
                
    //             //加载菜单详情panel页面
    //             var tpl = template('menuDetailTpl',searchModel.detail);
    //             //console.log(searchModel.detail)
    //             $('#menu-detail').html(tpl);
    //             $.afui.setTitle(searchModel.detail.data.title);
    //         }else{
    //             $.when(getSingleById(id)).then(function(res){
    //                 console.log(res);
    //                 if (res.resultcode === '200') {
    //                     searchModel.detail.data = res.result.data[0];
    //                     console.log(searchModel.detail);
    //                     $('#menu-detail').html(template('menuDetailTpl',searchModel.detail));
    //                     $.afui.setTitle(searchModel.detail.data.title);                        
    //                 }
    //             })
    //         }

    //     },100)
    // })

    //搜索事件绑定
    $('#menu-category [name=search-form]').bind('submit',function (e) {        
        e.preventDefault();
        var v = $(this).children('input').val();
        if (v) {        
            getMenu(v);
        }else{
            return false;
        }
    }); 

});
