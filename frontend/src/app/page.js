"use client";
import { useEffect, useState } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import { IconBrandGithub, IconMail } from "@tabler/icons-react";
import { CardCarrousell } from "@/components/card-carrousell";
import { LampDemo } from "@/components/lamp-demo";
import { DemoWindow } from "@/components/demo-window";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Home = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (!user || !token) {
      setIsAuthenticated(false);
      return;
    }
    
    setIsAuthenticated(true);
  }, []);


  const teamMembers = [
    {
      name: "Antonio Macías",
      role: "Software Engineer",
      image: "/static/team/antonio.webp",
      github: "https://github.com/antoniommff",
      email: "mailto:antmacfer1@alum.us.es"
    },
    {
      name: "Rafael Pulido",
      role: "Software Engineer",
      image: "/static/team/rafa.webp",
      github: "https://github.com/rafpulcif",
      email: "mailto:rafpulcif@alum.us.es"
    }
  ];

  return (
    <div className={`min-h-screen w-full ${theme === 'dark' ? 'bg-neutral-900 text-white' : 'bg-white text-black'}`}>
      <div className="relative my-8 hidden md:block" style={isAuthenticated ? {height: "2450px"} : { height: "2800px" }}></div>
      <div className="block md:hidden relative my-8" style={isAuthenticated ? {height: "2050px"} : { height: "2550px" }}></div>
      {/* Hero Section */}
      <section className="hidden md:flex flex-col items-center justify-center text-center relative z-10">
        <div className="h-screen">
          <LampDemo />
        </div>
      </section>

      {/* Logo Section */}
      <section className="py-16 text-center relative z-10 md:mt-[-300px]">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-4">
            <Image
              src={theme === "dark" ? "/static/maestre_logo_circle_black.png" : "/static/maestre_logo_circle.png"}
              alt="Maestre Logo"
              width={128}
              height={128}
              className="rounded-xl"
            />
            <h2 className={`text-5xl font-bold font-alfa-slab-one ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              MAESTRE
            </h2>
          </div>
          <p className={`text-xl mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Choose one of our automated tools and start creating!
          </p>
        </div>
      </section>
  
      {/* Demo Video */}
      <section className="px-4 relative z-10">
        <DemoWindow />
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 font-alfa-slab-one">
            Ready to Transform Your Teaching?
          </h2>
          <button
            onClick={() => router.push('/profile/signin')}
            className={cn(
              "mt-4 px-8 py-4 rounded-md text-lg font-medium border border-green-500 relative group/btn",
              "hover:shadow-[0_0_20px_2px_rgba(34,197,94,0.3)] transition-shadow duration-800",
              theme === "dark"
                ? "text-white bg-gradient-to-br from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                : "text-black bg-gradient-to-br from-white to-neutral-100 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
            )}
            style={{ fontFamily: "'Alfa Slab One', sans-serif" }}
          >
            Sign in as a Teacher
            <BottomGradient />
          </button>
        </section>
      )}

      {/* Tools Carousel */}
      <hr className="w-3/4 mx-auto" />
      <section className="py-16">
        <h2 className={`text-4xl font-bold text-center font-alfa-slab-one mb-8 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          Explore our tools
        </h2>
        <CardCarrousell />
      </section>

      {/* Team Section */}
      <section className="pb-10">
        <h2 className={`text-4xl font-bold text-center mb-12 font-alfa-slab-one ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          Meet Our Team
        </h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member) => (
            <div 
              key={member.name} 
              className={`p-6 rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl w-[300px] ${
                theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100'
              }`}
            >
              <Image 
                src={member.image} 
                alt={member.name} 
                width={128}
                height={128}
                className="rounded-full mx-auto mb-4" 
              />
              <h3 className={`text-xl font-bold text-center mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                {member.name}
              </h3>
              <p className={`text-center mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {member.role}
              </p>
              <div className="flex justify-center gap-4">
                <a href={member.github} target="_blank" rel="noopener noreferrer" className={theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}>
                  <IconBrandGithub className="w-6 h-6" />
                </a>
                <a href={member.email} className={theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}>
                  <IconMail className="w-6 h-6" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100'}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About Maestre</h3>
            <p>An innovative educational platform designed to enhance teaching and learning experiences.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Useful Links</h3>
            <ul>
              <li><a href="https://github.com/MAESTRE-TFG/maestre" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
              <li><a href="/docs">Documentation</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p>Email: contact@maestre.com</p>
            <p>Location: Sevilla, Spain</p>
          </div>
        </div>
        <div className="text-center mt-8 pt-8 border-t border-gray-700">
          <p> © 2025 Maestre </p>
          <p className="mt-2">Licensed under MIT License</p>
        </div>
      </footer>
    </div>
  );

};

export default function Main() {
  return <SidebarDemo ContentComponent={Home} />;
}

const BottomGradient = ({ isCreate }) => {
  return (<>
    <span className={cn("group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0", 
      isCreate ? "bg-gradient-to-r from-transparent via-green-500 to-transparent" : "bg-gradient-to-r from-transparent via-cyan-500 to-transparent")} />
    <span className={cn("group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10", 
      isCreate ? "bg-gradient-to-r from-transparent via-green-500 to-transparent" : "bg-gradient-to-r from-transparent via-indigo-500 to-transparent")} />
  </>);
};