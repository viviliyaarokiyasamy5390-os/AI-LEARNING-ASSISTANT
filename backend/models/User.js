import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true, 
    select: false 
  },
  profileImage: { 
    type: String, 
    default: "" 
  },
}, { 
  timestamps: true 
});

// Password hash panna - next illama
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return; // next() vendam, return mattum podhum
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password compare panna
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;