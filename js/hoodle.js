(function (ns) {
	//////////////
	//  private
	//  反射向量
	//  R = I - 2 * (I * N) * N
	//////////////
	var reflectVector = function (vector, normal) {
		//  I * N
		var t = vector.x * normal.x + vector.y * normal.y;
		return {
			x: vector.x - 2 * t * normal.x,
			y: vector.y - 2 * t * normal.y
		}
	}

	var Hoodle = ns.Hoodle = Hilo.Class.create({
		Extends: Hilo.Bitmap,

		constructor: function(properties) {
			properties   = properties || {};
			// 调用父类构造函数
	        Hoodle.superclass.constructor.call(this, properties);
	        // 初始化参数
	        Hilo.util.copy(this, properties, true);
	    	this.speedUpY  = this.gravity = 0.2;
	    	this.force     = this.gravity * 0.3;
	    	this.bounceSquare   = 0.4;
	    	this.bounceCircle   = 0.7;
	    	this.radius    = this.pivotX = this.pivotY = this.width >> 1;
	    	this.moveRange = [-16, -1];
	    	this.x         = this.startX;
	        this.y         = this.startY;
	    },
	    startX:  0,     // 弹珠的起始x坐标
	    startY:  0, 	// 弹珠的起始y坐标
	    gravity: 0, 	// 重力加速度
	    force: 0,		// 水平摩擦力给予小球水平加速度 μg
	    speedUpX: 0,    // 水平加速度
	    speedUpY: 0,    // 垂直加速度
	    bounceSquare: 0,// 弹力变量(针对方形)
	    bounceCircle: 0,// 弹力变量(针对圆形)
	    moveX: 0, 		// 当前弹珠x轴速度
	    moveY: 0,	    // 当前弹珠y轴速度
	    moveRange: [],  // 弹珠初始速度范围
	    radius: 0,      // 弹珠半径
	    isStatic: true, // 弹珠是否已静止
	    activeRect: [], // 活动范围
	    /*
	    *  准备阶段
	    */
	    getReady: function () {
	    	// 初始化参数
	        this.x        = this.startX;
	        this.y        = this.startY;
	        this.speedUpX = 0;
	        this.moveY    = 0;
	        this.startRotate(6000, 360, true)
		},
		startRotate: function (time, angle, loop) {
	        var me = this;
	        me.stopRotate();

	        time = time || 6000;
	        angle = angle || 360;
	        me.rotation = 0;
	        me.rotateTween = Hilo.Tween.to(me, {rotation:angle}, {time:time, loop:loop});
	    },
	    stopRotate: function () {
	        var me = this;
	        if (me.rotateTween) {
	            me.rotateTween.stop();
	            me.rotateTween = null;
	        }
	    },
		/*
		*  开始下落
		*/
		startDown: function (ratio) {
			// 恢复弹珠状态
			this.isStatic = false;
			this.moveX = this.moveRange[1] + (this.moveRange[0] - this.moveRange[1]) * ratio;
		},
		/**
		*  碰撞反弹 (针对方形)
		*/
		collisionSquare: function (direction) {
			if (['left', 'right', 'side'].some(function (i) { return i === direction; })) {
				// 速度反向并减少
				this.moveX *= this.bounceSquare * -1;
			} else {
				// 速度反向并减少
		        this.moveY *= this.bounceSquare * -1;
			}
		},
		/*
        *  碰撞反弹 (针对圆形)
        */
       	collisionCircle: function (centerCircle) {
   			//  将弹珠的速度表示为向量形式
   			var speed = {
   				x: this.moveX,
   				y: this.moveY
   			}
   			//  撞击平面法向量
   			var normal = {
   				x: this.x - centerCircle.x,
   				y: this.y - centerCircle.y
   			}
   			//  将法向量单位化
   			var inv = 1 / Math.sqrt(normal.x * normal.x + normal.y * normal.y);
   			normal.x *= inv;
   			normal.y *= inv;
   			//  反弹
   			speed = reflectVector(speed, normal);

   			this.moveX = speed.x * this.bounceCircle;
   			this.moveY = speed.y * this.bounceCircle;
   			
   			// this.judgeStatic();
       	},
       	/*
	   	*  判断弹珠是否停止并更新弹珠状态
	   	*/
	   	judgeStatic: function () {
	   		// 判断是否速度为0即静止状态
	   		var limit = this.activeRect[3] / 1000;

	        if (Math.abs(this.moveY) <= limit) {
	        	// 垂直方向静止
	        	this.moveY = 0;
	        	// 因为摩擦力存在所以有了水平加速度
	    		this.speedUpX = this.moveX > 0 ? -this.force : this.force;
	    		if (Math.abs(this.moveX) <= limit) {
	    			// 弹珠静止
	    			this.moveX = 0;
	        		this.isStatic = true;
	    		}
	        }
	   	},
		/*
		*  整个弹跳过程
		*/
		onUpdate: function () {
			// 如果已经静止则停止弹跳
		    if(this.isStatic) return;

		    //  垂直位移
		    this.moveY += this.speedUpY;
		    //  水平位移
		    this.moveX += this.speedUpX;
		    //   y轴坐标
		    var y = this.y + this.moveY;
		    //   x轴坐标
		    var x = this.x + this.moveX;
		    //   弹珠运行界限
		    var limitY = this.activeRect[1] + this.activeRect[3] - this.pivotY;
		    var limitX = this.activeRect[0] + this.activeRect[2] - this.pivotX;

		    if (y > limitY) {
		        // 弹珠碰触地面
		        this.y = limitY;
		        this.collisionSquare('bottom');

		        this.judgeStatic();
		    } else if (y < this.activeRect[1]) {
		    	this.y = this.activeRect[1];
		    	this.collisionSquare('top');
		    } else {
		    	// 弹珠没有碰到地面
				this.y = y;
		    }

		    if (x < this.activeRect[0] + this.pivotX || x > limitX) {
		    	// 弹珠触碰墙壁
	    		this.x = x > limitX ? limitX : this.activeRect[0] + this.pivotX;
	    		this.collisionSquare('side');
	    	} else {
	    		// 弹珠没有触碰墙壁
	    		this.x = x;
	    	}
		}
	});
})(window.game);