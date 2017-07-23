/**
 * Created by WLouis on 2017/3/22.
 */
//如何在一个网站或者一个页面，去书写你的JS代码：

//1.js的分层(功能) : jquery(tools)  组件(ui)  应用(app), mvc(backboneJs)
//2.js的规划(管理) : 避免全局变量和方法(命名空间，闭包，面向对象) , 模块化(seaJs,requireJs)
window.onload = function () {
    mv.app.toTip();
    mv.app.toBanner();
    mv.app.toSel();
    mv.app.toRun();
};

var mv = {};//命名空间管理模式

mv.tools = {};//通用方法

//让所有的浏览器公用，所以建立底层的tools方法
//获取类名
mv.tools.getByClass = function (oParent,sClass) {
    var aEle = oParent.getElementsByTagName('*');
    var arr = [];
    for (var i=0;i<aEle.length-1;i++){
         if(aEle[i].className == sClass){
             arr.push(aEle[i]);
         }
    }
    return arr;//把找到的class元素返回到数组中
};
//获取最终样式
//两个参数：操作对象和属性
mv.tools.getStyle = function (obj,attr) {
    if (obj.currentStyle){
        return obj.currentStyle[attr];
    }
    else {
        return getComputedStyle(obj,false)[attr];//兼容性
    }
};

mv.ui = {};//组件

//单击输入框，search website 消失，单击空白或者为空时，search website存在
mv.ui.textChange = function (obj,str) {

     obj.onfocus = function () {
          if(this.value == str){
              this.value = '';
          }
     };

    obj.onblur = function () {
        if(this.value == ''){
            this.value = str;
        }
    };
};
//淡入效果的组件
mv.ui.fadeIn = function (obj) {
    //取消淡入淡出抖动
    var iCur = mv.tools.getStyle(obj,'opacity');
    if(iCur == 1){return false;}//当透明度为100时不需要淡入

    var value = 0;
    clearInterval(obj.timer);//清理定时器
    //设置定时器，有运动效果
    obj.timer = setInterval(function () {
        var iSpeed = 5;
        if (value == 100){
            clearInterval(obj.timer);
        }
        else{
            value += iSpeed;//累加value值
            obj.style.opacity = value/100;//透明度0~1
            obj.style.filter = 'alpha(opacity='+value+')';//透明度兼容模式
        }
    },30);
};
//淡出效果的组件
mv.ui.fadeOut = function (obj) {
    //取消淡入淡出抖动
    var iCur = mv.tools.getStyle(obj,'opacity');
    if(iCur == 0){return false;}//当透明度为0时不需要淡出

    var value = 100;
    clearInterval(obj.timer);//清理定时器
    //设置定时器，有运动效果
    obj.timer = setInterval(function () {
        var iSpeed = -5;
        if (value == 0){
            clearInterval(obj.timer);
        }
        else{
            value += iSpeed;//累加value值
            obj.style.opacity = value/100;//透明度0~1
            obj.style.filter = 'alpha(opacity='+value+')';//透明度兼容模式
        }
    },30);
};
//滑动图片的向左运动
mv.ui.moveLeft = function (obj,old,now) {
    clearInterval(obj.timer);//清零定时器
    obj.timer = setInterval(function () {
        var iSpeed = (now - old)/10;
        //取整数操作，向上和向下取整数
        iSpeed = iSpeed >0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

        if(now == old){
            clearInterval(obj.timer);
        }
        else {
            old += iSpeed;
            obj.style.left = old + 'px';
        }
    },30);
};

mv.app = {};//具体应用

