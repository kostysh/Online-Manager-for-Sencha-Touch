Ext.define("Ext.draw.sprite.Path", {
    extend: "Ext.draw.sprite.Sprite",
    requires: ['Ext.draw.Draw', 'Ext.draw.path.Path'],
    alias: 'sprite.path',
    type: 'path',
    inheritableStatics: {
        def: {
            processors: {
                path: function (n, o) {
                    if (!(n instanceof Ext.draw.path.Path)) {
                        n = new Ext.draw.path.Path(n);
                    }
                    return n;
                }
            },
            aliases: {
                "d": "path"
            },
            defaults: {
                path: "M 0,0"
            },
            dirtyTriggers: {
                path: 'bbox'
            },
            updaters: {
                "path": function (attr) {
                    var path = attr.path;
                    if (!path || path.bindAttr !== attr) {
                        path = new Ext.draw.path.Path();
                        path.bindAttr = attr;
                        attr.path = path;
                    }
                    path.clear();
                    this.drawPath(path, attr);
                    attr.dirtyFlags.bbox = ['path'];
                }
            }
        }
    },

    getBBox: function (isWithoutTransform) {
        var bbox = this.attr.bbox;
        if (isWithoutTransform) {
            bbox.plain = bbox.plain || this.attr.path.getDimension();
            return bbox.plain;
        }
        bbox.transform = this.attr.path.getDimensionWithTransform(this.attr.matrix);
        return bbox.transform;
    },

    render: function (surface, ctx) {
        var mat = this.attr.matrix,
            attr = this.attr;
        if (attr.path.coords.length === 0) {
            return;
        }
        mat.toContext(ctx);
        ctx.appendPath(attr.path);
        ctx.fillStroke(attr);
    },

    /**
     * Update the path.
     * @param {Ext.draw.path.Path} path An empty path to draw on using path API. 
     * @param {Object} attr The attribute object. Note: DO NOT use the `sprite.attr` instead of this
     * if you want to work with instancing.
     */
    drawPath: function (path, attr) {}
});