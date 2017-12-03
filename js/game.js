(function (global) {

    window.onload = function(){
        game.init();
    }

    var game = global.game = {
    	width: 0,        // 舞台宽
        height: 0,       // 舞台高

        title: null,     // 标题
        asset: null,     // 资源集合
        stage: null,     // 舞台对象
        ticker: null,    // 定时器
        state: null,     // 游戏状态
        hoodle: null,    // 弹珠
        obstacles: null, // 障碍物集合
        fences: null,    // 栅栏
        bonus: null,     // 奖励

        init: function () {
        	this.asset = new game.Asset();
            this.asset.on('complete', function(e){
                this.asset.off('complete');
                this.initStage();
            }.bind(this));
            this.asset.load();
        },
        /*
        *   初始化舞台
        */
    	initStage: function () {
    		this.width  = 667; // 初始化舞台宽
    		this.height = 375; // 初始化舞台高
    		this.scale = 1;   // 初始化舞台缩放比

    	    // 实例化一个舞台对象
    	    var stage = this.stage = new Hilo.Stage({
    	    	renderType: 'canvas',
    	        width: this.width,
    	        height: this.height,
    	        scaleX: this.scale,
    	        scaleY: this.scale
    	    });

    	    document.body.appendChild(this.stage.canvas); // 把canvas画布添加到body中

    	    /* 启动计时器 */
    		    
    	    // 设定舞台刷新频率为60fps
            this.ticker = new Hilo.Ticker(60);

            this.ticker.addTick(Hilo.Tween); // 需要把Tween加入到舞台才能使用缓动功能
            
            // 把舞台加入到tick队列
            this.ticker.addTick(this.stage);
            // 启动ticker
            this.ticker.start();

            /* 绑定交互事件 */

            // 开启舞台的DOM事件响应(不开启则无法响应点击和拖拽事件)
            this.stage.enableDOMEvent([Hilo.event.POINTER_START, Hilo.event.POINTER_MOVE, Hilo.event.POINTER_END], true);
            // 绑定鼠标点下事件
            this.stage.on(Hilo.event.POINTER_START, this.onUserInput.bind(this));

            //Space键控制
            document.addEventListener('keydown', function(e){
                if(e.keyCode === 32) this.onUserInput(e);
            }.bind(this));

            //绑定舞台更新事件
        	this.stage.onUpdate = this.onUpdate.bind(this);

        	// 初始化
        	this.initBackground();
            this.initFences();
            this.initBonus();
            this.initObstacles();
            this.initHoodle();
        	// 开始游戏
        	this.gameReady();
    	},
        /*
        *   鼠标输入
        */
    	onUserInput: function () {
    		if(this.state === 'start') {
                this.hoodle.startDown()
                this.state = 'playing';
            } else if (this.state === 'over') {
                this.gameReady();
            } else if (this.state === 'playing') {
            	this.ticker.pause();
            	this.state = 'pause';
            } else {
            	this.ticker.resume();
            	this.state = 'playing';
            }
    	},
        /*
        *   开始游戏
        */
    	gameReady: function () {
    		this.state = 'start';
            this.hoodle.getReady();
    	},
        /*
        *   结束游戏
        */
    	gameOver: function () {
    		if(this.state !== 'over') {
                //设置当前状态为结束over
                this.state = 'over';
                this.hoodle.stopRotate();
            }
    	},
    	/* 
    	*  初始化游戏背景
    	*  为了减少canvas的重复绘制，采用DOM+CSS来设置背景
    	*/
    	initBackground: function () {
    		var bgWidth  = this.width * this.scale;  // 舞台实际宽
    		var bgHeight = this.height * this.scale; // 舞台实际高
    		// 往body标签内最后插入一个div
    	    document.body.insertBefore(Hilo.createElement('div', {
    	        id: 'bg',
    	        style: {
    	            position: 'absolute',
    	            background: 'url(images/bg.png) no-repeat',
    	            backgroundSize: 'cover',
    	            width: bgWidth + 'px',
    	            height: bgHeight + 'px'
    	        }
    	    }), this.stage.canvas);
    	},
        /*
        *  初始化栅栏
        */
        initFences: function () {
            this.fences = new game.Fences({
                id: 'fences',
                image: this.asset.fence,
                height: 34,
                width: 368,
                activeRect: [118, 294, 368, 34]
            }).addTo(this.stage);
        },
        initBonus: function () {
        	this.bonus = new game.Bonus({
        		id: 'bouns',
        		image: this.asset.bonus,
        		height: 50,
        		width: 368,
        		activeRect: [118, 278, 368, 50]
        	}).addTo(this.stage);
        },
        /*
        * 初始化弹珠
        */
    	initHoodle: function () {
    		this.hoodle = new game.Hoodle({
                id: 'hoodle',
                image: this.asset.hoodle,
                width: 14,
                height: 14,
                startX: 443,
                startY: 89,
                activeRect: [118, 65, 368, 263]
            }).addTo(this.stage);
    	},
        /*
        *  初始化障碍物
        */
        initObstacles: function () {
            this.obstacles = new game.Obstacles({
                id: 'obstacles',
                image: this.asset.obstacles,
                height: 263,
                width: 368,
                activeRect: [118, 65, 348, 193],
                amount: 22,
            }).addTo(this.stage);
        },
    	onUpdate: function () {
            if (this.state === 'ready') {
                return;
            }

            if (this.hoodle && this.hoodle.isStatic && this.hoodle.y !== this.hoodle.startY) {
                this.gameOver();
            } else {
				if (this.obstacles && this.obstacles.checkCollision(this.hoodle)) {
				    //	弹珠发生碰撞       
				}
                if (this.fences && this.fences.checkCollision(this.hoodle)) {
                    //  弹珠发生碰撞
                }
            }
        }
    };
})(window)