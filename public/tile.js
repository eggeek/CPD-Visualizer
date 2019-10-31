const c = require("./constant")

var vecs = []
for (var i=0; i<8; i++) {
  var vec = [0, 0, 0];
  for (var j=0; j<3; j++) if (i & (1<<j)) {
    vec[j] += 60;
  }
  vecs.push(vec);
}
var moves = ["N", "S", "E", "W", "NE", "NW", "SE", "SW"];

class Tile {

  constructor(obj) {
    this.order  = Number(obj.order);
    this.cid    = Number(obj.cid);
    this.rowid  = Number(obj.rowid);
    this.mask   = Number(obj.mask);
    this.x      = Number(obj.x);
    this.y      = Number(obj.y);
    this.side   = Number(obj.side);
    if (obj.hasOwnProperty('hmove')) {
      this.hmove = Number(obj['hmove']);
    }
    else {
      this.hmove = -1;
    }
  }

  decode_mask() {
    var fmoves = [];
    for (var i=0; i<8; i++) if (this.mask & (1<<i)) {
      fmoves.push(moves[i]);
    }
    if (this.mask & c.hmask) fmoves.push("H");
    if (this.mask & c.cmask) fmoves.push("C");
    return fmoves.join(",");
  }

  coloring () {
    // order = -1: obstacle
    if (this.order == -1) return "black";
    var r=125, g=125, b=125;
    for (var i=0; i<8; i++) if (this.mask & (1<<i)) {
      r = Math.min(255, r + vecs[i][0]);
      g = Math.min(255, g + vecs[i][1]);
      b = Math.min(255, b + vecs[i][2]);
    }
    var a = this.order == this.cid? 1.0: 0.5;
    return "rgba(" + [r,g,b,a].join(",") + ")";
  }

  getinfo() {
  return `x:${this.x}, y:${this.y}
          </br>mask:${this.mask} (${this.decode_mask()})
          </br>cid: ${this.cid}
          </br>order: ${this.order}
          </br>side: ${this.side}
          </br>color: ${this.coloring()}`
  }
}
module.exports = Tile;
