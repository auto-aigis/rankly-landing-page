"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  BarChart3,
  TrendingUp,
  Eye,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
  Brain,
  Target,
  LineChart,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: Feature[] = [
    {
      icon: <Eye className="h-6 w-6 text-indigo-600" />,
      title: "AI Visibility Tracking",
      description:
        "Monitor how your brand appears across ChatGPT, Perplexity, Claude, and other AI search engines in real time.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-indigo-600" />,
      title: "Competitive Intelligence",
      description:
        "See how you stack up against competitors in AI-generated answers and recommendations.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-indigo-600" />,
      title: "Growth Recommendations",
      description:
        "Get actionable insights to improve your brand presence in AI-powered search results.",
    },
    {
      icon: <Brain className="h-6 w-6 text-indigo-600" />,
      title: "AI Answer Analysis",
      description:
        "Understand how AI models interpret and present your brand information to users.",
    },
    {
      icon: <Target className="h-6 w-6 text-indigo-600" />,
      title: "Query Monitoring",
      description:
        "Track thousands of relevant queries to see when and how your brand gets mentioned.",
    },
    {
      icon: <LineChart className="h-6 w-6 text-indigo-600" />,
      title: "Performance Reports",
      description:
        "Comprehensive dashboards showing visibility trends, share of voice, and citation metrics.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Connect Your Brand",
      description:
        "Add your brand, competitors, and the queries that matter most to your business.",
      icon: <Zap className="h-8 w-8 text-indigo-600" />,
    },
    {
      number: "02",
      title: "Monitor AI Responses",
      description:
        "We continuously query AI search engines and track how your brand appears in responses.",
      icon: <Search className="h-8 w-8 text-indigo-600" />,
    },
    {
      number: "03",
      title: "Analyze & Optimize",
      description:
        "Get detailed analytics and actionable recommendations to grow your AI search visibility.",
      icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      price: "$49",
      period: "/month",
      description: "Perfect for small businesses getting started with AI search visibility.",
      features: [
        "1 brand profile",
        "100 tracked queries",
        "3 AI engines monitored",
        "Weekly reports",
        "Email support",
      ],
      popular: false,
      cta: "Get Started",
    },
    {
      name: "Professional",
      price: "$149",
      period: "/month",
      description: "For growing teams that need comprehensive AI search intelligence.",
      features: [
        "5 brand profiles",
        "1,000 tracked queries",
        "All AI engines monitored",
        "Daily reports",
        "Competitive analysis",
        "Priority support",
        "API access",
      ],
      popular: true,
      cta: "Get Started",
    },
    {
      name: "Enterprise",
      price: "$499",
      period: "/month",
      description: "For large organizations with advanced AI search visibility needs.",
      features: [
        "Unlimited brand profiles",
        "10,000+ tracked queries",
        "All AI engines monitored",
        "Real-time monitoring",
        "Advanced competitive intel",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
      ],
      popular: false,
      cta: "Contact Sales",
    },
  ];

  const faqItems: FAQItem[] = [
    {
      question: "What AI search engines does Rankly monitor?",
      answer:
        "Rankly monitors all major AI-powered search engines including ChatGPT, Perplexity, Claude, Google AI Overviews, Microsoft Copilot, and more. We continuously add new platforms as they emerge.",
    },
    {
      question: "How is this different from traditional SEO tools?",
      answer:
        "Traditional SEO tools focus on Google search rankings and backlinks. Rankly is purpose-built for the new era of AI search, tracking how AI models reference, recommend, and present your brand in conversational responses — something traditional tools simply cannot do.",
    },
    {
      question: "How quickly will I see results?",
      answer:
        "You will start seeing visibility data within 24 hours of setup. Actionable insights and trend data typically become meaningful within the first week as we gather enough data points for analysis.",
    },
    {
      question: "Can I track my competitors?",
      answer:
        "Absolutely. Competitive intelligence is a core feature. You can track how competitors appear in AI responses for the same queries, understand share of voice, and identify opportunities where you can gain an advantage.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a 14-day free trial on all plans. No credit card required. You can explore the full platform and see your AI search visibility data before committing.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Search className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Rankly</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 pb-4">
            <div className="flex flex-col gap-3">
              <a
                href="#features"
                className="text-sm text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-sm text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-sm text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <Separator />
              <div className="flex gap-3 pt-2">
                <a href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </a>
                <a href="/register">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    Get Started
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
            <Zap className="h-3.5 w-3.5 mr-1.5 inline" />
            AI Search Intelligence Platform
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Dominate AI Search
            <span className="text-indigo-600"> Before Your Competitors Do</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Understand, measure, and grow your brand visibility across AI-powered search engines like ChatGPT, Perplexity, and more. The operating system for AI search optimization.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-base px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="text-base px-8 py-6">
                See How It Works
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">14-day free trial • No credit card required</p>

          {/* Hero Visual */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-8 shadow-2xl shadow-indigo-100/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-gray-500">ChatGPT</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                  <p className="text-sm text-gray-500 mt-1">Visibility Score</p>
                  <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[87%] bg-green-500 rounded-full" />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-gray-500">Perplexity</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">72%</p>
                  <p className="text-sm text-gray-500 mt-1">Visibility Score</p>
                  <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[72%] bg-blue-500 rounded-full" />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span className="text-xs font-medium text-gray-500">Claude</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">64%</p>
                  <p className="text-sm text-gray-500 mt-1">Visibility Score</p>
                  <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[64%] bg-purple-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything You Need for AI Search Visibility
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              A comprehensive platform designed specifically to help you understand and improve how AI search engines perceive your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Get Started in Minutes
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to start understanding and growing your AI search presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <span className="text-sm font-bold text-indigo-600 mb-2">STEP {step.number}</span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 w-8">
                    <ArrowRight className="h-5 w-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-white">500+</p>
              <p className="mt-1 text-indigo-200 text-sm">Brands Monitored</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-white">1M+</p>
              <p className="mt-1 text-indigo-200 text-sm">Queries Tracked</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-white">8</p>
              <p className="mt-1 text-indigo-200 text-sm">AI Engines</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-white">99.9%</p>
              <p className="mt-1 text-indigo-200 text-sm">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular
                    ? "border-indigo-600 shadow-xl scale-105"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-indigo-600 text-white px-3 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="/register" className="w-full">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Got questions? We have answers.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-indigo-800">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="h-12 w-12 text-indigo-200 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Own Your AI Search Presence?
          </h2>
          <p className="mt-4 text-lg text-indigo-100 max-w-2xl mx-auto">
            Join hundreds of forward-thinking brands already using Rankly to dominate AI-powered search results. Start your free trial today.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-gray-100 text-base px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-indigo-300 text-white hover:bg-indigo-700 text-base px-8 py-6"
              >
                Sign In
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-indigo-200">No credit card required • Setup in 5 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-indigo-400" />
                <span className="text-lg font-bold text-white">Rankly</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm">
                The AI Search Intelligence Platform that helps businesses understand, measure, and grow their visibility across AI-powered search engines.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
              <ul className="space-y-2">
                <li><a href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign In</a></li>
                <li><a href="/register" className="text-sm text-gray-400 hover:text-white transition-colors">Get Started</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              {"© 2024 Rankly. All rights reserved."}
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}