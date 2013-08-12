function rlResourceManager(rm) {
    this.rm = rm;

    this.loadArray = function (data, folder) {
        for (var i = 0; i < data.length; i++) {
            this.rm.addImage(data[i], folder + '/' + data[i] + '.png');
        }
    }

    this.loadResources = function () {
        //Tiles
        this.loadArray(['grass', 'ground'], 'tiles');

        //Landscape Items
        this.loadArray(['tree_1', 'tree_2'], 'items');

        //Decorations
        this.loadArray(['rock_1', 'rock_2', 'bush'], 'decorations');
    }
}