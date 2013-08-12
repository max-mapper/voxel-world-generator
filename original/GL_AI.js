function GL_AI_Node(id, pat) {
    this.id = id;
    this.pat = pat;
}

function GL_AI(w, h) {
    this.w = w;
    this.h = h;

    this.walkability = get2DArray(this.w, this.h);
    this.fCost = new Array();
    this.spt = new Array();
    this.frontier = new Array();
    this.path = new Array();
    this.source = -1;
    this.target = null;

    //Get a path for actor.v to target.v
    this.setPath = function (actor, whole_path) {
        this.spt = new Array();
        this.frontier = new Array();

        //Get the ID of the actor's tile
        this.source = this.getID(~~actor.v.x, ~~actor.v.y);

        //This is where our path starts
        this.spt.push(new GL_AI_Node(this.source));
        //Add left, right, top and bottom tiles as options for next steps
        this.addNeighbors(this.source);

        var nextID = -1;
        var parent = null;

        //While we have options left
        while (this.frontier.length > 0) {
            //First node in frontier will always be the closest to the target
            nextID = this.frontier[0];
            this.frontier.splice(0, 1);
            //Find out how we got to this node (previous step)
            parent = this.findParent(nextID);
            this.spt.push(new GL_AI_Node(nextID, parent));
            //Add left, right, top and bottom tiles as options for next steps
            this.addNeighbors(nextID);

            //If we're close enough, break
            if (nextID == this.getID(this.target.v.x, this.target.v.y))
                break;
        }

        this.rebuildPath();

        if (whole_path)
            return this.path;
        else if (this.path.length > 1) {
            var id = this.path[this.path.length - 2].id;
            var tv = this.getCoordinatesFromID(id);
            actor.tv.x = tv.x;
            actor.tv.y = tv.y;
        }
    }

    this.addNeighbors = function (id) {
        var v = this.getCoordinatesFromID(id);

        if (v.y > 0)
            this.addFrontier(v.x, v.y - 1);
        if (v.x > 0)
            this.addFrontier(v.x - 1, v.y);
        if (v.y < (this.h - 1))
            this.addFrontier(v.x, v.y + 1);
        if (v.x < (this.w - 1))
            this.addFrontier(v.x + 1, v.y);
    }
    
    //Run this one first
    this.setWalkability = function (data) {
        for (var i = 0; i < this.w; i++) {
            for (var j = 0; j < this.h; j++) {
                this.walkability[i][j] = data[i][j];
            }
        }
    }

    this.addFrontier = function (x, y) {
        if (this.walkability[x][y]) {
            var tv = this.getCoordinatesFromTarget();

            var index = this.getID(x, y);
            var found = false;
            var f = 0;
            var inserted = false;

            var thisF = this.fCost[index];

            for (var i = 0; i < this.frontier.length; i++) {
                var t = this.getCoordinatesFromID(this.frontier[i]);
                f = this.fCost[this.frontier[i]];

                if (this.frontier[i] == index)
                    break;

                if (f > thisF) {
                    if ((i < this.frontier.length - 1) && (this.frontier[i + 1] == index))
                        break;

                    if (this.findParentHelper(index) == null) {
                        this.frontier.splice(i, 0, index);
                        inserted = true;
                        break;
                    }
                }
            }

            if ((this.frontier.length == 0) || (!inserted)) {
                if (this.findParentHelper(index) == null)
                    this.frontier.push(index);
            }
        }
    }

    this.calcF = function () {
        this.fCost = new Array();

        var tf = 0;
        var f = 0;

        var tv = this.getCoordinatesFromTarget();

        for (var i = 0; i < this.w; i++) {
            tf = Math.pow(tv.x - i, 2);
            for (var j = 0; j < this.h; j++) {
                f = Math.sqrt(tf + Math.pow(tv.y - j, 2)) + this.walkability[i][j];
                this.fCost.push(f);
            }
        }
    }

    this.setTarget = function (target) {
        this.target = target;
        this.calcF();
    }

    this.findParent = function (id) {
        var tempID = -1;
        var result = null;

        var v = this.getCoordinatesFromID(id);

        //Left
        if (v.x > 0) {
            tempID = ((v.x - 1) * this.h) + v.y;
            result = this.findParentHelper(tempID);
            if (result != null)
                return result;
        }
        //Right
        if (v.x < (this.w - 1)) {
            tempID = ((v.x + 1) * this.h) + v.y;
            result = this.findParentHelper(tempID);
            if (result != null)
                return result;
        }
        //Top
        if (v.y > 0) {
            tempID = (v.x * this.h) + v.y - 1;
            result = this.findParentHelper(tempID);
            if (result != null)
                return result;
        }
        //Bottom
        if (v.y < (this.h - 1)) {
            tempID = (v.x * this.h) + v.y + 1;
            result = this.findParentHelper(tempID);
            if (result != null)
                return result;
        }

        //No parent found
        return null;
    }

    this.findParentHelper = function (id) {
        for (var i = 0; i < this.spt.length; i++) {
            if (this.spt[i].id == id)
                return this.spt[i];
        }

        return null;
    }

    this.rebuildPath = function () {
        this.path = new Array();

        var tempNode = this.spt[this.spt.length - 1];

        while (tempNode != null) {
            this.path.push(tempNode);
            tempNode = tempNode.pat;
        }
    }

    this.getID = function (x, y) {
        return ((x * this.h) + y);
    }

    this.getCoordinatesFromTarget = function () {
        var tv = new Vector();
        tv.x = ~~this.target.v.x;
        tv.y = ~~this.target.v.y;

        return tv;
    }

    this.getCoordinatesFromID = function (id) {
        var v = new Vector();
        v.x = parseInt(id / this.h);
        v.y = parseInt(id - (v.x * this.h));

        return v;
    }
}