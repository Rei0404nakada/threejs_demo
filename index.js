import * as THREE from "./build/three.module.js"
import { OrbitControls } from "./jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js";
import { TextGeometry } from "./jsm/geometries/TextGeometry.js";
import { FontLoader } from "./jsm/loaders/FontLoader.js";
import { PointerLockControls } from "./jsm/controls/PointerLockControls.js"
let scene, camera, renderer, cube;
let orbitcontrols;
let mixer;
let model = null;
let text;
let delta;
let animationId = null;
let fontUrl;
let model3d = "./3d/cube_animations.glb";
let flamecount = 0;
let wireframeCheck = false;
let dirLight;
let ambientLight;
let plane;
let moveForward = false;
let moveBackward = false;
let moveLeft= false;
let moveRight = false;
let prevTime = performance.now();
let material1;
let controls;
let diceFlame = 0;
let prevTime2;
let clickControl = 0;
let box;
const actions = [];
const clock = new THREE.Clock();
const fontLoader = new FontLoader()
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

document.getElementById("changeType0").addEventListener("click", function() {
    location.reload();
});

document.getElementById("changeType1").addEventListener("click", function() {
    wireframeCheck = false;
    material1 = new THREE.MeshPhongMaterial({ 
        color: 0x6699FF,
        specular: 0xffffff,
        shininess: 50,
        wireframe: wireframeCheck
    });
    orbitcontrols.dispose();
    addLight();
    modelloader(1);
    animates(1);
});
document.getElementById("changeType2").addEventListener("click", function() {
    wireframeCheck = true;
    material1 = new THREE.MeshPhongMaterial({ 
        color: 0x6699FF,
        specular: 0xffffff,
        shininess: 50,
        wireframe: wireframeCheck
    });
    orbitcontrols.dispose();
    addLight();
    modelloader(1);
    animates(1);
});

document.getElementById("changeType3").addEventListener("click", function() {
    fontUrl = "./fonts/gentilis_bold.typeface.json";
    orbitcontrols.dispose();
    addLight();
    modelloader(2);
    animates(2);
});
document.getElementById("changeType4").addEventListener("click", function() {
    fontUrl = "./fonts/gentilis_regular.typeface.json";
    orbitcontrols.dispose();
    addLight();
    modelloader(2);
    animates(2);
});
document.getElementById("changeType5").addEventListener("click", function() {
    fontUrl = "./fonts/helvetiker_bold.typeface.json";
    orbitcontrols.dispose();
    addLight();
    modelloader(2);
    animates(2);
});
document.getElementById("changeType6").addEventListener("click", function() {
    fontUrl = "./fonts/helvetiker_regular.typeface.json";
    orbitcontrols.dispose();
    addLight();
    modelloader(2);
    animates(2);
});
document.getElementById("changeType7").addEventListener("click", function() {
    fontUrl = "./fonts/optimer_bold.typeface.json";
    orbitcontrols.dispose();
    addLight();
    modelloader(2);
    animates(2);
});
document.getElementById("changeType8").addEventListener("click", function() {
    fontUrl = "./fonts/optimer_regular.typeface.json";
    orbitcontrols.dispose();
    addLight();
    modelloader(2);
    animates(2);
});

