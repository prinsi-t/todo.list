import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true // Added index for user
  },
  text: {
    type: String,
    maxlength: 500 // Added maxlength validation
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Todo', TodoSchema);



// import mongoose from 'mongoose';

// const TodoSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   text: String,
//   completed: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model('Todo', TodoSchema);

