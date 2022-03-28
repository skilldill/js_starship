function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const canvas = document.getElementById('canvas');
const controller = document.getElementById('controller');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

// GAME
const SPACE_OBJECT_TYPES = {
    STAR: 'STAR',
    PLANET: 'PLANET',
    METEOR: 'METEOR'
}

// { coords: [x, y], type: SPACE_OBJECT_TYPES }
const spaceObjects = [];

const spaceShipState = {
    coords: [100, window.innerHeight / 2],
    shots: []
}

function renderSpaceShip(x, y) {
    ctx.strokeStyle = '#fff';
    ctx.fillStyle = '#fff';

    ctx.beginPath();
    ctx.fillRect(x, y, 40, 8);
    
    // Tail
    ctx.moveTo(x, y + 4);
    ctx.lineTo(x - 10, y - 15);
    ctx.lineTo(x + 15, y + 4);
    ctx.lineTo(x - 10, y + 23);
    ctx.closePath();
    ctx.fill();
    
    // Flys
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 4);
    ctx.lineTo(x + 30, y - 40);
    ctx.lineTo(x + 25, y + 4);
    ctx.lineTo(x + 30, y + 48);
    ctx.closePath();
    ctx.fill();

    // Cabine
    ctx.beginPath();
    ctx.moveTo(x + 25, y + 4);
    ctx.lineTo(x + 25, y - 5);
    ctx.lineTo(x + 80, y + 4);
    ctx.lineTo(x + 25, y + 13);
    ctx.closePath();
    ctx.fill();

    // Blasters
    ctx.beginPath();
    ctx.moveTo(x + 25, y - 20);
    ctx.lineTo(x + 45, y - 20);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(x + 25, y + 28);
    ctx.lineTo(x + 45, y + 28);
    ctx.stroke();
    ctx.closePath();
}

function generateSpaceObjects(count, type, xLimits = [0, window.innerWidth * 10], yLimits = [0, window.innerHeight] ) {
    for (let i = 0; i < count; i++) {
        spaceObjects.push({
            coords: [
                getRandomInt(...xLimits), 
                getRandomInt(...yLimits)
            ],
            type
        });
    }
}

function reRenderScene() {
    ctx.fillStyle = '#000';
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
}

function renderStar(x, y) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, 1, 1);

    ctx.fillStyle = '#000';
}

function renderPlanet(x, y) {
    ctx.fillStyle = '#0d0d0d';

    ctx.beginPath();
    ctx.arc(x, y, 350, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#000';
}

function renderMeteor(x, y) {
    ctx.fillStyle = '#fff';

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = '#000';
}

const mapRenderFuncs = {
    [SPACE_OBJECT_TYPES.STAR]: renderStar,
    [SPACE_OBJECT_TYPES.PLANET]: renderPlanet,
    [SPACE_OBJECT_TYPES.METEOR]: renderMeteor,
}

function reRenderSpaceObjects() {
    spaceObjects.forEach((spaceObject) => {
        const { coords, type } = spaceObject;
        
        const render = mapRenderFuncs[type];

        render(...coords);
    })
}

function moveSpaceObjects() {
    spaceObjects.forEach((spaceObject) => {
        switch(spaceObject.type) {
            case SPACE_OBJECT_TYPES.STAR:
                spaceObject.coords[0] = spaceObject.coords[0] - 1;
                break;

            case SPACE_OBJECT_TYPES.PLANET:
                spaceObject.coords[0] = spaceObject.coords[0] - 0.2;
                break;

            case SPACE_OBJECT_TYPES.METEOR:
                spaceObject.coords[0] = spaceObject.coords[0] - 5;
                break;
        }
    })
}

function moveShots() {
    spaceShipState.shots.forEach((shot) => {
        shot[0] = shot[0] + 5;
    })
}

function reRenderShots(shots) {
    ctx.fillStyle = '#f00';

    shots.forEach((shot) => {
        ctx.fillRect(shot[0], shot[1], 5, 2);
    })

    ctx.fillStyle = '#000';
}

function checkSuccessShots(shots) {
    const meteors = spaceObjects.filter(({ type }) => type === SPACE_OBJECT_TYPES.METEOR);

    meteors.map((meteor) => {
        const foundIndex = shots.findIndex((shot) => shot[0] >= meteor.coords[0] - 10 && shot[0] <= meteor.coords[0] + 20); 

        if (foundIndex > -1 && shots[foundIndex][1] >= meteor.coords[1] - 10 && shots[foundIndex][1] <= meteor.coords[1] + 20) {
            meteor.coords[0] = -10;
        }
    })
}

generateSpaceObjects(window.innerWidth * 6, SPACE_OBJECT_TYPES.STAR);
generateSpaceObjects(1, SPACE_OBJECT_TYPES.PLANET, [window.innerWidth - 100, window.innerWidth], [-100, 0]);
generateSpaceObjects(20, SPACE_OBJECT_TYPES.METEOR);

reRenderScene();
reRenderSpaceObjects();

// GAME LIFECIRCLE
setInterval(() => {
    moveSpaceObjects();
    moveShots();

    checkSuccessShots(spaceShipState.shots);

    reRenderScene();
    reRenderSpaceObjects();
    renderSpaceShip(...spaceShipState.coords);
    reRenderShots(spaceShipState.shots);
}, 10)

canvas.addEventListener('mousemove', (event) => {
    const { clientY } = event;
    spaceShipState.coords[1] = clientY;
})

canvas.addEventListener('click', () => {
    spaceShipState.shots.push([spaceShipState.coords[0] + 45, spaceShipState.coords[1] - 20]);
    spaceShipState.shots.push([spaceShipState.coords[0] + 45, spaceShipState.coords[1] + 28]);
})