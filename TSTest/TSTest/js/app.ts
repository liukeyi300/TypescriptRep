///<reference path="reference.ts" />

interface Person {
    firstname: string; lastname: string;
}

function test(person: Person) {
    return '<h1>' + "Hello, " + person.firstname + " " + person.lastname + '</h1>';
}


enum Color { Red = 1, Green, Blue};

interface SquareConfig { 
    color?: string; 
    width?: number; 
}

function createSquare(config: SquareConfig): { color: string; area: number;} { 
    var newSqure = {
        color : "white", 
        area : 100 
    };

    if (config.color) {
         newSqure.color = config.color; 
    }

    if (config.width) { 
        newSqure.area = config.width * config.width;
    }

    return newSqure;
}
    var usr = { firstname: "Jane", lastname: "Usr" };

    var mySquare = createSquare({ color: "black", width: 200 });

    alert("color is : " + mySquare.color + " area is " + mySquare.area);

/*$(function () {
    var usr = { firstname: "Jane", lastname: "Usr" };

    var mySquare = createSquare({ color: "black", width: 200 });

    alert("color is : " + mySquare.color + " area is " + mySquare.area);


    //document.body.innerHTML = test(usr);
   
    //var colorName: Color = Color.Blue;
    //alert(colorName);
    /*var notSure: any = 1;
    alert(notSure);
    notSure = "test";
    alert(notSure);
    notSure = false;
    alert(notSure);
});*/