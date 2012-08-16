/**
 *
 */
Ext.define('Ext.chart.series.StackedCartesian', {

    extend: 'Ext.chart.series.Cartesian',

    config: {
        stacked: true
    },

    coordinateY: function () {
        var me = this,
            store = me.getActualStore(),
            items = store.getData().items,
            axis = me.getYAxis(),
            range = {min: 0, max: 0},
            fieldCategories = me.fieldCategoryY || ['Y'],
            i, j, k, fields, field, data, dataStart, style = {},
            stacked = me.getStacked(),
            sprites = me.getSprites();
        
        if (sprites.length > 0) {
            if (stacked) {
                dataStart = [];
            }
            for (i = 0; i < fieldCategories.length; i++) {
                fields = me.getFields([fieldCategories[i]]);
                if (stacked) {
                    for (j = 0; j < items.length; j++) {
                        dataStart[j] = 0;
                    }
                }
                for (j = 0; j < fields.length; j++) {
                    style = {};
                    field = fields[j];
                    data = me.coordinateData(items, field, axis);
                    if (stacked) {
                        style['dataStart' + fieldCategories[i]] = dataStart;
                        dataStart = dataStart.slice(0);
                        for (k = 0; k < items.length; k++) {
                            dataStart[k] += data[k];
                        }
                        style['data' + fieldCategories[i]] = dataStart;
                    } else {
                        style['data' + fieldCategories[i]] = data;
                    }
                    sprites[j].setAttributes(style);
                }
            }
            me.getRangeOfData(dataStart, range);

            me.dataRange[1] = range.min;
            me.dataRange[3] = range.max;
            style = {};
            style.dataRange = me.dataRange;
            for (i = 0; i < sprites.length; i++) {
                sprites[i].setAttributes(style);
            }
        }
    },

    getFields: function (fieldCategory) {
        var me = this,
            fields = [], fieldsItem,
            i, ln;
        for (i = 0, ln = fieldCategory.length; i < ln; i++) {
            fieldsItem = me['get' + fieldCategory[i] + 'Field']();
            if (Ext.isArray(fieldsItem)) {
                fields.push.apply(fields, fieldsItem);
            } else {
                fields.push(fieldsItem);
            }
        }
        return fields;
    },

    getSprites: function () {
        var me = this,
            chart = this.getChart(),
            animation = chart && chart.getAnimate(),
            surface,
            fields = me.getFields(me.fieldCategoryY),
            sprites = me.sprites,
            i, length = fields.length,
            sprite;

        if (!chart) {
            return [];
        }

        surface = this.getSurface();
        if (animation) {
            for (i = 0; i < length; i++) {
                sprite = sprites[i];
                if (!sprite) {
                    sprite = surface.add({type: me.seriesType});
                    sprites.push(sprite);
                    sprite.fx.on('animationstart', 'onSpriteAnimationStart', this);
                    sprite.fx.on('animationend', 'onSpriteAnimationEnd', this);
                }
                if (animation) {
                    sprite.fx.setConfig(animation);
                }
                sprite.setAttributes(me.getStyleByIndex(i));
            }
        }


        return sprites;
    }
});
