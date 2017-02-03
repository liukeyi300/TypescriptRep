module AicTech.Web.Utils {
    export class TreeUtils {
        static EquimentsName = {
            length: 0
        };

        constructor() { }

        /**
         * 根据给定的data和根节点生成树形结构的对象
         * data中数据项需要有独一无二的id和parentId
         */
        static getTree(data: any[], rootLevel: number|string, notNeedClean = false): Object {
            var hash = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var id = item["id"];
                var parentId = item["parent"];
                hash[id] = hash[id] || [];
                hash[parentId] = hash[parentId] || [];

                item.items = hash[id];
                hash[parentId].push(item);
            }
            if (!notNeedClean) {
                hash[rootLevel].forEach(function (d) {
                    TreeUtils.cleanData(d);
                });
            }
            return hash[rootLevel];
        }

        /**
         * 根据树形data获取树的深度
         */
        static getTreeDepth(data: any[]): number {
            var current = [],
                dataLength = data.length,
                curLength = data[data.length - 1].length,
                i,
                j,
                max;
            for (i = 0; i < curLength; i++) {
                if (typeof data[dataLength - 1][i].items !== 'undefined') {
                    for (j = 0, max = data[dataLength - 1][i].items.length; j < max; j++) {
                        current.push(data[dataLength - 1][i].items[j]);
                    }
                }
            }

            if (current.length > 0) {
                var a = [];
                data.push(a);
                dataLength++;
                for (i = 0, length = current.length; i < length; i++) {
                    data[dataLength - 1].push(current[i]);
                }
                TreeUtils.getTreeDepth(data);
            }
            return data.length;
        }

        /**
         * 异步执行
         * @params {number | string} curNode
         * @return JQueryPromise<any>
         */
        static expandTreeNodeAsync(curNode: number | string): JQueryPromise<any> {
            var context = (new Service.DataContextService<AicTech.PPA.DataModel.PPAEntities>()).getServiceContext();
            var d = $.Deferred();
            if (context === null) {
                context = new AicTech.PPA.DataModel.PPAEntities({
                    name: "oData",
                    oDataServiceHost: Service.AuthenticationService.serviceAddress + Service.AuthenticationService.ppaEntitiesDataRoot
                }); 
            }
            if (curNode === "null") {
                context.PM_EQUIPMENT
                    .filter(function (it) {
                        return it.MASTER_NO == null;
                    })
                    .map((it) => {
                        return {
                            id: it.EQP_NO,
                            parent: it.MASTER_NO,
                            text: it.EQP_NAME
                        }
                    })
                    .toArray(function (data) {
                        d.resolve(data);
                        data.forEach((it) => {
                            TreeUtils.EquimentsName[it.id + ""] = it.text;
                            TreeUtils.EquimentsName.length++;
                        });
                    })
                    .fail(function (e) {
                        d.reject(e);
                    });
            } else {
                context.PM_EQUIPMENT
                    .filter(function (it) {
                        return it.MASTER_NO == this.eqpNo;
                    }, { eqpNo: curNode })
                    .map((it) => {
                        return {
                            id: it.EQP_NO,
                            parent: it.MASTER_NO,
                            text: it.EQP_NAME,
                            items: []
                        }
                    })
                    .toArray(function (data) {
                        d.resolve(data);
                        data.forEach((it) => {
                            TreeUtils.EquimentsName[it.id + ""] = it.text;
                            TreeUtils.length++;
                        });
                    })
                    .fail(function (e) {
                        d.reject(e);
                    });
            }
            return d.promise();
        }

        private static cleanData(data: { items: [any] }) {
            if (data.items.length > 0) {
                data.items.forEach(function (item) {
                    TreeUtils.cleanData(item);
                });
            } else {
                delete data.items;
            }
        }
    } 
}