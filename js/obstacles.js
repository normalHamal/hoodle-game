(function (ns) {
	var Obstacles = ns.Obstacles = Hilo.Class.create({
		Extends: Hilo.Container,

		constructor: function(properties) {
			properties = properties || {};
			// 调用父类构造函数
	        Obstacles.superclass.constructor.call(this, properties);
			// 初始化参数
	        Hilo.util.copy(this, properties, true);
	        // 不同颜色障碍物对应的图片位置
	        this.obstacleImages = [
    			  {color: 'blue',   rect: [0,0,20,20]}
    			, {color: 'red',    rect: [0,20,20,20]}
    			, {color: 'yellow', rect: [0,40,20,20]}
    			, {color: 'green',  rect: [0,60,20,20]}
    			, {color: 'purple', rect: [0,80,20,20]}
	    	];
			// 障碍物容器的内边距 (左右边距和上下边距)
			this.paddingX   = 30;
			this.paddingY   = 50;
			// 障碍物最小间距 (水平间距和垂直间距)
			this.baseSpace  = 40;
			// 浮动间距最大值 (间距  = 最小间距 + 浮动间距)
			this.floatSpace = 23;
	    	
	    	this.createObstacles(properties.image);
	    },
	    amount: 0,
	    obstacleImages: [],
	    paddingX: 0,
	    paddingY: 0,
	    baseSpace: 0,
	    floatSpace: 0,
	    startX: 0,
	    startY: 0,
	    activeRect: [],
	    /*
	    *	创建障碍物
	    */
	    createObstacles: function (image) {
	    	for (var i = 0, l = this.amount; i < l; i += 1) {
	    		// 随机创建不同颜色的障碍物
	    		// 障碍物被添加到容器内的深度会逐步提升
	    		var obstacle = new Hilo.Bitmap({
	    			id: 'obstacle' + i,
	    			image: image,
	    			rect: this.obstacleImages[0 + Math.random() * 4 >> 0].rect
	    		}).addTo(this);
	    		
	    		// 设置障碍物的位置
	    		this.setPosition(obstacle, i);
	    		//  增加拖拽功能
	    		Hilo.util.copy(obstacle, Hilo.drag);
				obstacle.startDrag(this.activeRect);
	    	}
	    },
	    /*
	    *	设置障碍物位置
	    */
	    setPosition: function (obstacle, index) {
	    	// startX += index === 0 ? this.paddingX + Math.random() * 32 >> 0 : 60 + Math.random() * 32 >> 0;
	    	if (index === 0) {
	    		this.startX = this.floatSpace + Math.random() * this.paddingX >> 0;
	    		this.startY = this.floatSpace + Math.random() * this.paddingY >> 0;
	    	} else {
	    		this.startX += this.baseSpace + Math.random() * this.floatSpace >> 0;
	    	}

	    	var overflowX = this.startX + obstacle.width + this.paddingX - this.width;
            if (overflowX > 0) {
                this.startX = overflowX + this.paddingX;
                this.startY += this.baseSpace + Math.random() * this.floatSpace >> 0;
            }
            // obstacle.x = overflowX > 0 ? (this.startX = overflowX + this.paddingX, this.startY += this.baseSpaceY + Math.random() * this.floatSpace >> 0) : this.startX;
            var overflowY = this.startY + obstacle.height + this.paddingY - this.height;
            obstacle.y = overflowY > 0 ? this.startY - overflowY : this.startY;

            obstacle.x = this.startX + this.activeRect[0];
            obstacle.y += this.activeRect[1];
	    },
	    /*
	    *	重置障碍物位置（并不重新创建而只是改变位置）
	    */
	    resetObstacles: function () {
	    	// 将容器的所有子元素乱序
	    	this.sortChildren(function () {
	    		return 0.5 - Math.random();
	    	});
	    	// 然后重新设置位置
	    	this.children.forEach(function (child, index) {
	    		// 设置障碍物的位置
	    		this.setPosition(child, index);
	    	}.bind(this));
	    },
	    /*
	    *	检测碰撞
	    */
	    checkCollision: function (hoodle) {
	    	if (this.children.length === 0) return;
	    	
	    	//  障碍物半径
   			var obstacleRadius = this.children[0].width >> 1;

       		//  遍历所有障碍物
	    	for(var i = 0, l = this.children.length; i < l; i += 1) {
	    		var obstacle = this.children[i];
	    		//  障碍物圆心
	       		var centerObstacle = {
	       			x: obstacle.x + obstacle.width / 2,
	       			y: obstacle.y + obstacle.height / 2
	       		};
	       		//  障碍物中心点和弹珠中心点距离与两个半径之和的差值
       			var distance = Math.sqrt(Math.pow((hoodle.x - centerObstacle.x), 2) +
       					   			Math.pow((hoodle.y - centerObstacle.y), 2)) -
       									(hoodle.radius + obstacleRadius);
       			//	碰撞
	            if (distance < 0) {
	            	//  将弹珠定格在碰撞瞬间的位置
	            	var theta = Math.atan2(hoodle.y - centerObstacle.y, hoodle.x - centerObstacle.x);
	            	hoodle.x += Math.abs(distance) * Math.cos(theta)
	            	hoodle.y += Math.abs(distance) * Math.sin(theta);
	            	//  弹珠做出反应
	            	hoodle.collisionCircle(centerObstacle);
	            	return true;
	            }
	        }
	        return false;
	    }
	});
})(window.game)