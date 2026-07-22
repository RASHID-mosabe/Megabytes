import React from 'react';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { Sprout, Sparkles, Truck, Coffee, Flame, Heart } from 'lucide-react';
import { motion } from 'motion/react';

const iconMap: { [key: string]: React.ComponentType<{ size: number; className?: string }> } = {
  Sprout: Sprout,
  Sparkles: Sparkles,
  Truck: Truck,
  Coffee: Coffee,
  Flame: Flame,
  Heart: Heart,
};

export default function Features() {
  const { chooseFeatures } = useWebsiteData();

  return (
    <section className="w-full py-24 px-6 md:px-12 bg-wood-pattern-light border-b border-sand/30">
      <div className="max-w-[1400px] mx-auto space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl lg:text-4xl text-[#100906] tracking-widest uppercase">
            WHY CHOOSE US?
          </h2>
          <div className="w-12 h-[2px] bg-[#D95413] mx-auto" />
        </div>

        {/* Feature Cards Column */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {chooseFeatures.map((feature, idx) => {
            const IconComponent = iconMap[feature.iconName] || Sparkles;
            return (
              <motion.article
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex flex-col items-center text-center space-y-5 group"
              >
                {/* Minimalist Icon Bubble */}
                <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center text-[#D95413] shadow-md border border-gray-100 group-hover:scale-110 group-hover:bg-[#D95413] group-hover:text-white transition-all duration-300">
                  <IconComponent size={24} className="transition-transform duration-300" />
                </div>

                {/* Text Details */}
                <div className="space-y-3 max-w-[340px]">
                  <h3 className="font-display font-bold text-lg text-[#100906] uppercase tracking-wide group-hover:text-[#D95413] transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-xs text-[#100906]/75 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
