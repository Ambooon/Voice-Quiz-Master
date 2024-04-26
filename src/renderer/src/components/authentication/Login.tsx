import { SyntheticEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataType } from './Types'

export default function Login() {
  const [userData, setUserData] = useState({
    username: '',
    password: ''
  })
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const navigate = useNavigate()

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    // if (!validateUserData(userData)) {
    //   navigate('/')
    // }
    navigate('/')
  }

  // function validateUserData(userData: UserDataType): number {
  //   // Call to API
  //   // validation if success call API if not show error message

  //   // if not match in database
  //   // if (true) {
  //   //   console.log(userData)
  //   //   setErrorMessages(["Account don't found"])
  //   //   return 1
  //   // } else {
  //   //   return 0
  //   // }
  // }

  return (
    <section className="w-96 m-auto bg-neutral-50 p-4 text-center rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-16 mt-4">Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="px-2 py-1 mb-6"
          type="text"
          name="username"
          value={userData.username}
          placeholder="Enter your username"
          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
        />
        <br />
        <input
          className="px-2 py-1 mb-8"
          type="password"
          name="password"
          value={userData.password}
          placeholder="Enter your password"
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        />
        <br />
        {errorMessages &&
          errorMessages.map((err) => (
            <p key={err} className="text-red-500 font-light">
              {err}
            </p>
          ))}
        <button className="px-3 py-1 rounded-md bg-blue-400 mb-4 mt-2">Login</button>
        <br />
        <Link to="/register" className="font-thin text-sm">
          Not yet registered?
        </Link>
      </form>
    </section>
  )
}
