var mongoose = require('mongoose');

var SprintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  startDate: {
    type: Date,
    default: null
  },
  finishDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
  updatedAt: {
    type: Number,
    default: Date.now
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, {
  usePushEach: true
});

var Sprint = mongoose.model('Sprint', SprintSchema);

module.exports = {Sprint};
