import { getSHA256Hash } from 'boring-webcrypto-sha256'
import { SyntheticEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataType } from './Types'

export default function Login() {
  const [userData, setUserData] = useState({
    username: '',
    password: ''
  })
  const [errorMessages, setErrorMessages] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    setErrorMessages('')
    if (await validateUserData(userData)) {
      console.log('login')
      sessionStorage.setItem('username', userData.username)
      sessionStorage.setItem('isLoggedIn', 'true')
      navigate('/')
    }
    // navigate('/')
  }

  async function validateUserData(userData: UserDataType) {
    const hashPassword = await getSHA256Hash(userData.password)
    if (await window.api.login({ username: userData.username, password: hashPassword })) {
      return true
    }
    setErrorMessages('Account not found')
    return false
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <section className="w-96 m-auto bg-neutral-50 p-4 text-center rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold mb-12 mt-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="px-2 py-1 mb-6 border border-slate-400 rounded-md"
            type="text"
            name="username"
            value={userData.username}
            placeholder="Enter your username"
            required
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          />
          <br />
          <input
            className="px-2 py-1 mb-4 border border-slate-400 rounded-md"
            type="password"
            name="password"
            value={userData.password}
            placeholder="Enter your password"
            required
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
          <br />
          {errorMessages && <p className="text-red-500 font-light">{errorMessages}</p>}
          <input
            className="px-3 py-1 rounded-md bg-myBlue-1 mb-8 mt-2 text-white hover:bg-myBlue-2 cursor-pointer"
            type="submit"
            value="Login"
          />
          <br />
          <Link to="/register" className="font-thin text-sm text-myBlue-1">
            Not yet registered?
          </Link>
        </form>
      </section>
    </div>
  )
}
