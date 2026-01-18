import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CheckCircle, Loader2, RotateCcw } from 'lucide-react'

const VerifyOtp = () => {
  const [isverified, setIsVerified] = React.useState(false)
  const [error, setError] = React.useState("")
  const [successMassage, setSuccessMessage] = React.useState("")
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = React.useState(false)
  const inputRefs = React.useRef([])

  const { email } = useParams()  
  const navigate = useNavigate()

  const handleChange = (value, index) => {
    if (value.length > 1) return
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleVerify = async () => {
    const finalOtp = otp.join("")
    if (finalOtp.length < 6) {
      setError("Please enter the 6-digit code")
      return
    }
    try {
      setIsLoading(true)
      const response = await axios.post(
        `http://localhost:8000/api/user/verifyOtp/${email}`,
        { otp: finalOtp }
      )
      setSuccessMessage(response.data.message)
      setTimeout(() => {
        navigate(`/reset-password/${email}`)
      }, 2000)
      setIsVerified(true)
      setSuccessMessage(response.data.message)
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const clearOtp = () => {
    setOtp(["", "", "", "", "", ""])
    setError("")
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }

  return (
    <div className='min-h-screen flex flex-col bg-green-100'>
      <div className='flex-l flex items-center justify-center p-4'>
        <div className='w-full max-w-md space-y-6'>
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold tracking-tight text-green-600'>
              Verify Your Email
            </h1>
            <p className='text-muted-foreground'>
              we&apos;ve sent a 6-digit verification code to{" "}
              <span>{"Your Email"}</span>
            </p>
          </div>
          <Card className='shadow-lg'>
            <CardHeader className='space-y-1'>
              <CardTitle className='text-2xl text-center text-green-600'>
                Enter Verification Code
              </CardTitle>
              <CardDescription className='text-center'>
                {isverified
                  ? "Code verified successfully! Redirecting..."
                  : "Enter The 6-digit Verification Code"}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMassage && (
                <p className="text-green-600 text-sm mb-3 text-center">
                  {successMassage}
                </p>
              )}

              {isverified ? (
                <div className='py-6 flex flex-col items-center justify-center text-center space-y-4'>
                  <div className='bg-primary/10 rounded-full p-3'>
                    <CheckCircle className='h-6 w-6 text-primary' />
                  </div>
                  <div className='space-y-2'>
                    <h3 className='font-medium text-lg'>Verification Successfull</h3>
                    <p className='text-muted-foreground'>
                      Your Email Has been verified Successfully. you&apos;ll be
                      redirected to reset your password.
                    </p>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span className='text-sm text-muted-foreground'>
                      Redirecting...
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className='flex justify-between mb-6'>
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        type="text"
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        ref={(el) => (inputRefs.current[index] = el)}
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg font-medium rounded-md border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      />
                    ))}
                  </div>
                  <div className='space-y-3'>
                    <Button
                      onClick={handleVerify}
                      disabled={isLoading || otp.some((digit) => digit === "")}
                      className='bg-green-600 w-full'
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Code"
                      )}
                    </Button>
                    <Button
                      variant='outline' 
                      onClick={clearOtp}
                      className='w-full flex items-center justify-center bg-transparent border border-gray-300 hover:bg-gray-100'
                      disabled={isLoading || isverified}
                    >
                      <RotateCcw className='mr-2 h-4 w-4' />
                      Clear
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className='flex justify-center'>
              <p className='text-sm text-muted-foreground'>
                Wrong Email?{" "}
                <Link to={'/forgot-password'} className='text-green-600 hover:underline'>
                  Change Email
                </Link>
                </p>
              </CardFooter>
          </Card>
          <div className='text-center text-xs text-muted-foreground'>
            <p>
              for testing purposes, use code <span className='font-bold'>123456</span>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtp