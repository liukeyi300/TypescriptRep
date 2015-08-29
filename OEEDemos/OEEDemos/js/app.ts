/// <reference path="reference.ts" />

$(function () {
    /*var viewModel = kendo.observable({
        firstName: "Joe",
        lastName: "Li",
        displayGreeting: function (): void {
            var firstName = this.get("firstName");
            var lastName = this.get("lastName");
            alert("Hello, " + firstName + " " + lastName + "!!!");
        }
    });
    kendo.bind($('#view'), viewModel);*/

    $("#nav-tree").kendoTreeView({
        dataImageUrlField: "image",
        dataSource: [
            {
                text: "foo",
                image: "images/icons/test16_16/mail.png",
                items: [
                    { text: "bar", image: "images/icons/test16_16/search.png" },
                    { text: "net", image: "images/icons/test16_16/search.png" },
                    { text: "net", image: "images/icons/test16_16/search.png" },
                    { text: "net", image: "images/icons/test16_16/search.png" },
                    { text: "net", image: "images/icons/test16_16/search.png" },
                    { text: "net", image: "images/icons/test16_16/search.png" },
                    { text: "net", image: "images/icons/test16_16/search.png" },
                    { text: "net", image: "images/icons/test16_16/search.png" },
                    { text: "net", image: "images/icons/test16_16/search.png" },
                    { text: "net", image: "images/icons/test16_16/search.png" }
                ]
            }, {
                text: "add",
                image: "images/icons/test16_16/search.png",
                items: [
                    { text: "addad" },
                    { text: "asdf" }
                ]
            }
        ]
    });
});