"use client";
import { useEffect, useState } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

const Home = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      localStorage.removeItem('authToken');
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/profile/signup');
      return;
    }
  }, [router]);

  const tools = [
    { title: "Exam maker", category: "Category 1", content: "Create and manage exams with ease using our Exam Maker tool.", src: "/static/tools/exam_maker.webp" },
    { title: "Test Maker", category: "Category 2", content: "Generate tests quickly and efficiently with our Test Maker tool.", src: "/static/tools/test_maker.webp" },
    { title: "Planner", category: "Category 2", content: "Organize your tasks and schedule with our intuitive Planner tool.", src: "/static/tools/planner.webp" },
    { title: "Translator", category: "Category 2", content: "Translate text seamlessly with our powerful Translator tool.", src: "/static/tools/translator.webp" },
  ];

  return (
    <div className={`relative flex flex-col justify-center items-center py-8 sm:px-8 lg:px-8 overflow-auto ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="text-center my-10">
        <h1 className={`text-5xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>Welcome to MAESTRE</h1>
        <p className={`text-xl mt-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Your ultimate tool for managing tasks efficiently</p>
      </div>
      <MacbookScroll src="/static/to/maestre_logo_circle_black" showGradient={true} title="Application Preview" />
      <section className="my-10 w-full">
        <Carousel items={tools.map((tool, index) => (
          <Card key={index} card={tool} index={index} layout={true} />
        ))} />
      </section>
      <footer className={`py-4 mt-5 ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
        <hr className={`my-3 ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`} />
        <div className="container">
          <div className="row text-center text-md-start">
            <div className="col-md-4 mb-3">
              <img src="/path/to/logo.png" alt="Logo" className="img-fluid mb-2" style={{ maxWidth: "100px" }} />
              <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-dark"}`}>Explore the world of MAESTRE. Find information about tools, features, and more.</p>
            </div>
            <div className="col-md-4 mb-3">
              <h5 className={`text-uppercase ${theme === "dark" ? "text-gray-300" : "text-dark"}`}>Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="/" className={`text-decoration-none ${theme === "dark" ? "text-gray-300" : "text-dark"}`}>Home</a></li>
                <li><a href="/create" className={`text-decoration-none ${theme === "dark" ? "text-gray-300" : "text-dark"}`}>Create</a></li>
                <li><a href="/material" className={`text-decoration-none ${theme === "dark" ? "text-gray-300" : "text-dark"}`}>Material</a></li>
                <li><a href="/contact" className={`text-decoration-none ${theme === "dark" ? "text-gray-300" : "text-dark"}`}>Contact</a></li>
                <li><a href="/profile" className={`text-decoration-none ${theme === "dark" ? "text-gray-300" : "text-dark"}`}>Profile</a></li>
                <li><a href="/signout" className={`text-decoration-none ${theme === "dark" ? "text-gray-300" : "text-dark"}`}>Sign out</a></li>
              </ul>
            </div>
            <div className="col-md-4 mb-3 d-flex flex-column align-items-center">
              <h5 className={`text-uppercase ${theme === "dark" ? "text-gray-300" : "text-dark"}`}>Contact</h5>
              <div className="row text-center text-md-start">
                <a className="social-link" href="https://github.com/maestre-tfg" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" fill={theme === "dark" ? "white" : "black"} height="1em" viewBox="0 0 496 512">
                    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
                  </svg>
                </a>
                <a className="social-link" href="https://www.linkedin.com/in/antoniommff" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill={theme === "dark" ? "white" : "black"}>
                    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                  </svg>
                </a>
                <a className="social-link" href="https://bento.me/antoniommff" target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill={theme === "dark" ? "white" : "black"}>
                    <path d="M502.61,233.32,278.68,9.39a32,32,0,0,0-45.25,0L9.39,233.32a32,32,0,0,0,0,45.25L233.32,502.61a32,32,0,0,0,45.25,0L502.61,278.68A32,32,0,0,0,502.61,233.32ZM256,352a96,96,0,1,1,96-96A96.11,96.11,0,0,1,256,352ZM256,192a64,64,0,1,0,64,64A64.07,64.07,0,0,0,256,192Z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <hr className={`my-3 ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`} />
          <div className="text-center">
            <p className={`mb-0 ${theme === "dark" ? "text-gray-300" : "text-dark"}`}>2025 © MAESTRE</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function Main() {
  return <SidebarDemo ContentComponent={Home} />;
}
