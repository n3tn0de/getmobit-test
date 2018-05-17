import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
  },
  firstName: String,
  lastName: String,
  canEdit: {
    type: Boolean,
    index: true,
  },
  password: String,
}, { timestamps: true })

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' })

const saltRounds = 10

UserSchema.pre('save', function(next) {
  if (this.isModified('password') || this.isNew) {
    bcrypt.hash(this.password, saltRounds)
      .then(hash => {
        this.password = hash
        next()
      })
  }
})

UserSchema.methods.isPasswordValid = function(password) {
  return bcrypt.compareSync(password, this.password)
}

export default mongoose.model('User', UserSchema)
