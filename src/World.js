// World.js

// Vertex shader program
var VSHADER_SOURCE =`
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    attribute vec2 a_TexCoord;
    attribute vec3 a_Normal;

    varying vec2 v_TexCoord;   // Pass to fragment shader
    varying vec3 v_Normal;    
    varying vec4 v_VertPos;

    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;      // Setting global rotation
    uniform mat4 u_ViewMatrix;              // Set by LookAt
    uniform mat4 u_ProjectionMatrix;        // Set by GL perspective command...eventually
    // uniform mat4 u_NormalMatrix;

    void main(){
        gl_Position = u_ProjectionMatrix * u_ViewMatrix* u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        // vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
        // v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
        v_UV = a_UV;
        v_TexCoord = a_TexCoord;
        v_Normal = a_Normal;
        v_VertPos = u_ModelMatrix * a_Position;

    }`;

// Fragment shader program
var FSHADER_SOURCE =`
    precision mediump float;
    
    uniform vec4 u_FragColor;

    varying vec2 v_TexCoord;
    varying vec2 v_UV;
    varying vec3 v_Normal;    
    varying vec4 v_VertPos;

    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform int u_whichTexture;
    uniform vec3 u_lightPos;
    uniform vec3 u_cameraPos;
    uniform vec3 u_lightColor;
    uniform bool u_lightOn;

    void main(){
    if(u_whichTexture == -3){                           // Ground texture  
        gl_FragColor = vec4((v_Normal + 1.0)/2.0, 1.0);

    }
    else if(u_whichTexture == -2){                   // Solid color
        gl_FragColor = u_FragColor;
    }
    else if(u_whichTexture == -1){              // UV texture
        gl_FragColor = vec4(v_TexCoord, 1.0, 1.0);

    }
    else if (u_whichTexture == 0){              // Dirt Texture

        if (abs(v_Normal.y) > 0.5) {
        // Top or Bottom faces
            gl_FragColor = texture2D(u_Sampler1, v_TexCoord); 
        } else {
            // Side faces
            gl_FragColor = texture2D(u_Sampler0, v_TexCoord); 
        } 
    }
    else{                                           // Error shows red
        gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
    }

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);

    // N dot L
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(L, N), 0.0);
    // gl_FragColor = gl_FragColor * nDotL;
    // gl_FragColor.a = 1.0;

    // Reflection
    vec3 R = reflect(-L, N);

    // Eye vector
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    // Specular
    float specular = pow(max(dot(E, R), 0.0), 30.0) * 0.2;

    // vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    // vec3 ambient = vec3(gl_FragColor) * 0.2;

    vec3 diffuse = vec3(gl_FragColor) * nDotL * u_lightColor * 0.9;
    vec3 ambient = vec3(gl_FragColor) * 0.8;

    // }
    if (u_lightOn) {
        if (u_whichTexture <= 0) {
            gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
        } else {
            gl_FragColor = vec4(diffuse + ambient, 1.0);
        }
    }
    // else {
    //     // If lighting is off, copied from above
    //     if (u_whichTexture == -3) {  
    //         gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);
    //     } else if (u_whichTexture == -2) {  
    //         gl_FragColor = u_FragColor;
    //     } else if (u_whichTexture == -1) {  
    //         gl_FragColor = vec4(v_TexCoord, 1.0, 1.0);
    //     } else if (u_whichTexture == 0) {  
    //         if (abs(v_Normal.y) > 0.5) {
    //             gl_FragColor = texture2D(u_Sampler1, v_TexCoord);
    //         } else {
    //             gl_FragColor = texture2D(u_Sampler0, v_TexCoord);
    //         }
    //     } else {
    //         gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
    //     }
    // }
}`;

// Constants
const SPEED = 0.1;
const ALPHA = 1;

// Defining global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix; 
// let u_NormalMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightColor;
let lightOn;
let texture;

var g_Camera = new Camera();

// Global variables for HTML action
let g_clearColorR = 0.0;
let g_clearColorG = 0.0;
let g_clearColorB = 0.0;

