import { BookA, BookOpen, LogOut, User } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from '@/context/userContext';
import axios from 'axios';
import { toast } from 'sonner';

const NavBar = () => {
    const {user,setUser} = useUser()
    const accessToken=localStorage.getItem("accessToken")
    const LogoutoutHandler = async() => {
        try {
            const res=await axios.post("http://localhost:8000/user/logout",{},{
                headers:{
                    authorization:`Bearer ${accessToken}`
                }
            })
          if(res.data.success){
            setUser(null)
            toast.success(res.data.message)
            localStorage.clear()
          }
            
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <nav className="p-2 border-b border-gray-200 bg-transparent">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className='flex gap-2 items-center'>
                    <BookOpen className='h-6 w-6 text-green-800' />
                    <h1 className='font-bold text-xl'><span className='text-green-600'>Notes</span> App</h1>
                </div>
                <div className='flex gap-7 items-center'>
                    <ul className='flex gap-7 font-semibold text-lg items-center'>
                        <li>Features</li>
                        <li>Pricing</li>
                        <li>Contact</li>
                        {
                            user ? <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem><User />Profile</DropdownMenuItem>
                                    <DropdownMenuItem><BookA />Notes</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={LogoutoutHandler}><LogOut />Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu> : <Link to={'/login'}><li>Login</li></Link>
                        }
                    </ul>
                </div>
            </div>

        </nav>
    )
}

export default NavBar
