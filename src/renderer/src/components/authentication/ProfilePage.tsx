import { getSHA256Hash } from 'boring-webcrypto-sha256'
import { useState } from 'react'
import { GrUserManager } from 'react-icons/gr'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const username = sessionStorage.getItem('username')
  const [isEditPassword, setIsEditPassword] = useState(false)
  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  async function changePassword(e) {
    e.preventDefault()
    if (password.newPassword === password.confirmPassword) {
      const oldPasswordHash = await getSHA256Hash(password.oldPassword)
      const newPasswordHash = await getSHA256Hash(password.newPassword)
      const result = await window.api.changePassword({
        username: username,
        oldPassword: oldPasswordHash,
        newPassword: newPasswordHash
      })
      if (result) {
        setIsEditPassword(false)
        setPassword({ oldPassword: '', newPassword: '', confirmPassword: '' })
        setMessage('Password successfully changed')
      } else {
        setMessage('Old password did not match')
      }
    } else {
      setMessage('New password and confirm password did not match')
    }
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="bg-slate-100 rounded-xl shadow-xl p-8 w-[28rem]">
        <div className="flex justify-between items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold">Profile Page</h1>
          <div className="flex justify-between items-center gap-2">
            <button
              onClick={() => {
                setIsEditPassword((prev) => !prev)
                setPassword({ oldPassword: '', newPassword: '', confirmPassword: '' })
                setMessage('')
              }}
              className="px-2 py-1 rounded-md bg-myBlue-1 text-white hover:bg-myBlue-2"
            >
              Change Password
            </button>
            <button
              onClick={() => {
                sessionStorage.setItem('username', '')
                sessionStorage.setItem('isLoggedIn', 'false')
                navigate('/login')
              }}
              className="px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div className="col-span-1 border-r border-r-black flex justify-center items-center">
            <GrUserManager size={48} />
          </div>

          <div className="col-span-3 px-8 flex items-center">
            <div>
              {isEditPassword ? (
                <form onSubmit={(e) => changePassword(e)}>
                  <label htmlFor="oldPassword">Old Password: </label>
                  <input
                    required
                    minLength={8}
                    className="px-2 py-1 mb-2 border border-slate-400 rounded-md"
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={password.oldPassword}
                    onChange={(e) =>
                      setPassword((prev) => ({ ...prev, oldPassword: e.target.value }))
                    }
                  />
                  <label htmlFor="newPassword">New Password: </label>
                  <input
                    className="px-2 py-1 mb-2 border border-slate-400 rounded-md"
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    required
                    minLength={8}
                    value={password.newPassword}
                    onChange={(e) =>
                      setPassword((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                  />
                  <label htmlFor="confirmPassword">Confirm Password: </label>
                  <input
                    className="px-2 py-1 mb-2 border border-slate-400 rounded-md"
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    minLength={8}
                    value={password.confirmPassword}
                    onChange={(e) =>
                      setPassword((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                  />
                  {message && <p className="text-red-500">{message}</p>}
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      onClick={() => {
                        setIsEditPassword(false)
                        setPassword({ oldPassword: '', newPassword: '', confirmPassword: '' })
                        setMessage('')
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
