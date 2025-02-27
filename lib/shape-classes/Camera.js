// Camera.js
// Defines the Camera class
// Defines color and matrix
class Camera{
    constructor(){

    //  -1.5112262964248657 0.23259633779525757 -2.1792638301849365
    //  -1.2585904598236084 0.1384878158569336 -1.2162953615188599

        this.eye = new Vector3([-1.5112262964248657, 0.23259633779525757, -2.1792638301849365]);
        this.at = new Vector3([-1.2585904598236084, 0.1384878158569336, -1.2162953615188599]);
        // this.at = new Vector3([0, 0, -1]);
        this.up = new Vector3([0, 1, 0]);
        this.speed = 3;
        this.fov = 60;


        this.moveD = new Vector3([0, 0, 0]);

        this.atPoint = new Vector3([0, 0, 0]);
        this.rotMat = new Matrix4();

        this.addBlockDirection = new Vector3([0, 0, 0]);
        this.addBlockblockPosition = new Vector3([0, 0, 0]);
        this.addBlockDistance = new Vector3([0, 0, 0]);
    }

    moveForward(speed){
        // copy at to d
        // var d = new Vector3();
        this.moveD.set(this.at);
        this.moveD.sub(this.eye);
        this.moveD.normalize();
        this.moveD.mul(speed);
        // d = d.div(d.length());
        this.eye = this.eye.add(this.moveD);
        this.at = this.at.add(this.moveD);
    }

    moveBackward(speed){
        // var d = new Vector3();
        this.moveD.set(this.at);
        this.moveD.sub(this.eye);        
        this.moveD.normalize();
        this.moveD.mul(speed);
        // d = d.div(d.length());
        this.eye = this.eye.sub(this.moveD);
        this.at = this.at.sub(this.moveD);
    }

    moveLeft(speed){
        // var d = new Vector3();
        this.moveD.set(this.at);
        this.moveD.sub(this.eye);      // check order
        // var right = -d.cross(this.up);       // copy above but check negative placement
        let left = Vector3.cross(this.moveD, this.up);
        left.mul(-1);
        left.normalize();
        left.mul(speed);

        this.eye = this.eye.add(left);
        this.at = this.at.add(left);
    }

    moveRight(speed){
        // var d = new Vector3();
        this.moveD.set(this.at);
        this.moveD.sub(this.eye);      // check order
        // var right = -d.cross(this.up);       // copy above but check negative placement
        let right = Vector3.cross(this.moveD, this.up);
        right.normalize();
        right.mul(speed);


        this.eye = this.eye.add(right);
        this.at = this.at.add(right);
    }

    panLeft(alpha){
        // var atPoint = new Vector3();
        this.atPoint.set(this.at);
        this.atPoint.sub(this.eye);

        var rotMat = new Matrix4();
        rotMat.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotMat.multiplyVector3(this.atPoint);
        this.at.set(this.eye);
        this.at.add(f_prime);

    }

    panRight(alpha){
        // var atPoint = new Vector3();
        this.atPoint.set(this.at);
        this.atPoint.sub(this.eye);

        var rotMat = new Matrix4();
        rotMat.setRotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotMat.multiplyVector3(this.atPoint);
        this.at.set(this.eye);
        this.at.add(f_prime);
    }

    panUp(alpha) {
        // var atPoint = new Vector3();
        this.atPoint.set(this.at);
        this.atPoint.sub(this.eye);

        var right = Vector3.cross(this.up, this.atPoint);
        var rotMat = new Matrix4();
        rotMat.setRotate(alpha, right.elements[0], right.elements[1], right.elements[2]);

        var f_prime = rotMat.multiplyVector3(this.atPoint);
        this.at.set(this.eye);
        this.at.add(f_prime);
    }

    panDown(alpha) {
        // Compute the forward vector  f = at - eye;
        // var atPoint = new Vector3();
        this.atPoint.set(this.at);
        this.atPoint.sub(this.eye);
    
        var right = Vector3.cross(this.up, this.atPoint);
        var rotMat = new Matrix4();
        rotMat.setRotate(-alpha, right.elements[0], right.elements[1], right.elements[2]);
    
        var f_prime = rotMat.multiplyVector3(this.atPoint);
        this.at.set(this.eye);
        this.at.add(f_prime);
    }

    handleMouseMove(event) {
        if (this.isMouseControlled) {
            let newX = event.clientX - this.lastX;
            let newY = event.clientY - this.lastY;
    
            let panSpeed = 0.1;
    
            if (newX !== 0) {
                this.camera.panRight(newX * panSpeed);
            }
    
            if (newY !== 0) {
                this.camera.panLeft(newY * panSpeed);
            }
    
            this.newX = event.clientX;
            this.newY = event.clientY;
        }
    }

    addBlock(distance) {

        this.addBlockDirection.set(this.at);
        this.addBlockDirection.sub(this.eye);
        this.addBlockDirection.normalize();  // Now this is the correct forward direction

        // Get the position in front of the camera
        this.addBlockDistance.set(this.addBlockDirection);
        this.addBlockDistance.mul(distance);  // Make sure you're using addBlockDistance here
        this.addBlockblockPosition.set(this.eye);
        this.addBlockblockPosition.add(this.addBlockDistance);

        return this.addBlockblockPosition;

    }
    
    
}
