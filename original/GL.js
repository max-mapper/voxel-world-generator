function GL() {
    this.graphics = new GL_Graphics();
    this.ui = new GL_UI('UI', this.graphics);
    this.controller = new GL_Controller();
    this.resources = new GL_Resource_Manager();
    this.objects = new GL_Object_Builder();
    this.sound = new GL_Sound();
    this.interval = null;
    this.callbacks = new Array();

    this.setMainLoop = function (callback, interval) {
        if (this.interval != null)
            clearInterval(this.interval);
        this.interval = setInterval(callback, interval);
    }

    this.setInterval = function (name, callback, interval) {
        var cb = new GL_Callback(name, callback, interval);

        setInterval(callback, interval);
    }

    this.deallocate = function () {
        if (this.interval != null)
            clearInterval(this.interval);
    }
}

function GL_Callback(name, callback, interval) {
    this.name = name;
    this.callback = callback;
    this.interval = interval;
}