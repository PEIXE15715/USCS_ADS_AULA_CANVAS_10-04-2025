let canvas = document.getElementById("meucanvas");
let ctx = canvas.getContext("2d");

let x = 300;
let y = 200;
let ang = 0;
let centerX = 300;
let centerY = 200;

let x2 = 300;
let y2 = 200;
let ang2 = Math.random()*2*Math.PI;
let speed2 = 10;
let speedX2 = speed2*2*Math.cos(ang2);
let speedY2 = speed2*2*Math.sin(ang2);


function desenha ()
{

ctx.clearRect(0, 0, 600, 400);


    ang += 0.01;
    x = centerX + 100*(Math.cos(ang));
    y = centerY + 100*(Math.sin(ang));



    ctx.beginPath();
    ctx.fillStyle = "cyan";
    ctx.arc(x, y, 25, 0, 2*Math.PI);
    ctx.fill();

    x2 += speedX2;
    y2 += speedY2;

    if(x2 <= 0 || x2 >= 600)
    {
        x2 -= speedX2;
        speedX2 *= -1;
    }
   if (y2 <= 0 || y2 >= 400)
   {
    y2 -= speedY2;
    speedY2 *= -1;
   }



    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(x2, y2, 20, 0, 2*Math.PI);
    ctx.fill();

}

setInterval(desenha, 1000/60);
