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


let player = new Image();
player.src = "carrinho.png";

let background = new Image();
background.src = "pista.png";

let bgY = 0;
let bgW =  canvas.width;
let bgH = canvas.height;
let playerSpeed = 1;
let pX = 470;
let pY = 620;
let pW = 100;
let pH = 80;


let bullet = new Image();
bullet.src = "bala.png";

let bW = 30;
let bH = 30;
let bRadius = bW/2;
let bSpeed = 9;
let bullets = [[400, 400], [400, -100], [400, -100]];

let enemy = new Image();
enemy.src = "rei.png";

let eW = 60;
let eH = 80;
let eRadius = eW/2;
let eSpeed = 2;
let enemies = [[200, 100, eSpeed]];
let eSpawnCD = 3000;
let eSpawnTimer = 0;







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


canvas.addEventListener(

    "mousemove", 
    function(event)
    {
        let rect = canvas.getBoundingClientRect();
        let cX = event.clientX - rect.left;
        let cY = event.clientY - rect.top;
        //console.log("coords:" + cX + " ," + cY);

        pX = cX - pW/2;
        //pY = cY - pH/2;
    }
);


canvas.addEventListener(
    "click",
    function(event)
    {
        //console.log("atirou");
        for(let i = 0; i < bullets.length; i++){
            if (bullets[i][1] < -100)
            {
                bullets[i][0] = pX + pW/3;
                bullets[i][1] = pY;
                break;

            }
            
         
        }
    }
);


function drawBullets()
{
    for (let i = 0; i < bullets.length; i++)
    { 
        bullets[i][1]-= bSpeed;
        ctx.beginPath();
        ctx.drawImage(
            bullet,
            bullets[i][0],
            bullets[i][1],
            bW,
            bH
        
        );

    }
}

function drawEnemies()
{
    for (let i = 0; i < enemies.length; i++)
    {
        enemies[i][0] -= enemies[i][2];
        ctx.beginPath();
        ctx.drawImage(
            enemy,
            enemies[i][0],
            enemies[i][1],
            eW,
            eH
        );
        if (enemies[i][0] < -100 || enemies[i][0] > 900)
        {

        }
    }
}
function detectCollison()
{
   for (let i = 0; i < bullets.length; i ++)
   {
    for(let j = 0; j < enemies.length; j++)
    {
       if (testCollison(bullets[i], enemies[j]))
       {
         bullets[i][1] = -500;
         enemies.splice(j, 1);
       }
    }
   }

}

function testCollison(b, e)
{

    let dist = Math.sqrt((b[0]-e[0])**2 + (b[1])**2);
    if (bRadius+eRadius > dist)
    {
        return true;
    }
    else
     {
       return false
     }
}

function spawnEnemy()
{
    eSpawnTimer +- 1000/60;
    if (eSpawnTimer >= eSpawnCD)
    {
        eSpawnTimer = 0;
        let x = Math.random() * canvas.width;
        let y = Math.random() * 100 + 50;
        let s = (Math.random() * eSpeed * 2) - eSpeed;
        let e = [x, y, s];
        enemies.push(e);
    }
}
    










function jogar()
{
   ctx.clearRect(0, 0, canvas.width,  canvas.height);
   bgY += playerSpeed;
   if(bgY >= bgH)
   {
    bgY -= bgH;
   }
   ctx.drawImage(background, 0, bgY, bgW, bgH);
   ctx.drawImage(background, 0, bgY - bgH, bgW, bgH);


   ctx.drawImage(player, pX, pY, pW, pH);

    drawBullets();
    drawEnemies();
    detectCollison();
    spawnEnemy();
    
      
}









setInterval(jogar, 1000/60);


