


var url = $url();

url = typeof url != "undefined" ? url.mode[0] : null;

var mineN = 13;
var rows = 10;
var cols = 10;


switch (url) {
    case 'medium':
        rows = 13;
        cols = 15;
        mineN = 20;
        break;

    case 'hard':
        rows = 15;
        cols = 17;
        mineN = 25;
        break;
}



// Cell Class
var Cell = function (id, mine, row, col) {
    this.id = id;
    this.mine = mine;
    this.border = 0;
    this.quantumstate = false;
    this.table = {
        row,
        col,
    };
    this.near = {
        up: this.id - cols,
        upright: this.id - (cols - 1),

        right: this.id + 1,
        downright: this.id + (cols + 1),

        down: this.id + cols,
        downleft: this.id + (cols - 1),

        left: this.id - 1,
        upleft: this.id - (cols + 1)
    };

    //bordercheck
    if ((row == 1 || row == rows) || (col == 1 || col == cols)) {
        this.border = 1;

        if (row == 1) {
            this.near.up = false;
            this.near.upleft = false;
            this.near.upright = false;
        }

        if (row == rows) {
            this.near.down = false;
            this.near.downleft = false;
            this.near.downright = false;
        }

        if (col == 1) {
            this.near.upleft = false;
            this.near.left = false;
            this.near.downleft = false;
        }

        if (col == cols) {
            this.near.upright = false;
            this.near.right = false;
            this.near.downright = false;
        }
    }
}

// create grid
var gridCellId = 0;
var Cells = [];

for (var i = 0; i < rows; i++) {
    $('#minefield').append("<div class='row'>" + "</div>");
    for (var i2 = 0; i2 < cols; i2++) {
        $('.row').last().append(`
            <div class=col>
                <span mine=false class=gridCell cell-id=${gridCellId}></span>
            </div>
        `);
        Cells[gridCellId] = new Cell(gridCellId, false, i + 1, i2 + 1);
        gridCellId++;
    }
}

//placemines
for (var i3 = 0; i3 < mineN; i3++) {
    var cellN = Math.floor((Math.random() * (rows * cols)));
    Cells[cellN].mine = true;
    //green for mines
    //$('[cell-id=' + cellN + ']').css('background', 'green');
    $('[cell-id=' + cellN + ']').attr("mine", true);
}

//dinamic css
$(".row").css("width", cols * 33);



//click event
$(".gridCell").click(function () {
    var cellid = parseInt($(this).attr('cell-id'));
    var mine = $(this).attr('mine');
    console.log(Cells[cellid]);
    // functions?
    function chkCell(id) {
        if (id != false) {
            return Cells[id].mine;
        } else return false 
    }

    function chkNear(cell) {
        if (cell != false || typeof cell !== "undefined") {

            var countNearMines = 0;
            try {
                if (chkCell(cell.near.up)) {countNearMines++;}
                if (chkCell(cell.near.upright)) {countNearMines++;}

                if (chkCell(cell.near.right)) {countNearMines++;}
                if (chkCell(cell.near.downright)) {countNearMines++;}

                if (chkCell(cell.near.down)) {countNearMines++;}
                if (chkCell(cell.near.downleft)) {countNearMines++;}

                if (chkCell(cell.near.left)) {countNearMines++;}
                if (chkCell(cell.near.upleft)) {countNearMines++;}

                if (countNearMines > 0 && !cell.quantumstate) {
                    $('[cell-id=' + cell.id + ']').html(countNearMines);
                    $('[cell-id=' + cell.id + ']').css('background', '#e67e22');
                }

                if (countNearMines == 0 && !cell.quantumstate) {
                    $('[cell-id=' + cell.id + ']').css('background', '#e67e22');

                    cell.quantumstate = true;
                    spread(cell);
                }
            } catch (err) {}
        }
    }

    function spread(cell) {
        if (cell != false || typeof cell !== "undefined") {
            chkNear(Cells[cell.near.up]);
            chkNear(Cells[cell.near.upright]);

            chkNear(Cells[cell.near.right]);
            chkNear(Cells[cell.near.downright]);

            chkNear(Cells[cell.near.down]);
            chkNear(Cells[cell.near.downleft]);

            chkNear(Cells[cell.near.left]);
            chkNear(Cells[cell.near.upleft]);
        }
    }

    //end
    if (Cells[cellid].mine) {
        alert('rip');
        location.reload();
        $('[cell-id=' + cellid + ']').css('background', '#2ecc71');
    } else {
        chkNear(Cells[cellid]);
    }
});

function $GET(q,s) {
    s = (s) ? s : window.location.search;
    var re = new RegExp('&amp;'+q+'=([^&amp;]*)','i');
    return (s=s.replace(/^\?/,'&amp;').match(re)) ?s=s[1] :s='';
}

function $url(url = window.location.search) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}