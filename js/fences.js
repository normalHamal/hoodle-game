(function (ns) {
	var Fences = ns.Fences = Hilo.Class.create({
		Extends: Hilo.Container,

		constructor: function(properties) {
			properties = properties || {};
			// 调用父类构造函数
	        Fences.superclass.constructor.call(this, properties);
			// 初始化参数
	        Hilo.util.copy(this, properties, true);

			this.amount          = 6;
			this.paddingX        = [52, 51, 51, 51, 51, 51];
			this.topCircleRadius = 3;

			this.createFences(properties.image);
	    },
	    amount: 0,
	    paddingX: [],
	    activeRect: [],
	    topCircleRadius: 0,
	    /*
	    *	创建障碍物
	    */
	    createFences: function (image) {
	    	for (var i = 0, l = this.amount; i < l; i += 1) {
	    		var fence = new Hilo.Bitmap({
	    			id: 'fence' + i,
	    			image: image
	    		}).addTo(this);

	    		// 设置障碍物的位置
	    		this.setPosition(fence, i);
	    	}
	    },
	    /*
	    *	设置障碍物位置
	    */
	    setPosition: function (fence, index) {
	    	fence.x = this.paddingX.slice(0, index + 1).reduceRight(function(a, b) {
			  	return a + b;
			}) + this.activeRect[0];
			fence.y = this.activeRect[1];
	    },
	    /*
	    *	检测碰撞
	    */
	    checkCollision: function (hoodle) {
	    	//  遍历所有障碍物
	    	for(var i = 0, l = this.children.length; i < l; i += 1) {
	    		var fence = this.children[i];
       			//	碰撞
	            if (hoodle.hitTestObject(fence, true)) {
	            	// 将弹珠定格在碰撞瞬间的位置

	            	// 判断撞击左边
	            	if (hoodle.y > fence.y + this.topCircleRadius && hoodle.x > fence.x - hoodle.radius && hoodle.x
	            		 < fence.x) {
	            		hoodle.x = fence.x - hoodle.radius;
	            		// 弹珠做出反应
	            		hoodle.collisionSquare('left');
	            	}
	            	// 判断撞击右边
	            	else if (hoodle.y > fence.y + this.topCircleRadius && hoodle.x < fence.x + fence.width + hoodle.radius &&
	            		 hoodle.x > fence.x) {
	            		hoodle.x = fence.x + fence.width + hoodle.radius;
	            		// 弹珠做出反应
	            		hoodle.collisionSquare('right');
	            	}
	            	// 判断撞击上边
	            	else {
			    		//  障碍物上半圆心
			       		var centerFence = {
			       			x: fence.x + this.topCircleRadius,
			       			y: fence.y + this.topCircleRadius
			       		};
			       		//  障碍物上半中心点和弹珠中心点距离与两个半径之和的差值
		       			var distance = Math.sqrt(Math.pow((hoodle.x - centerFence.x), 2) +
		       					   			Math.pow((hoodle.y - centerFence.y), 2)) -
		       									(hoodle.radius + this.topCircleRadius);
		       			//	碰撞
			            if (distance < 0) {
			            	//  将弹珠定格在碰撞瞬间的位置
			            	var theta = Math.atan2(hoodle.y - centerFence.y, hoodle.x - centerFence.x);
			            	hoodle.x += Math.abs(distance) * Math.cos(theta)
			            	hoodle.y += Math.abs(distance) * Math.sin(theta);
			            	//  弹珠做出反应
			            	hoodle.collisionCircle(centerFence);
			            } else {
			            	return false;
			            }

	            	}
	            	return true;
	            }
	        }
	        return false;
	    }
	});
})(window.game);