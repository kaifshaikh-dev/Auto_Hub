import React from 'react';
import { Car, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Car size={24} />
              </div>
              <span className="text-xl font-bold">AutoHub</span>
            </div>
            <p className="text-gray-400 max-w-sm mb-6">
              Good vehicles, better prices. Find second-hand cars and bikes you can trust.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase mb-4 text-gray-300">Quick Links</h3>
            <ul className="space-y-3 justify-center">
              <li><a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Home</a></li>
              <li><a href="/vehicles" className="text-gray-400 hover:text-primary-400 transition-colors">Browse Vehicles</a></li>
              <li><a href="/dealer/login" className="text-gray-400 hover:text-primary-400 transition-colors">Dealer Login</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase mb-4 text-gray-300">Contact</h3>
            <ul className="space-y-3 relative">
              <li className="text-gray-400">kaifshaikh9982@gmail.com</li>
              <li className="text-gray-400">+91 8668799982</li>
              <li className="text-gray-400">Sangli, India</li>
            </ul>
          </div>
        </div>

        {/* <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} AutoHub by Dealer Network. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;

