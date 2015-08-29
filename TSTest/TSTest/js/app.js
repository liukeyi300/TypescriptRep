function test(person) {
    return '<h1>' + "Hello, " + person.firstname + " " + person.lastname + '</h1>';
}
var Color;
(function (Color) {
    Color._map = [];
    Color.Red = 1;
    Color._map[2] = "Green";
    Color.Green = 2;
    Color._map[3] = "Blue";
    Color.Blue = 3;
})(Color || (Color = {}));

; ;
function createSquare(config) {
    var newSqure = {
        color: "white",
        area: 100
    };
    if(config.color) {
        newSqure.color = config.color;
    }
    if(config.width) {
        newSqure.area = config.width * config.width;
    }
    return newSqure;
}
var usr = {
    firstname: "Jane",
    lastname: "Usr"
};
var mySquare = createSquare({
    color: "black",
    width: 200
});
alert("color is : " + mySquare.color + " area is " + mySquare.area);
