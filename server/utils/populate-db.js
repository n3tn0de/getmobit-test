import User from '../models/User'
import Device from '../models/Device'
import randomMac from 'random-mac'
const chance = require('chance').Chance()

const usersAmount = 10
const devicesAmount = process.env.DEVICES_AMOUNT || 1100

export async function populateUsers() {
  await User.create({
    email: 'n3tn0de@gmail.com',
    firstName: 'Alexey',
    lastName: 'Vishnyakov',
    canEdit: true,
    password: 'test'
  })
  for (let index = 0; index < usersAmount; index++) {
    await User.create({
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      password: chance.string(),
      canEdit: chance.bool(),
    })
  }
}

const osTypes = [
  'Windows',
  'MacOS',
  'Ubuntu',
  'Debian'
]

const groups = [
  'Developers',
  'Manages',
  'Sales',
  'Accounting'
]

export async function populateDevices() {
  for (let index = 0; index < devicesAmount; index++) {
    const randomRecord = Math.floor(Math.random() * await User.count())
    await User.findOne().skip(randomRecord).exec(async (err, res) => {
      await Device.create({
        ipv4: chance.ip(),
        ipv6: chance.ipv6(),
        mac: randomMac(),
        name: chance.word() + chance.string(),
        description: chance.paragraph(),
        group: groups[Math.floor(Math.random() * groups.length)],
        office: chance.natural({ min: 1, max: 400 }),
        users: [ res._id ],
        os: osTypes[Math.floor(Math.random() * osTypes.length)],
      })
    })
  }
}
