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
    coords: [100, window.innerHeight / 2]
}

function renderSpaceShip(x, y) {
    ctx.strokeStyle = '#fff';
    ctx.fillStyle = '#fff';

    ctx.beginPath();
    ctx.fillRect(x, y, 40, 8);
    
    ctx.moveTo(x, y)
    ctx.lineTo(x + 10, y - 20);
    ctx.lineTo(x + 10, y + 28);
    ctx.lineTo(x, y + 8);
    ctx.closePath();
    ctx.fill();

    ctx.strokeRect(x + 10, y - 18, 5, 1);
    ctx.strokeRect(x + 10, y + 26, 5, 1);

    ctx.strokeRect(x + 10, y - 10, 15, 1);
    ctx.strokeRect(x + 10, y + 18, 15, 1);
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


generateSpaceObjects(window.innerWidth * 6, SPACE_OBJECT_TYPES.STAR);
generateSpaceObjects(1, SPACE_OBJECT_TYPES.PLANET, [window.innerWidth - 100, window.innerWidth], [-100, 20]);
generateSpaceObjects(20, SPACE_OBJECT_TYPES.METEOR);

reRenderScene();
reRenderSpaceObjects();

// GAME LIFECIRCLE
setInterval(() => {
    moveSpaceObjects();
    reRenderScene();
    reRenderSpaceObjects();
    renderSpaceShip(...spaceShipState.coords)
}, 10)