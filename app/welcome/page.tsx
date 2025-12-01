'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { 
  Brain, 
  Heart, 
  TrendingUp, 
  Users, 
  Shield, 
  Sparkles,
  ChevronDown,
  Star,
  CheckCircle2,
  ArrowRight,
  Zap,
  Moon,
  Wallet
} from 'lucide-react'

export default function WelcomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "Sarah M.",
      role: "3 months sober",
      quote: "Reframe changed my life. I went from drinking daily to feeling completely in control.",
      avatar: "🌸"
    },
    {
      name: "James K.",
      role: "Cut back 70%",
      quote: "The science-based approach finally made something click. I understand my triggers now.",
      avatar: "🌊"
    },
    {
      name: "Emily R.",
      role: "6 months free",
      quote: "The daily lessons and community support kept me going when it got tough.",
      avatar: "✨"
    }
  ]

  return (
    <div className="min-h-screen bg-[#FFFBF7] overflow-x-hidden">
      {/* Floating Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-400 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🧡</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Reframe</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-700 hover:text-primary">
                Log in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-primary hover:bg-primary-dark text-white rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/40 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-100/50 to-yellow-100/50 rounded-full blur-3xl" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-[15%] animate-float">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="absolute top-48 right-[20%] animate-float delay-500">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <Heart className="w-7 h-7 text-rose-500" />
            </div>
          </div>
          <div className="absolute bottom-32 left-[20%] animate-float delay-1000">
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="absolute bottom-48 right-[15%] animate-float delay-700">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-green-500" />
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full px-4 py-2 mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm text-gray-700">Join 2,000,000+ people building healthier habits</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transform your
            <span className="block bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
              relationship with alcohol
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Science-backed tools, personalized guidance, and a supportive community — 
            everything you need to drink less and live more.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/auth/register">
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-dark hover:to-orange-600 text-white rounded-full px-10 py-6 text-lg shadow-xl shadow-orange-500/25 transition-all hover:scale-105">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg border-2 border-gray-300 hover:border-primary hover:text-primary">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2 font-semibold">4.8/5 rating</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>200% money-back guarantee</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span>84 countries</span>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "70%", label: "Average reduction", icon: TrendingUp, color: "text-green-600" },
              { value: "2M+", label: "Active users", icon: Users, color: "text-primary" },
              { value: "84", label: "Countries", icon: Sparkles, color: "text-amber-500" },
              { value: "4.8★", label: "App rating", icon: Star, color: "text-yellow-500" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-white to-orange-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What you'll gain
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              When you drink less, you gain so much more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Wallet,
                title: "Save Money",
                description: "Users save an average of €2,400 per year. Imagine what you could do with that.",
                color: "from-green-400 to-emerald-600",
                bgColor: "bg-green-50"
              },
              {
                icon: Zap,
                title: "More Energy",
                description: "Wake up refreshed, not drained. Better sleep means better days.",
                color: "from-amber-400 to-orange-600",
                bgColor: "bg-amber-50"
              },
              {
                icon: Moon,
                title: "Better Sleep",
                description: "Restore your natural sleep cycles. Feel the difference in days.",
                color: "from-purple-400 to-indigo-600",
                bgColor: "bg-purple-50"
              },
              {
                icon: Heart,
                title: "Improved Health",
                description: "Lower blood pressure, better liver function, clearer skin, and more.",
                color: "from-rose-400 to-red-600",
                bgColor: "bg-rose-50"
              },
              {
                icon: Brain,
                title: "Mental Clarity",
                description: "Think clearer, focus better, and reduce anxiety naturally.",
                color: "from-blue-400 to-cyan-600",
                bgColor: "bg-blue-50"
              },
              {
                icon: Users,
                title: "Stronger Relationships",
                description: "Be present for the people who matter most to you.",
                color: "from-primary to-orange-600",
                bgColor: "bg-orange-50"
              }
            ].map((benefit, index) => (
              <div 
                key={index} 
                className={`${benefit.bgColor} rounded-3xl p-8 hover:shadow-xl transition-all hover:-translate-y-1 cursor-default`}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} mb-6`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Reframe works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A proven, science-backed approach to lasting change
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Personalized Assessment",
                description: "Tell us about your goals and habits. We'll create a custom plan just for you.",
                lottie: "https://lottie.host/f38cb803-24f4-498a-b24f-587078bfdfd2/BBZKJ20M6D.lottie"
              },
              {
                step: "02",
                title: "Daily Micro-Lessons",
                description: "Learn the neuroscience behind habits in bite-sized, 5-minute daily sessions.",
                lottie: "https://lottie.host/ca383446-5e30-450a-b61e-4f64bb6be0c8/EkFKv16aX3.lottie"
              },
              {
                step: "03",
                title: "Track & Transform",
                description: "Monitor your progress, celebrate wins, and watch your life improve day by day.",
                lottie: "https://lottie.host/25aaa523-59ca-4185-9d8e-7e1ca254968c/770RwUrvID.lottie"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-b from-orange-50 to-white rounded-3xl p-8 border border-orange-100 h-full">
                  <div className="text-6xl font-bold text-orange-100 mb-4">{item.step}</div>
                  <div className="h-40 mb-6">
                    <DotLottieReact
                      src={item.lottie}
                      loop
                      autoplay
                      style={{ height: '100%', width: '100%' }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-orange-300">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-orange-50/50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real stories, real results
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands who've transformed their lives
            </p>
          </div>

          <div className="relative bg-white rounded-3xl p-10 md:p-14 shadow-xl border border-orange-100">
            <div className="absolute -top-6 left-10 text-8xl text-primary/20">"</div>
            
            <div className="relative z-10">
              <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed mb-8 font-medium">
                {testimonials[activeTestimonial].quote}
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange-400 rounded-full flex items-center justify-center text-2xl">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonials[activeTestimonial].name}</div>
                  <div className="text-primary font-medium">{testimonials[activeTestimonial].role}</div>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial 
                      ? 'bg-primary w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Everything you need to succeed
              </h2>
              <p className="text-xl text-gray-600 mb-10">
                Reframe combines cutting-edge neuroscience with practical tools for lasting change.
              </p>

              <div className="space-y-6">
                {[
                  "30-day neuroscience-based program",
                  "Personalized daily lessons",
                  "Meditation & breathing exercises",
                  "Progress tracking & insights",
                  "Supportive community",
                  "24/7 expert support"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-lg text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-200/20 rounded-3xl blur-3xl" />
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl">
                {/* Mock App Screen */}
                <div className="bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium text-gray-600">Day 7</span>
                    <span className="text-sm font-medium text-primary">7 🔥</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">📚</div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Understanding Triggers</div>
                        <div className="text-xs text-gray-500">5 min read</div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-primary">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">🧘</div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Mindful Breathing</div>
                        <div className="text-xs text-gray-500">3 min exercise</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-orange-500">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8">
            <Shield className="w-10 h-10" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            200% Money-Back Guarantee
          </h2>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
            If you don't see results after following the program, we'll refund double your money. No questions asked.
          </p>
          <p className="text-lg opacity-75">
            That's how confident we are in Reframe.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to transform your life?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join over 2 million people who've already started their journey with Reframe.
          </p>
          
          <Link href="/auth/register">
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-dark hover:to-orange-600 text-white rounded-full px-12 py-7 text-xl shadow-xl shadow-orange-500/25 transition-all hover:scale-105">
              Start Your Free Trial Today
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>

          <p className="mt-6 text-gray-500">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-400 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🧡</span>
              </div>
              <span className="text-xl font-bold text-white">Reframe</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <span>© 2024 Reframe. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}
