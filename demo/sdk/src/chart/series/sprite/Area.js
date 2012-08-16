/**
 * Area sprite.
 */
Ext.define("Ext.chart.series.sprite.Area", {
    alias: 'sprite.areaSeries',
    extend: "Ext.chart.series.sprite.StackedCartesian",

    inheritableStatics: {
        def: {
            defaults: {
                transformFillStroke: true
            }
        }
    },

    renderClipped: function (surface, ctx, clip) {
        var me = this,
            attr = me.attr,
            dataX = attr.dataX,
            dataY = attr.dataY,
            dataStartY = attr.dataStartY,
            matrix = attr.matrix,
            x, y, i,
            xx = matrix.elements[0],
            dx = matrix.elements[4],
            yy = matrix.elements[3],
            dy = matrix.elements[5],
            start = Math.max(0, Math.floor(clip[0])),
            end = Math.min(dataX.length - 1, Math.ceil(clip[2]));

        ctx.beginPath();
        for (i = start; i <= end; i++) {
            x = dataX[i] * xx + dx;
            y = dataY[i] * yy + dy;
            ctx.lineTo(x, y);
        }
        if (dataStartY) {
            for (i = end; i >= start; i--) {
                x = dataX[i] * xx + dx;
                y = dataStartY[i] * yy + dy;
                ctx.lineTo(x, y);
            }
        } else {
            // dataStartY[i] == 0;
            ctx.lineTo(clip[0] + clip[2], y);
            ctx.lineTo(clip[0] + clip[2], dy);
            ctx.lineTo(clip[0], dy);
            ctx.lineTo(clip[0], dataY[i] * yy + dy);
        }
        ctx.fill();

        ctx.beginPath();
        for (i = start; i <= end; i++) {
            x = dataX[i] * xx + dx;
            y = dataY[i] * yy + dy;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
});