/// <reference path="reference.ts" />

class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: JQuery) {
        this.element = element[0];
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    start() {
        //this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }

    stop() {
        clearTimeout(this.timerToken);
    }

}

interface stringArray {
    [index: number]: string;
}

interface clockInterface {
	new (hour: number, minute: number);
}

interface shape {
	color: string;
}

interface penStoke {
	penWidth: number;
}

interface squre extends shape, penStoke {
	sideLength: number;
}

class Clock {
	currentTime: Date;

	constructor(h: number, m: number) { }
}

interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}
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

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }
    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        } else {
            alert("Error");
        }
    }
}

class Grid {
    static origin = { x: 0, y: 0 };
    calulateDistanceFromOrigin(point: { x: number; y: number; }) {
        var xDist = (point.x - Grid.origin.x);
        var yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }

    constructor(public scale: number) { }
}

class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nameTag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function findKeeper<A extends Animal, K>(a: {
    new (): A;
    prototype: { keeper: K }
    }): K {

    return a.prototype.keeper;
}



enum A { Ready=1, Waiting };
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
