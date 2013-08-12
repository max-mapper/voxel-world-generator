//Define Mappings
var KEY_LEFT = '%';
var KEY_RIGHT = '\'';
var KEY_UP = '&';
var KEY_DOWN = '(';

function GL_Controller() {
    this.keyboard = new GL_Keyboard();
    this.mouse = new GL_Mouse();
}

//Keyboard Functions
function GL_Keyboard() {
    this.keys = new Array();

    //HACK: For using 'this' from within event handlers
    var instance = this;

    this.setCallback = function (callback) {
        document.body.onkeydown = this.callback;
        document.body.onkeyup = this.callback;
    }

    this.callback = function (e) {
        instance.keyDown(String.fromCharCode(e.keyCode), e.type != 'keyup');
    }
    
    this.keyDown = function (key, isDown) {
        if (key.charCodeAt(0) == '\t'.charCodeAt(0))
            key = 'tab';
        //Find Key
        var index = -1;
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i].key == key) {
                index = i;
                break;
            }
        }

        //Found
        if (index != -1) {
            if (!isDown)
                this.keys.splice(index, 1);
            else
                this.keys[index].state++;
        }
        //Not Found
        else {
            if (isDown) {
                var k = new GL_Key();
                k.key = key;
                this.keys.push(k);
            }
        }
    }

    this.isKeyDown = function(key, consume) {
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i].key == key) {
                if (consume)
                    this.keys.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    this.getKeyStates = function (keyArray, consume) {
        var result = new Array();

        for (var i = 0; i < keyArray.length; i++) {
            result.push(this.isKeyDown(keyArray[i], consume));
        }

        return result;
    }
}

function GL_Key() {
    this.key = '';
    this.state = 0;
}

//Mouse Functions
function GL_Mouse() {
    this.buttons = new Array();
    this.buttons.push(false);
    this.buttons.push(false);
    this.moved = false;

    //HACK: For using 'this' from within event handlers
    var instance_mouse = this;

    this.v = new Vector(0, 0);

    this.move = function (e) {
        if (e.layerX) {
            instance_mouse.v.x = e.layerX;
            instance_mouse.v.y = e.layerY;
        }
        else {
            var rect = gl.graphics.canvas.getBoundingClientRect();
            instance_mouse.v.x = e.clientX - rect.left;
            instance_mouse.v.y = e.clientY - rect.top;
        }

        instance_mouse.moved = true;
    }

    this.button = function (e) {
        var b = e.button;
        if (b == 2)
            b = 1;
        instance_mouse.buttons[b] = (e.type == 'mousedown');
    }

    this.getStates = function (consume) {
        var result = new Array();
        result.push(instance_mouse.buttons[0]);
        result.push(instance_mouse.buttons[1]);
		
        if (consume) {
            instance_mouse.buttons[0] = false;
            instance_mouse.buttons[1] = false;
        }

        return result;
    }

    this.setCallback = function () {
        gl.graphics.canvas.onmousemove = this.move;
        gl.graphics.canvas.onmousedown = this.button;
        gl.graphics.canvas.onmouseup = this.button;
		gl.graphics.canvas.ontouchstart = this.button;
    }
}