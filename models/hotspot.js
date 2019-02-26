const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const hotspotSchema = new Schema({
  name: String,
  location: String,
  kind:String,
  genre:String,
  userId: {type:Schema.Types.ObjectId, ref:'User'},
  visits: {
    type:Number,
    default:1
  },
  first: {
    type:Boolean,
    default:true
  },
  coolspot: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

const Hotspot = mongoose.model("Hotspot", hotspotSchema);

module.exports = Hotspot;