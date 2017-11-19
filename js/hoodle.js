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
		Extends: Hilo.Sprite,

		constructor: function(properties) {
			properties   = properties || {};
			// 调用父类构造函数
	        Hoodle.superclass.constructor.call(this, properties);
	        // 往精灵动画序列中增加帧
	        this.addFrame(properties.atlas.getSprite('hoodle'));
	        // 设置精灵动画的帧间隔
	        this.interval = 7;
	        // 初始化参数
	        Hilo.copy(this, properties, true);
	        // 设置重力加速度
	    	this.speedUpY = this.gravity = 0.3;
	    	//  假设摩擦系数为 0.4
	    	this.force    = this.gravity * 0.4;
	    	// 设置弹力变量
	    	this.bounce   = 0.8;
	    	//  设置弹珠半径
	    	this.radius   = this.width >> 1;
	    },
	    startX:  0,     // 弹珠的起始x坐标
	    startY:  0, 	// 弹珠的起始y坐标
	    stageX:  0,     // 舞台的宽度
	    stageY:  0, 	// 舞台的高度
	    gravity: 0, 	// 重力加速度
	    force: 0,		// 水平摩擦力给予小球水平加速度 μg
	    speedUpX: 0,    // 水平加速度
	    speedUpY: 0,    // 垂直加速度
	    bounce: 0,      // 弹力变量
	    moveX: 0, 		// 当前弹珠x轴速度
	    moveY: 0,	    // 当前弹珠y轴速度
	    radius: 0,      // 弹珠半径
	    isStatic: true, // 弹珠是否已静止
	    /*
	    *  准备阶段
	    */
	    getReady: function () {
	    	// 初始化参数
	        this.x        = this.startX;
	        this.y        = this.startY;
	        this.speedUpX = 0;
	        this.moveX    = -10;
	        this.moveY    = 0;
	        this.interval = 7;
	        this.play();
		},
		/*
		*  开始下落
		*/
		startDown: function () {
			// 恢复弹珠状态
			this.isStatic = false;
		},
		/*
        *  碰撞反弹 (针对圆形)
        */
       	collisionCircle: function (obstacle, centerObstacle) {
   			//  将弹珠的速度表示为向量形式
   			var speed = {
   				x: this.moveX,
   				y: this.moveY
   			}
   			//  撞击平面法向量
   			var normal = {
   				x: this.x - centerObstacle.x,
   				y: this.y - centerObstacle.y
   			}
   			//  将法向量单位化
   			var inv = 1 / Math.sqrt(normal.x * normal.x + normal.y * normal.y);
   			normal.x *= inv;
   			normal.y *= inv;
   			//  反弹
   			speed = reflectVector(speed, normal);

   			this.moveX = speed.x * this.bounce;
   			this.moveY = speed.y * this.bounce;
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

		    if(y > this.stageY - this.height) {
		        // 弹珠碰触地面
		        this.x = x;
		        this.y = this.stageY - this.height;
		        // 速度反向并减少
		        this.moveY *= this.bounce * -1;
		        // 判断是否速度为0即静止状态
		        if (Math.abs(this.moveY) <= this.stageY / 1000) {
		        	// 垂直方向静止
		        	this.moveY = 0;
		        	// 因为摩擦力存在所以有了水平加速度
		    		this.speedUpX = this.moveX > 0 ? -this.force : this.force;
		    		if (Math.abs(this.moveX) <= this.stageY / 1000) {
		    			// 弹珠静止
		    			this.moveX = 0;
		        		this.isStatic = true;
		        		this.stop();
		    		}
		        }
		    } else {
		    	// 弹珠没有碰到地面
				this.y = y;
		    }

		    if (x < 0 || x > this.stageX - this.width) {
		    	// 弹珠触碰墙壁
	    		this.x      = x < 0 ? 0 : this.stageX - this.width;
	    		// 速度反向并减少
	    		this.moveX *= this.bounce * -1;
	    	} else {
	    		// 弹珠没有触碰墙壁
	    		this.x = x;
	    	}
		}
	});
})(window.game)