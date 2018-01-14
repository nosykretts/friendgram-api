require('dotenv').config()
const mongoose = require('mongoose')
const faker = require('faker/locale/id_ID')

let UserModel = require('./models/user')
// let HouseModel = require('./models/house')
let  counter = 0;
mongoose.connection.openUri(process.env.MONGODB_CONN_STRING, {
  useMongoClient: true,
})
mongoose.Promise = global.Promise
mongoose.connection
  .once('open', () => {
    console.log('mongoose connection success')
  })
  .on('error', error => {
    console.log('connection error', error)
  })

let exactUser = [
  UserModel.create({
    name: 'Fajar Patappari',
    username: 'nosykretts',
    email: 'top.sick.red@gmail.com',
    followings: [],
    password: '1234',
  }),
  UserModel.create({
    name: 'Agum',
    username: 'agumandi',
    followings: [],
    email: 'agum@gmail.com',
    password: '1234',
  }),
]

function rb(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function gri(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // gri(-180, 180, 3)
    // 12.693
}


function createUsers() {
  let users = exactUser
  for (let i = 0; i < 5; i++) {
    // users.push(
    //   UserModel.create({
    //     name: faker.name.findName(),
    //     email: faker.internet.email().toLowerCase(),
    //     password: '1234',
    //   })
    // )
  }
  return Promise.all(users)
}

function randPhotos(user) {
  return Array.apply(null, Array(rb(1, 4))).map((x, i) => {
  //  return `http://via.placeholder.com/${rb(500, 220)}x${rb(500,220)}` 
   counter++
   return `http://loremflickr.com/${rb(300, 200)}/${rb(300,200)}/house?lock=${counter}`
  })
}

let xusers = null

createUsers()
  .then(_users => {
    xusers = _users
    console.log(xusers[0])
    console.log(xusers[1])
    process.exit()
  })
  .catch(err => {
    console.log(err)
    process.exit()
  })