document.getElementById("changeType9").addEventListener("click", function() {
    let dice_num = Math.floor(Math.random() * 6) + 1;
    let camera_num = Math.floor(Math.random() * 4) + 1;
    prevTime2 = performance.now();
    console.log(dice_num);
    console.log(camera_num);
    diceFlame = 0;
    switch (dice_num){
        case 1:
            model3d = "./3d/dice1.glb";
            break;
        case 2:
            model3d = "./3d/dice2.glb";   
            break;
        case 3:
            model3d = "./3d/dice3.glb";    
            break;
        case 4:
            model3d = "./3d/dice4.glb";
            break;
        case 5:
            model3d = "./3d/dice5.glb";
            break;
        case 6:
            model3d = "./3d/dice6.glb";
            break;
    }
    switch (camera_num){
        case 1:
            camera.position.x = 0;
            camera.position.y = 20;
            camera.position.z = 20;
            break;
        case 2:
            camera.position.x = 0;
            camera.position.y = 20;
            camera.position.z = -20;   
            break;
        case 3:
            camera.position.x = 20;
            camera.position.y = 20;
            camera.position.z = 0;    
            break;
        case 4:
            camera.position.x = -20;
            camera.position.y = 20;
            camera.position.z = 0;
            break;
    }
    flamecount = 0;
    orbitcontrols.dispose();
    addLight();
    modelloader(0);
    animates(3);
});
document.getElementById("changeType10").addEventListener("click", function() {
    model3d = "./3d/dice.glb";
    camera.position.x = 0;
    camera.position.y = 25;
    camera.position.z = 15;
    orbitcontrols.dispose();
    addLight();
    modelloader(0);
    animates(0);
});
document.getElementById("changeType11").addEventListener("click", function() {
    wireframeCheck = false;
    material1 = new THREE.MeshToonMaterial({color: 0x6699FF});
    orbitcontrols.dispose();
    addLight();
    modelloader(1);
    animates(1);
});
document.getElementById("changeType12").addEventListener("click", function() {
    wireframeCheck = false;
    material1 = new THREE.MeshLambertMaterial({color: 0x6699FF});
    orbitcontrols.dispose();
    addLight();
    modelloader(1);
    animates(1);
});
document.getElementById("changeType13").addEventListener("click", function() {
    if (clickControl == 0) {
        fps();
        animate4();
        clickControl = 1;
    }else if (clickControl == 2) {
        controls.dispose();
        fps();
        animate4();
    }else {
        controls.dispose();
        controls = new PointerLockControls(camera, renderer.domElement);
        controls.lock();
    }
    
});

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1,
        1000
    );

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    dirLight = new THREE.DirectionalLight(0xffffff, 2);
    scene.add(dirLight);

    ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 10;

    // orbitcontrols = new OrbitControls(camera, renderer.domElement);
    // orbitcontrols.zoomSpeed = 0.5;
    
}
function addLight() {
    scene.add(dirLight);
    scene.add(ambientLight);
}
function fps() {

    scene.remove( cube );
    scene.remove( plane );
    scene.remove( text );
    scene.remove( model );
    scene.remove(dirLight);
    scene.remove(ambientLight);
    scene.remove( box );
    const color = new THREE.Color();

    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

    camera.position.set(0, 5, 25);

    orbitcontrols.dispose();
    controls = new PointerLockControls(camera, renderer.domElement);
    // window.addEventListener("click", () => {
    //     controls.lock();
    // })
    controls.lock();

    const onKeyDown = (e) => {
        switch (e.code) {
            case "KeyW":
                moveForward = true;
                break;
            case "KeyA":
                moveLeft = true;
                break;
            case "KeyS":
                moveBackward = true;
                break;
            case "KeyD":
                moveRight = true;
                break;
        }
    };
    const onKeyUp = (e) => {
        switch (e.code) {
            case "KeyW":
                moveForward = false;
                break;
            case "KeyA":
                moveLeft = false;
                break;
            case "KeyS":
                moveBackward = false;
                break;
            case "KeyD":
                moveRight = false;
                break;
        }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    
    const planeGeometry = new THREE.PlaneGeometry(4000, 4000, 1000, 1000);
    const material = new THREE.MeshBasicMaterial({
    color: 0x6699FF,
    wireframe: true,
    });
    plane = new THREE.Mesh(planeGeometry, material);
    plane.rotateX(-Math.PI / 2);
    scene.add(plane);

    // const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
    // let position = boxGeometry.attributes.position;
    // const colorsBox = [];
    // for (let i = 0, l = position.count; i < l; i++) {
    // color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    // colorsBox.push(color.r, color.g, color.b);
    // }
    // boxGeometry.setAttribute(
    // "color",
    // new THREE.Float32BufferAttribute(colorsBox, 3)
    // );
    // for (let i = 0; i < 200; i++) {
    // const boxMaterial = new THREE.MeshPhongMaterial({
    //     specular: 0xffffff,
    //     flatShading: true,
    //     vertexColors: true,
    // });
    // boxMaterial.color.setHSL(
    //     Math.random() * 0.2 + 0.5,
    //     0.75,
    //     Math.random() * 0.25 + 0.75
    // );
    // box = new THREE.Mesh(boxGeometry, boxMaterial);
    // box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
    // box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
    // box.position.z = Math.floor(Math.random() * 20 - 10) * 20;
    // scene.add(box);
    // }
    const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
    const boxMaterial =new THREE.MeshLambertMaterial({color: 0x6699FF});
    box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.y = 10;
    scene.add(box);
}

function modelloader(t) {
    if (clickControl == 1) {
        clickControl = 2;
    }
    orbitcontrols = new OrbitControls(camera, renderer.domElement);
    orbitcontrols.zoomSpeed = 0.5;

    switch (t){
        case 0:
            scene.remove( plane );
            scene.remove( cube );
            scene.remove( model );
            scene.remove( text );
            scene.remove( box );
            const gltfloader = new GLTFLoader();
            gltfloader.load(
                model3d,
                function (gltf) {
                    model = gltf.scene;
                    scene.add(model);
                    mixer = new THREE.AnimationMixer(model);
                    gltf.animations.forEach(animation => {
                        actions.push(mixer.clipAction(animation).play());
                    })
                },
                undefined,
                function (error) {
                    console.log(error);
                }
            );
            break;
        case 1:
            scene.remove( plane );
            scene.remove( cube );
            scene.remove( model );
            scene.remove( text );
            scene.remove( box );
            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = 15;
            const geometry1 = new THREE.TorusGeometry( 6, 2, 16, 100 );
            cube = new THREE.Mesh(geometry1, material1);
            scene.add(cube);    
            break;
        case 2:
            scene.remove( plane );
            scene.remove( cube );
            scene.remove( model );
            scene.remove( text );
            scene.remove( box );
            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = 15;
            
            fontLoader.load(fontUrl, (font) => {
                const textGeometry = new TextGeometry("HAL IH13", {
                font: font,
                size: 3,
                height: 1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5,
            })
            textGeometry.center()
                  
            const textMaterial = new THREE.MeshPhongMaterial({
                color: 0x6699FF,
              })
            text = new THREE.Mesh(textGeometry, textMaterial)
            text.castShadow = true
            text.position.z = 1
            scene.add(text)
            })
            break;
    }    
}

function animate0() {
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(animate0);
    delta = clock.getDelta();
    mixer.update(delta);
    orbitcontrols.update();
    renderer.render(scene, camera);
}
function animate1() {
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(animate1);
    delta = clock.getDelta();
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    orbitcontrols.update();
    renderer.render(scene, camera);
}
function animate2() {
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(animate2);
    delta = clock.getDelta();
    orbitcontrols.update();
    renderer.render(scene, camera);
}
function animate3() {
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(animate3);
    flamecount += 1;
    delta = clock.getDelta();
    const dicetime = performance.now();
    diceFlame += (dicetime - prevTime2) / 100;
    if (diceFlame < 115) {
        mixer.update(delta);
    }
    // if (flamecount < 1550) {
    //     mixer.update(delta);
    // }
    orbitcontrols.update();
    prevTime2 = dicetime;
    renderer.render(scene, camera);
}
function animate4() {
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(animate4);

    const time = performance.now();
    // 前進後進判定
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    //ポインターがONになったら
    if (controls.isLocked) {
        const delta2 = (time -prevTime) / 1000;

        velocity.z -= velocity.z * 5.0 * delta2;
        velocity.x -= velocity.x * 5.0 * delta2;
        if (moveForward || moveBackward) {
            velocity.z -= direction.z * 200 * delta2;
        }
        if (moveRight || moveLeft) {
            velocity.x -= direction.x * 200 * delta2;
        }
        controls.moveForward(-velocity.z * delta2);
        controls.moveRight(-velocity.x * delta2);
    }
    prevTime = time;
    renderer.render(scene, camera);
}

function animates(t) {
    if (t == 0) {
       animate0();
    }else if(t == 1) {
       animate1(); 
    }else if(t == 2) {
        animate2(); 
    }else if(t == 3) {
        animate3(); 
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);
init();
modelloader(0);
animates(0);






    