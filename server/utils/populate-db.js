import User from '../models/User'
const chance = require('chance').Chance()

const usersAmount = 10
const devicesAmount = 2500

export const populateUsers = () => {
  User.create({
    email: 'n3tn0de@gmail.com',
    firstName: 'Alexey',
    lastName: 'Vishnyakov',
    canEdit: true,
    password: 'test'
  })
  for (let index = 0; index <= usersAmount; index++) {
    User.create({
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      password: chance.string(),
      canEdit: chance.bool(),
    })
  }
}
