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

function generateSpaceObjects(count, type) {
    for (let i = 0; i < count; i++) {
        spaceObjects.push({
            coords: [
                getRandomInt(0, window.innerWidth * 10), 
                getRandomInt(0, window.innerHeight)
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
    ctx.fillStyle = '#202020';
    ctx.arc(x, y, 70, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#000';
}

function renderMeteor(x, y) {
    // ctx.fillStyle = '#fff';
    // ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
    // ctx.fill();
    // ctx.closePath();

    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, 10, 10);

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
                spaceObject.coords[0] = spaceObject.coords[0] - (1 / 50);
                break;

            case SPACE_OBJECT_TYPES.METEOR:
                spaceObject.coords[0] = spaceObject.coords[0] - 5;
                break;
        }
    })
}


generateSpaceObjects(window.innerWidth * 6, SPACE_OBJECT_TYPES.STAR);
generateSpaceObjects(2, SPACE_OBJECT_TYPES.PLANET);
generateSpaceObjects(20, SPACE_OBJECT_TYPES.METEOR);

reRenderScene();
reRenderSpaceObjects();

// GAME LIFECIRCLE
setInterval(() => {
    moveSpaceObjects();
    reRenderScene();
    reRenderSpaceObjects();
}, 10)