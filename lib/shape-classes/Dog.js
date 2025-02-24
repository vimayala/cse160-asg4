// class Dog{
//     constructor(){
//         this.dogHead = new Cube();
//         this.dogMouth = new Cube();
//         this.dogNose = new Cube();
//         this.leftEye = new Cube();
//         this.rightEye = new Cube();
//         this.dogLeftEar = new Cube();
//         this.leftEar = new Pyramid();
//         this.dogRightEar = new Cube();
//         this.rightEar = new Pyramid();
//         // this.torsoFront = new Cube();
//         // this.torsoMiddle = new Cube();
//         // this.torsoRear = new Cube();
//         // this.dogTailBase = new Cube();
//         // this.dogTailEnd = new Pyramid();
//         // this.backLeftLeg = new Cube();
//         // this.backRightLeg = new Cube();
//         // this.frontLeftLeg = new Cube();
//         // this.frontRightLeg = new Cube();
//         // this.backLeftFoot = new Cube();
//         // this.backRightFoot = new Cube();
//         // this.frontLeftFoot = new Cube();
//         // this.frontRightFoot = new Cube();

//         this.setInitialTransformations();

//     }
//     setInitialTransformations(){

//         // Dog's Head
//         this.dogHead.color = [0.8, 0.7, 0.5, 1.0];
//         this.dogHead.matrix.translate(-1.25, -0.05, -0.75);
//         this.dogHead.matrix.rotate(g_BodyAngle * 0.075, 0, 1, 0);
//         this.dogHead.matrix.rotate(g_BodyAngle * 0.125, 1, 0, 0);
//         var dogHeadCoordsMatrix1 = new Matrix4(this.dogHead.matrix);
//         var dogHeadCoordsMatrix2 = new Matrix4(this.dogHead.matrix);
//         this.dogHead.matrix.scale(0.5, 0.5, 0.45);


//         // // Dog's Mouth
//         this.dogMouth.color = [0.35, 0.2, 0.1, 1.0];
//         this.dogMouth.matrix = dogHeadCoordsMatrix1;
//         this.dogMouth.matrix.translate(0.05, 0, -0.15);
//         this.dogMouth.matrix.scale(0.4, 0.3, 0.15);


//         // // Dog's Nose
//         this.dogNose.color = [0.35, 0.15, 0.05, 1.0];
//         this.dogNose.matrix = new Matrix4(dogHeadCoordsMatrix1);
//         this.dogNose.matrix.translate(0.35, 0.7, -0.15);
//         this.dogNose.matrix.scale(0.3, 0.3, 0.15);

//         // // Dog's Eyes
//         // this.leftEye.color = [0.1, 0.1, 0.1, 1.0];
//         // this.leftEye.matrix = dogHeadCoordsMatrix2;
//         // this.leftEye.matrix.translate(0.05, 0.3, -0.1);
//         // this.leftEye.matrix.scale(0.1, 0.1, 0.1);

//         // this.rightEye.color = [0.1, 0.1, 0.1, 1.0];
//         // this.rightEye.matrix = dogHeadCoordsMatrix2;
//         // this.rightEye.matrix.translate(3, 0, -0.1);


//         // // Dog's Ears
//         // this.dogLeftEar.matrix = dogHeadCoordsMatrix2;
//         // var dogLeftEarCoordsMatrix1 = new Matrix4(this.dogLeftEar.matrix);
//         // this.dogLeftEar.color = [0.8, 0.7, 0.5, 1.0];
//         // this.dogLeftEar.matrix.translate(0.525, 1.9, 2.5);
//         // this.dogLeftEar.matrix.scale(1.5, 1.5, 1.5);


//         // // let leftEar = new Pyramid();
//         // this.leftEar.color = [0.35, 0.2, 0.1, 1.0];
//         // this.leftEar.matrix = dogLeftEarCoordsMatrix1;
//         // this.leftEar.matrix.rotate(180, 0, 0, 1);
//         // this.leftEar.matrix.translate(2.65, -3.425, 1.5);
//         // this.leftEar.matrix.scale(1.5, 1.5, 1.5);


//         // // var dogRightEar = new Cube();
//         // this.dogRightEar.matrix = dogHeadCoordsMatrix2;
//         // var dogRightEarCoordsMatrix = new Matrix4(this.dogRightEar.matrix);
//         // this.dogRightEar.color = [0.8, 0.7, 0.5, 1.0];
//         // this.dogRightEar.matrix.translate(-3.125, 0, 0);

