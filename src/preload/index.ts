import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'
import { MongoClient } from 'mongodb'
const ObjectId = require('mongodb').ObjectId
const crypto = require('crypto')

let client
let database
let adminsDb
let quizzesDb
let historyDb
try {
  client = new MongoClient('mongodb://0.0.0.0:27017/')
  client.connect()

  database = client.db('thesis')
  adminsDb = database.collection('admins')
  quizzesDb = database.collection('quizzes')
  historyDb = database.collection('history')
} catch {
  console.log("Error: Can't connect in the database")
}

const api = {
  isUsernameExist: async (username: string) => {
    if (await adminsDb.findOne({ username: `${username}` })) {
      return true
    }
    return false
  },

  register: (userData: { username: string; password: string }) => {
    adminsDb.insertOne(userData)
  },

  login: async (userData: { username: string; password: string }) => {
    if (await adminsDb.findOne({ username: userData.username, password: userData.password })) {
      return true
    }
    return false
  },

  getQuizzes: async (user) => {
    let quizzes = await quizzesDb
      .find({ user: user }, { title: 1, date: 1, description: 1 })
      .toArray()

    quizzes = quizzes.map((quiz) => {
      const secretKey = 'mySecretKey'
      const decipher = crypto.createDecipher('aes-256-cbc', secretKey)
      let decrypted = decipher.update(quiz.encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      const object = JSON.parse(decrypted)
      return {
        id: quiz._id.toHexString(),
        user: quiz.user,
        ...object
      }
    })
    return quizzes
  },

  createQuiz: async (data) => {
    const { user, ..._data } = data
    const secretKey = 'mySecretKey'
    const cipher = crypto.createCipher('aes-256-cbc', secretKey)
    let encrypted = cipher.update(JSON.stringify(_data), 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return await quizzesDb.insertOne({ encrypted: encrypted, user: user })
  },

  getQuiz: async (id) => {
    const _id = new ObjectId(id)
    let result = await quizzesDb.findOne({ _id: _id })
    const secretKey = 'mySecretKey'
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey)
    let decrypted = decipher.update(result.encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    const object = JSON.parse(decrypted)
    result = { id: _id.toHexString(), user: result.user, ...object }
    return result
  },

  updateQuiz: async (id, data) => {
    const { _id, user, ...rest } = data
    const secretKey = 'mySecretKey'
    const cipher = crypto.createCipher('aes-256-cbc', secretKey)
    let encrypted = cipher.update(JSON.stringify(rest), 'utf8', 'hex')
    encrypted += cipher.final('hex')
    await quizzesDb.findOneAndReplace(
      { _id: new ObjectId(id) },
      { user: user, encrypted: encrypted }
    )
  },

  deleteQuiz: async (id) => {
    const _id = new ObjectId(id)
    return await quizzesDb.findOneAndDelete({ _id: _id })
  },

  getQuizzesHistory: async (user) => {
    let quizzes = await historyDb
      .find({ user: user }, { title: 1, date: 1, description: 1 })
      .toArray()

    quizzes = quizzes.map((quiz) => {
      return {
        ...quiz,
        id: quiz._id.toHexString()
      }
    })
    return quizzes
  },

  createQuizHistory: async (data) => {
    return await historyDb.insertOne(data)
  },

  deleteQuizHistory: async (id) => {
    const _id = new ObjectId(id)
    return await historyDb.findOneAndDelete({ _id: _id })
  },

  getQuizHistory: async (id) => {
    const _id = new ObjectId(id)
    const result = await historyDb.findOne({ _id: _id })
    return result
  },

  changePassword: async (data: { username: string; oldPassword: string; newPassword: string }) => {
    const result = await adminsDb.findOneAndReplace(
      {
        username: data.username,
        password: data.oldPassword
      },
      { username: data.username, password: data.newPassword }
    )
    return result
  }
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
