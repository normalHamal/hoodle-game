
(function(ns){

var OverScene = ns.OverScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function (properties) {
        properties = properties || {};
        OverScene.superclass.constructor.call(this, properties);
        this.overImages = [
              {color: 'golden', rect: [0, 1125, 667, 375]}
            , {color: 'red',    rect: [0, 750, 667, 375]}
            , {color: 'blue',   rect: [0, 375, 667, 375]}
            , {color: 'green',  rect: [0, 0, 667, 375]}
        ];
        this.image = properties.image;
        this.init(properties);
    },
    image: null,
    overImages: [],

    init: function (properties) {
        this.removeAllChildren();

        //  准备场景（其实就是加块挡板）
        var over = new Hilo.Bitmap({
            id: 'over',
            image: properties.image,
            rect: properties.rect
        });

        this.addChild(over);
    },

    show: function (color) {
        this.visible = true;
        var index    = 0;

        this.overImages.forEach(function (o, i) {
            if (o.color === color) {
                index = i;
            }
        });
        this.init({
            image: this.image,
            rect: this.overImages[index].rect
        })
            

        Hilo.Tween.from(this.getChildById('over'), {alpha:0}, {
            duration: 400,
            ease: Hilo.Ease.Back.EaseIn
        });
    }
});

})(window.game);