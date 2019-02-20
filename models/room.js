const RoomSchema = Schema({
  name:  String,
  desc:  String,
  owner: Schema.Types.ObjectId
});