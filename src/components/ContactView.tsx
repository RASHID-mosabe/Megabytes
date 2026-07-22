import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWebsiteData } from '../context/WebsiteDataContext';

export default function ContactView() {
  const { contactData } = useWebsiteData();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 5000);
    }
  };

  return (
    <section className="w-full py-16 px-6 md:px-12 bg-gradient-to-b from-[#F5E3C7] to-white/60">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-[#2A160E] tracking-tight uppercase">
            GET IN TOUCH
          </h2>
          <p className="font-sans text-sm text-[#2A160E]/70 max-w-md mx-auto">
            We value your experience at Mega Bytes Restaurant. Have a question, suggestion, or feedback? Send us a message!
          </p>
          <div className="w-24 h-1.5 bg-[#D96A1D] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-4">
          
          {/* Column 1: Contact Details & Hours (5 Cols) */}
          <div className="lg:col-span-5 space-y-8 bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-white/40 shadow-sm">
            <div className="space-y-4">
              <h3 className="font-display font-bold text-xl text-[#2A160E] tracking-wide uppercase border-l-4 border-[#D96A1D] pl-3">
                Location & Contact
              </h3>
              <p className="font-sans text-xs text-[#2A160E]/70 leading-relaxed">
                Located in the heart of Kitale, Kenya. Drop by to experience our cozy atmosphere or order fresh meals for fast local delivery.
              </p>
            </div>

            {/* Quick Details list */}
            <div className="space-y-4 font-sans text-sm text-[#2A160E]/90">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#D96A1D]/10 flex items-center justify-center text-[#D96A1D] shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#2A160E] uppercase tracking-wider">Our Address</h4>
                  <p className="text-xs text-[#2A160E]/75 mt-0.5">{contactData.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#D96A1D]/10 flex items-center justify-center text-[#D96A1D] shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#2A160E] uppercase tracking-wider">Phone Number</h4>
                  <p className="text-xs text-[#2A160E]/75 mt-0.5">{contactData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#D96A1D]/10 flex items-center justify-center text-[#D96A1D] shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#2A160E] uppercase tracking-wider">Email Us</h4>
                  <p className="text-xs text-[#2A160E]/75 mt-0.5">{contactData.email}</p>
                </div>
              </div>
            </div>

            {/* Operating Hours card */}
            <div className="bg-[#2A160E]/5 p-6 rounded-xl border border-[#2A160E]/10 space-y-3">
              <div className="flex items-center gap-2 text-[#2A160E] font-bold">
                <Clock size={16} className="text-[#D96A1D]" />
                <h4 className="font-display text-sm uppercase tracking-wider">Business Hours</h4>
              </div>
              <div className="font-sans text-xs space-y-1.5 text-[#2A160E]/85">
                <div className="flex justify-between">
                  <span>Monday — Friday</span>
                  <span className="font-bold">{contactData.hoursWeekdays}</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday — Sunday</span>
                  <span className="font-bold">{contactData.hoursWeekends}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Feedback Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-display font-bold text-xl text-[#2A160E] tracking-wide uppercase mb-6 border-l-4 border-[#D96A1D] pl-3">
              Send us a Message
            </h3>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 border border-green-200 shadow-sm">
                    <CheckCircle size={32} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-lg text-dark-brown">MESSAGE SENT!</h4>
                    <p className="font-sans text-xs text-dark-brown/60 max-w-sm">
                      Thank you, <span className="font-bold text-dark-brown">{formData.name}</span>! We have received your feedback and will get back to you via <span className="font-bold text-dark-brown">{formData.email}</span> shortly.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-sans text-[10px] font-extrabold uppercase tracking-widest text-[#2A160E]/50">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rashid Ondara"
                        className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-3 text-xs font-sans text-dark-brown outline-none focus:border-[#D96A1D] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-sans text-[10px] font-extrabold uppercase tracking-widest text-[#2A160E]/50">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. yourname@gmail.com"
                        className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-3 text-xs font-sans text-dark-brown outline-none focus:border-[#D96A1D] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-sans text-[10px] font-extrabold uppercase tracking-widest text-[#2A160E]/50">
                      Message / Feedback
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your suggestions, questions, or dine-in inquiry here..."
                      className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-sans text-dark-brown outline-none resize-none focus:border-[#D96A1D] focus:bg-white transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 bg-[#D96A1D] hover:bg-[#C45A1E] text-white font-sans font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Send size={16} />
                    <span>SEND MESSAGE</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