//文字的显现和消失
mv.app.toTip = function () {
    var oText1 = document.getElementById('text1');
    var oText2 = document.getElementById('text2');

    mv.ui.textChange(oText1,'Search website');
    mv.ui.textChange(oText2,'Search website');

};
//轮播图片
mv.app.toBanner = function () {
    var oAd = document.getElementById('ad');
    var aLi = oAd.getElementsByTagName('li');

    var oPrevBg = mv.tools.getByClass(oAd,'prev_bg')[0];//第一个类名
    var oNextBg = mv.tools.getByClass(oAd,'next_bg')[0];//第一个类名

    var oPrev = mv.tools.getByClass(oAd,'prev')[0];
    var oNext = mv.tools.getByClass(oAd,'next')[0];

    //定义一个标识进行累加
    var iNow = 0;

    //开一个定时器
    var timer = setInterval(auto,3000);//3秒钟轮播一次

    function auto() {

         if(iNow == aLi.length-1){
               iNow = 0;
         }
         else{
             iNow++;
         }
        //     淡出效果
        for(var i=0; i<aLi.length; i++){
            mv.ui.fadeOut(aLi[i]);
        }
        //淡入效果
        mv.ui.fadeIn(aLi[iNow]);
    }

    function autoPrev() {

        if(iNow == 0){
            iNow = aLi.length-1;
        }
        else{
            iNow--;
        }
        //     淡出效果
        for(var i=0; i<aLi.length; i++){
            mv.ui.fadeOut(aLi[i]);
        }
        //淡入效果
        mv.ui.fadeIn(aLi[iNow]);
    }
    //防止抖动加了连等，因为a和span并列触发
    oPrevBg.onmouseover = oPrev.onmouseover = function(){
        oPrev.style.display = 'block';
        clearInterval(timer);//清零定时器，让图片停止
    };
    oNextBg.onmouseover = oNext.onmouseover = function(){
        oNext.style.display = 'block';
        clearInterval(timer);
    };
    oPrevBg.onmouseout = oPrev.onmouseout = function(){
        oPrev.style.display = 'none';
        timer = setInterval(auto,3000);//3秒钟轮播一次
    };
    oNextBg.onmouseout = oNext.onmouseout = function(){
        oNext.style.display = 'none';
        timer = setInterval(auto,3000);//3秒钟轮播一次
    };
    //点击事件
    oPrev.onclick = function () {
        autoPrev();
    };
    oNext.onclick = function () {
        auto();
    };
};
//下拉菜单
mv.app.toSel = function () {
    var oSel = document.getElementById('sel1');
    var aDd = oSel.getElementsByTagName('dd');
    var aUl = oSel.getElementsByTagName('ul');
    var aH2 = oSel.getElementsByTagName('h2');

//显示和隐藏ul
    for (var i=0;i<aDd.length;i++){
        aDd[i].index = i;
        aDd[i].onclick = function (ev) {
            //为了取消冒泡，建立的变量
            //noinspection JSDuplicatedDeclaration
            var ev = ev || window.event;
            //为了不让this指向document，创建一个变量存储指向aDd的This
            var This = this;
            //先隐藏让指定的打开
            for (var i=0;i<aUl.length;i++){
                aUl[i].style.display = 'none';
            }
            aUl[this.index].style.display = 'block';

            document.onclick = function () {
                //This应该是指向aDd，而不是document
                aUl[This.index].style.display = 'none';
            };
            ev.cancelBubble = true;//取消冒泡
        };
    }

    //选择menu1~menu3函数方法
    for(var i=0;i<aUl.length;i++){

        //根据ul的索引找到h2
        aUl[i].index = i;

        //采用闭包的的写法
        (function (ul) {

            var aLi = ul.getElementsByTagName('li');

            for(var i=0;i<aLi.length;i++){
                aLi[i].onmouseover = function () {
                    this.className = 'active';
                };
                aLi[i].onmouseout = function () {
                    this.className = '';
                };
                aLi[i].onclick = function (ev) {
                    //为了取消冒泡，建立的变量
                    //noinspection JSDuplicatedDeclaration
                    var ev = ev || window.event;

                    //this.parentNode表示找到Li的父类ul
                    //this.innerHTML表示找到当前的li的值
                    aH2[this.parentNode.index].innerHTML = this.innerHTML;

                    ev.cancelBubble = true;
                    this.parentNode.style.display = 'none';
                };
            }
        })(aUl[i]);
    }
};
//滚动图片
mv.app.toRun = function () {
    var oRun = document.getElementById('run1');
    var oUl = oRun.getElementsByTagName('ul')[0];
    var aLi = oUl.getElementsByTagName('li');

    var oPrev = mv.tools.getByClass(oRun,'prev')[0];
    var oNext = mv.tools.getByClass(oRun,'next')[0];

    //定义标识
    var iNow = 0;
    oUl.innerHTML += oUl.innerHTML;
   //aLi[0].offsetWidth表示第一个li元素的宽度
    oUl.style.width = aLi.length * aLi[0].offsetWidth + 'px';

    oPrev.onclick = function () {

        //完成无缝切换效果的滑动图片
        if(iNow == 0){
            iNow = aLi.length/2;
            oUl.style.left = -oUl.offsetWidth/2 + 'px';
        }

        mv.ui.moveLeft(oUl,-iNow*aLi[0].offsetWidth,-(iNow-1)*aLi[0].offsetWidth);
        iNow--;//下一次点击
    };

    oNext.onclick = function () {

        //完成无缝切换效果的滑动图片
        if(iNow == aLi.length/2){
            iNow = 0;
            oUl.style.left = 0;
        }

        mv.ui.moveLeft(oUl,-iNow*aLi[0].offsetWidth,-(iNow+1)*aLi[0].offsetWidth);

        iNow++;//下一次点击
    };

};
