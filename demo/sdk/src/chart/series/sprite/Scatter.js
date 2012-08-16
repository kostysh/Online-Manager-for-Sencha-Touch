/**
 *
 */
Ext.define("Ext.chart.series.sprite.Scatter", {
    alias: 'sprite.scatterSeries',
    extend: 'Ext.chart.series.sprite.Cartesian',
    renderClipped: function (surface, ctx, clip) {
        var attr = this.attr,
            dataX = attr.dataX,
            dataY = attr.dataY,
            matrix = this.attr.matrix,
            xx = matrix.getXX(),
            yy = matrix.getYY(),
            dx = matrix.getDX(),
            dy = matrix.getDY(),
            markerCfg = {},
            x, y;
        for (var i = 0; i < dataX.length; i++) {
            x = dataX[i];
            y = dataY[i];
            if (clip[0] <= x && x <= clip[2] && clip[1] <= y && y <= clip[3]) {
                markerCfg.translationX = x * xx + dx;
                markerCfg.translationY = y * yy + dy;
                this.putMarker('items', markerCfg);
            }
        }
    }
});
