var AicTech;
(function (AicTech) {
    var Web;
    (function (Web) {
        var Utils;
        (function (Utils) {
            var ArrayUtils = (function () {
                function ArrayUtils() {
                }
                ArrayUtils.filterByParameter = function (originalData, selectPar, parData) {
                    var recList = [], result = [], currentList, i, parNums = selectPar.length, parValue;
                    if (selectPar.length === 0) {
                        return originalData;
                    }
                    parData[selectPar[0].parId] = parData[selectPar[0].parId] || [];
                    parData[selectPar[0].parId].filter(function (it) {
                        return it.parValue === selectPar[0].parValue;
                    }).forEach(function (it) {
                        recList.push(it.recNo);
                    });
                    for (i = 1; i < parNums && recList.length > 0; i++) {
                        currentList = [],
                            parValue = selectPar[i].parValue;
                        parData[selectPar[i].parId].filter(function (it) {
                            return it.parValue === parValue;
                        }).forEach(function (it) {
                            currentList.push(it.recNo);
                        });
                        if (currentList.length === 0) {
                            recList = [];
                            break;
                        }
                        else {
                            recList = recList.filter(function (it) {
                                return currentList.indexOf(it) > -1;
                            });
                        }
                    }
                    result = originalData.filter(function (it) {
                        return recList.indexOf(it.recNo) > -1;
                    });
                    return result;
                };
                return ArrayUtils;
            })();
            Utils.ArrayUtils = ArrayUtils;
        })(Utils = Web.Utils || (Web.Utils = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=ArrayUtils.js.map