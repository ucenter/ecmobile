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
                //navigator.app.exitApp();
            }                           
        }