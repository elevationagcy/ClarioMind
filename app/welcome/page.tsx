"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";

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
  globe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
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

  return (
    <div className="bg-background-light text-text-light font-body transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-surface-light/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="px-4 py-4 space-y-4">
              <a className="block text-sm font-medium text-text-muted-light hover:text-primary" href="#how-it-works">
                How it Works
              </a>
              <a className="block text-sm font-medium text-text-muted-light hover:text-primary" href="#features">
                Features
              </a>
              <a className="block text-sm font-medium text-text-muted-light hover:text-primary" href="#faq">
                FAQ
              </a>
              <hr className="border-gray-200" />
              <Link className="block text-sm font-medium text-primary" href="/auth/login">
                Log in
              </Link>
              <Link 
                className="block w-full text-center bg-primary text-white px-6 py-3 rounded-full text-sm font-semibold" 
                href="/quiz"
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-semibold mb-6 animate-fade-in-up">
              <Icons.verified />
              Neuroscience-backed. Evidence-based.
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-text-light leading-[1.1]">
              Build Healthier <br />
              <span className="text-primary">Drinking Habits.</span>
            </h1>

            <p className="mt-6 text-xl text-text-muted-light leading-relaxed max-w-xl">
              Use neuroscience to reframe your relationship with alcohol. Unlock your healthiest, happiest self without rigid rules or judgment.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Link 
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold text-lg shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2" 
                href="/quiz"
              >
                Start Your Journey
                <Icons.arrowForward />
              </Link>

              <div className="flex items-center gap-4 px-4">
                <div className="flex -space-x-2">
                  <Image 
                    alt="User" 
                    className="w-8 h-8 rounded-full border-2 border-white" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1-taOqjPNtacAjOTfCyhhq7CEkSiz67G7fry1B1lj8V3GBJ-xOUK-40gpZgXxzbIzXqu44XYdLoPDL0P0o2BIf7h0jVgD6JOtCFSlMrnISGXDB2VvaGrQ28J52hlgodRwv0rC8hXjIRw99dI_3vi7nBq70cHe6y2FlCUsMt2uSLaYxF4RANylrXxvlYagkE4fzh4eJqk44A1D_z7AK5fMm6-aPLcIZuTa5l91HgkAevKq46oiKhWYC90xCK9gmDtjrJ2bznclSMlx"
                    width={32}
                    height={32}
                  />
                  <Image 
                    alt="User" 
                    className="w-8 h-8 rounded-full border-2 border-white" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjjhJboYBmsnSru86wozTU8h557cKg01pwwziJZ5d_HYpoI6tfmFLnjwwRqg3zjcdMNIW0P9nS_q0fWLirX0V7DlaX91Pt4kHtyuL9HKRIVi5Glhauqj_eK4BAgL2QC2Ik_4e3915zCotOWzrSMxQdj1TTgvlP9zZs9HODF7bxlggp3hgCACBipYljKv9C2N_Wzvgd5BsJ2WMxp9xGrk4fZmy8KLqhBpgoHKnZHbX2UwfFdZd4TIjeImnpnKI581MnLPd_iyLfK45O"
                    width={32}
                    height={32}
                  />
                  <Image 
                    alt="User" 
                    className="w-8 h-8 rounded-full border-2 border-white" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs0tCnvOMuHQPqqd75MRFGEbCRc3qfvLofFn6pwJq3yP9fHm8oCBFv0LlxasDwcXwuf61w42IQNjMpakV75fijmJn6dTmNJPcE7R4kU28oUh1rpfVv3HtF5TZEMNdz0HEt0Oesq1CpWL0FFc_MU2flqvohjh3ZQiaxlIib9BX76Vo-f7IZDNCUNKP9f-v4mhz8mm0x4AFGKR-dQBFCBtWj01FXPqtgOq1xpDzRiHtXlskgOXnyqXVWXv5JTafLCemfcsK5R1NR4yK4"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="text-sm">
                  <span className="font-bold text-text-light block">10k+ Trusted Users</span>
                  <div className="flex text-yellow-400 text-xs">
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
              <div className="text-5xl font-display font-bold text-primary mb-2">80%</div>
              <div className="text-text-muted-light font-medium">See reduced alcohol use within 2 months</div>
            </div>
            <div className="p-4 border-l-0 md:border-l border-gray-100">
              <div className="text-5xl font-display font-bold text-primary mb-2">52k</div>
              <div className="text-text-muted-light font-medium">Professionals currently enrolled</div>
            </div>
            <div className="p-4 border-l-0 md:border-l border-gray-100">
              <div className="text-5xl font-display font-bold text-primary mb-2">1M+</div>
              <div className="text-text-muted-light font-medium">Drinks eliminated in the last year</div>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 bg-background-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
            <div className="relative z-10 flex-1">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                Your Daily Companion
              </div>
              <h2 className="text-3xl font-display font-bold text-text-light mb-4">
                Track your progress every day.
              </h2>
              <p className="text-text-muted-light text-lg mb-6">
                Get personalized daily tasks, micro-lessons, and track your alcohol-free journey with our intuitive dashboard. Watch your streak grow as you build healthier habits.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                Start Your Journey
                <Icons.arrowForward />
              </Link>
            </div>

            {/* Phone Mockup */}
            <div className="w-full md:w-auto relative z-10 flex justify-center">
              <div className="relative w-[280px] h-[560px]">
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
      <section className="py-24 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-text-light mb-6">
              We do science, not <span className="text-primary">stigma</span>.
            </h2>
            <p className="text-lg text-text-muted-light max-w-2xl mx-auto">
              Developed with hundreds of medical and mental health experts, ClarioMind is a revolutionary alcohol habit-change app built for the modern professional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-background-light rounded-3xl p-8 lg:p-12 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
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

            <div className="bg-background-light rounded-3xl p-8 lg:p-12 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
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
      <section className="py-24 bg-background-light" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-surface-light aspect-[9/19] max-h-[600px] mx-auto">
              <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                <source src="/assets/animation.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-display font-bold text-text-light mb-6">
                How ClarioMind Works
              </h2>
              <p className="text-lg text-text-muted-light mb-12">
                Three simple steps to regain your power, backed by cognitive behavioral therapy.
              </p>

              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-lg">
                    01
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-light mb-2">We get to know you</h3>
                    <p className="text-text-muted-light leading-relaxed">
                      Tell us about your triggers, your goals, and what&apos;s been holding you back through our comprehensive assessment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-lg">
                    02
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-light mb-2">Daily 5-minute Lessons</h3>
                    <p className="text-text-muted-light leading-relaxed">
                      Short, practical lessons about the neuroscience of habits tailored to your profile. Learn <em>why</em> you drink, not just that you shouldn&apos;t.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-lg">
                    03
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-light mb-2">Track &amp; Transform</h3>
                    <p className="text-text-muted-light leading-relaxed">
                      See your progress in real-time. Celebrate the wins. Watch your life change as data proves your transformation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <Link 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors" 
                  href="/quiz"
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
      <section className="py-24 bg-surface-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-light mb-4">
              What You&apos;ll Get Inside
            </h2>
            <p className="text-text-muted-light">A comprehensive toolkit for your journey.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 bg-background-light rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-full h-40 rounded-lg mb-4 overflow-hidden relative">
                <Image
                  src="/assets/daily-micro-lessons.jpeg"
                  alt="Daily Micro-Lessons"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-text-light mb-2">Daily Micro-Lessons</h3>
              <p className="text-sm text-text-muted-light leading-relaxed">
                Understand how alcohol affects your brain and why changing creates lasting transformation.
              </p>
            </div>

            <div className="p-8 bg-background-light rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-full h-40 rounded-lg mb-4 overflow-hidden relative">
                <Image
                  src="/assets/community.jpeg"
                  alt="Community"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-text-light mb-2">24/7 Anonymous Community</h3>
              <p className="text-sm text-text-muted-light leading-relaxed">
                Connect with thousands on the same path. Celebrate wins, get support during tough moments.
              </p>
            </div>

            <div className="p-8 bg-background-light rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-full h-40 rounded-lg mb-4 overflow-hidden relative">
                <Image
                  src="/assets/smart-tracking.jpeg"
                  alt="Smart Tracking"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-text-light mb-2">Smart Tracking</h3>
              <p className="text-sm text-text-muted-light leading-relaxed">
                Monitor your progress in real-time. Log drinks without resetting your start date because slips happen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Image Section */}
      <section className="py-12 bg-background-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative aspect-[16/9]">
            <Image
              src="/assets/your-why-is-your-power.jpeg"
              alt="Your Why is Your Power"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-light text-center mb-12">
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
      <section className="py-24 bg-background-light relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                Ready to transform <br />your life?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of professionals who&apos;ve already started their journey with ClarioMind.
              </p>
              <Link 
                className="inline-flex items-center justify-center px-10 py-5 bg-white text-primary hover:bg-gray-50 rounded-full font-bold text-lg shadow-lg transition-all hover:-translate-y-1 gap-2" 
                href="/quiz"
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
      <footer className="bg-surface-light border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Image 
                  src="/assets/clariomind.png" 
                  alt="ClarioMind Logo" 
                  width={128}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-text-muted-light text-sm leading-relaxed max-w-xs mb-6">
                The science-backed app for professionals looking to change their relationship with alcohol.
              </p>
              <div className="flex gap-4">
                <a
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors"
                  href="mailto:info@clariomind.com"
                  aria-label="Contact Email"
                >
                  <Icons.mail />
                </a>
                <a
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors"
                  href="https://www.instagram.com/clariomindapp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Icons.globe />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-text-light mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-text-muted-light">
                <li><a className="hover:text-primary transition-colors" href="#features">Features</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Methodology</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Success Stories</a></li>
              </ul>
            </div>

         

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted-light">
            <div>© 2024 ClarioMind Inc. All rights reserved.</div>
            <div className="flex gap-6">
              <Link className="hover:text-primary transition-colors" href="/privacy">Privacy</Link>
              <Link className="hover:text-primary transition-colors" href="/terms">Terms</Link>
              <a className="hover:text-primary transition-colors" href="#">Cookies</a>
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
        {question}
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <Icons.expandMore />
        </span>
      </button>
      {isOpen && (
        <div className="text-text-muted-light p-6 pt-0 leading-relaxed border-t border-gray-100 mt-2">
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
