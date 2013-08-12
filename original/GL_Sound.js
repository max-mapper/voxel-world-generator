function GL_Sound_File(name, object) {
    this.name = name;
    this.object = object;
    this.initiator = '';
}

function GL_Sound() {
    this.folder = '';
    this.sounds = new Array();
    this.loading = 0;

    this.ready = function () {
        return (this.loading == 0);
    }

    this.init = function (folder) {
        this.folder = folder;
    }

    this.addSound = function (name, src) {
        var tag = new Audio(this.folder + '/' + name + '.mp3');
        tag.addEventListener('canplaythrough', markAsReady, false);

        var sound = new GL_Sound_File(name, tag);
        this[name] = sound;
        
        this.sounds.push(name);
    }

    this.playSound = function (name, initiator) {
        var o = this[name].object;
        //if (this[name].initiator != initiator) {
            o.currentTime = 0;
            o.play();
            this[name].initiator = initiator;
            return o;
        //}
    }

    this.reset = function () {
        for (var i = 0; i < this.sounds.length; i++) {
            this[this.sounds[i]].initiator = '';
        }
    }
}

function markAsReady() {
    gl.sound.loading--;
}