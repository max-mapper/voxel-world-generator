function GL_Object_Builder() {
    this.getText = function (filename) {
        var txtFile = new XMLHttpRequest();
        txtFile.open('GET', filename, false);
        txtFile.send();
        return txtFile.responseText;
    }

    this.buildObjects = function (filename, keyword) {
        filename = 'data/' + filename;
        var text = this.getText(filename);
        while (text.indexOf('"') > -1) {
            text = text.replace('"', '');
        }
        text = text.split('\r\n');

        var data = new Array();
        var object = null;
        for (var i = 0; i < text.length; i++) {
            var line = text[i];
            if (line == keyword) {
                if (object != null)
                    data.push(object);
                object = new Object();
            }
            else if (line != '') {
                var split = line.split('|');
                var property = split[0];
                var value = split[1];

                if (value.indexOf(',') > -1) {
                    value = value.split(',');

                    if (property[0] == '%') {
                        property = property.replace('%', '');
                        for (var j = 0; j < value.length; j++) {
                            value[j] = parseInt(value[j]);
                        }
                    }
                }
                else if (property[0] == '%') {
                    property = property.replace('%', '');
                    value = parseInt(value);
                }

                object[property] = value;
            }

            if (i == text.length - 1)
                data.push(object);
        }

        return data;
    }
}