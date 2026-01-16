import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useUser } from '@/context/userContext'
import { toast } from 'sonner'

const ForgotPassword = () => {
  const [isloading, setIsloading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useUser() 

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError("")

    try {
      setIsloading(true)
      const res = await axios.post('http://localhost:8000/user/forgotPassword', { email })

      if (res.data.success) {
        // only do this if your API actually returns user here
        if (res.data.user) {
          setUser(res.data.user)
        }

        setIsSubmitted(true)        // <-- otherwise success message never shows
        navigate(`/verify-otp/${email}`)
        toast.success(res.data.message)
        setEmail("")
      } else {
        setError(res.data.message || "Something went wrong")
      }
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message || "Something went wrong")
    } finally {
      setIsloading(false)
    }
  }

  return (
    <div className='relative w-full h-[760px] bg-green-100 overflow-hidden'>
      <div className='min-h-screen flex flex-col'>
        <div className='flex-l flex items-center justify-center p-4'>
          <div className='w-full max-w-md space-y-6'>
            <div className='text-center space-y-2'>
              <h1 className='text-3xl font-bold tracking-tight text-green-600'>
                Reset Your Password
              </h1>
              <p className='text-muted-foreground'>
                Enter Your Email and we'll send you the instructions to reset your password.
              </p>
            </div>

            <Card className='bg-white'>
              <CardHeader className='space-y-1'>
                <CardTitle className='text-2xl text-center text-green-600'>
                  Forgot Password
                  <CardDescription className='text-center'>
                    {isSubmitted
                      ? "✅ If the email exists, instructions have been sent."
                      : "Please enter your email address below."}
                  </CardDescription>
                </CardTitle>
              </CardHeader>

              <CardContent className='space-y-4'>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isSubmitted ? (
                  <div className='py-6 flex-col items-center justify-center text-center space-y-4'>
                    <div className='bg-primary/10 rounded-full p-3'>
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className='space-y-2'>
                      <h3 className="text-lg font-medium">Check Your Inbox</h3>
                      <p className='text-muted-foreground'>
                        We've sent a password reset link to your{" "}
                        <span className="font-medium text-foreground">{email}</span>
                      </p>
                      <p>
                        if you don't see the email, check your spam folder or{" "}
                        <button
                          className='text-primary hover:underline font-medium'
                          onClick={() => { setIsSubmitted(false) }}
                        >
                          Try Again!
                        </button>
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className='space-y-4'>
                    <div className='space-y-2 relative text-gray-800'>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isloading}
                      />
                    </div>
                    <Button
                      className="w-full bg-green-600 text-white relative hover:bg-green-500 cursor-pointer"
                      disabled={isloading}
                    >
                      {isloading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending reset link...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>

              <CardFooter className="flex justify-center">
                <p>
                  Remember Your Password?{" "}
                  <Link to={"/login"} className="text-green-600 hover:underline">
                    Log In
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword