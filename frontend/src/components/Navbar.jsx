import React, { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import authService from '../services/authService';

const Navbar = ({ user, onLogin, onLogout, currentSection, onSectionChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    authService.initiateGoogleLogin();
  };

  const handleLogout = async () => {
    const success = await authService.logout();
    if (success) {
      onLogout();
    }
  };

  const handleNavClick = (section) => {
    onSectionChange(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex-shrink-0 flex items-center"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <div className="ml-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                  Questly
                </span>
                <div className="text-xs text-slate-500 -mt-1">Career Discovery for Africa</div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavClick('home')}
              className={`font-medium transition-colors ${
                currentSection === 'home' 
                  ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' 
                  : 'text-slate-700 hover:text-emerald-600'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className={`font-medium transition-colors ${
                currentSection === 'about' 
                  ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' 
                  : 'text-slate-700 hover:text-emerald-600'
              }`}
            >
              About
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className={`font-medium transition-colors ${
                currentSection === 'contact' 
                  ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' 
                  : 'text-slate-700 hover:text-emerald-600'
              }`}
            >
              Contact Us
            </button>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img 
                    src={user.picture} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Sign in with Google
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-slate-200">
              <button 
                onClick={() => handleNavClick('home')}
                className="block w-full text-left px-3 py-2 text-slate-700 hover:text-emerald-600 font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('about')}
                className="block w-full text-left px-3 py-2 text-slate-700 hover:text-emerald-600 font-medium"
              >
                About
              </button>
              <button 
                onClick={() => handleNavClick('contact')}
                className="block w-full text-left px-3 py-2 text-slate-700 hover:text-emerald-600 font-medium"
              >
                Contact Us
              </button>
              
              {user ? (
                <div className="pt-4 pb-3 border-t border-slate-200">
                  <div className="flex items-center px-3 mb-3">
                    <img 
                      src={user.picture} 
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                      <div className="text-base font-medium text-slate-800">{user.name}</div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="mx-3 w-auto"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="pt-4 pb-3 border-t border-slate-200">
                  <Button
                    onClick={handleLogin}
                    className="mx-3 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign in with Google
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;