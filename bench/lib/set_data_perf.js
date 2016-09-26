'use strict';

var NUM_TILES = 6;

module.exports = function(source, numCalls, geojson, cb) {
    var tileCount = 0;
    var startTime = null;
    var times = [];

    source.on('data', function tileCounter(event) {
        if (event.dataType !== 'tile') return;

        tileCount++;
        if (tileCount === NUM_TILES) {
            tileCount = 0;
            times.push(performance.now() - startTime);

            if (times.length < numCalls) {
                startTime = performance.now();
                source.setData(geojson);
            } else {
                var avgTileTime = times.reduce(function (v, t) {
                    return v + t;
                }, 0) / times.length;
                source.off('data', tileCounter);
                cb(null, avgTileTime);
            }
        }
    });

    startTime = performance.now();
    source.setData(geojson);
};
