(function (ns) {
    var Asset = ns.Asset = Hilo.Class.create({
        // Mixes属性在创建时将会被混入属性或方法
        // EventMixin是一个包含事件相关功能的mixin
        // 此处是为了给对象增加事件功能(比如fire方法)
        Mixes: Hilo.EventMixin,
        queue: null,    // 资源下载队列
        bg: null,       // 背景
        hoodle: null,   // 弹珠
        obstacle: null, // 障碍物
        // 预加载图片素材
        load: function() {
            // 图片素材列表
            var resources = [
                {id: 'bg', src: 'images/bg.jpg'},
                {id: 'hoodle', src: 'images/hoodle.png'},
                {id: 'obstacles', src: 'images/obstacles.png'}
            ];

            this.queue = new Hilo.LoadQueue(); // 实例化一个下载队列 
            this.queue.add(resources); // 把素材列表加入到下载队列中
            this.queue.on('complete', this.onComplete.bind(this)); // 绑定complete事件监听
            this.queue.start(); // 启动下载队列
        },
        // 资源下载完成
        onComplete: function () {
            // 资源下载完成后的Image对象赋值
            this.bg       = this.queue.get('bg').content;
            this.hoodle   = this.queue.get('hoodle').content;

            var obstacles = this.queue.get('obstacles').content;
            // 切图
            this.obstacleGlyphs = {
	            0: {image: obstacles, rect: [0,0,30,30]},
	            1: {image: obstacles, rect: [0,30,30,30]},
	            2: {image: obstacles, rect: [0,60,30,30]},
	            3: {image: obstacles, rect: [0,90,30,30]},
	            4: {image: obstacles, rect: [0,120,30,30]}
	        };
            //删除下载队列的complete事件监听
            this.queue.off('complete');
            //发送complete事件
            this.fire('complete');
        }
    });
})(window.game)