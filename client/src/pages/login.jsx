import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";   // <- added Link
import { useUser } from "@/context/userContext";


const API_URL = import.meta.env.VITE_API_URL;
const Login = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("formData:", formData);
      const res = await axios.post(
  `${API_URL}/api/user/login`,
  formData,


        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("login response:", res.data);

      if (res.data.success) {
        // data = { accessToken, refreshToken, user }
        setUser(res.data.data.user); // only user in context
        localStorage.setItem("accessToken", res.data.data.accessToken);
        localStorage.setItem("refreshToken", res.data.data.refreshToken);

        toast.success(res.data.message || "Login successful");
        navigate("/", { replace: true });
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-green-600">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Login To Your Account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-green-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500"
                disabled={isLoading}
              >
                {isLoading ? "Logging into Your Account..." : "Login"}
              </Button>

              <p className="text-sm text-center text-gray-600">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-green-600 hover:underline">
                  Sign Up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;