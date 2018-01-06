require('dotenv').config()
const mongoose = require('mongoose')
const faker = require('faker/locale/id_ID')

let UserModel = require('./models/user')
let HouseModel = require('./models/house')
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
    email: 'top.sick.red@gmail.com',
    password: '1234',
  }),
  UserModel.create({
    name: 'Agum',
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
    users.push(
      UserModel.create({
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: '1234',
      })
    )
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
function randFacilites() {
  return Array.apply(null, Array(rb(1, 10)))
    .map((x, i) => {
      return ['FasA', 'FasB', 'FasC', 'FasD', 'FasE', 'FasF', 'FasG'][rb(0, 6)]
    })
    .filter((fas, idx, arr) => arr.indexOf(fas) === idx)
}

function createHouses(users) {
  let houses = []
  for (const user of users) {
    for (let i = 0; i < rb(1, 3); i++) {
      let buildingArea = rb(80, 300)
      let prom = HouseModel.create({
        creator: user._id,
        title: faker.company.catchPhrase(),
        description: faker.lorem.paragraph(),
        price: buildingArea * 2 * 5000000,
        surfaceArea: buildingArea * 2,
        buildingArea: buildingArea,
        roomCount: rb(1, 5),
        toiletCount: rb(1, 5),
        maidRoomCount: rb(0, 2),
        floorCount: rb(1, 3),
        garageCount: rb(0, 2),
        carportCount: rb(0, 3),
        certification: ['CERT-A', 'CERT-B', 'CERT-C'][rb(0, 2)],
        photos: randPhotos(user),
        facilities: randFacilites(),
        address: 'Jl. Random Banget',
        loc : {
          type : 'Point',
          coordinates : [gri(106,108,6), gri(-6,-7, 6)] //long,lat(2dsphere)
        },
        contact: {
          name: faker.name.findName(),
          phoneNumber: '0' + rb(811,896)+ rb(1000, 9999)+ rb(100,9999),
        },
      })
      houses.push(prom)
    }
  }
  return Promise.all(houses)
}

let xusers = null

createUsers()
  .then(_users => {
    xusers = _users
    console.log(xusers[2])
    console.log(xusers[3])

    return createHouses(_users)
  })
  .then(houses => {
    console.log(houses[0])
    console.log(houses[1])
    process.exit()
  })
  .catch(err => {
    console.log(err)
    process.exit()
  })
// process.exit()
