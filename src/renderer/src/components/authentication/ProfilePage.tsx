import { useState } from 'react'
import { GrUserManager } from 'react-icons/gr'

export default function ProfilePage() {
  const username = 'Francis'
  const [isEditPassword, setIsEditPassword] = useState(false)
  const [password, setPassword] = useState({
    password: '',
    password2: ''
  })
  const [message, setMessage] = useState('')

  function changePassword(e) {
    e.preventDefault()
    if (password.password !== password.password2) {
      setMessage("Password don't match")
    } else {
      // change password in database logic
      setIsEditPassword(false)
      setPassword({ password: '', password2: '' })
      setMessage('Password successfully changed')
    }
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="bg-slate-100 rounded-xl shadow-xl p-4 w-96">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Profile Page</h1>
          <button
            onClick={() => {
              setIsEditPassword((prev) => !prev)
              setPassword({ password: '', password2: '' })
              setMessage('')
            }}
            className="px-2 py-1 rounded-md bg-myBlue-1 text-white hover:bg-myBlue-2"
          >
            Change Password
          </button>
        </div>
        <div className="grid grid-cols-4">
          <div className="col-span-1 border-r border-r-black flex justify-center items-center">
            <GrUserManager size={48} />
          </div>

          <div className="col-span-3 px-8 flex items-center">
            <div>
              {isEditPassword ? (
                <form onSubmit={(e) => changePassword(e)}>
                  <label htmlFor="password">Password: </label>
                  <input
                    required
                    minLength={8}
                    className="px-2 py-1 mb-2 border border-slate-400 rounded-md"
                    type="password"
                    id="password"
                    name="password"
                    value={password.password}
                    onChange={(e) => setPassword((prev) => ({ ...prev, password: e.target.value }))}
                  />
                  <label htmlFor="password2">Confirm Password: </label>
                  <input
                    className="px-2 py-1 mb-2 border border-slate-400 rounded-md"
                    type="password"
                    id="password2"
                    name="password2"
                    required
                    minLength={8}
                    value={password.password2}
                    onChange={(e) =>
                      setPassword((prev) => ({ ...prev, password2: e.target.value }))
                    }
                  />
                  {message && <p className="text-red-500">{message}</p>}
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      onClick={() => {
                        setIsEditPassword(false)
                        setPassword({ password: '', password2: '' })
                      }}
                      className="px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-2 py-1 rounded-md bg-myBlue-1 text-white hover:bg-myBlue-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2>Username: {username}</h2>
                  {message && <p className="text-green-500">{message}</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
