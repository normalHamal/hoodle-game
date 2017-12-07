(function (ns) {
	var Bonus = ns.Bonus = Hilo.Class.create({
		Extends: Hilo.Container,

		constructor: function(properties) {
			properties = properties || {};
			// 调用父类构造函数
	        Bonus.superclass.constructor.call(this, properties);
			// 初始化参数
	        Hilo.util.copy(this, properties, true);
	        // 不同颜色奖励对应的图片位置
	        this.bonusImages = [
    			  {color: 'golden', rect: [0, 0, 40, 40]}
    			, {color: 'red',    rect: [40, 0, 37, 37]}
    			, {color: 'blue',   rect: [77, 0, 33, 33]}
    			, {color: 'green',  rect: [110, 0, 30, 30]}
	    	];
			this.amount      = 7;
			this.fenceWidth  = 9;
			this.paddingX    = [0, 61, 51, 51, 51, 51, 51];
			this.createBonus(properties.image);
	    },
	    amount: 0,
	    paddingX: [],
	    activeRect: [],
	    bonusImages: [],
	    bonusArray: [],
	    fenceWidth: 0,
	    /*
	    *	创建奖励
	    */
	    createBonus: function (image) {
	    	var b = 0;
	    	//  生成奖励集合
	    	while (b != this.amount) {
	    		//  随机生成各种奖励，但是要控制金色和红色出现的机率要小
	    		//  并且不能超过一定个数
	    		var pr = 0 + Math.random() * 100 >> 0;
	    		var item;
	    		//  控制金色红色蓝色绿色按：10% 20% 30% 40%概率出现
	    		if (pr < 10) {
	    			item = this.bonusImages[0];
	    		} else if (pr < 30) {
	    			item = this.bonusImages[1];
	    		} else if (pr < 60){
	    			item = this.bonusImages[2];
	    		} else {
	    			item = this.bonusImages[3];
	    		}
	    		
	    		var itemLen = this.bonusArray.filter(function (i) {
	    			return i.color === item.color;
	    		}).length;

	    		if (item.color === 'golden' && itemLen === 2) continue;
				if (item.color === 'red' && itemLen === 3) continue;

	    		this.bonusArray[b++] = item;
	    	}

	    	for (var i = 0, l = this.amount; i < l; i += 1) {
	    		var bonus = new Hilo.Bitmap({
	    			id: 'bonus' + i,
	    			image: image,
	    			rect: this.bonusArray[i].rect
	    		}).addTo(this);

	    		// 设置障碍物的位置
	    		this.setPosition(bonus, i);
	    	}
	    },
	    /*
	    *	设置奖励位置
	    */
	    setPosition: function (bonus, index) {
	    	var x = this.paddingX.slice(0, index + 1).reduceRight(function(a, b) {
			  	return a + b;
			}) + this.activeRect[0];
			var y = this.activeRect[1] + this.activeRect[3] - bonus.height;
			//  居中所需要偏移的距离
			var offsetLeft;
			if (index !== this.amount - 1) {
				offsetLeft = this.paddingX[index + 1] - this.fenceWidth - bonus.width >> 1;
			} else {
				offsetLeft = this.activeRect[2] - x - bonus.width + this.activeRect[0] >> 1;
			}

			bonus.x = x + offsetLeft;
			bonus.y = y;
	    },
	    /**
	     *   获取最终弹珠落入哪个奖励中
	     */
	    getOverBonus: function (hoodle) {
	    	if (this.children.length === 0 || !hoodle) return null;

	    	for(var i = 0, l = this.children.length; i < l; i += 1) {
	    		var bonus = this.children[i];

	    		if (hoodle.hitTestObject(bonus, true)) {
	    			return this.bonusArray[i].color;
	    		}
	    	}

	    	return null;
	    }
	});
})(window.game)