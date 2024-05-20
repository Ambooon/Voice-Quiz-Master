import { getSHA256Hash } from 'boring-webcrypto-sha256'
import { SyntheticEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataType } from './Types'

export default function Register() {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const navigate = useNavigate()

  async function handleSubmit(e: SyntheticEvent) {
    setErrorMessages([])
    e.preventDefault()
    if ((await validateUserData(userData)) === 0) {
      console.log('Register')
      const hashPassword = await getSHA256Hash(userData.password)
      window.api.register({ username: `${userData.username}`, password: `${hashPassword}` })

      navigate('/')
    }
  }

  // if this return other than 0 it means register fails
  async function validateUserData(userData: UserDataType) {
    // Check if username don't have similar username in the database
    const isSuccess: number[] = []

    if (await window.api.isUsernameExist(userData.username)) {
      setErrorMessages((prev) => [...prev, 'Username Already Exist'])
      isSuccess.push(1)
    }
    if (userData.password !== userData.confirmPassword) {
      setErrorMessages((prev) => [...prev, 'Password not match'])
      isSuccess.push(1)
    }
    return isSuccess.length
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <section className="w-96 m-auto bg-neutral-50 p-4 text-center rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold mb-12 mt-4">Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            required
            minLength={3}
            className="px-2 py-1 mb-6 border border-slate-400 rounded-md"
            type="text"
            name="username"
            value={userData.username}
            placeholder="Enter your username"
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          />
          <br />
          <input
            required
            minLength={8}
            className="px-2 py-1 mb-6 border border-slate-400 rounded-md"
            type="password"
            name="password"
            value={userData.password}
            placeholder="Enter your password"
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
          <br />
          <input
            required
            minLength={8}
            className="px-2 py-1 mb-4 border border-slate-400 rounded-md"
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            placeholder="Confirm your password"
            onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
          />
          <br />
          {errorMessages &&
            errorMessages.map((err) => (
              <p key={err} className="text-red-500 font-light">
                {err}
              </p>
            ))}
          <input
            className="px-3 py-1 rounded-md bg-myBlue-1 mb-8 mt-2 text-white hover:bg-myBlue-2 cursor-pointer"
            type="submit"
            value="Register"
          />
          <br />
          <Link to="/login" className="font-thin text-sm text-myBlue-1">
            Already registered?
          </Link>
        </form>
      </section>
    </div>
  )
}
