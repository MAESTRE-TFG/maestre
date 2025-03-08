"use client";
import { useEffect, useState } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import { IconBrandGithub, IconMail } from "@tabler/icons-react";
import { CardCarrousell } from "@/components/card-carrousell";
import Image from "next/image";

const Home = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/profile/signup');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);


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
      <div className="relative my-8" style={{ height: "2000px" }}></div>
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center relative z-20">
        <Image
          src={theme === "dark" ? "/static/maestre_logo_circle_black.png" : "/static/maestre_logo_circle.png"}
          alt="Maestre Logo"
          width={256}
          height={256}
          className="mb-8"
        />
        <h1 className={`text-6xl font-bold mb-4 font-alfa-slab-one ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          MAESTRE
        </h1>
        <p className={`text-xl mb-8 max-w-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Empowering educators with intelligent tools for seamless teaching and assessment
        </p>
      </section>

      <br></br>

      {/* Tools Carousel */}
      <section className="w-full relative z-10 max-h-[500px]">
        <CardCarrousell />
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 font-alfa-slab-one">
            Ready to Transform Your Teaching?
          </h2>
          <button
            onClick={() => router.push('/profile/signin')}
            className={`px-8 py-4 rounded-lg text-lg font-bold transition-all ${
              theme === 'dark' 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Sign in as a Teacher
          </button>
        </section>
      )}

      <div className="relative my-8" style={{ height: "500px" }}></div>

      {/* Team Section */}
      <section className="py-20 px-4">
        <h2 className={`text-4xl font-bold text-center mb-12 font-alfa-slab-one ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          Meet Our Team
        </h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member) => (
            <div key={member.name} className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100'}`}>
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
          <p>© 2025 Maestre. All rights reserved.</p>
          <p className="mt-2">Licensed under MIT License</p>
        </div>
      </footer>
    </div>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={Home} />;
}


