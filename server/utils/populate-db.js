import User from '../models/User'

export const populateUsers = () => {
  User.create({
    email: 'n3tn0de@gmail.com',
    password: 'test'
  })
}
