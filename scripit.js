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
// A multiplicação por 2 aqui dobrava a velocidade efetiva.
// speedX2 = speed2 * Math.cos(ang2); 
// speedY2 = speed2 * Math.sin(ang2);
let speedX2 = speed2*2*Math.cos(ang2);
let speedY2 = speed2*2*Math.sin(ang2);

function desenha ()
{
    

    ang += 0.01;
    x = centerX + 100*(Math.cos(ang));
    y = centerY + 100*(Math.sin(ang));

    ctx.beginPath();
    ctx.fillStyle = "cyan";
    ctx.arc(x, y, 25, 0, 2*Math.PI);
    ctx.fill();

    let radius2 = 20;
    x2 += speedX2;
    y2 += speedY2;

    // Lógica de reflexão nas bordas (corrigida)
    if(x2 - radius2 <= 0) {
        x2 = radius2;
        speedX2 *= -1;
    } else if (x2 + radius2 >= canvas.width) { // Usar canvas.width
        x2 = canvas.width - radius2;
        speedX2 *= -1;
    }
    if (y2 - radius2 <= 0) {
        y2 = radius2;
        speedY2 *= -1;
    } else if (y2 + radius2 >= canvas.height) { // Usar canvas.height
        y2 = canvas.height - radius2;
        speedY2 *= -1;
    }

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(x2, y2, radius2, 0, 2*Math.PI);
    ctx.fill();
}


let player = new Image();
player.src = "carrinho.png";

let background = new Image();
background.src = "pista.png";

let bgY = 0;
let bgW =  canvas.width; // Certifique-se que o canvas tem width/height no HTML ou aqui
let bgH = canvas.height;
let playerSpeed = 1; // Velocidade de rolagem do background
let pX = 470;
let pY = 620; // Ajuste conforme a altura do seu canvas
let pW = 100;
let pH = 80;


let bullet = new Image();
bullet.src = "bala.png";

let bW = 30;
let bH = 30;
let bRadius = bW/2;
let bSpeed = 9;
const BULLET_OFFSCREEN_Y = -bH - 10; // Posição Y para balas "disponíveis"
// Inicializa todas as balas como disponíveis
let bullets = [
    [0, BULLET_OFFSCREEN_Y], 
    [0, BULLET_OFFSCREEN_Y], 
    [0, BULLET_OFFSCREEN_Y]
];


let enemy = new Image();
enemy.src = "rei.png";

let eW = 60;
let eH = 80;
let eRadius = eW/2; // Usado para colisão circular
let eSpeed = 2; // Velocidade base para inimigos
let enemies = [[200, 100, eSpeed]]; // Um inimigo inicial
let eSpawnCD = 3000; // Cooldown para spawn de inimigos (ms)
let eSpawnTimer = 0;


canvas.addEventListener(
    "mousemove", 
    function(event)
    {
        let rect = canvas.getBoundingClientRect();
        let cX = event.clientX - rect.left;
        // let cY = event.clientY - rect.top; // Não usado pois pY é fixo
        
        pX = cX - pW/2; // Centraliza o jogador no mouse horizontalmente
        //pY = cY - pH/2; // Movimentação vertical comentada
    }
);

canvas.addEventListener(
    "click",
    function(event)
    {
        for(let i = 0; i < bullets.length; i++){
            // Verifica se a bala está disponível (fora da tela)
            if (bullets[i][1] < BULLET_OFFSCREEN_Y + bH) // Um pouco de margem para garantir
            {
                bullets[i][0] = pX + (pW / 2) - (bW / 2); // Centraliza a bala no jogador
                bullets[i][1] = pY; // Bala sai do "topo" do jogador (ajuste se necessário)
                break; // Dispara apenas uma bala por clique
            }
        }
    }
);


function drawBullets()
{
    for (let i = 0; i < bullets.length; i++)
    { 
        // Só desenha e move se a bala estiver em jogo
        if (bullets[i][1] > BULLET_OFFSCREEN_Y) {
            bullets[i][1]-= bSpeed;
            ctx.drawImage(
                bullet,
                bullets[i][0],
                bullets[i][1],
                bW,
                bH
            );
        }
    }
}

function drawEnemies()
{
    
    for (let i = enemies.length - 1; i >= 0; i--)
    {
        enemies[i][0] -= enemies[i][2]; 
        ctx.drawImage(
            enemy,
            enemies[i][0],
            enemies[i][1],
            eW,
            eH
        );

       
        if (enemies[i][0] < -eW || enemies[i][0] > canvas.width) 
        {
            enemies.splice(i, 1);
        }
    }
}

function detectCollison()
{
   for (let i = 0; i < bullets.length; i++)
   {
    
    if (bullets[i][1] <= BULLET_OFFSCREEN_Y) {
        continue;
    }

    
    for(let j = enemies.length - 1; j >= 0; j--)
    {
       if (testCollison(bullets[i], enemies[j]))
       {
         bullets[i][1] = BULLET_OFFSCREEN_Y; 
         enemies.splice(j, 1); 
         
       }
    }
   }
}

function testCollison(b, e) 
{
    
    let bulletCenterX = b[0] + bW / 2;
    let bulletCenterY = b[1] + bH / 2;
   
    let enemyCenterX = e[0] + eW / 2;
    let enemyCenterY = e[1] + eH / 2;

    
    let dx = bulletCenterX - enemyCenterX;
    let dy = bulletCenterY - enemyCenterY;
    let dist = Math.sqrt(dx*dx + dy*dy);

    if (dist < bRadius + eRadius) 
    {
        return true;
    }
    else
    {
       return false;
    }
}

function spawnEnemy()
{
    eSpawnTimer += (1000/60); 
    if (eSpawnTimer >= eSpawnCD)
    {
        eSpawnTimer = 0; 
        
        let x = Math.random() * (canvas.width - eW); 
        let y = Math.random() * 100 + 50; 
       
        let s = (Math.random() * eSpeed * 2) - eSpeed; 
        if (s === 0) s = eSpeed / 2 * (Math.random() < 0.5 ? -1 : 1); 
        
        let newEnemy = [x, y, s];
        enemies.push(newEnemy);
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