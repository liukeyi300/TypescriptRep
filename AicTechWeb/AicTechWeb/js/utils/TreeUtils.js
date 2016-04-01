var AicTech;
(function (AicTech) {
    var Web;
    (function (Web) {
        var Utils;
        (function (Utils) {
            var TreeUtils = (function () {
                function TreeUtils() {
                }
                /**
                 * 根据给定的data和根节点生成树形结构的对象
                 * data中数据项需要有独一无二的id和parentId
                 */
                TreeUtils.getTree = function (data, rootLevel, notNeedClean) {
                    if (notNeedClean === void 0) { notNeedClean = false; }
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
                };
                /**
                 * 根据树形data获取树的深度
                 */
                TreeUtils.getTreeDepth = function (data) {
                    var current = [], dataLength = data.length, curLength = data[data.length - 1].length, i, j, max;
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
                };
                /**
                 * 异步执行
                 * @params {number | string} curNode
                 * @return JQueryPromise<any>
                 */
                TreeUtils.expandTreeNodeAsync = function (curNode) {
                    var context = (new Service.DataContextService()).getServiceContext();
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
                            .map(function (it) {
                            return {
                                id: it.EQP_NO,
                                parent: it.MASTER_NO,
                                text: it.EQP_NAME
                            };
                        })
                            .toArray(function (data) {
                            d.resolve(data);
                            data.forEach(function (it) {
                                TreeUtils.EquimentsName[it.id + ""] = it.text;
                                TreeUtils.EquimentsName.length++;
                            });
                        })
                            .fail(function (e) {
                            d.reject(e);
                        });
                    }
                    else {
                        context.PM_EQUIPMENT
                            .filter(function (it) {
                            return it.MASTER_NO == this.eqpNo;
                        }, { eqpNo: curNode })
                            .map(function (it) {
                            return {
                                id: it.EQP_NO,
                                parent: it.MASTER_NO,
                                text: it.EQP_NAME,
                                items: []
                            };
                        })
                            .toArray(function (data) {
                            d.resolve(data);
                            data.forEach(function (it) {
                                TreeUtils.EquimentsName[it.id + ""] = it.text;
                                TreeUtils.length++;
                            });
                        })
                            .fail(function (e) {
                            d.reject(e);
                        });
                    }
                    return d.promise();
                };
                TreeUtils.cleanData = function (data) {
                    if (data.items.length > 0) {
                        data.items.forEach(function (item) {
                            TreeUtils.cleanData(item);
                        });
                    }
                    else {
                        delete data.items;
                    }
                };
                TreeUtils.EquimentsName = {
                    length: 0
                };
                return TreeUtils;
            })();
            Utils.TreeUtils = TreeUtils;
        })(Utils = Web.Utils || (Web.Utils = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=TreeUtils.js.map