/// <reference path="reference.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Greeter = (function () {
    function Greeter(element) {
        this.element = element[0];
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    Greeter.prototype.start = function () {
        //this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    };
    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
})();
var Clock = (function () {
    function Clock(h, m) {
    }
    return Clock;
})();
//class Animal {
//    name: string;
//    constructor(theName: string) {
//        this.name = theName;
//    }
//    move(meters: number = 0) {
//        alert(this.name + " moved " + meters + "m.");
//    }
//}
//class Snake extends Animal {
//    constructor(name: string) {
//        super(name);
//    }
//    move(meters = 5) {
//        alert("Slithering....");
//        super.move(meters);
//    }
//}
var passcode = "secret passcode";
var Employee = (function () {
    function Employee() {
    }
    Object.defineProperty(Employee.prototype, "fullName", {
        get: function () {
            return this._fullName;
        },
        set: function (newName) {
            if (passcode && passcode == "secret passcode") {
                this._fullName = newName;
            }
            else {
                alert("Error");
            }
        },
        enumerable: true,
        configurable: true
    });
    return Employee;
})();
var Grid = (function () {
    function Grid(scale) {
        this.scale = scale;
    }
    Grid.prototype.calulateDistanceFromOrigin = function (point) {
        var xDist = (point.x - Grid.origin.x);
        var yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    };
    Grid.origin = { x: 0, y: 0 };
    return Grid;
})();
var BeeKeeper = (function () {
    function BeeKeeper() {
    }
    return BeeKeeper;
})();
var ZooKeeper = (function () {
    function ZooKeeper() {
    }
    return ZooKeeper;
})();
var Animal = (function () {
    function Animal() {
    }
    return Animal;
})();
var Bee = (function (_super) {
    __extends(Bee, _super);
    function Bee() {
        _super.apply(this, arguments);
    }
    return Bee;
})(Animal);
var Lion = (function (_super) {
    __extends(Lion, _super);
    function Lion() {
        _super.apply(this, arguments);
    }
    return Lion;
})(Animal);
function findKeeper(a) {
    return a.prototype.keeper;
}
var A;
(function (A) {
    A[A["Ready"] = 1] = "Ready";
    A[A["Waiting"] = 2] = "Waiting";
})(A || (A = {}));
;
$(function () {
    /*var el = $("#content");
    var greet = new Greeter(el);
    greet.start();*/
    /*var cl: clockInterface = Clock;
    var newCl = new cl(1, 2);
    */
    /*var squre = <squre>{};
    squre.color = "blue";
    squre.sideLength = 100;
    squre.penWidth = 100;
    alert(squre.color + " " + squre.sideLength + " " + squre.penWidth);*/
    /*var c: Counter;
    c(10);
    c.reset();
    c.interval = 5.0;*/
    /*var sam = new Snake("Snake");
    sam.move();*/
    /*var employee = new Employee();
    employee.fullName = "Bob";
    if (employee.fullName) {
        alert(employee.fullName);
    }*/
    /**  Lion.prototype.keeper = new ZooKeeper();
      Lion.prototype.keeper.nameTag = "ABC";
      alert(findKeeper(Lion).nameTag);  // typechecks!*/
    /* var grid = new Grid(1.0);
     alert(grid.calulateDistanceFromOrigin({ x: 10, y: 10 }));*/
    /*var status = A.Ready;
    alert(status); */
    $('#test').kendoButton();
});
/*
window.onload = () => {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
};*/
//# sourceMappingURL=app.js.map