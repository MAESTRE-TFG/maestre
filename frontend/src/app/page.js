"use client";
import { useEffect, useState, useRef } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IconBrandGithub, IconMail, IconArrowDown, IconChevronRight, IconDeviceLaptop, IconPencil, IconNotebook, IconBrandApple } from "@tabler/icons-react";
import { CardCarrousell } from "@/components/card-carrousell";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Home = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (!user || !token) {
      setIsAuthenticated(false);
      return;
    }
    
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    // Intersection Observer for video autoplay when in view
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && videoRef.current) {
          videoRef.current.play();
          setVideoPlaying(true);
        } else if (videoRef.current) {
          videoRef.current.pause();
          setVideoPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const teamMembers = [
    {
      name: "Antonio Macías",
      role: "Software Engineer",
      image: "/static/team/antonio.webp",
      github: "https://github.com/antoniommff",
      email: "mailto:antmacfer1@alum.us.es",
      bio: "Leading the technical architecture and backend development of Maestre's innovative education platform."
    },
    {
      name: "Rafael Pulido",
      role: "Software Engineer",
      image: "/static/team/rafa.webp",
      github: "https://github.com/rafpulcif",
      email: "mailto:rafpulcif@alum.us.es",
      bio: "Spearheading the frontend development and user experience design for Maestre's educational tools."
    }
  ];

  const features = [
    {
      icon: <IconDeviceLaptop className="w-12 h-12" />,
      title: "Interactive Lessons",
      description: "Create dynamic, engaging lessons that adapt to student needs with our intelligent content generation tools."
    },
    {
      icon: <IconPencil className="w-12 h-12" />,
      title: "Assessment Builder",
      description: "Design comprehensive assessments in minutes with customizable templates and automatic grading capabilities."
    },
    {
      icon: <IconNotebook className="w-12 h-12" />,
      title: "Curriculum Planning",
      description: "Develop structured, standards-aligned curriculum plans with our AI-powered educational framework."
    }
  ];

  const textColor = theme === 'dark' ? 'text-white' : 'text-black';
  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-white';
  const subtleTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
  const accentColor = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
  const sectionBgColor = theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50';
  const highlightColor = theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100/50';
  // Add these missing variable definitions near the other theme-related variables
  const subtleBgColor = theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100';
  const borderColor = theme === 'dark' ? 'border-neutral-700' : 'border-gray-200';
  const hoverColor = theme === 'dark' ? 'hover:text-white' : 'hover:text-black';

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className={`min-h-screen w-full ${bgColor} ${textColor}`}>
      {/* Hero Section - Full-height with video background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full bg-black/10 z-10"></div>
        <Image
          src="/static/teachers/teachers.webp"
          alt="Teachers background"
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full"
        />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="container mx-auto px-4 relative z-20 text-center"
        >
          <div className="space-y-8 max-w-4xl mx-auto">
            <motion.div 
              className="flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Image
                src={"/static/maestrito/maestrito_jump_transparent.webp"}
                alt="Maestre Logo"
                width={300}
                height={300}
                className="rounded-xl"
              />
              <h1 className="text-6xl md:text-8xl font-bold ml-4 text-white font-alfa-slab-one tracking-tight" style={{WebkitTextStroke: '2px #015fc1'}}>
                MAESTRE
              </h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-3xl font-light text-white max-w-3xl mx-auto tracking-wide"
            >
              Reimagining education with intelligent tools for the modern classroom
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <button 
                onClick={() => router.push('/tools')}
                className="mt-8 px-8 py-4 bg-white text-black rounded-full text-lg font-medium flex items-center mx-auto hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-200/50"
              >
                Discover our AI tools!
              </button>
            </motion.div>
          </div>
        </motion.div>
        
        <div className="absolute bottom-10 w-full flex justify-center z-20">
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            onClick={scrollToFeatures}
            className="cursor-pointer"
          >
            <IconArrowDown className="h-8 w-8 text-white" />
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className={`py-24 ${bgColor}`} ref={featuresRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            className="max-w-5xl mx-auto text-center"
          >
            <h2 className={`text-4xl md:text-5xl font-bold ${textColor} font-alfa-slab-one mb-8`}>
              Transforming Education Through Technology
            </h2>
            <p className={`text-xl ${subtleTextColor} max-w-3xl mx-auto mb-12 leading-relaxed`}>
              Maestre combines cutting-edge artificial intelligence with pedagogical expertise 
              to create tools that enhance teaching and elevate student learning experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase - Apple-style grid with icons */}
      <section className={`py-24 ${sectionBgColor}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeIn}
                className={`p-8 rounded-3xl ${highlightColor} backdrop-blur-sm flex flex-col items-center text-center`}
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  className={`mb-6 ${accentColor}`}
                >
                  {feature.icon}
                </motion.div>
                <h3 className={`text-2xl font-semibold mb-4 ${textColor}`}>{feature.title}</h3>
                <p className={`${subtleTextColor}`}>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Demo Video - Apple-style with play controls */}
      <section className={`py-32 ${bgColor} overflow-hidden`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold ${textColor} font-alfa-slab-one mb-6`}>
              See Maestre in Action
            </h2>
            <p className={`text-xl ${subtleTextColor} max-w-3xl mx-auto`}>
              Watch how our platform transforms lesson planning, assessment creation, 
              and classroom management in minutes.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl relative"
          >
            <div className="aspect-w-16 aspect-h-9 bg-black">
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                poster="/static/video-poster.jpg"
                controls
              >
                <source src="/static/demo_1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {!videoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.play();
                        setVideoPlaying(true);
                      }
                    }}
                    className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-110"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className={`py-8 px-6 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-medium ${textColor}`}>Maestre Demo</h3>
                  <p className={`${subtleTextColor}`}>See how teachers use Maestre to enhance their classroom</p>
                </div>
                <button className={`flex items-center ${accentColor} hover:underline`}>
                  Learn more
                  <IconChevronRight className="ml-1 w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Showcase - Improved carousel */}
      <section className={`py-32 ${sectionBgColor}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold ${textColor} font-alfa-slab-one mb-6`}>
              Explore our tools
            </h2>
            <p className={`text-xl ${subtleTextColor} max-w-3xl mx-auto`}>
              Discover our suite of intelligent educational tools designed to save time
              and enhance learning outcomes.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <CardCarrousell />
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Apple-style with device mockup */}
      {!isAuthenticated && (
        <section className={`py-32 ${bgColor} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className={`text-4xl md:text-5xl font-bold ${textColor} font-alfa-slab-one mb-6`}>
                  Ready to Transform Your Teaching?
                </h2>
                <p className={`${subtleTextColor} text-xl mb-10 leading-relaxed`}>
                  Join thousands of educators worldwide who are saving time and improving learning outcomes with Maestre's innovative tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => router.push('/profile/signin')}
                    className={cn(
                      "px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center",
                      theme === "dark" 
                        ? "bg-white text-black hover:bg-gray-200" 
                        : "bg-black text-white hover:bg-gray-800",
                      "shadow-lg hover:shadow-xl"
                    )}
                  >
                    Sign in as a Teacher
                    <IconChevronRight className="ml-2 w-5 h-5" />
                  </button>
                  <button
                    onClick={() => router.push('/about')}
                    className="px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center border border-current hover:bg-gray-100/10"
                  >
                    Learn more
                  </button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-[3/4] max-w-md mx-auto">
                  <Image 
                    src="/static/anonymous_teacher.webp"
                    alt="Maestre on iPad" 
                    layout="fill"
                    objectFit="contain"
                    className="rounded-xl"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Team Section - Enhanced with animations */}
      <section className={`py-32 ${sectionBgColor}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold ${textColor} font-alfa-slab-one mb-6`}>
              Meet Our Team
            </h2>
            <p className={`text-xl ${subtleTextColor} max-w-3xl mx-auto`}>
              The brilliant minds behind Maestre's innovative educational platform.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                variants={fadeIn}
                className={`transition-all duration-500 hover:scale-105`}
              >
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8">
                  <div className="relative w-48 h-48 md:w-40 md:h-40 flex-shrink-0">
                    <Image 
                      src={member.image} 
                      alt={member.name} 
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-medium mb-2 ${textColor}`}>
                      {member.name}
                    </h3>
                    <p className={`${accentColor} font-medium mb-4`}>
                      {member.role}
                    </p>
                    <p className={`${subtleTextColor} mb-6 leading-relaxed`}>
                      {member.bio}
                    </p>
                    <div className="flex gap-6">
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className={`${subtleTextColor} hover:${textColor} transition-colors duration-300`}>
                        <IconBrandGithub className="w-6 h-6" />
                      </a>
                      <a href={member.email} className={`${subtleTextColor} hover:${textColor} transition-colors duration-300`}>
                        <IconMail className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className={`py-32 ${bgColor}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className={`rounded-3xl overflow-hidden ${theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-50'} p-12`}>
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/3">
                  <div className="relative w-32 h-32 mx-auto md:mx-0">
                    <Image 
                      src="/static/anonymous_teacher.webp" 
                      alt="Teacher testimonial" 
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <svg className="h-12 w-12 text-gray-400 mb-6" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className={`text-2xl font-light italic mb-8 ${textColor}`}>
                    "Maestre has completely transformed my teaching workflow. I can create engaging lessons in minutes that used to take hours, and my students are more engaged than ever before."
                  </p>
                  <div>
                    <h4 className={`text-xl font-medium ${textColor}`}>Maria González</h4>
                    <p className={subtleTextColor}>High School Science Teacher, Barcelona</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Clean and minimal */}
      <footer className={`${bgColor} pt-24 pb-12`}>
      {/* Newsletter Section */}
      <div className="container mx-auto px-6 mb-20">
        <div className={`rounded-3xl ${subtleBgColor} p-12 md:p-16 flex flex-col md:flex-row gap-12 items-center justify-between`}>
          <div className="md:w-1/2">
            <h3 className={`text-3xl font-bold mb-4 ${textColor}`}>Stay up to date</h3>
            <p className={`${subtleTextColor} text-lg max-w-md`}>
              Get the latest news, resources and updates about Maestre's educational tools.
            </p>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <input
                type="email"
                placeholder="Enter your email"
                className={`px-6 py-4 rounded-full text-base flex-grow border ${borderColor} bg-transparent ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button className={`px-8 py-4 rounded-full text-base font-medium transition-all duration-300 whitespace-nowrap ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="container mx-auto px-6">
        {/* Logo and Social */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
          <div className="flex items-center mb-6 md:mb-0">
            <Image
              src={theme === "dark" ? "/static/logos/maestre_logo_dark.webp" : "/static/logos/maestre_logo_blue_transparent.webp"}
              alt="Maestre Logo"
              width={48}
              height={48}
              className="rounded-xl"
            />
            <h3 className={`text-2xl font-bold ml-3 ${textColor} font-alfa-slab-one`}>
              MAESTRE
            </h3>
          </div>
          
          <div className="flex gap-6 items-center">
            <a href="https://twitter.com/maestreapp" target="_blank" rel="noopener noreferrer" 
              className={`${subtleTextColor} ${hoverColor} transition-colors duration-300`}>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.059 10.059 0 01-3.102 1.185 4.92 4.92 0 00-8.38 4.482 13.952 13.952 0 01-10.15-5.144 4.924 4.924 0 001.523 6.574 4.872 4.872 0 01-2.23-.618v.06a4.923 4.923 0 003.95 4.823 4.94 4.94 0 01-2.224.084 4.93 4.93 0 004.6 3.42 9.88 9.88 0 01-6.102 2.105 9.94 9.94 0 01-1.173-.067 13.98 13.98 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.543z" />
              </svg>
            </a>
            <a href="https://github.com/MAESTRE-TFG" target="_blank" rel="noopener noreferrer" 
              className={`${subtleTextColor} ${hoverColor} transition-colors duration-300`}>
              <IconBrandGithub className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com/company/maestreapp" target="_blank" rel="noopener noreferrer" 
              className={`${subtleTextColor} ${hoverColor} transition-colors duration-300`}>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="https://youtube.com/maestreedtech" target="_blank" rel="noopener noreferrer" 
              className={`${subtleTextColor} ${hoverColor} transition-colors duration-300`}>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-5 ${textColor}`}>About</h4>
            <ul className="space-y-3">
              <li><a href="/about" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Our Mission</a></li>
              <li><a href="/team" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Our Team</a></li>
              <li><a href="/careers" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Careers</a></li>
              <li><a href="/press" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Press Kit</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-5 ${textColor}`}>Products</h4>
            <ul className="space-y-3">
              <li><a href="/tools/lesson-creator" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Lesson Creator</a></li>
              <li><a href="/tools/assessment-builder" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Assessment Builder</a></li>
              <li><a href="/tools/curriculum-planner" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Curriculum Planner</a></li>
              <li><a href="/pricing" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-5 ${textColor}`}>Resources</h4>
            <ul className="space-y-3">
              <li><a href="/blog" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Blog</a></li>
              <li><a href="/guides" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Guides</a></li>
              <li><a href="/webinars" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Webinars</a></li>
              <li><a href="/case-studies" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Case Studies</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-5 ${textColor}`}>Support</h4>
            <ul className="space-y-3">
              <li><a href="/help" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Help Center</a></li>
              <li><a href="/contact" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Contact Us</a></li>
              <li><a href="/community" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Community</a></li>
              <li><a href="/status" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>System Status</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-5 ${textColor}`}>Legal</h4>
            <ul className="space-y-3">
              <li><a href="/terms" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Terms of Service</a></li>
              <li><a href="/privacy" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Privacy Policy</a></li>
              <li><a href="/cookies" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Cookie Policy</a></li>
              <li><a href="/security" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Security</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className={`pt-8 border-t ${borderColor} flex flex-col md:flex-row justify-between items-center`}>
          <div className="flex items-center mb-4 md:mb-0">
            <p className={`${subtleTextColor} text-sm`}>© 2025 Maestre. All rights reserved.</p>
          </div>
          
          <div className="flex gap-6 items-center">
            <div className="flex items-center">
              <p className={`${subtleTextColor} text-sm mr-2`}>Region:</p>
              <button className={`flex items-center ${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>
                United States
                <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center">
              <p className={`${subtleTextColor} text-sm mr-2`}>Language:</p>
              <button className={`flex items-center ${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>
                English
                <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>

    
    </div>
  );
};


export default function Main() {
  return <SidebarDemo ContentComponent={Home} />;
}