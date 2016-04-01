module AicTech.Web.Utils {
    export class ArrayUtils {
        static filterByParameter<T extends Html.IRecord>(originalData: T[], selectPar: Html.IParameter[], parData: any[]): T[]{
            var recList = [],
                result: T[] = [],
                currentList: string[],
                i,
                parNums = selectPar.length,
                parValue;
            if (selectPar.length === 0) {
                return originalData;
            }

            parData[selectPar[0].parId] = parData[selectPar[0].parId] || [];
            parData[selectPar[0].parId].filter(function (it: { recNo: string, parValue: string }) {
                return it.parValue === selectPar[0].parValue;
            }).forEach((it) => {
                recList.push(it.recNo);
            });

            for (i = 1; i < parNums && recList.length > 0; i++) {
                currentList = [],
                parValue = selectPar[i].parValue;
                parData[selectPar[i].parId].filter(function (it: { recNo: string, parValue: string }) {
                    return it.parValue === parValue;
                }).forEach((it) => {
                    currentList.push(it.recNo);
                });

                if (currentList.length === 0) {
                    recList = [];
                    break;
                } else {
                    recList = recList.filter(function (it) {
                        return currentList.indexOf(it) > -1;
                    });
                }
            }

            result = originalData.filter(function (it: T) {
                return recList.indexOf(it.recNo) > -1;
            });
            return result;
        }
    }
}