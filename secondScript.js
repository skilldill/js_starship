function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const canvas = document.getElementById('canvas');
const controller = document.getElementById('controller');

controller.focus();

canvas.addEventListener('click', () => {
    controller.focus();
})

let ctx;

function canvasInit() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx = canvas.getContext('2d');
    
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";
    ctx.save();
}

function reRenderScene() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillRect(0, 0,window.innerWidth, window.innerHeight);
}

function generateStars(count) {
    const stars = [];

    for (let i = 0; i < count; i++) {
        const star = [getRandomInt(-20, window.innerWidth * 4), getRandomInt(0, window.innerHeight - 10)];
        stars.push(star);
    }

    return stars;
}

canvasInit();
reRenderScene();

// GAME PART
let stars = generateStars(window.innerWidth * 4);
let meteors = generateStars(5);
let movedPath = 0;

// {y: number, path: number}
const shots = [];

const starshipCoords = [100, window.innerHeight / 2];

function moveStars(step) {
    movedPath = movedPath + step;

    stars.forEach((star) => {
        star[0] = star[0] - step;
    })

    meteors.forEach((meteor) => {
        meteor[0] = meteor[0] - step * 2;
    })
}

function renderStarship(x, y) {
    ctx.fillStyle = '#FFF';
    ctx.strokeStyle = '#FFF';

    ctx.fillRect(x, y, 25, 10);
    ctx.fillRect(x, y - 10, 5, 10);
    ctx.fillRect(x, y + 10, 5, 10);

    ctx.beginPath();
    ctx.moveTo(x + 25, y + 5);
    ctx.lineTo(x + 35, y + 5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x + 20, y - 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x + 20, y + 25);
    ctx.stroke();
}

function renderShots() {
    if (shots.length === 0)
        return;

    shots.forEach((shot) => {
        shot.path = shot.path + 10;
        ctx.fillStyle = '#FFF';
        ctx.fillRect(shot.path, shot.y, 10, 2);
    })

    ctx.fillStyle = '#000';
}

function reRenderStars(stars) {
    ctx.fillStyle= '#fff';

    stars.map((star) => {
        ctx.fillRect(star[0], star[1], 1, 1);
    })

    ctx.fillStyle= '#000';
}

function reRenderMeteors(meteors) {
    ctx.fillStyle= '#fff';

    meteors.map((meteor) => {
        ctx.fillRect(meteor[0], meteor[1], 10, 10);
    })

    ctx.fillStyle= '#000';
}

function checkSuccessShots() {
    meteors.map((meteor) => {
        const foundIndex = shots.findIndex((shot) => shot.path >= meteor[0] - 10 && shot.path <= meteor[0] + 20); 

        if (foundIndex > -1 && shots[foundIndex].y >= meteor[1] - 10 && shots[foundIndex].y <= meteor[1] + 20) {
            meteor[0] = -10;
        }
    })
}

setInterval(() => {
    if (movedPath % (4000) === 0) {
        stars = generateStars(window.innerWidth * 4);
    }

    if (movedPath % 2000 === 0) {
        meteors = generateStars(10);
    }

    checkSuccessShots();

    moveStars(1);
    reRenderScene();
    renderStarship(...starshipCoords);
    reRenderStars(stars);
    reRenderMeteors(meteors);
    renderShots();
}, 10)

canvas.addEventListener('mousemove', (event) => {
    const { clientY } = event;
    starshipCoords[1] = clientY;
})

canvas.addEventListener('click', () => {
    shots.push({
        y: starshipCoords[1] + 5,
        path: 100
    })
})

controller.addEventListener('keydown', (event) => {
    const { keyCode } = event;

    switch(keyCode) {
        // UP
        case 38:
            starshipCoords[1] = starshipCoords[1] - 5;
            break;

        // DOWN
        case 40:
            starshipCoords[1] = starshipCoords[1] + 5;
            break;

        // SHOT
        case 32:
            shots.push({
                y: starshipCoords[1] + 5,
                path: 100
            })
            break;
    }
})