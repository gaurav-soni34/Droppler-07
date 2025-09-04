"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="p-4 flex items-center justify-between">
      {/* left */}
      <SidebarTrigger/>    
      {/* right */}
      <div className="flex items-center gap-6">
          <Link href="/generat-qr">
           QRify
        </Link>
        <Link href="/">Dasboard</Link>
        {/* thememenu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* usermenu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/evilrabbit.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-[1.2rem] w-[1.2rem] mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
              Setting
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;

// "use client";
// import { useEffect, useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
// import Link from "next/link";
// import { useTheme } from "next-themes";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "./ui/button";
// import { SidebarTrigger } from "./ui/sidebar";
// import { auth, googleProvider, rtdb } from "@/lib/firebase";
// import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
// import { ref, set } from "firebase/database";

// const Navbar = () => {
//   const { theme, setTheme } = useTheme();
//   const [user, setUser] = useState<any>(null);

//   // Track auth state
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       // Optionally save user info to Realtime Database
//       if (currentUser) {
//         const userRef = ref(rtdb, `users/${currentUser.uid}`);
//         set(userRef, {
//           uid: currentUser.uid,
//           displayName: currentUser.displayName,
//           email: currentUser.email,
//           photoURL: currentUser.photoURL,
//         });
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // // Google login
//   // const handleLogin = async () => {
//   //   try {
//   //     await signInWithPopup(auth, googleProvider);
//   //   } catch (err: any) {
//   //     console.error("Login error:", err.message);
//   //     alert(err.message);
//   //   }
//   // };
// const handleLogin = async () => {
//   if (typeof window === "undefined") return; // Client-side only

//   try {
//     const result = await signInWithPopup(auth, googleProvider);
//     console.log("Logged in as:", result.user.displayName || result.user.email);
//   } catch (err: unknown) {
//     // 🔹 TypeScript safe error handling
//     let message = "Unknown error occurred";
//     if (err instanceof Error) message = err.message;
//     console.error("Login error:", message);
//     alert("Login error: " + message);
//   }
// };


//   // Logout
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//     } catch (err: any) {
//       console.error("Logout error:", err.message);
//       alert(err.message);
//     }
//   };

//   return (
//     <nav className="p-4 flex items-center justify-between">
//       {/* Left */}
//       <SidebarTrigger />

//       {/* Right */}
//       <div className="flex items-center gap-6">
//         <Link href="/generat-qr">QRify</Link>
//         <Link href="/">Dashboard</Link>

//         {/* Theme Menu */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" size="icon">
//               <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
//               <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
//               <span className="sr-only">Toggle theme</span>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {/* Auth Menu */}
//         {!user ? (
//           <Button onClick={handleLogin} className="bg-blue-600 text-white">
//             Login / Signup
//           </Button>
//         ) : (
//           <DropdownMenu>
//             <DropdownMenuTrigger>
//               <Avatar>
//                 <AvatarImage src={user.photoURL || ""} />
//                 <AvatarFallback>
//                   {user.displayName
//                     ? user.displayName.charAt(0).toUpperCase()
//                     : user.email
//                     ? user.email.charAt(0).toUpperCase()
//                     : "U"}
//                 </AvatarFallback>
//               </Avatar>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent sideOffset={10}>
//               <DropdownMenuLabel>My Account</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>
//                 <User className="h-[1.2rem] w-[1.2rem] mr-2" />
//                 {user.displayName || user.email || "Profile"}
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
//                 Setting
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={handleLogout} className="text-red-600">
//                 <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
//                 Logout
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;