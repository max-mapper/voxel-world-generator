function GL_Resource_Manager() {
    this.images = new Array();
    this.imageProperties = new Array();
    this.imageCount = 0;

    this.doneLoaded = function () {
        var count = 0;
        for (var i = 0; i < this.imageProperties.length; i++) {
            if (this[this.imageProperties[i]].complete)
                count++;
        }
        return (count == this.imageCount);
    }

    this.progress = function () {
        var count = 0;
        for (var i = 0; i < this.imageProperties.length; i++) {
            if (this[this.imageProperties[i]].complete)
                count++;
        }
        return (count / this.imageCount);
    }

    this.addImage = function (name, src) {
        if (this[name] == null) {
            this.imageCount++;
            var image = new Image();
            this.imageProperties.push(name);
            this[name] = image;
            image.src = 'images/' + src;
        }
    }
}