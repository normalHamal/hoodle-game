
(function(ns){

var ReadyScene = ns.ReadyScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function (properties) {
        ReadyScene.superclass.constructor.call(this, properties);
        this.init(properties);
    },

    init: function (properties) {
        //  准备场景（其实就是加块挡板）
        var baffle = new Hilo.Bitmap({
            id: 'baffle',
            image: properties.image,
            rect: [0, 52, 368, 50]
        });
        //  开始按钮
        var start  = new Hilo.Bitmap({
            id: 'start',
            image: properties.image,
            rect: [0, 0, 90, 52]
        });
        //确定位置
        baffle.x = 118;
        baffle.y = 278;
        start.x  = 526;
        start.y  = 75;

        this.addChild(baffle, start);
    },

    hide: function (cb) {
        Hilo.Tween.to(this.getChildById('baffle'), {y: this.height, height: 0}, {
            duration: 400,
            ease: Hilo.Ease.Back.EaseOut,
            onComplete: function () {
                this.visible = false;
                cb();
            }.bind(this)
        });
    }
});

})(window.game);