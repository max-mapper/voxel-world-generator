function GL_Graphics() {
    this.canvas = null;
    this.ctx = null;
    this.colorManager = new GL_ColorManager();

    this.fillStyle = '';
    this.strokeStyle = '';

    this.bg = getRGBA(0, 0, 0, 1);

    this.init = function (id, size) {
        this.canvas = getElement(id);
        this.canvas.oncontextmenu = return_false;
        this.ctx = this.canvas.getContext('2d');

        if (size != null) {
            this.canvas.width = size.x;
            this.canvas.height = size.y;
        }

        this.w = this.canvas.width;
        this.h = this.canvas.height;

        this.ctx.lineWidth = 1;
        this.ctx.font = 'italic 24px Calibri';
    }

    this.set = function (property, value) {
        this[property] = value;
    }

    this.clear = function () {
        this.ctx.fillStyle = this.bg;
        this.drawRectangle(0, 0, this.w, this.h, true);
    }

    this.setColor = function (name, type, r, g, b, a) {
        var cmd = 'this.ctx.';

        if (type == 'fill')
            type = 'fillStyle';
        else
            type = 'strokeStyle';

        var useColor = '';

        if (name != '')
            useColor = this.colorManager.getColor(name);
        else
            useColor = getRGBA(r, g, b, a);

        if (useColor == null) {
            useColor = getRGBA(r, g, b, a);
            this.colorManager.addColor(name, useColor);
        }

        this[type] = useColor;

        cmd += type + "='" + useColor + "';";

        eval(cmd);
    }

    this.drawRectangle = function (x, y, w, h, fill) {
        var fnc = 'this.ctx.strokeRect';

        if (fill)
            fnc = 'this.ctx.fillRect';

        eval(fnc + '(x, y, w, h)');
    }

    this.drawScaleRectangle = function (x, y, w, h, fill) {
        x *= game.tile_size.x;
        y *= game.tile_size.y;
		
        w *= game.tile_size.x;
        h *= game.tile_size.y;

        //Clipping
        if ((x < 0) || (x >= this.w) || (y < 0) || (y >= this.h))
            return;

        this.drawRectangle(x, y, w, h, fill);
    }

    this.drawImage = function (image, x, y, w, h) {
        this.ctx.drawImage(image, x, y, w, h);
    }

    this.drawHalfScaleImage = function (image, x, y, w, h) {
        this.ctx.globalAlpha = 0.3;

        x *= game.tile_size.x;
        y *= game.tile_size.y;

        w *= game.tile_size.x;
        h *= game.tile_size.y;

        this.drawImage(image, x, y, w, h);

        this.ctx.globalAlpha = 1.0;
    }

    this.drawScaleImage = function (image, x, y, w, h) {
        x *= game.tile_size.x;
        y *= game.tile_size.y;

        w *= game.tile_size.x;
        h *= game.tile_size.y;

        this.drawImage(image, x, y, w, h);
    }

    this.drawScaleFlipImage = function (image, x, y, w, h, flipH, flipV) {
        var scaleH = flipH ? -1 : 1;
        var scaleV = flipV ? -1 : 1;
        var x = flipH ? w - x : x;
        var y = flipV ? h - y : y;

        x *= game.tile_size.x;
        y *= game.tile_size.y;

        w *= game.tile_size.x;
        h *= game.tile_size.y;

        x -= (game.tile_size.x * 2);
        y -= (game.tile_size.x * 2);

        this.ctx.save();
        this.ctx.scale(scaleH, scaleV);
        this.ctx.drawImage(image, x, y, w, h);
        this.ctx.restore();
    }

    this.drawCircle = function (x, y, r, fill) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        if (fill)
            this.ctx.fill();
        else
            this.ctx.stroke();
        this.ctx.closePath();
    }

    this.drawScaleCircle = function (x, y, r, fill) {
        var div = 2;

        x *= game.tile_size.x;
        y *= (game.tile_size.y * div);
        r *= game.tile_size.x;

        this.ctx.save();
        this.ctx.scale(1, 1 / div);

        var grd = this.ctx.createRadialGradient(x, y, r / 3, x, y, r * 1.5);
        grd.addColorStop(0, '#A31');
        grd.addColorStop(1, 'transparent');

        this.ctx.fillStyle = grd;

        this.ctx.beginPath();
        this.ctx.arc(x, y, r * 1.5, 0, 2 * Math.PI, false);
        if (fill)
            this.ctx.fill();
        else
            this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.restore();
    }

    this.drawLine = function (x1, y1, x2, y2) {
		x1 *= game.tile_size.x;
        y1 *= game.tile_size.y;
		
		x2 *= game.tile_size.x;
        y2 *= game.tile_size.y;
		
		y1 -= (game.tile_size.y * 2);
		
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x1 + x2, y1 + y2);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}

function GL_ColorManager() {
    this.colors = new Array();

    this.addColor = function (name, color) {
        var newColor = new GL_Color(name, color);
        this.colors.push(newColor);
    }

    this.getColor = function (name) {
        for (var i = 0; i < this.colors.length; i++) {
            if (this.colors[i].name == name)
                return this.colors[i].color;
        }

        return null;
    }

}

function GL_Color(_name, _color) {
    this.name = _name;
    this.color = _color;
}