import React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useNavigate, Link } from "react-router-dom"   // <-- added Link

const Signup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isloading, setIsloading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsloading(true)
    try {
      const response = await axios.post(
        "http://localhost:8000/user/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      )
      if (response.data.success) {
        navigate("/verify")
        toast.success(response.data.message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsloading(false)
    }
  }

  return (
    <div className="relative w-full h-screen bg-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-green-600">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center">
              Create your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Full Name</Label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                />
              </div>

              <div className="grid gap-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </CardContent>

            <br />

            <CardFooter className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500"
                disabled={isloading}
              >
                {isloading ? "Signing Up..." : "Sign Up"}
              </Button>

              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-green-600 hover:underline">
                  Log In
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Signup