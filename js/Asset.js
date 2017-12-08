(function (ns) {
    var Asset = ns.Asset = Hilo.Class.create({
        // Mixes属性在创建时将会被混入属性或方法
        // EventMixin是一个包含事件相关功能的mixin
        // 此处是为了给对象增加事件功能(比如fire方法)
        Mixes: Hilo.EventMixin,
        queue: null,         // 资源下载队列
        bg: null,            // 背景
        hoodle: null,   // 弹珠
        obstacles: null,     // 障碍物
        fence: null,   // 栅栏
        // 预加载图片素材
        load: function() {
            // 图片素材列表
            var resources = [
                {id: 'ready', src: 'images/ready.png'},
                {id: 'over', src: 'images/over.png'},
                {id: 'hoodle', src: 'images/hoodle.png'},
                {id: 'obstacles', src: 'images/obstacles.png'},
                {id: 'fence', src: 'images/fence.png'},
                {id: 'bonus', src: 'images/bonus.png'},
                {id: 'button', src: 'images/button.png'}
            ];

            this.queue = new Hilo.LoadQueue(); // 实例化一个下载队列 
            this.queue.add(resources); // 把素材列表加入到下载队列中
            this.queue.on('complete', this.onComplete.bind(this)); // 绑定complete事件监听
            this.queue.start(); // 启动下载队列
        },
        // 资源下载完成
        onComplete: function () {
            // 资源下载完成后的Image对象赋值
            this.ready     = this.queue.get('ready').content;
            this.over      = this.queue.get('over').content;
			this.obstacles = this.queue.get('obstacles').content;
			this.hoodle    = this.queue.get('hoodle').content;
			this.fence     = this.queue.get('fence').content;
			this.bonus     = this.queue.get('bonus').content;
            this.button    = this.queue.get('button').content;
            //删除下载队列的complete事件监听
            this.queue.off('complete');
            //发送complete事件
            this.fire('complete');
        }
    });
})(window.game);