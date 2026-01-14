"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";

// Track Meta Pixel events
const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
};

// Track Quiz Started event
const trackQuizStarted = () => {
  trackEvent('Lead', { content_name: 'Quiz Started' });
  // Also track custom event for more granular tracking
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', 'QuizStarted');
  }
};

// Icon Components
const Icons = {
  verified: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  ),
  arrowForward: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
  ),
  star: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  ),
  menu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  ),
  close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  lightbulb: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M12 .75a8.25 8.25 0 00-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 00.577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 01-.937-.171.75.75 0 11.374-1.453 5.261 5.261 0 002.626 0 .75.75 0 11.374 1.452 6.712 6.712 0 01-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 00.577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0012 .75z" />
      <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 01.877-.597 11.319 11.319 0 004.22 0 .75.75 0 11.28 1.473 12.819 12.819 0 01-4.78 0 .75.75 0 01-.597-.876zM9.754 22.344a.75.75 0 01.824-.668 13.682 13.682 0 002.844 0 .75.75 0 11.156 1.492 15.156 15.156 0 01-3.156 0 .75.75 0 01-.668-.824z" clipRule="evenodd" />
    </svg>
  ),
  psychology: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M11.25 3v4.046a3 3 0 00-4.277 4.204H3.5a.75.75 0 00-.75.75v6.75c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H5.927a1.5 1.5 0 012.948-.525A3 3 0 0012 15a3 3 0 003.125-2.775 1.5 1.5 0 012.948.525h-2.073a.75.75 0 00-.75.75v5.25c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75h-3.473a3 3 0 00-4.277-4.204V3a.75.75 0 00-1.5 0z" />
    </svg>
  ),
  expandMore: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
    </svg>
  ),
  instagram: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
    </svg>
  ),
};

function WelcomePageContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track Content View on page load
  useEffect(() => {
    trackEvent('ViewContent', { content_name: 'Welcome Page' });
  }, []);

  return (
    <div className="bg-background-light text-text-light font-body transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-surface-light/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Image 
                src="/assets/clariomind.png" 
                alt="ClarioMind Logo" 
                width={160}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a className="text-sm font-medium text-text-muted-light hover:text-primary transition-colors" href="#how-it-works">
                How it Works
              </a>
              <a className="text-sm font-medium text-text-muted-light hover:text-primary transition-colors" href="#features">
                Features
              </a>
              <a className="text-sm font-medium text-text-muted-light hover:text-primary transition-colors" href="#faq">
                FAQ
              </a>
              <div className="h-6 w-px bg-gray-200"></div>
              <Link className="text-sm font-medium text-primary hover:text-primary-dark" href="/auth/login">
                Log in
            </Link>
              <Link 
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40" 
                href="/quiz"
                onClick={trackQuizStarted}
              >
                Take the Quiz
            </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                className="text-text-light p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <Icons.close /> : <Icons.menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface-light border-t border-gray-100">
            <div className="px-4 py-4 space-y-4 text-center">
              <a 
                className="block text-sm font-medium text-text-muted-light hover:text-primary py-2" 
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </a>
              <a 
                className="block text-sm font-medium text-text-muted-light hover:text-primary py-2" 
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                className="block text-sm font-medium text-text-muted-light hover:text-primary py-2" 
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <hr className="border-gray-200" />
              <Link 
                className="block text-sm font-medium text-primary py-2" 
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link 
                className="block w-full text-center bg-primary text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg shadow-primary/25" 
                href="/quiz"
                onClick={() => {
                  setMobileMenuOpen(false);
                  trackQuizStarted();
                }}
              >
                Take the Quiz
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center pt-20 overflow-hidden bg-background-light">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          >
            <source src="/assets/Clario-banner.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-background-light/60 via-background-light/30 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 w-full">
          <div className="max-w-3xl lg:max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/40 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up">
              <Icons.verified />
              Neuroscience-backed. Evidence-based.
      </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-8 text-text-light leading-[1.05]">
              Build Healthier <br className="hidden sm:block" />
              <span className="text-primary">Drinking Habits.</span>
        </h1>

            <p className="mt-8 text-lg sm:text-xl text-text-muted-light leading-relaxed max-w-xl">
              Use neuroscience to reframe your relationship with alcohol. Unlock your healthiest, happiest self without rigid rules or judgment.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
              <Link 
                className="w-full sm:w-auto px-10 py-4 sm:py-5 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-lg shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-3" 
                href="/quiz"
                onClick={trackQuizStarted}
              >
                Start Your Journey
                <Icons.arrowForward />
            </Link>

              <div className="flex items-center gap-5 px-4 w-full sm:w-auto justify-center sm:justify-start">
                <div className="flex -space-x-3">
                  {[
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuC1-taOqjPNtacAjOTfCyhhq7CEkSiz67G7fry1B1lj8V3GBJ-xOUK-40gpZgXxzbIzXqu44XYdLoPDL0P0o2BIf7h0jVgD6JOtCFSlMrnISGXDB2VvaGrQ28J52hlgodRwv0rC8hXjIRw99dI_3vi7nBq70cHe6y2FlCUsMt2uSLaYxF4RANylrXxvlYagkE4fzh4eJqk44A1D_z7AK5fMm6-aPLcIZuTa5l91HgkAevKq46oiKhWYC90xCK9gmDtjrJ2bznclSMlx",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCjjhJboYBmsnSru86wozTU8h557cKg01pwwziJZ5d_HYpoI6tfmFLnjwwRqg3zjcdMNIW0P9nS_q0fWLirX0V7DlaX91Pt4kHtyuL9HKRIVi5Glhauqj_eK4BAgL2QC2Ik_4e3915zCotOWzrSMxQdj1TTgvlP9zZs9HODF7bxlggp3hgCACBipYljKv9C2N_Wzvgd5BsJ2WMxp9xGrk4fZmy8KLqhBpgoHKnZHbX2UwfFdZd4TIjeImnpnKI581MnLPd_iyLfK45O",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAs0tCnvOMuHQPqqd75MRFGEbCRc3qfvLofFn6pwJq3yP9fHm8oCBFv0LlxasDwcXwuf61w42IQNjMpakV75fijmJn6dTmNJPcE7R4kU28oUh1rpfVv3HtF5TZEMNdz0HEt0Oesq1CpWL0FFc_MU2flqvohjh3ZQiaxlIib9BX76Vo-f7IZDNCUNKP9f-v4mhz8mm0x4AFGKR-dQBFCBtWj01FXPqtgOq1xpDzRiHtXlskgOXnyqXVWXv5JTafLCemfcsK5R1NR4yK4"
                  ].map((src, i) => (
                    <Image 
                      key={i}
                      alt="User" 
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
                      src={src}
                      width={40}
                      height={40}
                    />
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-text-light text-sm">10k+ Trusted Users</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Icons.star key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl sm:text-5xl font-display font-bold text-primary mb-2">80%</div>
              <div className="text-text-muted-light font-medium">See reduced alcohol use within 2 months</div>
            </div>
            <div className="p-4 border-l-0 md:border-l border-gray-100">
              <div className="text-4xl sm:text-5xl font-display font-bold text-primary mb-2">52k</div>
              <div className="text-text-muted-light font-medium">Professionals currently enrolled</div>
            </div>
            <div className="p-4 border-l-0 md:border-l border-gray-100">
              <div className="text-4xl sm:text-5xl font-display font-bold text-primary mb-2">1M+</div>
              <div className="text-text-muted-light font-medium">Drinks eliminated in the last year</div>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-12 sm:py-20 bg-background-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden flex flex-col lg:flex-row items-center gap-10">
            <div className="relative z-10 flex-1 w-full text-center lg:text-left">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                Your Daily Companion
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-light mb-4">
                Track your progress every day.
              </h2>
              <p className="text-text-muted-light text-base sm:text-lg mb-6 max-w-2xl mx-auto lg:mx-0">
                Get personalized daily tasks, micro-lessons, and track your alcohol-free journey with our intuitive dashboard. Watch your streak grow as you build healthier habits.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-sm font-medium text-text-muted-light">Daily lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-sm font-medium text-text-muted-light">Progress tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-sm font-medium text-text-muted-light">Personalized tasks</span>
                </div>
              </div>
              <Link 
                href="/quiz"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 sm:py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold text-base transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
                onClick={trackQuizStarted}
              >
                Start Your Journey
                <Icons.arrowForward />
              </Link>
            </div>

            {/* Phone Mockup */}
            <div className="w-full lg:w-auto relative z-10 flex justify-center mt-8 lg:mt-0">
              <div className="relative w-[240px] sm:w-[280px] h-[480px] sm:h-[560px]">
                <Image
                  src="/assets/app-mockup.png"
                  alt="ClarioMind App Dashboard"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-text-light mb-6">
              We do science, not <span className="text-primary">stigma</span>.
            </h2>
            <p className="text-base sm:text-lg text-text-muted-light max-w-2xl mx-auto">
              Developed with hundreds of medical and mental health experts, ClarioMind is a revolutionary alcohol habit-change app built for the modern professional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-background-light rounded-3xl p-6 sm:p-12 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Icons.lightbulb />
                </div>
                <h3 className="text-2xl font-bold text-text-light mb-4">Evidence-Based Reduction</h3>
                <p className="text-text-muted-light leading-relaxed mb-8">
                  Our exclusive program is developed by leading experts in the fields of mental health and medicine. No fluff, just science.
                </p>
              </div>
              <div className="relative aspect-video rounded-2xl border border-gray-200 p-4 shadow-sm overflow-hidden">
                <Image
                  src="/assets/evidence-based-reduction.png"
                  alt="Evidence Based Reduction"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="bg-background-light rounded-3xl p-6 sm:p-12 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Icons.psychology />
                </div>
                <h3 className="text-2xl font-bold text-text-light mb-4">Personalized Control</h3>
                <p className="text-text-muted-light leading-relaxed mb-8">
                  The only platform that utilizes neuroscience to tailor the experience to your unique triggers and lifestyle.
                </p>
              </div>
              <div className="relative aspect-video rounded-2xl border border-gray-200 p-4 shadow-sm overflow-hidden">
                <Image
                  src="/assets/personalized-control.png"
                  alt="Personalized Control"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-background-light" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div className="order-2 md:order-1 relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-surface-light aspect-[9/19] w-full max-w-[300px] sm:max-w-none max-h-[500px] sm:max-h-[600px] mx-auto">
              <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                <source src="/assets/animation.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="order-1 md:order-2 text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-light mb-6">
                How ClarioMind Works
              </h2>
              <p className="text-base sm:text-lg text-text-muted-light mb-8 sm:mb-12">
                Three simple steps to regain your power, backed by cognitive behavioral therapy.
              </p>

              <div className="space-y-8 sm:space-y-10">
                {[
                  {
                    num: "01",
                    title: "We get to know you",
                    text: "Tell us about your triggers, your goals, and what's been holding you back through our comprehensive assessment."
                  },
                  {
                    num: "02",
                    title: "Daily 5-minute Lessons",
                    text: "Short, practical lessons about the neuroscience of habits tailored to your profile. Learn why you drink, not just that you shouldn't."
                  },
                  {
                    num: "03",
                    title: "Track & Transform",
                    text: "See your progress in real-time. Celebrate the wins. Watch your life change as data proves your transformation."
                  }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-lg">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-light mb-2">{step.title}</h3>
                      <p className="text-text-muted-light leading-relaxed">
                        {step.text}
                      </p>
                  </div>
                </div>
              ))}
        </div>

              <div className="mt-10 sm:mt-12">
                <Link 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 sm:py-4 border border-transparent text-sm sm:text-base font-medium rounded-full text-white bg-primary hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25" 
                  href="/quiz"
                  onClick={trackQuizStarted}
                >
                  See How It Works
                  <Icons.arrowForward />
              </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="py-16 sm:py-24 bg-surface-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-light mb-4">
              What You&apos;ll Get Inside
            </h2>
            <p className="text-text-muted-light">A comprehensive toolkit for your journey.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                img: "/assets/daily-micro-lessons.jpeg",
                title: "Daily Micro-Lessons",
                text: "Understand how alcohol affects your brain and why changing creates lasting transformation."
              },
              {
                img: "/assets/community.jpeg",
                title: "24/7 Anonymous Community",
                text: "Connect with thousands on the same path. Celebrate wins, get support during tough moments."
              },
              {
                img: "/assets/smart-tracking.jpeg",
                title: "Smart Tracking",
                text: "Monitor your progress in real-time. Log drinks without resetting your start date because slips happen."
              }
            ].map((item, i) => (
              <div key={i} className="p-6 sm:p-8 bg-background-light rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-full h-40 rounded-lg mb-4 overflow-hidden relative">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-text-light mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted-light leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Image Section */}
      <section className="py-8 sm:py-12 bg-background-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative aspect-video sm:aspect-[16/9]">
            <Link href="/quiz" onClick={trackQuizStarted}>
              <Image
                src="/assets/your-why-is-your-power.jpeg"
                alt="Your Why is Your Power"
                fill
                className="object-cover"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 bg-white" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-light text-center mb-8 sm:mb-12">
            Frequently Asked Questions
            </h2>

          <div className="space-y-4">
            <FAQItem 
              question="Who is ClarioMind for?"
              answer="ClarioMind is designed for high-functioning professionals who want to change their relationship with alcohol. Whether you want to cut back or quit entirely, our tools adapt to your goals."
            />
            <FAQItem 
              question="How is ClarioMind different from other sobriety apps?"
              answer="Unlike traditional AA or willpower-based methods, we use neuroscience and cognitive behavioral therapy (CBT) techniques. We don't demand labels like &quot;alcoholic&quot; and we focus on the underlying habits."
            />
            <FAQItem 
              question='What if I&apos;m not sure I&apos;m a "high-functioning alcoholic"?'
              answer="You don't need a label to benefit. If alcohol is affecting your sleep, focus, or mood, or if you find yourself negotiating rules around drinking, ClarioMind can help you regain clarity."
            />
            <FAQItem 
              question="How is my data protected?"
              answer="Your privacy is our top priority. All data is encrypted and anonymized. We never share your personal information with employers or third parties."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-background-light relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-6xl font-display font-bold text-white mb-6">
                Ready to transform <br />your life?
            </h2>
              <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-10 max-w-2xl mx-auto">
                Join thousands of professionals who&apos;ve already started their journey with ClarioMind.
              </p>
              <Link 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 sm:py-5 bg-white text-primary hover:bg-gray-50 rounded-full font-bold text-sm sm:text-lg shadow-lg transition-all hover:-translate-y-1 gap-2 whitespace-nowrap" 
                href="/quiz"
                onClick={trackQuizStarted}
              >
                Start Your Journey To Recovery
                <Icons.arrowForward />
              </Link>
              <p className="mt-6 text-sm text-blue-200 opacity-80">
                No credit card required for initial assessment.
              </p>
              </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-light border-t border-gray-100 pt-16 sm:pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8">
              <Image 
                src="/assets/clariomind.png" 
                alt="ClarioMind Logo" 
                width={128}
                height={32}
                className="h-10 w-auto"
              />
            </div>
            
            <p className="text-text-muted-light text-base leading-relaxed max-w-md mb-8">
              The science-backed app for professionals looking to change their relationship with alcohol.
            </p>

            <div className="flex gap-4 mb-12">
              <a
                className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors"
                href="mailto:info@clariomind.com"
                aria-label="Contact Email"
              >
                <Icons.mail />
              </a>
              <a
                className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors"
                href="https://www.instagram.com/clariomindapp/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Icons.instagram />
              </a>
            </div>

            <div className="w-full pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-sm text-text-muted-light font-medium">
                © 2026 ClarioMind Inc. All rights reserved.
              </div>
              <div className="flex gap-8 text-sm">
                <Link className="text-text-muted-light hover:text-primary transition-colors font-medium" href="/privacy">Privacy</Link>
                <Link className="text-text-muted-light hover:text-primary transition-colors font-medium" href="/terms">Terms</Link>
                <a className="text-text-muted-light hover:text-primary transition-colors font-medium" href="#">Cookies</a>
              </div>
            </div>
          </div>
      </div>
      </footer>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-background-light rounded-xl border border-gray-100 overflow-hidden">
      <button 
        className="flex justify-between items-center font-medium cursor-pointer p-6 text-text-light hover:text-primary transition-colors w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="pr-4">{question}</span>
        <span className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <Icons.expandMore />
        </span>
      </button>
      {isOpen && (
        <div className="text-text-muted-light p-6 pt-0 leading-relaxed border-t border-gray-100 mt-2 bg-white/50">
          {answer}
        </div>
      )}
    </div>
  );
}

  export default function WelcomePage() {
    return (
    <Suspense fallback={<div className="min-h-screen bg-background-light" />}>
        <WelcomePageContent />
      </Suspense>
  );
  }
