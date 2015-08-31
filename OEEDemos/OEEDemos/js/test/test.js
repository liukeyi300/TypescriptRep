/// <reference path="../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    $(function () {
        /*var dataSource = new kendo.data.DataSource({
            data: [
                { name: "Jane", age: 30 },
                { name: "John", age: 40 }
            ],
            aggregate: [
                { field: "age", aggregate: "sum" },
                { field: "age", aggregate: "max" },
                { field: "age", aggregate: "min" }
            ]
        });
    
        dataSource.fetch(function () {
            var result = dataSource.aggregates().age;
            alert("Sum: " + result.sum + "! Max: " + result.max + "! Min: " + result.min);
        });*/
        var Person = kendo.data.Model.define({
            id: "personId",
            fields: {
                "name": {
                    type: "string"
                },
                "age": {
                    type: "number"
                }
            }
        });
        var person = new Person({
            name: "John Doe",
            age: 42
        });
        // console.log(person.get("name"));  // outputs "John Doe"
        /*$('#view').kendoTreeView({
            checkboxes: {
                name: "checkedItems[]"
            },
            animation: {
                collapse: {
                    duration: 400,
                    effects: "collapseVertical"
                }
            },
            dataImageUrlField:"image",
            dataSource: [
                {
                    text: "foo",
                    image: "../images/icons/test16_16/mail.png",
                    items: [
                        { text: "bar" },
                        { text:"net" }
                    ]
                }, {
                    text: "add",
                    image: "../images/icons/test16_16/search.png",
                    items: [
                        { text: "addad" },
                        { text: "asdf" }
                    ]
                }
            ]
        });*/
        var items = [
            {
                CategoryName: "Tea", items: [
                    { ProductName: "Green Tea" },
                    { ProductName: "Red Tea" }
                ]
            },
            {
                CategoryName: "Coffee"
            }];
        var items2 = [
            { text: "Tea", LinkTo: "http://www.baidu.com" },
            { text: "Rea", LinkTo: "http://www.acfun.tv" }];
        /*$('#view').kendoTreeView({
            dataUrlField: "LinkTo",
            dragAndDrop: true,
            dataSource: items2
        });*/
        /*$("#view").kendoTreeView({
            template: "#: item.displayName() #",
            dataSource: {
                data: [
                    {
                        CategoryName: "Reds",
                        status: "online",
                        subcategories: [
                            { SubCategoryName: "Yellow" },
                            { SubCategoryName: "Orange" },
                            { SubCategoryName: "Red" }
                        ]
                    },{
                        CategoryName: "Blues",
                        status: "offline",
                        subcategories: [
                            { SubCategoryName: "Green" },
                            { SubCategoryName: "Turquose" },
                            { SubCategoryName: "Blue" }
                        ]
                    }
                ],
                schema: {
                    model: Category
                }
            }
        });*/
        //$("#view").kendoTreeView({
        //    checkboxes: {
        //        checkChildren: true
        //    },
        //    dataSource: {
        //        data: [
        //            {
        //                text: "Foo", expanded: true, items: [
        //                    { text: "Bar" },
        //                    { text: "Baz" }
        //                ]
        //            }
        //        ]
        //    }
        //});
        //var treeView = $('#view').data('kendoTreeView');
        //var bar = treeView.findByText("Bar");
        //treeView.dataItem(bar).set("checked", true);
        /*$("#view").kendoTreeView({
            checkboxes: {
                checkChildren: true
            },
            check: function (e) {
                this.expandRoot = e.node;
    
                this.expand($(this.expandRoot).find(".k-item").addBack());
            },
            dataBound: function (e) {
                if (this.expandRoot) {
                    this.expand(e.node.find(".k-item"));
                }
            },
    
            // mocked datasource for the example
            dataSource: {
                transport: {
                    read: function (options) {
                        if (!counter) counter = 1;
    
                        // stub server
                        setTimeout(function () {
                            if (counter < 20) {
                                options.success([
                                    { text: "item " + (counter++) },
                                    { text: "item " + (counter++) },
                                    { text: "item " + (counter++), hasChildren: false }
                                ]);
                            } else {
                                options.success([]);
                            }
                        }, 500);
                    }
                },
                schema: {
                    model: {
                        id: "id",
                        hasChildren: "hasChildren"
                    }
                }
            }
        });*/
        var CustomNode = kendo.data.Node.define({
            averageRating: function () {
                var movies = this.children.data();
                var rating = 0;
                if (movies.length) {
                    $.each(movies, function () { rating += this.rating; });
                    rating /= movies.length;
                }
                return rating.toFixed(2);
            }
        });
        var dataSource = new kendo.data.HierarchicalDataSource({
            data: [{
                    categoryName: "SciFi",
                    items: [{
                            movieName: "Inception",
                            rating: 8.8,
                            image: "images/icons/test16_16/search.png"
                        }, {
                            movieName: "The Matrix",
                            rating: 8.7,
                            image: "images/icons/test16_16/search.png"
                        }],
                    image: "images/icons/test16_16/mail.png"
                }, {
                    categoryName: "Drama",
                    hasAssignedMovies: true,
                    image: "images/icons/test16_16/mail.png"
                }],
            schema: {
                model: CustomNode
            }
        });
        //var nav = new Navigations();
        //nav.initTree({
        //    dataTextField: ['categoryName', 'movieName'],
        //    checkboxes: {
        //        checkChildren: true,
        //        templete: '<input type="checkbox" name:"checkFields=[#= items.moviewName #]" />'
        //    },
        //    dataImageUrl:'image'
        //});
    });
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=test.js.map