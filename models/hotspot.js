const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const hotspotSchema = new Schema({
  name: String,
  location: String,
  kind:String,
  genre:String,
  visits: {
    type:Number,
    default:1
  }

}, {
  timestamps: true
});

const Hotspot = mongoose.model("Hotspot", hotspotSchema);

module.exports = Hotspot;