let g_globalAngleX = 0;
let g_globalAngleY = 15;
let g_globalAngleZ = 0;

let g_yellowAngle = 0;
let g_MagentaAngle = 0;
let g_BodyAngle = 0;
let g_LegAngle = 0;

let g_normalOn = true;
let g_lightOn = true;

let g_walkingAnimation = true;
let g_legAnimation = true;

let g_lightPos = [0, 1, -2];
let lightMoving = true;
var lightColor = [1.0, 1.0, 1.0];

let isMouseControlled = false;
let lastX = 0;
let lastY = 0;

const distance = 3;

function main() {
    setUpWebGL();
    connectVariablesToGLSL();
    addActionForHTMLUI();
    initTextures(gl, 0);

    clearCanvas();
    renderScene()
    requestAnimationFrame(tick);
}
var g_startTime = performance.now() / 1000.0 ;
var g_seconds = performance.now() / 1000.0 - g_startTime;

var g_yellowAnimation = false;
var g_magentaAnimation = false;

function tick(){
    g_seconds = (performance.now() / 1000.0 - g_startTime) * 1.5;
    updateAnimationAngles();
    renderScene();   
    requestAnimationFrame(tick);

}

function clearCanvas(){
    gl.clearColor(g_clearColorR, g_clearColorG, g_clearColorB, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function setUpWebGL(){
    canvas = document.getElementById('webgl');

    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    ``
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);

}

function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if (a_TexCoord < 0) {
        console.log('Failed to get the storage location of a_TexCoord');
        return;
    }

    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return;
    }

    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if(!u_ViewMatrix) {
      console.log('Failed to get the storage location of u_ViewMatrix');
      return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }

    // Get the storage location of the u_Sampler
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0'); 
    if(!u_Sampler0){
        console.log('Failed to get the storage location of u_Sampler0');
        return false;
    }
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1'); 
    if(!u_Sampler1){
        console.log('Failed to get the storage location of u_Sampler1');
        return false;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture'); 
    if(!u_whichTexture){
        console.log('Failed to get the storage location of u_whichTexture');
        return false;
    }

    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos'); 
    if(!u_lightPos){
        console.log('Failed to get the storage location of u_lightPos');
        return false;
    }

    u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
    if(!u_cameraPos){
        console.log('Failed to get the storage location of u_cameraPos');
        return false;
    }

    u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
    if(!u_lightOn){
        console.log('Failed to get the storage location of u_lightOn');
        return false;
    }

    // u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    // if(!u_NormalMatrix){
    //     console.log('Failed to get the storage location of u_NormalMatrix');
    //     return false;
    // }

    u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
    if(!u_lightColor){
        console.log('Failed to get the storage location of u_lightColor');
        return false;
    }

    gl.uniform1f(u_lightOn, g_lightOn);

    var identityM = new Matrix4();

    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);
    // gl.uniformMatrix4fv(u_NormalMatrix, false, identityM.elements);

}

// Adjusted from Ch 5
function initTextures() { 
    var image0 = new Image();
    var image1 = new Image();

    if (!image0 || !image1) {
        console.log('Failed to create the image objects');
        return false;
    }

    image0.onload = function() { sendImageToTexture(image0, 0); };
    image1.onload = function() { sendImageToTexture(image1, 1); };

    image0.src = '../resources/grassSide.jpg';
    image1.src = '../resources/grassTop.jpg';

    return true;
}

function sendImageToTexture(image, texUnit) {
    var texture = gl.createTexture();
    if (!texture) { 
        console.log('Failed to create the texture object');
        return false;
    } 

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y-axis

    // Activate the correct texture unit
    if (texUnit == 0) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(u_Sampler0, 0); // Bind texture0 to sampler0

    } else {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(u_Sampler1, 1);
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);


    // Set texture parameters
    
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
}

