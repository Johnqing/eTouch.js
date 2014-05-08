(function(window){

	var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
	var hasTouch = 'ontouchstart' in window && !isTouchPad;

	// 不支持touch事件直接报错
	if(!hasTouch) 
			throw new Error('Your browser does not support the onTouch！');

	var noop = function(){}

	var defalutConfig = {
			onStart: noop,
			onMove: noop,
			onEnd: noop
	}

	var ETouch = function(node, config){

		this.config = defalutConfig;		
		this.hasTouch = hasTouch;
		this.touchStart = hasTouch ? 'touchstart' : 'mousedown';
		this.touchMove = hasTouch ? 'touchmove' : '';
		this.touchEnd = hasTouch ? 'touchend' : 'mouseup';

		this.node = node;

		this.set(config);
		this.bind();

	}
	ETouch.prototype = {
		set: function(config){
			// config 传入的是 函数的话，监听完成
			if(typeof config == 'function'){
				this.done = config;
				return;
			}

			for(var key in config){
				this.config[key] = config[key];
			}

			this.done = this.config.onEnd;
		},
		bind: function(){
			var that = this;
			var tabsNode = this.node;

			var touchEvent = {
				TStart: function(ev){
					that.sY = void 0;
					that.distX = 0;
					//获得屏幕上第一个touch
					var point = that.hasTouch ? ev.touches[0] : ev;

					that.startX = point.pageX;
					that.startY = point.pageY;

					that.config.onStart && that.config.onStart.call(that);

					// move 事件
					tabsNode.addEventListener(that.touchMove, touchEvent.TMove);
					// end 事件
					tabsNode.addEventListener(that.touchEnd, touchEvent.TEnd);


				},

				TMove: function(ev){
					// 多点或者缩放
					if(that.hasTouch){
						if(ev.touches.length > 1 || ev.scale && ev.scale !==1) return;
					}

					var point = that.hasTouch ? ev.touches[0] : ev;

					that.distX = point.pageX - that.startX;
					that.distY = point.pageY - that.startY;

					that.sY = that.sY || Math.abs(that.distX) < Math.abs(that.distY);

					if(!that.sY){
						ev.preventDefault()
						that.config.onMove && that.config.onMove.call(that);
					}

				},
				TEnd: function(ev){
					if(!that.distX) return
					ev.preventDefault();

					if(!that.sY){
						that.done && that.done.call(this);
					}

					tabsNode.removeEventListener(that.touchMove, touchEvent.TMove);
					tabsNode.removeEventListener(that.touchEnd, touchEvent.TEnd);
				}
			}

			tabsNode.addEventListener(that.touchStart, touchEvent.TStart)

		}
	}
	// 对外接口
	window.eTouch = function(node, config){

		var nodes = document.querySelectorAll(node);
		var len = nodes.length;
		for (var i = 0; i < len; i++) {
			new ETouch(nodes[i], config)
		};		
	}
	window.et = window.eTouch;
})(this);