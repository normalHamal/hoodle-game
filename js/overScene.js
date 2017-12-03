
(function(ns){

var OverScene = ns.OverScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function (properties) {
        OverScene.superclass.constructor.call(this, properties);
        this.init(properties);
    },

    init: function (properties) {
        //  准备场景（其实就是加块挡板）
        var over = new Hilo.Bitmap({
            id: 'over',
            image: properties.image
        });

        this.addChild(over);
    },

    show: function () {
        this.visible = true;
        Hilo.Tween.from(this.getChildById('over'), {alpha:0}, {
            duration: 400,
            ease: Hilo.Ease.Back.EaseIn
        });
    }
});

})(window.game);