function addActionForHTMLUI(){
    document.onkeydown = keydown;


    document.getElementById('animateDogON').onclick = function () {g_legAnimation = true; g_walkingAnimation = true};
    document.getElementById('animateDogOFF').onclick = function () {g_legAnimation = false; g_walkingAnimation = false};

    document.getElementById('normalOnButton').onclick = function() { 
        g_normalOn = true
    };
    document.getElementById('normalOffButton').onclick = function() {
        g_normalOn = false
    }

    document.getElementById('lightOnButton').onclick = function() { 
        g_lightOn = true
    };
    document.getElementById('lightOffButton').onclick = function() {
        g_lightOn = false
    }
    
    document.getElementById('lightMovementButton').onclick = function() {
        lightMoving = !lightMoving
    }
    document.getElementById("lightRed").addEventListener("input", function(event) {
        lightColor[0] = event.target.value / 255.0;
        gl.uniform3f(u_lightColor, lightColor[0], lightColor[1], lightColor[2]);
    });

    document.getElementById("lightGreen").addEventListener("input", function(event) {
        lightColor[1] = event.target.value / 255.0;
        gl.uniform3f(u_lightColor, lightColor[0], lightColor[1], lightColor[2]);
    });
    document.getElementById("lightBlue").addEventListener("input", function(event) {
        lightColor[2] = event.target.value / 255.0;
        gl.uniform3f(u_lightColor, lightColor[0], lightColor[1], lightColor[2]);
    });

    // document.getElementById('bodySlide').addEventListener('mousemove', function(ev) {
    //     g_yellowAngle = this.value;
    //     renderScene();
    // });
    
    document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) {
        if(ev.buttons == 1){
            g_lightPos[0] = this.value / 100;
            renderScene
        }
    });
    document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) {
        if(ev.buttons == 1){
            g_lightPos[1] = this.value / 100;
            renderScene
        }
    });
    document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) {
        if(ev.buttons == 1){
            g_lightPos[2] = this.value / 100;
            renderScene
        }
    });

    canvas.addEventListener('mousedown', (event) => {
        // Set mouse control state to true when mouse is pressed down
        isMouseControlled = true;
        
        // Record the mouse position when mouse is pressed
        lastX = event.clientX;
        lastY = event.clientY;
    });
    
    canvas.addEventListener('mousemove', (event) => {
        if (isMouseControlled) {
            const newX = event.clientX - lastX;
            const newY = event.clientY - lastY;
    
            const panSpeed = 0.3; 
    
            if (newX !== 0) {
                g_Camera.panRight(newX * panSpeed);
            }
    
            if (newY !== 0) {
                if (newY > 0) {
                    g_Camera.panUp(newY * panSpeed); 
                } else {
                    g_Camera.panDown(-newY * panSpeed);  
                }
            }
            lastX = event.clientX;
            lastY = event.clientY;
        }
    });
    
    // Stop mouse controls when ESC/leaving mouse
    canvas.addEventListener('mouseup', () => {
        isMouseControlled = false;
    });
    

    document.addEventListener('keydown', (event) => {
        if (event.key === 'b') {  // 'b' key to add block
            const blockPosition = g_Camera.addBlock(distance);
            updateMap(blockPosition, true);
        }

        if (event.key === 'c') {  // 'b' key to add block
            const blockPosition = g_Camera.addBlock(distance);
            updateMap(blockPosition, false);

        }
    });
}

function updateAnimationAngles(){
    if(g_yellowAnimation){
        g_yellowAngle = 45 * Math.sin(g_seconds);

    }
    if(g_magentaAnimation){
        g_MagentaAngle = 45 * Math.sin(2.5 * g_seconds);
    }

    if(g_walkingAnimation){
        g_walkingAngle = 7 * Math.sin((3 * g_seconds));
        g_BodyAngle = 45 * Math.sin(2.5 * g_seconds);
    }

    if(g_legAnimation){
        g_LegAngle = 7 * Math.sin((3 * g_seconds));
    }
    if(lightMoving){
        g_lightPos[0] = 2 * Math.cos(g_seconds);
    }
}


// function updateAnimationAngles(){
//     if(g_yellowAnimation){
//         g_yellowAngle = 45 * Math.sin(g_seconds);

