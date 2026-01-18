import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader, Loader2 } from 'lucide-react'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ChangePassword = () => {
    const { email } = useParams()
    const [error, setError] = React.useState("")
    const [success, setSuccess] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [newPassword, setNewPassword] = React.useState("")
    const [confirmNewPassword, setConfirmNewPassword] = React.useState("")
    const navigate = useNavigate()
    const handleChangePassword = async () => {
       setError("")
       setSuccess("")

       if(!newPassword ||! confirmNewPassword){
        setError("Please Fill all The Fields")
        return
    }
    if(newPassword !== confirmNewPassword){
        setError("Passwords do not match")
        return
    }
    try {
        setIsLoading(true)
        const response = await axios.post(
            `http://localhost:8000/api/user/changePassword/${email}`,
            { newPassword, confirmPassword: confirmNewPassword }
          )
          setSuccess(response.data.message)
          setTimeout(() => {
            navigate('/login')
          }, 2000)
    } catch (error) {
        setError(error.response?.data?.message || "Something went wrong")
    }finally{
        setIsLoading(false)
    }
}
  return (
    <div className='min-h-screen flex items-center justify-center bg-green-100 px-4'>
        <div className='bg-white shadow-md rounded-lg p-5 max-w-md w-full'>
            <h2 className='text-center text-2xl font-bold mb-4'>Change Password Page</h2>
            <p className='text-sm text-center mb-4'>
                set a new password for <span className='font-semibold'>{email}</span>
            </p>
           {error && <p className='text-red-500 text-sm mb-3 text-center'>{error}</p>}
           {
            success && <p className='text-green-500 text-sm mb-3 text-center'>{success}</p>
           }
           <div className='space-y-4'>
            <Input 
            type='password'
            placeholder='New Password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
             />
            <Input 
            type='password'
            placeholder='Confirm New Password'
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
             />
             <Button className='w-full bg-green-600 hover:bg-green-400'
             disabled={isLoading}
             onClick={handleChangePassword}
             >
                {
                    isLoading ? <><Loader2 className='mr-2 w-4 h-4 animate-spin'/>Changing...</>:"Change Password"
                }
             </Button>
           </div>
        </div>
      
    </div>
  )
}

export default ChangePassword
