import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // <-- 1. Import Link
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar' ;
import bg2 from "@/assets/bg2.png";
import logo from "@/assets/logo.png"; // <-- 2. Import logo
import { logout } from "@/services/logoutService"

import myAvatar from "@/assets/my-avatar.png"; 

interface User {
  firstname: string;
  lastname: string;
  email: string;
}

export default function AboutUsPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("UserID");
    if (!id) {
      console.error("No user ID found in localStorage");
      return;
    }

    api
      .get(`/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading user info...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 3. Updated Header */}
      <header>
        <nav className="flex items-center justify-between p-4 text-xs font-bold bg-white shadow-sm">
          <div>
            <Link to="/">
              <img src={logo} alt="logo" className="w-12" />
            </Link>
          </div>
          <div className="space-x-6">
            <Link to="/invoice">Invoice</Link>
            <Link to="/quotation">Quotation</Link>
            <Link to="/aboutus" className="font-bold text-primary">About Us</Link>
          </div>
          <a onClick={logout} className=" hover:font-bold cursor-pointer">Log out →</a>
        </nav>

        {/* 4. Updated Banner */}
        <div className="relative w-full h-60 opacity-90">
          <img
            src={bg2}
            alt="banner"
            className="absolute inset-0 w-full h-full object-cover brightness-50"
          />
          <h1 className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold">
            About Us
          </h1>
        </div>
      </header>

      {/* User Card Section */}
      <main className="flex-grow flex justify-center items-center py-10 ">
        
        {/* 5. Card with increased font sizes */}
        <Card className="w-90 h-110 bg-white rounded-xl shadow-md p-6 text-center border-4 border-green-800">
          
          <CardHeader className="p-0">
            <Avatar className="w-50 h-50 mx-auto mb-4 bg-primary text-white border-4 border-green-600">
              

              <AvatarImage src={myAvatar} alt="My Avatar" />
              <AvatarFallback className="text-3xl font-bold">
                {user.firstname?.charAt(0)}
                {user.lastname?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <CardTitle className="text-3xl font-bold text-gray-600"> {/* <-- Increased from 2xl */}
              {user.firstname} {user.lastname}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 mt-2"> {/* <-- Added a little top margin */}
            <p className="text-gray-500 text-base mb-6"> {/* <-- Increased from text-sm */}
              Email:  {user.email}
            </p>
          </CardContent>

        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-auto flex items-center justify-center text-sm bg-ink text-white w-full p-3">
        <p>Use for Tailwind Demo © Faculty of ICT, Mahidol University</p>
      </footer>
    </div>
  );
}