//     }
//     // if(g_magentaAnimation){
//     //     g_MagentaAngle = 45 * Math.sin(2.5 * g_seconds);
//     // }
//     if(lightMoving){
//         g_lightPos[0] = 2 * Math.cos(g_seconds);
//     }

// }

function keydown(ev){

    // Right arrow key event
    if(ev.keyCode == 39 || ev.keyCode == 68){
        // g_Camera.eye.elements[0] += 0.2;
        g_Camera.moveRight(SPEED);
    }
    // Left arrow key event
    if(ev.keyCode == 37 || ev.keyCode == 65){
        // g_Camera.eye.elements[0] -= 0.2;
        g_Camera.moveLeft(SPEED);
    }
    // Up arrow key event
    if(ev.keyCode == 38 || ev.keyCode == 87){
        g_Camera.moveForward(SPEED);
    }
    // Down arrow key event
    if(ev.keyCode == 40 || ev.keyCode == 83){
        g_Camera.moveBackward(SPEED);
    }
    // Q (Left Pan) key event
    if(ev.keyCode == 81){
        g_Camera.panLeft(ALPHA);
    }

    // E (Right Pan) key event
    if(ev.keyCode == 69){
        g_Camera.panRight(ALPHA);
    }

    renderScene();
}


var projMat = new Matrix4();
var viewMat = new Matrix4();
var globalRotMat = new Matrix4().rotate(g_globalAngleX, 1, 0, 0) .rotate(g_globalAngleY, 0, 1, 0) .rotate(g_globalAngleZ, 0, 0, 1);
var modelMatrix = new Matrix4();
var normalMatrix = new Matrix4();

function renderScene(){
    var startTime = performance.now();

    // Pass projection matrix
    //                      fov,   aspect,                 near, far
    projMat.setPerspective(g_Camera.fov, canvas.width / canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    

    //                  eyes,                   at,                       up
    viewMat.setLookAt(g_Camera.eye.elements[0], g_Camera.eye.elements[1], g_Camera.eye.elements[2],     
                      g_Camera.at.elements[0], g_Camera.at.elements[1],g_Camera.at.elements[2],     
                      g_Camera.up.elements[0], g_Camera.up.elements[1],g_Camera.up.elements[2],);

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    // Rotate different axis
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    

    gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    gl.uniform3f(u_cameraPos, g_Camera.eye.elements[0], g_Camera.eye.elements[1], g_Camera.eye.elements[2]);


    gl.uniform1i(u_lightOn, g_lightOn);
    
    gl.uniform3f(u_lightColor,lightColor[0], lightColor[1], lightColor[2]);


    var light = new Cube();
    light.color = [2, 2, 0, 1];
    light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    light.matrix.scale(0.1, 0.1, 0.1);
    light.matrix.translate(0.5, 0.5, 0.5);
    light.render();


    var sky = new Cube();
    // sky.textureNum = -2;
    if(g_normalOn){
        sky.textureNum = -3;
    }
    sky.color = [0.3, 0.45, 0.9, 1.0];
    sky.matrix.translate(0, -1, 0);
    sky.matrix.scale(-5, -5, -5);
    sky.matrix.translate(-0.5, -0.5, -0.5);
    sky.render();


    var red = new Cube();
    // red.textureNum = 0
    if(g_normalOn){
        red.textureNum = -3;
    }
    red.color = [1.0, 0.0, 0.0, 1.0];
    red.matrix.translate(-1.25, -0.75, 0.0);
    red.matrix.rotate(-5, 1, 0, 0);
    red.matrix.scale(0.5, 0.3, 0.5);
    red.normalMatrix.setInverseOf(red.matrix).transpose();
    red.render();

    var yellow = new Cube();
    if(g_normalOn){
        yellow.textureNum = -3;
    }
    yellow.color = [1.0, 1.0, 0.0, 1.0];
    yellow.matrix.translate(-1.0, -0.5, 0.0);
    yellow.matrix.rotate(g_yellowAngle, 0.0, 0.0, 1);
    var yellowCoordMatrix = new Matrix4(yellow.matrix);
    yellow.matrix.scale(0.25, 0.7, 0.5);
    yellow.matrix.translate(-0.5, 0.0, 0.0);
    yellow.normalMatrix.setInverseOf(yellow.matrix).transpose();

    yellow.render();

    var magenta = new Cube();
    if(g_normalOn){
        magenta.textureNum = -3;
    }
    magenta.color = [1.0, 0.0, 1.0, 1.0];
    // magenta.textureNum = 0;
    magenta.matrix = yellowCoordMatrix;
    magenta.matrix.translate(0, 0.65, 0);
    magenta.matrix.rotate(g_MagentaAngle, 0, 0, 1);
    magenta.matrix.scale(0.3, 0.3, 0.3);
    magenta.matrix.translate(-0.5, 0.0, -0.001);
    magenta.render();

    var sphere = new Sphere();  
    if(g_normalOn){
        sphere.textureNum = -3;
    }
    sphere.matrix.scale(1, 1, 1)
    sphere.matrix.translate(2, 0, 0);
    sphere.render();

    renderPup()

    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration) / 10, "numdot");
    
}

