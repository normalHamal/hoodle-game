(function (ns) {
	var Hoodle = ns.Hoodle = Hilo.Class.create({
		Extends: Hilo.Bitmap,
		// 构造函数
		constructor: function(properties) {
			properties   = properties || {};
			// 调用父类构造函数
	        Hoodle.superclass.constructor.call(this, properties);
	        // 初始化参数
	        Hilo.copy(this, properties, true);
	    },
	    startX:  0,     // 弹珠的起始x坐标
	    startY:  0, 	// 弹珠的起始y坐标
	    stageX:  0,     // 舞台的宽度
	    stageY:  0, 	// 舞台的高度
	    gravity: 0, 	// 重力加速度
	    move: 0, 		// 当前弹珠位移
	    isStatic: true, // 弹珠是否已静止
	    up:   0,        // 弹珠往上弹次数
	    // 准备阶段
	    getReady: function () {
	    	//设置起始坐标
	        this.x = this.startX;
	        this.y = this.startY;
	        // 设置加速度
	    	this.gravity = 1;
		},
		// 开始下落
		startDown: function () {
			// 恢复弹珠状态
			this.isStatic = false;
			// 设置弹珠弹跳开始时间
			this.startTime = Date.now();
		},
		// 整个弹跳过程
		onUpdate: function () {
			// 如果已经静止则停止弹跳
		    if(this.isStatic) return;

		    //  下落位移
		    this.move += this.gravity;
		    //   y轴坐标
		    var y = this.y + this.move;

		    if(y >= this.stageY - this.height) {
		        // 弹珠碰触地面
		        this.y = this.stageY - this.height;
		        // 速度反向(这里假设热量转化1/5)
		        this.move *= -0.8;
		        // 判断是否速度为0即静止状态
		        if (Math.abs(this.move) <= this.stageY / 1000) {
		        	// 弹珠静止
		        	this.isStatic = true;
		        }
		        // 设置弹珠弹跳次数
			    this.up = this.move > 0 ? this.up : this.up + 1;
		    } else {
		    	this.y = y;
		    }
		}
	});
})(window.game)