//         // // let rightEar = new Pyramid();
//         // this.rightEar.color = [0.35, 0.2, 0.1, 1.0];
//         // this.rightEar.matrix = dogRightEarCoordsMatrix;
//         // this.rightEar.matrix.rotate(180, 0, 0, 1);
//         // this.rightEar.matrix.translate(-1.0, -1.025, -0.625);


//         // // Dog's Body
//         // // var torsoFront = new Cube();
//         // this.torsoFront.color = [0.8, 0.7, 0.5, 1.0];
//         // this.torsoFront.matrix.translate(-0.25, -0.4, -0.5);
//         // var torsoFrontMatrix1 = new Matrix4(this.torsoFront.matrix);
//         // var torsoFrontMatrix2 = new Matrix4(this.torsoFront.matrix);
//         // var torsoFrontMatrix3 = new Matrix4(this.torsoFront.matrix);
//         // this.torsoFront.matrix.rotate(g_BodyAngle * 0.07, 1, 0, 0);
//         // this.torsoFront.matrix.rotate(g_BodyAngle * 0.03, 0, 1, 0);
//         // this.torsoFront.matrix.scale(0.5, 0.4, 0.5);

//         // // var torsoMiddle = new Cube();
//         // this.torsoMiddle.color = [0.8, 0.7, 0.5, 1.0];
//         // this.torsoMiddle.matrix = torsoFrontMatrix1;
//         // this.torsoMiddle.matrix.translate(0.025, 0.025, 0.425);
//         // this.torsoMiddle.matrix.scale(0.45, 0.35, 0.275);


//         // // var torsoRear = new Cube();
//         // this.torsoRear.color =  [0.8, 0.7, 0.5, 1.0];
//         // this.torsoRear.matrix = torsoFrontMatrix2;
//         // this.torsoRear.matrix.translate(0, 0, 0.7);
//         // this.torsoRear.matrix.rotate(-g_BodyAngle * 0.07, 1, 1, 0);
//         // this.torsoFront.matrix.rotate(g_BodyAngle * 0.03, 0, 1, 0);
//         // this.torsoRear.matrix.scale(0.5, 0.4, 0.3);


//         // // var dogTailBase = new Cube();
//         // this.dogTailBase.color = [0.8, 0.7, 0.5, 1.0];
//         // this.dogTailBase.matrix = torsoFrontMatrix2;
//         // this.dogTailBase.matrix.rotate(g_BodyAngle / 4, 0, 1, 0);
//         // var dogTailMatrix = new Matrix4(torsoFrontMatrix2);
//         // this.dogTailBase.matrix.translate(0.4, 0.8, 0.85);
//         // this.dogTailBase.matrix.rotate(-25, 1, 0, 0);
//         // this.dogTailBase.matrix.scale(0.2, 0.2, 0.6);


        
//         // // var dogTailEnd = new Pyramid();
//         // this.dogTailEnd.color = [0.8, 0.7, 0.5, 1.0];
//         // this.dogTailEnd.matrix = new Matrix4(dogTailMatrix);
//         // this.dogTailEnd.matrix.translate(0.4, 1.2, 1.25);
//         // this.dogTailEnd.matrix.rotate(50, 1, 0, 0);
//         // this.dogTailEnd.matrix.scale(0.20, 0.3, 0.2);

        
//         // // Dog's Legs
//         // // var backLeftLeg = new Cube();
//         // this.backLeftLeg.color =  [0.8, 0.7, 0.5, 1.0];
//         // this.backLeftLeg.matrix = new Matrix4(torsoFrontMatrix3);
//         // this.backLeftLeg.matrix.rotate(g_LegAngle / 2, 1, 0, 0);
//         // var backLeftLegMatrix = new Matrix4(this.backLeftLeg.matrix);
//         // // backLeftLeg.matrix.translate(-0.2, -0.575, 0.3);
//         // this.backLeftLeg.matrix.translate(0.05, -0.25, 0.775);
//         // this.backLeftLeg.matrix.scale(0.1, 0.35, 0.125);


//         // // var backRightLeg = new Cube();
//         // this.backRightLeg.color =  [0.8, 0.7, 0.5, 1.0];
//         // this.backRightLeg.matrix = new Matrix4(torsoFrontMatrix3);
//         // this.backRightLeg.matrix.rotate(-g_LegAngle / 2, 1, 0, 0);
//         // var backRightLegMatrix = new Matrix4(this.backRightLeg.matrix);
//         // this.backRightLeg.matrix.translate(0.36125, -0.25, 0.775);
//         // this.backRightLeg.matrix.scale(0.1, 0.35, 0.125);
                  

