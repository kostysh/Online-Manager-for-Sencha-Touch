Ext.define("Ext.draw.sprite.Rect", {
    extend: "Ext.draw.sprite.Path",
    alias: 'sprite.rect',
    type: 'rect',
    inheritableStatics: {
        def: {
            processors: {
                x: 'number',
                y: 'number',
                width: 'number',
                height: 'number',
                radius: 'number'
            },
            aliases: {

            },
            dirtyTriggers: {
                x: 'path',
                y: 'path',
                width: 'path',
                height: 'path',
                radius: 'path'
            },
            defaults: {
                x: 0,
                y: 0,
                width: 1,
                height: 1,
                radius: 0
            }
        }
    },
    getBBox: function (isWithoutTransform) {
        var me = this,
            attr = me.attr,
            bbox = attr.bbox,
            x = attr.x,
            y = attr.y,
            width = attr.width,
            height = attr.height;

        if (!bbox.plain) {
            bbox.plain = {
                x: x,
                y: y,
                width: width,
                height: height
            };
        }

        if (isWithoutTransform) {
            return bbox.plain;
        }

        if (!bbox.transform) {
            bbox.transform = attr.matrix.transformBBox(bbox.plain, attr.radius);
        }

        return bbox.transform;
    },

    drawPath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            width = attr.width,
            height = attr.height,
            radius = Math.min(attr.radius, Math.abs(attr.height) * 0.5, Math.abs(attr.width) * 0.5);
        if (radius === 0) {
            path.rect(x, y, width, height);
        } else {
            path.moveTo(x + radius, y);
            path.arcTo(x + width, y, x + width, y + height, radius);
            path.arcTo(x + width, y + height, x, y + height, radius);
            path.arcTo(x, y + height, x, y, radius);
            path.arcTo(x, y, x + radius, y, radius);
        }
    }
});