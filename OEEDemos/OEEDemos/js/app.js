/// <reference path="reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var StartUp = (function () {
        function StartUp() {
        }
        StartUp.prototype.startUp = function () {
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: {
                        url: "http://localhost:4444/Webservice1/WebService1.asmx/HelloWorld",
                        dataType: "json",
                        type: "get",
                        contentType: "application/json; charset=uft-8",
                        data: {}
                    }
                },
                schema: {
                    parse: function (d) {
                        var data = JSON.parse(d.d);
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
                        return hash[0];
                    }
                }
            });
            var dataSource1 = kendo.observable({
                data: [{ text: "123", items: [{ text: "sdaf" }, { text: "safsda" }] }]
            });
            $('#nav-tree').kendoTreeView({
                dataSource: dataSource
            });
            //var navi = new Navigations($('#nav-tree'), dataSource);
            //navi.initTree({
            //    checkboxes: true
            //});
        };
        return StartUp;
    })();
    OEEDemos.StartUp = StartUp;
})(OEEDemos || (OEEDemos = {}));
window.onload = function () {
    var start = new OEEDemos.StartUp();
    start.startUp();
};
//# sourceMappingURL=app.js.map