function Tile(obj) {
  this.type = Number(obj.type);
  this.mask = Number(obj.mask);
  this.x = Number(obj.x);
  this.y = Number(obj.y);

  this.coloring = function() {
    colors = ["white", "black"];
    return colors[this.type];
  }

  this.getinfo = function() {
    console.log(this);
  }
}


module.exports = Tile;