//         // // var frontLeftLeg = new Cube();
//         // this.frontLeftLeg.color =  [0.8, 0.7, 0.5, 1.0];
//         // this.frontLeftLeg.matrix = new Matrix4(torsoFrontMatrix3);
//         // this.frontLeftLeg.matrix.rotate(-g_LegAngle / 1.5, 1, 0, 0);
//         // var frontLeftLegMatrix = new Matrix4(this.frontLeftLeg.matrix);
//         // this.frontLeftLeg.matrix.translate(0.05, -0.25, 0.15);
//         // this.frontLeftLeg.matrix.scale(0.1, 0.35, 0.125);
 

//         // // var frontRightLeg = new Cube();
//         // this.frontRightLeg.color =  [0.8, 0.7, 0.5, 1.0];
//         // this.frontRightLeg.matrix = new Matrix4(torsoFrontMatrix3);
//         // this.frontRightLeg.matrix.rotate(g_LegAngle / 1.5, 1, 0, 0);
//         // var frontRightLegMatrix = new Matrix4(this.frontRightLeg.matrix);
//         // this.frontRightLeg.matrix.translate(0.36125, -0.25, 0.15);
//         // this.frontRightLeg.matrix.scale(0.1, 0.35, 0.125);


//         // // Dog's Feet
//         // // var backLeftFoot = new Cube();
//         // this.backLeftFoot.color = [0.575, 0.45, 0.3, 1.0];
//         // this.backLeftFoot.matrix = backLeftLegMatrix;
//         // this.backLeftFoot.matrix.translate(0.035, -0.275, 0.7375);
//         // this.backLeftFoot.matrix.rotate(g_MagentaAngle / 8, 1, 0, 0);
//         // this.backLeftFoot.matrix.scale(0.125, 0.1, 0.175);

//         // // var backRightFoot = new Cube();
//         // this.backRightFoot.color = [0.575, 0.45, 0.3, 1.0];
//         // this.backRightFoot.matrix = backRightLegMatrix;
//         // this.backRightFoot.matrix.translate(0.35, -0.275, 0.7375);
//         // this.backRightFoot.matrix.rotate(g_MagentaAngle / 10, 1, 0, 0);
//         // this.backRightFoot.matrix.scale(0.125, 0.1, 0.175);


//         // // var frontLeftFoot = new Cube();
//         // this.frontLeftFoot.color = [0.575, 0.45, 0.3, 1.0];
//         // this.frontLeftFoot.matrix = frontLeftLegMatrix;
//         // this.frontLeftFoot.matrix.translate(0.035, -0.175, 0.2875);
//         // this.frontLeftFoot.matrix.rotate(180, 1, 0, 0);
//         // this.frontLeftFoot.matrix.rotate(g_MagentaAngle / 8, 1, 0, 0);
//         // this.frontLeftFoot.matrix.scale(0.125, 0.1, 0.175);


//         // // var frontRightFoot = new Cube();
//         // this.frontRightFoot.color = [0.575, 0.45, 0.3, 1.0];
//         // this.frontRightFoot.matrix = frontRightLegMatrix;
//         // this.frontRightFoot.matrix.translate(0.35, -0.175, 0.2875);
//         // this.frontRightFoot.matrix.rotate(180, 1, 0, 0);
//         // this.frontRightFoot.matrix.rotate(g_MagentaAngle / 10, 1, 0, 0);
//         // this.frontRightFoot.matrix.scale(0.125, 0.1, 0.175);

//     }
//     translate(x, y, z){
//         this.dogHead.matrix.translate(x, y, z);
//         // this.dogHead.matrix.translate(x, y, z);
//         this.dogMouth.matrix.translate(x, y, z);

//     }
//     render(){
//         this.dogHead.render();
//         this.dogMouth.render();
//         this.dogNose.render();
//         this.leftEye.render();
//         this.rightEye.render();
//         this.dogLeftEar.render();
//         this.leftEar.render();
//         this.dogRightEar.render();
//         this.rightEar.render();
//         // this.torsoFront.render();
//         // this.torsoMiddle.render();
//         // this.torsoRear.render();
//         // this.dogTailBase.render();
//         // this.dogTailEnd.render();
//         // this.backLeftLeg.render();
//         // this.backRightLeg.render();
//         // this.frontLeftLeg.render();
//         // this.frontRightLeg.render();
//         // this.backLeftFoot.render();
//         // this.backRightFoot.render();
//         // this.frontLeftFoot.render();
//         // this.frontRightFoot.render();

//     }
// }