(function (ns) {
	var Obstacle = ns.Obstacle = Hilo.Class.create({
		Extends: Hilo.Bitmap,
		// 构造函数
		constructor: function(properties) {
			properties = properties || {};
			// 调用父类构造函数
	        Obstacle.superclass.constructor.call(this, properties);
			// 初始化参数
	        Hilo.copy(this, properties, true);
	    },
	    /*
	    *	创建障碍物
	    */
	    createObstacles: function () {

	    },
	    /*
	    *	设置障碍物位置
	    */
	    setPosition: function () {

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