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
        btn: null,       // 发射按钮
        progress: null,  // 进度条
        bendRod: null,   // 弯曲杆
        gameReadyScene: null,
        gameOverScene: null,

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

            //绑定舞台更新事件
        	this.stage.onUpdate = this.onUpdate.bind(this);

        	// 初始化
        	this.initBackground();
            this.initScenes();
    	},
        /*
        *   鼠标输入
        */
    	onUserInput: function () {
    		if (this.state === 'start') {
                this.progress.play();
                this.state = 'playing';
            } else if (this.state === 'playing') {
                this.progress.stop(function (ratio) {
                    this.hoodle.startDown(ratio);
                    this.btn.setEnabled(false); // 禁用button
                }.bind(this));
            }
    	},
        /*
        *   开始游戏
        */
    	gameReady: function () {
            this.initFences();
            this.initBendRod();
            this.initBonus();
            this.initObstacles();
            this.initHoodle();
            this.initProgress(); // 必须初始化在button前面，不然button.depth太低会无法点击
            this.initButton();

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
                //显示结束场景
                if (!this.stage.contains(this.gameOverScene)) {
                    this.stage.addChild(this.gameOverScene);  
                }
                this.gameOverScene.show(this.bonus.getOverBonus(this.hoodle));
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
        /**
         * 初始化场景
         */
        initScenes: function () {
            //准备场景
            this.gameReadyScene = new game.ReadyScene({
                width: this.width,
                height: 328,
                image: this.asset.ready
            }).addTo(this.stage);

            //结束场景
            this.gameOverScene = new game.OverScene({
                width: this.width,
                height: this.height,
                image: this.asset.over,
                visible: false
            });

            //绑定开始按钮事件
            this.gameReadyScene.getChildById('start').on(Hilo.event.POINTER_START, function (e) {
                e._stopped = true;
                this.gameReadyScene.hide(function () {
                    this.state !== 'start' && this.gameReady();
                }.bind(this));
            }.bind(this));

            //绑定重新开始事件
            this.gameOverScene.getChildById('over').on(Hilo.event.POINTER_START, function (e) {
                e._stopped = true;
                // 重新开始
                this.gameOverScene.visible = false;
                this.destory();
                this.initScenes();
            }.bind(this));

            //显示准备场景
            this.gameReadyScene.visible = true;
        },
        /*
        * 初始化栅栏
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
        /*
        *  初始化奖励栏
        */
        initBonus: function () {
        	this.bonus = new game.Bonus({
        		id: 'bouns',
        		image: this.asset.bonus,
        		height: 50,
        		width: 368,
        		activeRect: [118, 278, 368, 50]
        	}).addTo(this.stage);
        },
        initBendRod: function () {
            this.bendRod = new game.BendRod({
                id: 'bendRod',
                width: this.width,
                height: this.height,
                activeRect: [118, 64, 399, 263]
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
                startX: 500,
                startY: 225,
                activeRect: [118, 64, 399, 263]
            }).addTo(this.stage);
    	},
        /*
        * 初始化障碍物
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
        /**
         * 初始化发射按钮
         */
        initButton: function () {
            this.btn = new Hilo.Button({
                id: 'btn',
                x: 540,
                y: 229,
                image: this.asset.button
            }).addTo(this.stage);
            // 绑定鼠标点下事件
            this.btn.on(Hilo.event.POINTER_START, this.onUserInput.bind(this));
        },
        /**
         * 初始化进度条
         */
        initProgress: function () {
            this.progress = new game.Progress({
                width: 80,
                height: 80,
                x:533,
                y:221
            }).addTo(this.stage);
        },
    	onUpdate: function () {
            if (this.state === 'start') {
                return;
            }
            if (this.hoodle && this.hoodle.end) {
                this.gameOver();
            } else {
				if (this.obstacles && this.obstacles.checkCollision(this.hoodle)) {

				}
                if (this.fences && this.fences.checkCollision(this.hoodle)) {

                }
                if (this.bendRod && this.bendRod.checkCollision(this.hoodle)) {
                    
                }
            }
        },
        destory: function () {
            this.stage.removeAllChildren();
        }
    };
})(window);