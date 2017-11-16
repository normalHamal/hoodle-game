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
        bg: null,        // 背景
        hoodle: null,    // 弹珠
        obstacles: null, // 障碍物集合
        init: function () {
        	this.asset = new game.Asset();
            this.asset.on('complete', function(e){
                this.asset.off('complete');
                this.initStage();
            }.bind(this));
            this.asset.load();
        },
    	// 初始化舞台
    	initStage: function () {
    		this.width  = 659;  // 初始化舞台宽
    		this.height = 323; // 初始化舞台高
    		this.scale  = 1;                  // 初始化舞台缩放比

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

            // 开启舞台的DOM事件响应
            this.stage.enableDOMEvent(Hilo.event.POINTER_START, true);
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
        	this.initHoodle();
            this.initTitle();
            this.initObstacle();
        	// 开始游戏
        	this.gameReady();
    	},
    	// 鼠标输入
    	onUserInput: function () {
    		if(this.state === 'start') {
                this.hoodle.startDown()
                this.state = 'playing';
            } else if (this.state === 'over') {
                this.gameReady();
            }
    	},
    	// 开始游戏
    	gameReady: function () {
    		this.state = 'start';
            this.hoodle.getReady();
    	},
        // 结束游戏
    	gameOver: function () {
    		if(this.state !== 'over') {
                //设置当前状态为结束over
                this.state = 'over';
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
    	            background: 'url(images/bg.jpg) no-repeat',
    	            backgroundSize: bgWidth + 'px, ' + bgHeight + 'px',
    	            width: bgWidth + 'px',
    	            height: bgHeight + 'px'
    	        }
    	    }), this.stage.canvas);
    	},
        /*
        *  初始化标题
        */
        initTitle: function(){
            // 当前分数
            this.title = new Hilo.Text({
            	id: 'title',
                text: '滑稽家族'
            }).addTo(this.stage, 0);
            // 设置标题样式
            var fontSize = 20;
            this.title.setFont(fontSize + 'px arial');
            this.title.color = '#428bca';
            // 设置标题的位置
            // 没有渲染之前textWidth为0，所以此处只能自己给值
            this.title.x = this.width - fontSize * 4 >> 1;
            this.title.y = this.height - fontSize - 2;
        },
        /*
        * 初始化弹珠
        */
    	initHoodle: function () {
    		this.hoodle = new game.Hoodle({
                id: 'hoodle',
                image: this.asset.hoodle,
                width: 30,
                height: 30,
                startX: this.width - 30 >> 1,
                stageX: this.width,
                stageY: this.height
            }).addTo(this.stage);
    	},
        /*
        *  初始化障碍物
        */
        initObstacle: function () {
            var startX = 36
              , startY = 84
              , paddingX = startX
              , paddingY = startY;

            this.obstacles = Array.from({length: 22}, function (obj, i) {
                obj = new game.Obstacle({
                    id: 'obstacle' + i,
                    image: this.asset.obstacle,
                    width: 30,
                    height: 30
                }).addTo(this.stage);
                // 设置障碍物起始坐标y
                startX += i === 0 ? 0 : 60 + Math.random() * 32 >> 0;
                var overflowX = startX + obj.width + paddingX - this.width;
                if (overflowX > 0) {
                    startX = overflowX + paddingX;
                    startY += 30 + Math.random() * 32 >> 0;
                }
                obj.x  = startX;
                // obj.x = overflowX > 0 ? (startX = overflowX + paddingX, startY += 30 + Math.random() * 32 >> 0) : startX;
                obj.y = startY > this.height - paddingY ? this.height - paddingY : startY;
                return obj;
            }.bind(this));
        },
    	onUpdate: function () {
            if (this.state === 'ready') {
                return;
            }
            if (this.hoodle.isStatic && this.hoodle.y !== 0) {
                this.gameOver();
            }
        }
    };
})(window)