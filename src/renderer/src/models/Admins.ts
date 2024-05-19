const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId

class Admins {
  dbName
  client

  constructor() {
    this.dbName = 'thesis'
    this.client = new MongoClient('mongodb://localhost:27017/')
  }

  #getCollection = async () => {
    await this.client.connect()
    const db = this.client.db(this.dbName)
    const admins = db.collection('admins')
    return admins
  }

  getAdmins = async () => {
    console.log(`Admins.ts > getAdmins`)

    const admins = await this.#getCollection()
    let res = await admins.find({}).toArray()

    res = res.map((admin) => {
      return {
        id: admin._id.toHexString(),
        username: admin.username,
        password: admin.password
      }
    })
    return res
  }

  // addEmployee = async (employee) => {
  //   console.log(`Employee.js > addEmployee: ${employee}`)

  //   const employees = await this.#getCollection()
  //   return await employees.insertOne(employee)
  // }

  // updateEmployee = async (id, employee) => {
  //   console.log(`Employee.js > updateEmployee: ${employee}`)

  //   const employees = await this.#getCollection()
  //   return await employees.updateOne({ _id: new ObjectId(id) }, { $set: employee })
  // }

  // deleteEmployee = async (id) => {
  //   console.log(`Employee.js > deleteEmployee: ${id}`)

  //   const employees = await this.#getCollection()
  //   const res = await employees.deleteOne({ _id: new ObjectId(id) })
  //   return res.deletedCount > 0
  // }
}

export default Admins
