(function (ns) {
	var Progress = ns.Progress = Hilo.Class.create({
		Extends: Hilo.Graphics,

		constructor: function(properties) {
			properties = properties || {};
			// 调用父类构造函数
	        Progress.superclass.constructor.call(this, properties);
	        this.startAngle = - Math.PI * 9 / 10;
	        this.endAngle   = - Math.PI * 1 / 10;
	        this.angleRange = this.endAngle - this.startAngle;

			this.init();
	    },
	    startAngle: 0,
	    endAngle: 0,
	    nowAngle: 0,
	    rotating: false,
	    angleRange: 0,
	    /**
	     * 初始化进度条位置为0
	     */
	    init: function () {
	    	this.nowAngle = this.startAngle;
	    	this.rotating  = false;

	    	this.clear();
	    	this.draw();
	    },
	    draw: function () {
	    	this.lineStyle(4, "#6dabcf")
                .drawCircle(0, 0, 40, this.startAngle, this.nowAngle, false)
                .endFill();
	    },
	    play: function () {
	    	this.rotating = true;
	    },
	    stop: function (cb) {
	    	if (this.rotating) {
	    		this.rotating = false;
	    	}
	    	if (!cb) return;

	    	cb((this.nowAngle - this.startAngle) / Math.abs(this.angleRange));
	    },
	    onUpdate: function () {
	    	if (!this.rotating) return;

	    	this.clear();

	    	this.nowAngle += 0.02 * this.angleRange;

	    	if (this.angleRange > 0 && this.nowAngle >= this.endAngle) {
	    		this.nowAngle = this.endAngle;
	    		this.angleRange *= -1;
	    	} else if (this.angleRange < 0 && this.nowAngle <= this.startAngle) {
	    		this.nowAngle = this.startAngle;
	    		this.angleRange *= -1;
	    	}

	    	this.draw();
	    }
	});
})(window.game);