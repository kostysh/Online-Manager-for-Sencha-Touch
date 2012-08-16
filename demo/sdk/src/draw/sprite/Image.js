Ext.define("Ext.draw.sprite.Image", {
    extend: "Ext.draw.sprite.Rect",
    alias: 'sprite.image',
    type: 'image',
    statics: {
        imageLoaders: {}
//        getWaitingImage: function () {
//            var image = document.createElement('img');
//            image.style.position = 'absolute';
//            image.style.zIndex = 100000;
//            image.style.top = '-1000px';
//            Ext.getBody().dom.appendChild(image);
//            // TODO: use a better image.
//            image.src = "";
//            this.waitingImage = image;
//            Ext.draw.sprite.Image.getWaitingImage = function () { return Ext.draw.sprite.Image.waitingImage; };
//            return this.waitingImage;
//        }
    },

    inheritableStatics: {
        def: {
            processors: {
                src: 'string'
            },
            defaults: {
                src: '',
                width: null,
                height: null
            }
        }
    },

    render: function (surface, ctx) {
        var me = this,
            attr = me.attr,
            mat = attr.matrix,
            src = attr.src,
            x = attr.x,
            y = attr.y,
            width = attr.width,
            height = attr.height,
            loadingStub = Ext.draw.sprite.Image.imageLoaders[src],
            imageLoader;

        if (loadingStub && loadingStub.done) {
            mat.toContext(ctx);
            ctx.drawImage(loadingStub.image, x, y, width || loadingStub.width, height || loadingStub.width);
        } else if (!loadingStub) {
            imageLoader = new Image();
            loadingStub = Ext.draw.sprite.Image.imageLoaders[src] = {
                image: imageLoader,
                done: false,
                pendingSprites: [me],
                pendingSurfaces: [surface]
            };
            imageLoader.width = width;
            imageLoader.height = height;
            imageLoader.onload = function () {
                var i;
                if (!loadingStub.done) {
                    loadingStub.done = true;
                    for (i = 0; i < loadingStub.pendingSprites.length; i++) {
                        loadingStub.pendingSprites[i].setDirty(true);
                    }
                    for (i in loadingStub.pendingSurfaces) {
                        loadingStub.pendingSurfaces[i].renderFrame();
                    }
                }
            };
            imageLoader.src = src;
        } else {
            Ext.Array.include(loadingStub.pendingSprites, me);
            Ext.Array.include(loadingStub.pendingSurfaces, surface);
        }

        // Draw loading mark
//        mat = mat.clone();
//        var list = mat.transformList([
//            [x, y],
//            [x + width, y],
//            [x + width, y + height],
//            [x, y + height]
//        ]);
//        try {
//            // Sometimes this will generate an error
//            ctx.drawImage(Ext.draw.sprite.Image.getWaitingImage(), (list[0][0] + list[2][0]) * 0.5 - 16, (list[0][1] + list[2][1]) * 0.5 - 16, 32, 32);
//        } catch (e) {
//
//        }

    }
});