// Send text to HTML, used for duration of renderScene in this files 
function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm){
        console.error("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

function renderPup(){
    // Rendering the blocky animal
    var dogHead = new Cube();
    dogHead.color = [0.8, 0.7, 0.5, 1.0];
    dogHead.matrix.translate(-0.25, -0.05, -0.75);
    dogHead.matrix.rotate(g_BodyAngle * 0.075, 0, 1, 0);
    dogHead.matrix.rotate(g_BodyAngle * 0.125, 1, 0, 0);
    var dogHeadCoordsMatrix1 = new Matrix4(dogHead.matrix);
    var dogHeadCoordsMatrix2 = new Matrix4(dogHead.matrix);
    dogHead.matrix.scale(0.5, 0.5, 0.45);
    dogHead.render();


    // Dog's Mouth
    var dogMouth = new Cube();
    dogMouth.color = [0.35, 0.2, 0.1, 1.0];
    dogMouth.matrix = dogHeadCoordsMatrix1;
    dogMouth.matrix.translate(0.05, 0, -0.15);
    dogMouth.matrix.scale(0.4, 0.3, 0.15);
    dogMouth.render();

    // Dog's Nose
    var dogNose = new Cube();
    dogNose.color = [0.3, 0.15, 0.05, 1.0];
    dogNose.matrix = dogHeadCoordsMatrix1;
    dogNose.matrix.translate(0.35, 0.7, -0.15);
    dogNose.matrix.scale(0.3, 0.3, 0.15);
    dogNose.render();

    // Dog's Eyes
    var leftEye = new Cube();
    leftEye.color = [0.1, 0.1, 0.1, 1.0];
    leftEye.matrix = dogHeadCoordsMatrix2;
    leftEye.matrix.translate(0.05, 0.3, -0.1);
    leftEye.matrix.scale(0.1, 0.1, 0.1);
    leftEye.render();

    var rightEye = new Cube();
    rightEye.color = [0.1, 0.1, 0.1, 1.0];
    rightEye.matrix = dogHeadCoordsMatrix2;
    rightEye.matrix.translate(3, 0, -0.1);
    rightEye.render();

   // Dog's Ears
   var dogLeftEar = new Cube();
   dogLeftEar.matrix = dogHeadCoordsMatrix2;
   var dogLeftEarCoordsMatrix1 = new Matrix4(dogLeftEar.matrix);
   dogLeftEar.color = [0.8, 0.7, 0.5, 1.0];
   dogLeftEar.matrix.translate(0.525, 1.9, 2.5);
   dogLeftEar.matrix.scale(1.5, 1.5, 1.5);
   dogLeftEar.render();

   let leftEar = new Pyramid();
   leftEar.color = [0.35, 0.2, 0.1, 1.0];
   leftEar.matrix = dogLeftEarCoordsMatrix1;
   leftEar.matrix.rotate(180, 0, 0, 1);
   leftEar.matrix.translate(2.65, -3.425, 1.5);
   leftEar.matrix.scale(1.5, 1.5, 1.5);
   leftEar.render();

   var dogRightEar = new Cube();
   dogRightEar.matrix = dogHeadCoordsMatrix2;
   var dogRightEarCoordsMatrix = new Matrix4(dogRightEar.matrix);
   dogRightEar.color = [0.8, 0.7, 0.5, 1.0];
   dogRightEar.matrix.translate(-3.125, 0, 0);
   dogRightEar.render();

   let rightEar = new Pyramid();
   rightEar.color = [0.35, 0.2, 0.1, 1.0];
   rightEar.matrix = dogRightEarCoordsMatrix;
   rightEar.matrix.rotate(180, 0, 0, 1);
   rightEar.matrix.translate(-1.0, -1.025, -0.625);
   rightEar.render();

    // Dog's Body
    var torsoFront = new Cube();
    torsoFront.color = [0.8, 0.7, 0.5, 1.0];
    torsoFront.matrix.translate(-0.25, -0.4, -0.5);
    var torsoFrontMatrix1 = new Matrix4(torsoFront.matrix);
    var torsoFrontMatrix2 = new Matrix4(torsoFront.matrix);
    var torsoFrontMatrix3 = new Matrix4(torsoFront.matrix);
    torsoFront.matrix.rotate(g_BodyAngle * 0.07, 1, 0, 0);
    torsoFront.matrix.rotate(g_BodyAngle * 0.03, 0, 1, 0);
    torsoFront.matrix.scale(0.5, 0.4, 0.5);
    torsoFront.render();

    var torsoMiddle = new Cube();
    torsoMiddle.color = [0.8, 0.7, 0.5, 1.0];
    torsoMiddle.matrix = torsoFrontMatrix1;
    torsoMiddle.matrix.translate(0.025, 0.025, 0.425);
    // torsoMiddle.matrix.rotate(0, 1, 0, 0);
    torsoMiddle.matrix.scale(0.45, 0.35, 0.275);
    torsoMiddle.render();

    var torsoRear = new Cube();
    torsoRear.color =  [0.8, 0.7, 0.5, 1.0];
    torsoRear.matrix = torsoFrontMatrix2;
    var torsoRearMatrix = new Matrix4(torsoRear.matrix);
    torsoRear.matrix.translate(0, 0, 0.7);
    torsoRear.matrix.rotate(-g_BodyAngle * 0.07, 1, 1, 0);
    torsoFront.matrix.rotate(g_BodyAngle * 0.03, 0, 1, 0);
    torsoRear.matrix.scale(0.5, 0.4, 0.3);
    torsoRear.render();

    var dogTailBase = new Cube();
    dogTailBase.color = [0.8, 0.7, 0.5, 1.0];
    dogTailBase.matrix = torsoFrontMatrix2;
    dogTailBase.matrix.rotate(g_BodyAngle / 4, 0, 1, 0);
    var dogTailMatrix = new Matrix4(torsoFrontMatrix2);
    dogTailBase.matrix.translate(0.4, 0.8, 0.85);
    dogTailBase.matrix.rotate(-25, 1, 0, 0);
    dogTailBase.matrix.scale(0.2, 0.2, 0.6);
    dogTailBase.render();
    
    var dogTailEnd = new Pyramid();
    dogTailEnd.color = [0.8, 0.7, 0.5, 1.0];
    dogTailEnd.matrix = new Matrix4(dogTailMatrix);
    dogTailEnd.matrix.translate(0.4, 1.2, 1.25);
    dogTailEnd.matrix.rotate(50, 1, 0, 0);
    dogTailEnd.matrix.scale(0.20, 0.3, 0.2);
    dogTailEnd.render();
    
    // Dog's Legs
    var backLeftLeg = new Cube();
    backLeftLeg.color =  [0.8, 0.7, 0.5, 1.0];
    backLeftLeg.matrix = new Matrix4(torsoFrontMatrix3);
    backLeftLeg.matrix.rotate(g_LegAngle / 2, 1, 0, 0);
    var backLeftLegMatrix = new Matrix4(backLeftLeg.matrix);
    // backLeftLeg.matrix.translate(-0.2, -0.575, 0.3);
    backLeftLeg.matrix.translate(0.05, -0.25, 0.775);
    backLeftLeg.matrix.scale(0.1, 0.35, 0.125);
    backLeftLeg.render();

    var backRightLeg = new Cube();
    backRightLeg.color =  [0.8, 0.7, 0.5, 1.0];
    backRightLeg.matrix = new Matrix4(torsoFrontMatrix3);
    backRightLeg.matrix.rotate(-g_LegAngle / 2, 1, 0, 0);
    var backRightLegMatrix = new Matrix4(backRightLeg.matrix);
    backRightLeg.matrix.translate(0.36125, -0.25, 0.775);
    backRightLeg.matrix.scale(0.1, 0.35, 0.125);
    backRightLeg.render();

    var frontLeftLeg = new Cube();
    frontLeftLeg.color =  [0.8, 0.7, 0.5, 1.0];
    frontLeftLeg.matrix = new Matrix4(torsoFrontMatrix3);
    frontLeftLeg.matrix.rotate(-g_LegAngle / 1.5, 1, 0, 0);
    var frontLeftLegMatrix = new Matrix4(frontLeftLeg.matrix);
    frontLeftLeg.matrix.translate(0.05, -0.25, 0.15);
    frontLeftLeg.matrix.scale(0.1, 0.35, 0.125);
    frontLeftLeg.render();

    var frontRightLeg = new Cube();
    frontRightLeg.color =  [0.8, 0.7, 0.5, 1.0];
    frontRightLeg.matrix = new Matrix4(torsoFrontMatrix3);
    frontRightLeg.matrix.rotate(g_LegAngle / 1.5, 1, 0, 0);
    var frontRightLegMatrix = new Matrix4(frontRightLeg.matrix);
    frontRightLeg.matrix.translate(0.36125, -0.25, 0.15);
    frontRightLeg.matrix.scale(0.1, 0.35, 0.125);
    frontRightLeg.render();

    // Dog's Feet
    var backLeftFoot = new Cube();
    backLeftFoot.color = [0.575, 0.45, 0.3, 1.0];
    backLeftFoot.matrix = backLeftLegMatrix;
    backLeftFoot.matrix.translate(0.035, -0.275, 0.7375);
    backLeftFoot.matrix.rotate(g_MagentaAngle / 8, 1, 0, 0);
    backLeftFoot.matrix.scale(0.125, 0.1, 0.175);
    backLeftFoot.render();

    var backRightFoot = new Cube();
    backRightFoot.color = [0.575, 0.45, 0.3, 1.0];
    backRightFoot.matrix = backRightLegMatrix;
    backRightFoot.matrix.translate(0.35, -0.275, 0.7375);
    backRightFoot.matrix.rotate(g_MagentaAngle / 10, 1, 0, 0);
    backRightFoot.matrix.scale(0.125, 0.1, 0.175);
    backRightFoot.render();

    var frontLeftFoot = new Cube();
    frontLeftFoot.color = [0.575, 0.45, 0.3, 1.0];
    frontLeftFoot.matrix = frontLeftLegMatrix;
    frontLeftFoot.matrix.translate(0.035, -0.175, 0.2875);
    frontLeftFoot.matrix.rotate(180, 1, 0, 0);
    frontLeftFoot.matrix.rotate(g_MagentaAngle / 8, 1, 0, 0);
    frontLeftFoot.matrix.scale(0.125, 0.1, 0.175);
    frontLeftFoot.render();

    var frontRightFoot = new Cube();
    frontRightFoot.color = [0.575, 0.45, 0.3, 1.0];
    frontRightFoot.matrix = frontRightLegMatrix;
    frontRightFoot.matrix.translate(0.35, -0.175, 0.2875);
    frontRightFoot.matrix.rotate(180, 1, 0, 0);
    frontRightFoot.matrix.rotate(g_MagentaAngle / 10, 1, 0, 0);
    frontRightFoot.matrix.scale(0.125, 0.1, 0.175);
    frontRightFoot.render();

}