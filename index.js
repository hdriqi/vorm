require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ users: [] }).write()

const server = express()

const main = async () => {
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())
  
  server.post('/submit/:type', async (req, res) => {
    const users = db.get('users')
    const userExist = users.find({ email: req.body.email }).value()

    if(!userExist) {
      users.push({
        type: req.params.type,
        email: req.body.email,
        content: req.body.content,
        createdAt: new Date().toISOString()
      }).write()

      return res.json({
        success: 1,
        message: 'successfully registered'
      })
    }
    else {
      return res.json({
        success: 0,
        message: 'email already registered'
      })
    }
  })

  server.listen(process.env.PORT, () => {
    console.log(`Running on ${process.env.PORT}`)
  })
}

main()