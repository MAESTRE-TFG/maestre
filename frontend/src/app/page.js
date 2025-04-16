"use client";
import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IconBrandGithub, IconMail, IconArrowDown, IconChevronRight, IconSparkles, IconSchool, IconBooks } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import Image from "next/image";

const CardCarrousell = dynamic(() => import("@/components/card-carrousell").then(mod => ({ default: mod.CardCarrousell })), {
  loading: () => <div className="h-96 flex items-center justify-center">Loading tools...</div>,
  ssr: false
});


const PlaceholderSection = () => (
  <div className="w-full h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse">
    Loading content...
  </div>
);

const Home = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef(null);
  const featuresRef = useRef(null);
  const demoSectionRef = useRef(null);
  const videoObserverRef = useRef(null);

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
    videoObserverRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVideoVisible(entry.isIntersecting);
      },
      { threshold: 0.5, rootMargin: "100px" }
    );

    if (videoRef.current) {
      videoObserverRef.current.observe(videoRef.current);
    }

    return () => {
      if (videoObserverRef.current && videoRef.current) {
        videoObserverRef.current.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVideoVisible && videoRef.current) {
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoPlaying(true);
          })
          .catch(error => {
            console.log("Autoplay prevented:", error);
            setVideoPlaying(false);
          });
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
      setVideoPlaying(false);
    }
  }, [isVideoVisible]);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDemoSection = () => {
    demoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const teamMembers = [
    {
      name: "Antonio Macías",
      role: "Software Engineer, Project Manager",
      image: "/static/team/antonio.webp",
      github: "https://github.com/antoniommff",
      email: "mailto:antmacfer1@alum.us.es",
      bio: "Spearheading the frontend development and user experience design for Maestre's educational tools."
    },
    {
      name: "Rafael Pulido",
      role: "Software Engineer, Analyst",
      image: "/static/team/rafa.webp",
      github: "https://github.com/rafpulcif",
      email: "mailto:rafpulcif@alum.us.es",
      bio: "Leading the technical architecture and backend development of Maestre's innovative education platform."
    }
  ];

  const features = [
    {
      icon: <IconSchool className="w-12 h-12" style={{color: 'rgb(25,65,166)'}} />,
      title: "Step 1: Create & Manage Classes",
      description: "Set up your virtual classroom environment by creating and organizing classes for different subjects and student groups."
    },
    {
      icon: <IconBooks className="w-12 h-12" style={{color: 'rgb(25,65,166)'}} />,
      title: "Step 2: Add Your Materials",
      description: "Upload your existing documents, presentations, and teaching resources to build a personalized content library for each class."
    },
    {
      icon: <IconSparkles className="w-12 h-12" style={{color: 'rgb(25,65,166)'}} />,
      title: "Step 3: Generate with AI",
      description: "Use our AI tools to transform your materials into lesson plans, assessments, and activities tailored to your teaching style and curriculum."
    }
  ];

  const textColor = theme === 'dark' ? 'text-white' : 'text-black';
  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-white';
  const subtleTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
  const accentColor = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
  const sectionBgColor = theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50';
  const highlightColor = theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100/50';
  const subtleBgColor = theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100';
  const borderColor = theme === 'dark' ? 'border-neutral-700' : 'border-gray-200';
  const hoverColor = theme === 'dark' ? 'hover:text-white' : 'hover:text-black';

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

    {/* Hero Section */}
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-16">
      {/* Background layer */}
      <div className="absolute inset-0 w-full h-full z-10"></div>
      <Image
        src={theme === "dark" ? "/static/teachers/teachers_dark.webp" : "/static/teachers/teachers.webp"}
        alt="Teachers background"
        layout="fill"
        objectFit="cover"
        className="absolute w-full h-full"
        priority // Mark as priority since it's above the fold
        quality={80} // Slightly reduced quality to improve load time
      />
    
      {/* Main content */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="container mx-auto px-4 relative z-20 text-center"
      >
        <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 pt-12">
          
          <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-[-200px]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          >
          <div>
            <Image
            src="/static/maestrito/maestrito_jump_transparent.webp"
            alt="Maestre Logo"
            width={250}
            height={250}
            sizes="100vw"
            className="w-full h-auto"
            priority
            />
          </div>
        
            <h1
              className={cn(
                "text-4xl sm:text-6xl md:text-8xl font-bold font-alfa-slab-one tracking-widest text-center sm:text-left",
                "text-white drop-shadow-[0_0.05em_0_rgba(25,65,166,1)]",
                "transform-gpu rotate-1 transition-transform",
                "relative before:content-['MAESTRE'] before:absolute before:left-0 before:top-0",
                "before:text-transparent before:webkit-text-stroke-[6px] before:webkit-text-stroke-color-[rgba(25,65,166,0.7)]",
                "before:z-[-1] before:translate-x-1 before:translate-y-1"
              )}
            >
              MAESTRE
            </h1>
          </motion.div>
            
          <br></br>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex justify-center mt-30"
          >
            <motion.button
              onClick={() => router.push('/tools')}
              whileHover={{ 
                scale: 1.05,
                y: -5
              }}
              className={cn(
                "px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center",
                theme === "dark" 
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600" 
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
                "shadow-lg hover:shadow-xl"
              )}
            >
              Discover the AI tools
              <IconChevronRight className="ml-2 w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          fill={theme === "dark" ? "black" : "rgba(255, 255, 255)"}
          preserveAspectRatio="none"
          className="block w-full h-[120px]"
        >
          <path d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>

    {/* Introduction Section */}
    <section className={`py-24 ${bgColor} relative`}>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className={`text-4xl md:text-5xl font-bold ${textColor} font-alfa-slab-one mb-8`}>
            Reimagining education with intelligence
          </h2>
          <p className={`text-xl ${subtleTextColor} max-w-3xl mx-auto mb-12 leading-relaxed`}>
            Maestre combines cutting-edge artificial intelligence with pedagogical expertise 
            to create tools that enhance teaching and elevate student learning experiences.
          </p>
        </motion.div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          fill={theme === "dark" ? "rgb(23, 23, 23)" : "rgb(248, 250, 252)"}
          preserveAspectRatio="none"
          className="block w-full h-[120px]"
        >
          <path d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>

    {/* Feature Showcase */}
    <section ref={featuresRef} className={`py-24 ${sectionBgColor} relative`}>
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
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        {theme !== 'dark' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="block w-full h-[120px]"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.05)" />
              </linearGradient>
            </defs>
            <path 
              d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              fill="url(#waveGradient)"
            />
          </svg>
        )}
      </div>
    </section>

    {/* Demo Video */}
    <section ref={demoSectionRef} className={`py-32 ${bgColor} overflow-hidden relative`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
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
              muted
              preload="none" // Don't preload video data
              loading="lazy"
            >
              <source src="/static/demo_1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Tools Showcase */}
    <section className={`py-32 ${sectionBgColor} relative`}>
      
      <div className="container mx-auto px-4 relative z-10">
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
        <Suspense fallback={<PlaceholderSection />}>
        <CardCarrousell />
        </Suspense>
      </motion.div>
      </div>

    </section>

    {/* CTA Section */}
    {!isAuthenticated && (
      <section className={`py-32 ${bgColor} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
      
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
            onClick={() => router.push('/profile/signup')}
            className={cn(
            "btn btn-lg btn-contrast px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center",
            theme === "dark" 
              ? "bg-white text-black hover:bg-gray-200" 
              : "bg-black text-white hover:bg-gray-800",
            "shadow-lg hover:shadow-xl"
            )}
          >
            Sign up as a Teacher
            <IconChevronRight className="ml-2 w-5 h-5" />
          </button>
          <button
            onClick={() => router.push('/tools')}
            className="btn btn-md btn-secondary font-medium transition-all duration-300 flex items-center justify-center border border-current hover:bg-gray-100/10"
          >
            Learn more
          </button>
          </div>
          <div className="mt-6">
          <p className={`${subtleTextColor} text-xl mb-10 leading-relaxed`}>
            Already have an account?{" "}
            <button
            onClick={() => router.push('/profile/signin')}
            className={`underline ${accentColor} hover:${hoverColor} transition-colors duration-300`}
            >
            Sign in here
            </button>
          </p>
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
            src="/static/teachers/anonymous_teacher.webp"
            alt="Join Maestre" 
            layout="fill"
            objectFit="contain"
            className="rounded-xl"
            loading="lazy"
          />
          </div>
        </motion.div>
        </div>
      </div>
      </section>
    )}

    <section className={`py-32 ${sectionBgColor} relative`}>
      
      <div className="container mx-auto px-4 relative">
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
                    loading="lazy"
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
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        {theme !== 'dark' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="block w-full h-[120px]"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.05)" />
              </linearGradient>
            </defs>
            <path 
              d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              fill="url(#waveGradient)"
            />
          </svg>
        )}
      </div>
    </section>

    {/* Testimonial Section */}
    <section className={`py-32 ${bgColor} relative`}>
      {/* Added gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
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
                    src="/static/teachers/anonymous_teacher.webp" 
                    alt="Teacher testimonial" 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                    loading="lazy"
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
                  <h4 className={`text-xl font-medium ${textColor}`}>Rafael Pulido</h4>
                  <p className={subtleTextColor}>High School Geography and History teacher, Seville</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          fill={theme === "dark" ? "black" : "rgb(248, 250, 252)"}
          preserveAspectRatio="none"
          className="block w-full h-[120px]"
        >
          <path d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>

    {/* Footer */}
    <footer className={`${bgColor} pt-24 pb-12 relative`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
      
      <div className="container mx-auto px-6 mb-20 relative z-10">
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
              src={theme === "dark" ? "/static/logos/maestre_logo_white_transparent.webp" : "/static/logos/maestre_logo_blue_transparent.webp"}
              alt="Maestre Logo"
              width={48}
              height={48}
              className="rounded-xl"
            />
            <h3
              className={`text-2xl font-bold ml-3`}
              style={{
                fontFamily: "'Alfa Slab One', sans-serif",
                color: theme === 'dark' ? 'text-white' : 'rgb(25,65,166)',
              }}
            >
              MAESTRE
            </h3>
          </div>
          
          <div className="flex gap-6 items-center">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16 max-w-6xl mx-auto">
          <div className="text-center sm:text-left lg:col-span-1">
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-5 ${textColor}`}>About</h4>
            <ul className="space-y-3">
              <li><a href="/about" target="_blank" rel="noopener noreferrer" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Our Mission</a></li>
              <li><a href="/team" target="_blank" rel="noopener noreferrer" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Our Team</a></li>
              <li><a href="/careers" target="_blank" rel="noopener noreferrer" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Careers</a></li>
              <li><a href="/press" target="_blank" rel="noopener noreferrer" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Press Kit</a></li>
            </ul>
          </div>

          <div className="text-center sm:text-left lg:col-span-1">
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-5 ${textColor}`}>Legal</h4>
            <ul className="space-y-3">
              <li><a href="/terms" target="_blank" rel="noopener noreferrer" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Terms of Service</a></li>
              <li><a href="/privacy" target="_blank" rel="noopener noreferrer" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Privacy Policy</a></li>
              <li><a href="/cookies" target="_blank" rel="noopener noreferrer" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Cookie Policy</a></li>
              <li><a href="/security" target="_blank" rel="noopener noreferrer" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Security</a></li>
            </ul>
          </div>

          <div className="text-center sm:text-left lg:col-span-1">
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-5 ${textColor}`}>Products</h4>
            <ul className="space-y-3">
              <li><a href="/tools/lesson-creator" target="_blank" rel="noopener noreferrer" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Lesson Creator</a></li>
              <li><a href="/tools/assessment" target="_blank" rel="noopener noreferrer" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Assessment Builder</a></li>
              <li><a href="/tools/curriculum" target="_blank" rel="noopener noreferrer" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Curriculum Planner</a></li>
              <li><a href="/pricing" target="_blank" rel="noopener noreferrer" className={`${subtleTextColor} ${hoverColor} transition-colors duration-300 text-sm`}>Pricing</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className={`pt-8 border-t ${borderColor} flex flex-col md:flex-row justify-between items-center`}>
          <div className="flex items-center mb-4 md:mb-0">
            <p className={`${subtleTextColor} text-sm`}>© 2025 Maestre. Under MIT License.</p>
          </div>
          
          <div className="flex gap-6 items-center">
            
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