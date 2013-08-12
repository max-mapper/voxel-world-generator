function GL_UI (name, graphics) {
    this.name = name;
    this.visible = true;
    this.elements = new Array();
    this.graphics = graphics;
    this.last_element = null;

    this.draw = function () {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].draw(this.graphics);
        }
    }

    this.create = function (type, id, x, y, w, h) {
        var el;
        if (type == 'container')
            el = new GL_UI_Container(id, x, y, w, h);

        this.elements.push(el);

        this.last_element = el;

        return this.last_element;
    }

    this.find = function (id) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].id == id)
                return this.elements[i];
        }
    }
}

function GL_UI_Container(id, x, y, w, h) {
    this.id = id;
    this.v = new Vector(x, y);
    this.s = new Vector(w, h);
    this.border = 0;
    this.alpha = 255;
    this.borderColor = new Vector3(255, 255, 255);
    this.backColor = new Vector3(0, 0, 0);
    this.foreColor = new Vector3(255, 255, 255);
    this.baseText = '';
    this.text = '';
    this.parent = null;
    this.children = new Array();

    this.clean = function (graphics) {
        graphics.setColor('', 'fill', this.backColor.x, this.backColor.y, this.backColor.z, this.alpha);
        graphics.drawRectangle(this.v.x, this.v.y, this.s.x, this.s.y, true);
    }

    this.draw = function (graphics) {
        //Draw BG
        graphics.setColor('', 'fill', this.backColor.x, this.backColor.y, this.backColor.z, this.alpha);
        graphics.drawRectangle(this.v.x, this.v.y, this.s.x, this.s.y, true);

        //Draw Text
        graphics.ctx.font = 'normal 14px Courier';
        graphics.setColor('', 'fill', this.foreColor.x, this.foreColor.y, this.foreColor.z, 1.0);

        var lines = this.text.split('|');
        var line_height = 15;
        var top = this.v.y + (this.s.y / 2) + 7 - ((lines.length / 2) * line_height);
        
        for (var i = 0; i < lines.length; i++) {
            graphics.ctx.fillText(lines[i], this.v.x + 7, top + (i * line_height));
        }

        //Draw Border
        if (this.border > 0) {
            graphics.setColor('', 'stroke', this.borderColor.x, this.borderColor.y, this.borderColor.z, this.alpha);
            graphics.drawRectangle(this.v.x, this.v.y, this.s.x, this.s.y, false);
        }
    }

    this.setBorder = function (width, r, g, b) {
        this.border = width;
        this.borderColor = new Vector3(r, g, b);
    }

    this.setBackColor = function (r, g, b, a) {
        this.alpha = a;
        this.backColor = new Vector3(r, g, b);
    }

    this.setText = function (text, r, g, b) {
        this.text = text;
        this.baseText = text;
        this.foreColor = new Vector3(r, g, b);
    }

    this.translate = function (values_array) {
        this.text = this.baseText;

        for (var i = 0; i < values_array.length; i++) {
            var replace_string = '%' + i;
            var replace_with = values_array[i];
            this.text = this.text.replace(replace_string, replace_with);
        }
    }
}