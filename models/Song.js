const mongoose = require('mongoose')
const { Schema } = mongoose

const songSchema = new Schema({
  artist: String,
  title: String,
  body: String,
  seconds: Number,
  fontSize: { type: Number, default: 15 },
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
})

mongoose.model('song', songSchema)