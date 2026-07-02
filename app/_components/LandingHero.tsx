"use client";

import dynamic from 'next/dynamic';
import { TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';

const HeroScanForm = dynamic(() => import('./HeroScanForm'), { ssr: false });

const socialProof = [
  { metric: '500+', label: 'Brands tracked' },
  { metric: '15', label: 'AI prompts per scan' },
  { metric: '<60s', label: 'Time to get score' },
];

const features = [
  { icon: TrendingUp, title: 'Real AI Visibility Score', desc: 'Get a real percentage showing how often your brand appears in ChatGPT & Perplexity answers.' },
  { icon: BarChart3, title: 'Competitor Benchmarking', desc: 'See exactly how your AI visibility compares to 3–5 top competitors in your category.' },
  { icon: Zap, title: 'Actionable Recommendations', desc: 'Receive 3 specific content actions with estimated visibility lift percentages.' },
  { icon: Shield, title: 'Track Over Time', desc: 'Save your score and monitor weekly progress. Know when you improve.' },
];

const faqs = [
  { q: 'How is the AI Visibility Score calculated?', a: 'We send 15 category-relevant prompts to ChatGPT and check how often your brand appears in the answers. Score = mentions ÷ total prompts × 100.' },
  { q: 'Do I need an account to get my score?', a: 'No! Enter your brand name and get your score instantly — no account required. Create a free account to save and track it over time.' },
  { q: 'What does the free plan include?', a: 'The free plan includes 1 brand, 1 scan per week, 7-day history, 3 recommendations, and competitor comparison (top 3). No credit card required.' },
  { q: 'How long does a scan take?', a: 'Most scans complete in under 60 seconds. We query 15 different AI prompts and return your score in real time.' },
  { q: 'Can I track multiple brands?', a: 'The Starter and Pro plans support up to 1 and 3 brands respectively. Contact us for enterprise multi-brand tracking.' },
];

export default function LandingHero() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-100 opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" /> New: Real-time AI search visibility scoring
          </span>
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-tight mb-6">
            How visible is your brand<br />
            <span className="text-indigo-600">in AI search?</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Get your <strong>AI Visibility Score</strong> in under 60 seconds.
            See how often ChatGPT and Perplexity mention your brand vs. competitors
            &mdash; and get specific steps to improve it.
          </p>
          <div className="flex justify-center mb-8">
            <HeroScanForm />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {socialProof.map(({ metric, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-indigo-600">{metric}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Everything you need to win in AI search</h2>
            <p className="text-gray-600">Rankly is the only platform built specifically for AI search visibility.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof / how it works */}
      <section className="py-20 bg-indigo-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-12">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Enter your brand', desc: 'Type your brand name and optional category. No account needed.' },
              { step: '2', title: 'We query AI engines', desc: 'We send 15 relevant prompts to ChatGPT and analyze the responses.' },
              { step: '3', title: 'Get your score', desc: 'Receive your AI Visibility Score, competitor benchmarks, and recommendations.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white text-xl font-black flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-6">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-b border-gray-100 pb-6">
                <h3 className="font-bold text-gray-900 mb-2">{q}</h3>
                <p className="text-sm text-gray-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-black mb-4">Ready to measure your AI visibility?</h2>
          <p className="text-indigo-200 mb-8">Get your free AI Visibility Score in under 60 seconds. No account required.</p>
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors text-lg"
          >
            Get My Score Free <Zap className="w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  );
}
