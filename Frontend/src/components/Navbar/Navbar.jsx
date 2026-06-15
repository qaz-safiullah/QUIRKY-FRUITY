import React, { useState, useEffect, useCallback } from 'react';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ cartCount, onCartClick, onAuthClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isShrunk, setIsShrunk] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsShrunk(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isHome) {
      setActiveSection('');
      return;
    }
    setActiveSection('');

    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 100;

    const observer = new IntersectionObserver(
      (entries) => {
        let visibleSection = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!visibleSection || entry.intersectionRatio > visibleSection.intersectionRatio) {
              visibleSection = entry;
            }
          }
        });
        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      { rootMargin: `-${navbarHeight}px 0px -40% 0px`, threshold: [0.1, 0.25, 0.5, 0.75] }
    );

    ['home', 'beverages', 'stores', 'about'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  const isActivePage = (path) => location.pathname === path;

  const scrollToSection = useCallback((sectionId) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.pathname, navigate]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${isShrunk ? 'shrunk' : ''}`}>
      <div className="navbar-content">
        
        <a href="/" className="logo-container" onClick={handleLogoClick}>
          <span className="logo-text top">quirky</span>
          <span className="logo-text bottom">-fruity</span>
        </a>

        <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          {['Home', 'Beverages', 'Stores', 'About'].map((item) => {
            const id = item.toLowerCase();
            return (
              <li key={id}>
                <a 
                  href={`/#${id}`}
                  className={`nav-item ${activeSection === id ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, id)}
                >
                  {item}
                </a>
              </li>
            );
          })}

          {user && (
            <>
              <li className="mobile-only"><a href="/profile" className={`nav-item ${isActivePage('/profile') ? 'active' : ''}`} onClick={() => { setIsMobileMenuOpen(false); navigate('/profile'); }}>Profile</a></li>
              <li className="mobile-only"><a href="/orders" className={`nav-item ${isActivePage('/orders') ? 'active' : ''}`} onClick={() => { setIsMobileMenuOpen(false); navigate('/orders'); }}>My Orders</a></li>
            </>
          )}
        </ul>
        
        <div className="nav-actions">
          {user ? (
            <>
              <a href="/profile" className={`nav-item desktop-only ${isActivePage('/profile') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>Profile</a>
              <a href="/orders" className={`nav-item desktop-only ${isActivePage('/orders') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/orders'); }}>My Orders</a>
              <IconButton size="small" className="cart-btn" onClick={onCartClick}>
                <Badge 
                  badgeContent={cartCount} 
                  color="warning"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#d95d39', 
                      color: 'white',
                      fontWeight: 'bold',
                    }
                  }}
                >
                  <ShoppingCartIcon sx={{ color: '#8C8C8C', transition: 'color 0.3s ease', '&:hover': { color: '#1a1a1a' } }} />
                </Badge>
              </IconButton>
            </>
          ) : (
            <button className="btn-auth" onClick={onAuthClick}>Login / Sign Up</button>
          )}

          <IconButton 
            className="hamburger-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            sx={{ color: '#1a1a1a' }}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
