const canvas = document.getElementById('canvas');
const controller = document.getElementById('controller');

controller.focus();

const initCoords = [0, 320];
const coords = [0, 320];
let moveDirection = '';

let ctx;


const sceneObjects = [
    [100, initCoords[1] - 20, 30, 20],
    [130, initCoords[1] - 25, 20, 25],
    [300, initCoords[1] - 10, 50, 10],
    [400, initCoords[1] - 100, 30, 100]
]

function canvasInit() {
    canvas.width = 700;
    canvas.height = 400;
    
    ctx = canvas.getContext('2d');
    
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";
    ctx.save();
}


function reRenderScene() {
    ctx.clearRect(0, 0, 700, 400);

    ctx.strokeStyle = "#e0e0e0";

    ctx.beginPath();
    ctx.moveTo(0, initCoords[1]);
    ctx.lineTo(700, initCoords[1]);
    ctx.stroke();

    sceneObjects.map((data) => {
        ctx.strokeRect(...data);
    })

    ctx.restore();
}

function renderSubject(x, y, height = 20) {
    ctx.fillRect(x, y - height, 10, height);
}



canvasInit();
reRenderScene();
renderSubject(...coords);

canvas.addEventListener('click', () => controller.focus());

function getSceneObjectByCoords(x) {
    const foundObject = sceneObjects.find((obj) => x >= obj[0] && x < obj[0] + obj[2]);
    return foundObject;
}

const subjectActions = {
    goRigth() {
        coords[0] = coords[0] + 10;

        const sceneObject = getSceneObjectByCoords(coords[0]);
        
        if (!sceneObject) {
            coords[1] = initCoords[1];
        }

        reRenderScene();
        renderSubject(coords[0], coords[1]);
    },

    goLeft() {
        coords[0] = coords[0] - 10;

        const sceneObject = getSceneObjectByCoords(coords[0]);

        if (!sceneObject) {
            coords[1] = initCoords[1];
        }

        reRenderScene();
        renderSubject(coords[0], coords[1]);
    },

    jump() {
        const sceneObject = getSceneObjectByCoords(coords[0]);
        
        reRenderScene();
        renderSubject(coords[0], coords[1], 10);

        let timeout = setTimeout(() => {
            reRenderScene();
            renderSubject(coords[0], coords[1] - 30);
        }, 50)

        timeout = setTimeout(() => {
            reRenderScene();

            if (!!sceneObject && sceneObject[3] < 30) {
                coords[1] = initCoords[1] - sceneObject[3];
            } 

            renderSubject(coords[0], coords[1]);
            clearTimeout(timeout);
        }, 200)
    },

    jumpLeft() {
        const sceneObject = getSceneObjectByCoords(coords[0] - 20);
        
        reRenderScene();
        renderSubject(coords[0], coords[1], 10);

        let timeout = setTimeout(() => {
            reRenderScene();
            renderSubject(coords[0] - 10, coords[1] - 30);
        }, 50)

        timeout = setTimeout(() => {
            reRenderScene();

            if (!!sceneObject && sceneObject[3] < 30) {
                coords[1] = initCoords[1] - sceneObject[3];
            } 

            renderSubject(coords[0] - 20, coords[1]);

            coords[0] = coords[0] - 20;
            clearTimeout(timeout);
        }, 200)
    },

    jumpRight() {
        const sceneObject = getSceneObjectByCoords(coords[0] + 20);
        
        reRenderScene();
        renderSubject(coords[0], coords[1], 10);

        let timeout = setTimeout(() => {
            reRenderScene();
            renderSubject(coords[0] + 10, coords[1] - 30);
        }, 50)

        timeout = setTimeout(() => {
            reRenderScene();

            if (!!sceneObject && sceneObject[3] < 30) {
                coords[1] = initCoords[1] - sceneObject[3];
            } 

            renderSubject(coords[0] + 20, coords[1]);

            coords[0] = coords[0] + 20;
            clearTimeout(timeout);
        }, 200)
    }
}

controller.addEventListener('keydown', (event) => {
    const { keyCode } = event;

    switch(keyCode) {
        case 32:
            if (moveDirection === 'right') {
                subjectActions.jumpRight();
                break;
            }

            if (moveDirection === 'left') {
                subjectActions.jumpLeft();
                break;
            }

            subjectActions.jump();
            break;
                    
        case 39:
            // Right
            subjectActions.goRigth();
            moveDirection = 'right';
            break;

        case 37:
            // Left
            subjectActions.goLeft();
            moveDirection = 'left';
            break;
    }
})

controller.addEventListener('keyup', (event) => {
    const { keyCode } = event;
    
    if (keyCode === 37 || keyCode === 39) {
        moveDirection = '';
    }
})