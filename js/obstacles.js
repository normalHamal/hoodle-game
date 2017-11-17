(function (ns) {
	var Obstacles = ns.Obstacles = Hilo.Class.create({
		Extends: Hilo.Bitmap,
		// 构造函数
		constructor: function(properties) {
			properties = properties || {};
			// 调用父类构造函数
	        Obstacles.superclass.constructor.call(this, properties);
			// 初始化参数
	        Hilo.copy(this, properties, true);
	        // 不同颜色障碍物对应的图片位置
	        this.obstacleImages = [
    			  {color: 'blue',   rect: [0,0,30,30]}
    			, {color: 'red',    rect: [0,30,30,30]}
    			, {color: 'yellow', rect: [0,60,30,30]}
    			, {color: 'green',  rect: [0,90,30,30]}
    			, {color: 'purple', rect: [0,120,30,30]}
	    	];
	    	// 障碍物容器的内边距 (左右边距和上下边距)
	    	this.paddingX = 36;
	    	this.paddingY = 84;
	    	// 障碍物最小间距 (水平间距和垂直间距)
	    	this.baseSpaceX = 60;
	    	this.baseSpaceY = 30;
	    	// 浮动间距最大值 (间距 = 最小间距 + 浮动间距)
	    	this.floatSpace = 32;

	    	this.createObstacles(properties.image);
	    },
	    amount: 0,
	    obstacleImages: null,
	    paddingX: 0,
	    paddingY: 0,
	    baseSpaceX: 0,
	    baseSpaceY: 0,
	    floatSpace: 0,
	    startX: 0,
	    startY: 0,
	    /*
	    *	创建障碍物
	    */
	    createObstacles: function (image) {
	    	for (var i = 0, l = this.amount; i < l; i += 1) {
	    		// 随机创建不同颜色的障碍物
	    		var obstacle = new Hilo.Bitmap({
	    			id: 'obstacle' + i,
	    			image: image,
	    			rect: this.obstacleImages[0 + Math.random() * 4 >> 0].rect
	    		}).addTo(this);

	    		// 设置障碍物的位置
	    		this.setPosition(obstacle, i);
	    	}
	    },
	    /*
	    *	设置障碍物位置
	    */
	    setPosition: function (obstacle, index) {
	    	// startX += index === 0 ? this.paddingX + Math.random() * 32 >> 0 : 60 + Math.random() * 32 >> 0;
	    	if (index === 0) {
	    		this.startX = this.paddingX + Math.random() * this.floatSpace >> 0;
	    		this.startY = this.paddingY + Math.random() * this.floatSpace >> 0;
	    	} else {
	    		this.startX = this.baseSpaceX + Math.random() * this.floatSpace >> 0;
	    	}

	    	var overflowX = this.startX + obstacle.width + this.paddingX - this.width;
	    	var overflowY = this.startY + obstacle.height + this.paddingY - this.height;

            if (overflowX > 0) {
                this.startX = overflowX + this.paddingX;
                this.startY += this.baseSpaceY + Math.random() * this.floatSpace >> 0;
            }
            // obstacle.x = overflowX > 0 ? (this.startX = overflowX + this.paddingX, this.startY += this.baseSpaceY + Math.random() * this.floatSpace >> 0) : this.startX;
            obstacle.x = this.startX;
            obstacle.y = overflowY > 0 ? this.startY - overflowY : this.startY;
	    },
	    /*
	    *	重置障碍物位置（并不重新创建而只是改变位置）
	    */
	    resetObstacles: function () {

	    },
	    /*
	    *	检测碰撞
	    */
	    checkCollision: function () {
	    	
	    }
	});
})(window.game)