const { v4: uuid } = require('uuid')

const records = [
  {
    id: 1,
    username: 'user',
    password: '123',
    displayName: 'demo user',
    email: 'user@mail.ru',
  },
  {
    id: 2,
    username: 'jill',
    password: '123',
    displayName: 'Jill',
    email: 'jill@example.com',
  },
]
  
const findById = function (id, cb) {
  process.nextTick(function () {
    const record = records.find(user => user.id === id);
      if (record) {
        cb(null, record)
      } else {
        cb(new Error('User ' + id + ' does not exist'))
      }
  })
}
  
const findByUsername = function (username, cb) {
  process.nextTick(function () {
    const record = records.find(user => user.username === username);
    if (record) {
      return cb(null, record)
    }
    return cb(null, null)
  })
}
  
const verifyPassword = (user, password) => {
  return user.password === password
}

const addUser = function (user, cb) {
  const {username, password, displayName, email} = user;
  process.nextTick(function () {
    if (records.some(user => user.username === username)) {
      cb(new Error('User ' + username + ' has already exist'))
    } else {
      const record = {
        id: uuid(),
        username,
        password,
        displayName,
        email,
      }
      
      records.push(record)
      return cb(null, record)
    }
    return cb(null, null);
  })
}

module.exports = { findById, findByUsername, verifyPassword, addUser }