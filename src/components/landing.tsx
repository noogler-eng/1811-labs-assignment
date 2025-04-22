"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-32 text-center bg-[#0A0A0A]">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-6 leading-tight tracking-tight"
        >
          Your Smartest Notes <br />
          In Pure Darkness.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl text-gray-400 text-lg mb-8"
        >
          Summarize and store your ideas instantly using Gemini AI. Sync across
          all devices with Supabase.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button className="bg-white text-black font-semibold hover:bg-gray-200 transition-all">
            Start Summarizing →
          </Button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-[#121212] py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "AI-Powered Summaries",
              desc: "Gemini condenses your notes into key takeaways.",
            },
            {
              title: "Realtime Sync",
              desc: "Powered by Supabase. Your notes stay synced.",
            },
            {
              title: "Built for Speed",
              desc: "Designed with Next.js App Router & Edge-first tech.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.2 }}
            >
              <Card className="bg-[#1A1A1A] border border-gray-800 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-400">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A0A0A] py-28 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mb-6"
        >
          Let your notes think for you.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 max-w-xl mx-auto mb-8"
        >
          Say goodbye to clutter. Focus on ideas. AI does the rest.
        </motion.p>
        <Button className="bg-white text-black font-semibold px-8 py-6 text-lg hover:bg-gray-200 transition-all">
          Get Started Free
        </Button>
      </section>
    </main>
  );
}
