Ext.define("Ext.draw.sprite.Instancing", {
    extend: "Ext.draw.sprite.Sprite",
    alias: 'sprite.instancing',
    type: 'instancing',
    config: {
        template: null
    },
    instances: null,
    constructor: function (config) {
        this.instances = [];
        this.callSuper([config]);
        if (config && config.template) {
            this.setTemplate(config.template);
        }
    },

    applyTemplate: function (template) {
        if (!(template instanceof Ext.draw.sprite.Sprite)) {
            template = Ext.create("sprite." + template.type, template);
            template.setParent(this);
        }
        this.instances = [];
        this.position = 0;
        return template;
    },

    createInstance: function (config, data) {
        var template = this.getTemplate(),
            originalAttr = template.attr,
            attr = Ext.Object.chain(originalAttr);
        template.topModifier.prepareAttributes(attr);
        template.attr = attr;
        template.setAttributes(config);
        attr.data = data;
        this.instances.push(attr);
        template.attr = originalAttr;
        this.position++;
        return attr;
    },

    getBBox: function (isWithoutTransform) {
        var me = this,
            totalBBox = me.attr.bbox,
            template = me.getTemplate(),
            originalAttr = template.attr,
            instances = me.instances,
            left = Infinity,
            right = -Infinity,
            top = Infinity,
            bottom = -Infinity,
            bbox, i, ln;

        if (!totalBBox.plain) {
            for (i = 0, ln = me.position; i < ln; i++) {
                template.bindAttributes(instances[i]);
                template.applyTransformations();
                bbox = template.getBBox();
                if (left > bbox.x) {
                    left = bbox.x;
                }
                if (right < bbox.x + bbox.width) {
                    right = bbox.x + bbox.width;
                }
                if (top > bbox.y) {
                    top = bbox.y;
                }
                if (bottom < bbox.y + bbox.height) {
                    bottom = bbox.y + bbox.height;
                }
            }
            template.attr = originalAttr;
            return {
                x: left,
                y: top,
                width: right - left,
                height: bottom - top
            };
        }
        if (isWithoutTransform) {
            return totalBBox.plain;
        }
        if (!totalBBox.transform) {
            totalBBox.transform = Ext.draw.Draw.transformBBox(totalBBox.plain);
        }
        return totalBBox.transform;
    },

    render: function (surface, ctx, region) {
        var me = this,
            mat = me.attr.matrix,
            template = me.getTemplate(),
            originalAttr = template.attr,
            instances = me.instances,
            i, ln = me.position;

        mat.toContext(ctx);
        template.useAttributes(ctx);
        for (i = 0; i < ln; i++) {
            ctx.save();
            template.attr = instances[i];
            template.updateDirtyFlags(instances[i]);
            template.applyTransformations();
            template.useAttributes(ctx);
            template.render(surface, ctx, region);
            ctx.restore();
        }
        template.attr = originalAttr;
    },

    setAttributesFor: function (index, changes) {
        var template = this.getTemplate(),
            originalAttr = template.attr,
            attr = this.instances[index];
        template.attr = attr;
        changes = template.self.def.normalize(changes);
        template.topModifier.pushDown(attr, changes);
        this.updateDirtyFlags(attr);
        template.attr = originalAttr;
    }
});