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
  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    if (!validateUserData(userData)) {
      // Register user
      navigate('/') // pass some kind context
    }
  }

  // if this return other than 0 it means register fails
  function validateUserData(userData: UserDataType): number {
    // Check if username don't have similar username in the database

    if (userData.username.length < 6) {
      // show error in input
      return 1
    }
    if (userData.password.length < 8) {
      // show error in input
      return 1
    }
    if (userData.password !== userData.confirmPassword) {
      setErrorMessages(['Password not match'])
      return 1
    }
    return 0
  }
  return (
    <div className="h-screen flex justify-center items-center">
      <section className="w-96 m-auto bg-neutral-50 p-4 text-center rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold mb-12 mt-4">Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            required
            minLength={6}
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
          <button className="px-3 py-1 rounded-md bg-myBlue-1 mb-8 mt-2 text-white hover:bg-myBlue-2">
            Register
          </button>
          <br />
          <Link to="/login" className="font-thin text-sm text-myBlue-1">
            Already registered?
          </Link>
        </form>
      </section>
    </div>
  )
}
