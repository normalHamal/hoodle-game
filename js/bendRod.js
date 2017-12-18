(function (ns) {
	var BendRod = ns.BendRod = Hilo.Class.create({
		Extends: Hilo.Container,

		constructor: function(properties) {
			properties = properties || {};
			// 调用父类构造函数
	        BendRod.superclass.constructor.call(this, properties);
	        this.squares =  [
	        	{
	        		x: 439,
	        		y: 97,
	        		width: 30,
	        		height: 3
	        	},
	        	{
	        		x: 486,
	        		y: 117,
	        		width: 3,
	        		height: properties.activeRect[1] + properties.activeRect[3] - 117
	        	}
        	];
        	this.circle  =  {
        		x: 469, 
        		y: 117, 
        		radius: 20
        	};
	    },
	    circle: {},
	    squares: [],
	    /*
	    *	检测碰撞
	    */
	    checkCollision: function (hoodle) {
	    	var b = this.circle;

	    	if (b.x < hoodle.x && b.y > hoodle.y) {
				var distance = Math.sqrt(Math.pow((hoodle.x - b.x), 2) + Math.pow((hoodle.y - b.y), 2))
								- b.radius - hoodle.radius;

				if (distance < 0) {
					//  将弹珠定格在碰撞瞬间的位置
					var theta  = Math.atan2(hoodle.y - b.y, hoodle.x - b.x);
					hoodle.x   += Math.abs(distance) * Math.cos(theta)
					hoodle.y   += Math.abs(distance) * Math.sin(theta);
	            	hoodle.collisionCircle(b);
	            	//  如果撞到了圆角就不用判断下面的矩形了
	            	return true;
				}
			}

			this.squares.forEach(function (s) {
				var hit = false;
				// 圆形和矩形的相交其实就是（圆形的左边界一定小于矩形的右边界，同时圆形的右边界一定大于矩形的左边界）
				// ！其实对矩形和矩形也是同理
				hit = hoodle.x <= s.x + s.width + hoodle.radius && s.x <= hoodle.x + hoodle.radius &&
                  		hoodle.y <= s.y + s.height + hoodle.radius && s.y <= hoodle.y + hoodle.radius;
				// 此处不用管矩形的4个角的碰撞
				if (hit) {
					// 撞击
					if (hoodle.x < s.x) {
						hoodle.x = s.x - hoodle.radius;
						hoodle.collisionSquare('left');
					} else if (hoodle.y < s.y) {
						hoodle.y = s.y - hoodle.radius;
						hoodle.collisionSquare('top');
					} else if (hoodle.x > s.x) {
						hoodle.x = s.x + s.width + hoodle.radius;
						hoodle.collisionSquare('right');
					} else if (hoodle.y > s.y) {
						hoodle.y = s.y + s.height + hoodle.radius;
						hoodle.collisionSquare('bottom');
					}
				}
			});
	    }
	});
})(window.game);