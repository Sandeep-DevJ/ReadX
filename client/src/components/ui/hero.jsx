import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/userContext"; // <- use the hook

const Hero = () => {
  const { user } = useUser();
  
  const navigate = useNavigate();

  const username = user?.username || "Guest";

  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center bg-green-50">
      <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
        <h1 className="font-bold text-2xl">Welcome {username}</h1>

        <h1 className="text-4xl md:text-6xl font-bold text-green-700">
          Build Better Apps, Faster 🚀
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          A modern platform to manage users, authentication, and workflows —
          simple, secure, and scalable.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          {!user ? (
            <>
              <Button
                className="bg-green-600 hover:bg-green-500 flex items-center gap-2"
                onClick={() => navigate("/signup")}
              >
                Get Started <ArrowRight size={18} />
              </Button>
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-100"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-500 flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              Go to Home <ArrowRight size={18} />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;