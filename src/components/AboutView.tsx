import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Award, Users } from 'lucide-react';
import { useWebsiteData } from '../context/WebsiteDataContext';
import Features from './Features';

export default function AboutView() {
  const { aboutData } = useWebsiteData();

  return (
    <div className="w-full">
      {/* Narrative Section */}
      <section className="w-full py-16 px-6 md:px-12 bg-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Chef Narrative & Visual Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="font-sans font-extrabold text-xs text-[#D95413] tracking-widest uppercase">
                {aboutData.subtitle}
              </span>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl lg:text-4xl text-[#100906] tracking-widest uppercase">
                {aboutData.title}
              </h2>
              <div className="w-12 h-[2px] bg-[#D95413] mt-3" />
            </div>

            <p className="font-sans text-sm md:text-base text-[#100906]/85 leading-relaxed">
              {aboutData.paragraph1}
            </p>

            <p className="font-sans text-xs md:text-sm text-[#100906]/70 leading-relaxed">
              {aboutData.paragraph2}
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100 text-center space-y-1 shadow-xs">
                <Utensils size={18} className="text-[#D95413] mx-auto" />
                <p className="font-display font-black text-lg md:text-xl text-[#100906]">{aboutData.stat1Value}</p>
                <p className="font-sans text-[9px] text-[#100906]/60 uppercase tracking-widest font-bold">{aboutData.stat1Label}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-100 text-center space-y-1 shadow-xs">
                <Award size={18} className="text-[#D95413] mx-auto" />
                <p className="font-display font-black text-lg md:text-xl text-[#100906]">{aboutData.stat2Value}</p>
                <p className="font-sans text-[9px] text-[#100906]/60 uppercase tracking-widest font-bold">{aboutData.stat2Label}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-100 text-center space-y-1 shadow-xs">
                <Users size={18} className="text-[#D95413] mx-auto" />
                <p className="font-display font-black text-lg md:text-xl text-[#100906]">{aboutData.stat3Value}</p>
                <p className="font-sans text-[9px] text-[#100906]/60 uppercase tracking-widest font-bold">{aboutData.stat3Label}</p>
              </div>
            </div>
          </div>

          {/* Right: Immersive graphic / abstract card */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-[400px] aspect-[4/5] bg-[#100906] rounded-xl overflow-hidden shadow-xl border border-white"
            >
              <div 
                className="absolute inset-0 opacity-80 bg-cover bg-center mix-blend-overlay"
                style={{
                  backgroundImage: `url(${aboutData.image})`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <p className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#D95413]">{aboutData.badge}</p>
                <h4 className="font-display font-black text-lg uppercase tracking-wide leading-tight">{aboutData.cardTitle}</h4>
                <p className="font-sans text-[10px] text-white/70">{aboutData.cardDescription}</p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Existing Feature cards section */}
      <Features />
    </div>
  );
}
