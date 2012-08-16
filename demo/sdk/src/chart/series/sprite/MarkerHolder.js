Ext.define("Ext.chart.series.sprite.MarkerHolder", {
    extend: 'Ext.mixin.Mixin',

    mixinConfig: {
        id: 'markerHolder',
        hooks: {
            constructor: 'constructor',
            preRender: 'preRender'
        }
    },

    markerNames: ['items', 'labels'],

    constructor: function () {
        this.boundMarkers = {};
    },

    /**
     *
     * @param name {String}
     * @param marker {Ext.chart.series.sprite.Markers}
     */
    bindMarker: function (name, marker) {
        if (!this.boundMarkers[name]) {
            this.boundMarkers[name] = [];
        }
        Ext.Array.include(this.boundMarkers[name], marker);

    },

    preRender: function () {
        var boundMarkers = this.boundMarkers, boundMarkersItem,
            nameIdx, name,
            i, ln;
        for (nameIdx in this.markerNames) {
            name = this.markerNames[nameIdx];
            if (boundMarkers[name]) {
                for (boundMarkersItem = boundMarkers[name], i = 0, ln = boundMarkersItem.length; i < ln; i++) {
                    boundMarkersItem[i].clear();
                }
            }
        }
    },

    putMarker: function (name, markerAttr) {
        var boundMarkersItem, i, ln;
        if (this.boundMarkers[name]) {
            for (boundMarkersItem = this.boundMarkers[name], i = 0, ln = boundMarkersItem.length; i < ln; i++) {
                boundMarkersItem[i].putMarker(markerAttr);
            }
        }
    }
});