import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Map, MessageCircle, Bookmark, Home } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/chat', icon: MessageCircle, label: 'Ask Local' },
    { path: '/saved', icon: Bookmark, label: 'Saved' },
  ];

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20">
        <nav className="px-6 md:px-12 lg:px-24 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
              <div className="bg-ocean p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold text-ocean tracking-tight">
                Wanderlust
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                    className={`flex items-center gap-2 font-sans text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                      isActive ? 'text-ocean' : 'text-stone hover:text-ocean'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`mobile-nav-${item.label.toLowerCase().replace(' ', '-')}`}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive ? 'text-ocean' : 'text-stone'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-xs font-sans font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <footer className="bg-ocean text-white py-16 px-6 md:px-12 lg:px-24 mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Compass className="w-8 h-8" />
                <span className="font-serif text-2xl font-bold">Wanderlust</span>
              </div>
              <p className="font-sans text-white/80 leading-relaxed">
                Your trusted guide to discovering the world's most amazing destinations.
              </p>
            </div>
            
            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 font-sans">
                <li><Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/map" className="text-white/80 hover:text-white transition-colors">Explore Map</Link></li>
                <li><Link to="/chat" className="text-white/80 hover:text-white transition-colors">Ask a Local</Link></li>
                <li><Link to="/saved" className="text-white/80 hover:text-white transition-colors">Saved Places</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">Travel Tips</h3>
              <p className="font-sans text-white/80 leading-relaxed">
                Plan ahead, pack light, and always keep an open mind. The best adventures often come from unexpected detours.
              </p>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-12 pt-8 text-center font-sans text-white/60">
            <p>© 2025 Wanderlust. Your journey begins here.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
