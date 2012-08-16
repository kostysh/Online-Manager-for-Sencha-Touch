Ext.define("Ext.chart.series.sprite.Markers", {
    extend: 'Ext.draw.sprite.Instancing',

    config: {
        streamProvider: null
    },

    clear: function () {
        this.position = 0;
    },

    putMarker: function (markerAttr) {
        var me = this;
        if (me.position >= me.instances.length) {
            me.createInstance(markerAttr);
        } else {
            me.setAttributesFor(me.position, markerAttr);
            me.position++;
        }
    }
});