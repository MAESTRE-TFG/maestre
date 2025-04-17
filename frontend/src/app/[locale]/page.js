"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IconBrandGithub, IconMail, IconChevronRight, IconSparkles, IconSchool, IconBooks } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { Footer } from "@/components/footer";

const CardCarrousell = dynamic(() => import("@/components/card-carrousell").then(mod => ({ default: mod.CardCarrousell })), {
  loading: () => <div className="h-96 flex items-center justify-center">...</div>,
  ssr: false
});


const PlaceholderSection = () => (
  <div className="w-full h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse">
    {t('loading')}
  </div>
);

// Update the Home component definition
const Home = ({ params }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const locale = params?.locale || 'es';
  const t = useTranslations('HomePage');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef(null);
  const featuresRef = useRef(null);
  const demoSectionRef = useRef(null);
  const videoObserverRef = useRef(null);

  // Add the toggleLanguage function
  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'es' : 'en';
    const currentPath = window.location.pathname;
    
    // Get the path without the locale prefix
    const pathWithoutLocale = currentPath.replace(/^\/(en|es)/, '');
    
    // Navigate to the same page but with the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

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

  const teamMembers = [
    {
      name: "Antonio Macías",
      role: t('team_member_role_1'),
      image: "/static/team/antonio.webp",
      github: "https://github.com/antoniommff",
      email: "mailto:antmacfer1@alum.us.es",
      bio: t('team_member_bio_1')
    },
    {
      name: "Rafael Pulido",
      role: t('team_member_role_2'),
      image: "/static/team/rafa.webp",
      github: "https://github.com/rafpulcif",
      email: "mailto:rafpulcif@alum.us.es",
      bio: t('team_member_bio_2')
    }
  ];

  const features = [
    {
      icon: <IconSchool className="w-12 h-12" style={{color: 'rgb(25,65,166)'}} />,
      title: t('feature_title_1'),
      description: t('feature_description_1')
    },
    {
      icon: <IconBooks className="w-12 h-12" style={{color: 'rgb(25,65,166)'}} />,
      title: t('feature_title_2'),
      description: t('feature_description_2')
    },
    {
      icon: <IconSparkles className="w-12 h-12" style={{color: 'rgb(25,65,166)'}} />,
      title: t('feature_title_3'),
      description: t('feature_description_3')
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
        quality={80}
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
              {t('title')}
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
              onClick={() => router.push(`${locale}/tools`)}
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
              {t('main_button')}
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
            {t('subtitle')}
          </h2>
          <p className={`text-xl ${subtleTextColor} max-w-3xl mx-auto mb-12 leading-relaxed`}>
            {t('main_description')}
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
            {t('demo_title')}
          </h2>
          <p className={`text-xl ${subtleTextColor} max-w-3xl mx-auto`}>
            {t('demo_description')}
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
              {t('demo_video_unsupported')}
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
          {t('tools_title')}
        </h2>
        <p className={`text-xl ${subtleTextColor} max-w-3xl mx-auto`}>
          {t('tools_description')}
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
            {t('cta_title')}
          </h2>
          <p className={`${subtleTextColor} text-xl mb-10 leading-relaxed`}>
            {t('cta_description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push(`${locale}/profile/signup`)}
            className={cn(
            "btn btn-lg btn-contrast px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-center",
            theme === "dark" 
              ? "bg-white text-black hover:bg-gray-200" 
              : "bg-black text-white hover:bg-gray-800",
            "shadow-lg hover:shadow-xl"
            )}
          >
            {t('signup_button')}
            <IconChevronRight className="ml-2 w-5 h-5" />
          </button>
          <button
            onClick={() => router.push(`${locale}/tools`)}
            className="btn btn-md btn-secondary font-medium transition-all duration-300 flex items-center justify-center border border-current hover:bg-gray-100/10"
          >
            {t('learn_more_button')}
          </button>
          </div>
          <div className="mt-6">
          <p className={`${subtleTextColor} text-xl mb-10 leading-relaxed`}>
            {t('existing_acc_button')}{" "}
            <button
            onClick={() => router.push(`${locale}/profile/signin`)}
            className={`underline ${accentColor} hover:${hoverColor} transition-colors duration-300`}
            >
            {t('signin_button')}
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
            {t('team_title')}
          </h2>
          <p className={`text-xl ${subtleTextColor} max-w-3xl mx-auto`}>
            {t('team_description')}
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
                  {t('testimonial_text')}
                </p>
                <div>
                  <h4 className={`text-xl font-medium ${textColor}`}>{t('testimonial_author')}</h4>
                  <p className={subtleTextColor}>{t('testimonial_job')}</p>
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
          fill={theme === "dark" ? "black" : "rgb(255, 255, 255)"}
          preserveAspectRatio="none"
          className="block w-full h-[120px]"
        >
          <path d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>

    {/* Footer - replaced with component */}
    <Footer locale={locale} toggleLanguage={toggleLanguage} />
    
  </div>
);
};


export default function Main({ params }) {
  return <SidebarDemo ContentComponent={Home} params={params} />;
}