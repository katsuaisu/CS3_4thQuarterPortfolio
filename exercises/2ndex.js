// REI'S FIX
// added the parameters so the code can see the inputted numbers from HTML
function plotPoint(x0, y0, x, y) {

    console.log(x0, y0, x, y) // checks the arguments passed to this function
    in1.innerHTML = x0 + " " + y0 + " " + x + " " + y;
    var point = document.createElement('div');
    point.className = 'point';

    // REI'S FIX
    //  it didnt have the .style.left (like its supposed to have a 
    // dot kaya it wasnt working :( )

    /* control where to place the div on the screen using left and bottom of position:absolute */
    point.style.position = 'absolute';

    point.style.left = (x - x0 + 200 - 5) + 'px';
    // subtract half the width of the point to center it by changing left css property

    point.style.bottom = (y - y0 + 200 - 5) + 'px';
    // subtract half the height of the point to center it by changing bottom css property

    document.getElementById('coordinatePlane').appendChild(point);

    if (x > x0 && y > y0) {
        out1.innerHTML = "NE"
    }
    else if (x < x0 && y < y0) {
        out1.innerHTML = "SO"
    }
    else if (x > x0 && y < y0) {
        out1.innerHTML = "SE"
    }
    else if (x < x0 && y > y0) {
        out1.innerHTML = "NO"
    }
    else {
        out1.innerHTML = "divisa"
    }

    // REI'S FIX
    // peep missing closing bracket here

} 