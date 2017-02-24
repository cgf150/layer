var layer=(function(){
	var isInit=false,layerObj=null,cancelHandler=null,confirmHandler=null;

	// layer创建
	function createLayer(){
		layerObj=document.createElement('div');
		layerObj.className="layer";
		layerObj.wrap=document.createElement('div');
		layerObj.wrap.className="layer_wrap";
		
		// layer头部创建
		layerObj.header=document.createElement('div');
		layerObj.header.className="layer_header"
			layerObj.header_tittle=document.createElement('h4');
			layerObj.header_tittle.className="layer_title";
			layerObj.header_close=document.createElement('i');
			layerObj.header_close.className="icon-remove";
			layerObj.header.appendChild(layerObj.header_tittle);
			layerObj.header.appendChild(layerObj.header_close);

		// layer身体
		layerObj.wrap.body=document.createElement('div');
		layerObj.wrap.body.className="layer_body";

		// layer底部创建
		layerObj.wrap.foot=document.createElement('div');
		layerObj.wrap.foot.className="layer_footer";
		layerObj.wrap.foot.confirmBtn=document.createElement('button');
		layerObj.wrap.foot.confirmBtn.className="layer_btn_confirm";
		layerObj.wrap.foot.confirmBtn.innerHTML="确定";
		layerObj.wrap.foot.cancelBtn=document.createElement('button');
		layerObj.wrap.foot.cancelBtn.className="layer_btn_cancel";
		layerObj.wrap.foot.cancelBtn.innerHTML="取消";

		layerObj.wrap.foot.appendChild(layerObj.wrap.foot.confirmBtn);
		layerObj.wrap.foot.appendChild(layerObj.wrap.foot.cancelBtn);

		layerObj.appendChild(layerObj.wrap);
		layerObj.wrap.appendChild(layerObj.header);
		layerObj.wrap.appendChild(layerObj.wrap.body);
		layerObj.wrap.appendChild(layerObj.wrap.foot);
		document.body.appendChild(layerObj);

		// isInit - 判断layer是否已经创建完成
		isInit=true;
	}

	return {
		open:function(data,sTemp,callback){
			if(!isInit){ createLayer(); }
			var that=this;
			var confirmBtn=layerObj.wrap.foot.confirmBtn;
			var cancelBtn=layerObj.wrap.foot.cancelBtn;
			var closeBtn=layerObj.header_close;
			var wrap=layerObj.wrap;

			// 初始化
			confirmBtn.style.display="inline";
			cancelBtn.style.display="inline";
			confirmBtn.innerHTML=data?(data.confirmText?data.confirmText:'确定'):'确定';
			cancelBtn.innerHTML=data?(data.cancelText?data.cancelText:'取消'):'取消';
			layerObj.header_tittle.innerText=data?(data.title?data.title:'弹出框标题'):'弹出框标题';

			// 数据替换
			var rData=/\{([^\{\}]*)\}/ig;
			if(data){
				sTemp=sTemp.replace(rData,function(raw,get){
					return data[get]?data[get]:raw;
				});
			}

			layerObj.wrap.body.innerHTML=sTemp;

			// 入场动画
			$(layerObj).fadeIn('fast',function(){
				$(layerObj.wrap).fadeIn('fast');
				layerObj.wrap.style.marginTop=-layerObj.wrap.offsetHeight/2+'px';
				$(layerObj.wrap).animate({
					top:'50%'
				},'slow')
			})

			// 事件绑定
			util.on(confirmBtn,'click',confirmHandler=function(){
				if(callback&&callback.confirm){
					callback.confirm();
				}
			})
			util.on(cancelBtn,'click',cancelHandler=function(){
				that.close();

				if(callback&&callback.cancel){
					callback.cancel();
				}
			})
			util.on(closeBtn,'click',cancelHandler)
		},
		close:function(){
			// 出场动画
			$(layerObj.wrap).fadeOut('slow',function(){
				$(layerObj.wrap).css({
					top:'-100%'
				})
				$(layerObj).fadeOut();

				util.off(layerObj.wrap.foot.confirmBtn,'click',confirmHandler);
				util.off(layerObj.wrap.foot.cancelBtn,'click',cancelHandler);
			})
		},
        alert: function(data, sText, callback) { /*alert提示*/
            layer.open(data, sText, callback);
            layerObj.wrap.foot.cancelBtn.style.display='none';
        	var that=this,confirmBtn=layerObj.wrap.foot.confirmBtn;

        	// 与内容框逻辑不一样的地方：确定按钮的点击事件除了确定逻辑之外还需要调用close方法把整个layer隐藏
            util.off(confirmBtn, 'click', confirmHandler);
            util.on(confirmBtn, 'click', confirmHandler = function() {
            	if(callback&&callback.confirm){
               	 	callback.confirm();
            	}
                that.close();
            })
        },
        confirm:function(data, sText, callback){ /*confirm 提示 此逻辑与内容框逻辑一样*/
            layer.open(data, sText, callback);
        }
	}
})();