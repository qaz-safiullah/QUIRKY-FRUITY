import React, { useState, useEffect } from 'react';
import './Homepage.css';

// MUI Imports
import Button from '@mui/material/Button';

// API
import { fetchProducts, subscribeNewsletter } from '../services/api';

// Asset Imports
// Section 1
import tealBerry from '../assets/images/teal-berry.png';
import redApple from '../assets/images/red-apple.png';
import burstTeal from '../assets/images/burst-teal.png';
import burstRed from '../assets/images/burst-red.png';

// Section 2
import speechBubble from '../assets/images/fresh-speech-bubble.png';
import orangePapaya from '../assets/images/orange-papaya.png';

// Section 3: All Time Favorites
import pineappleHero from '../assets/images/pineapple-hero.png';
import hollowRed from '../assets/images/hollow-red.png';
import solidRed from '../assets/images/solid-red.png';

// Section 4: Beat the Summer Heat
import avocadoHero from '../assets/images/avocado-hero.png';
import burstAvocado from '../assets/images/burst-avocado.png';

// Section 5: Add to cart
import burstCreamOrange from '../assets/images/burst-cream-orange.png';
import charOrange from '../assets/images/char-orange.png';
import burstCreamPineapple from '../assets/images/burst-cream-pineapple.png';
import charPineapple from '../assets/images/char-pineapple.png';
import burstCreamPapaya from '../assets/images/burst-cream-papaya.png';
import charPapaya from '../assets/images/char-papaya.png';
import ProductCard from '../components/ProductCard';

// Section 6
import trioWithBurst from '../assets/images/trioWithBurst.png';
import middleBurstLeft from '../assets/images/middleBurstLeft.png';
import middleBurstRight from '../assets/images/middleBurstRight.png';
import bottomFruitLine from '../assets/images/bottomFruitLine.png';

// Section 8: Testimonial
import reviewerAvatar from '../assets/images/reviewerAvatar.png';
import fiveStars from '../assets/images/fiveStars.png';

// Section 10: Footer
import quirkyFruityTitle from '../assets/images/quirky_fruity_title.png';
import quirkyFruityAppleChar from '../assets/images/quirky_fruity_apple_char.png';

/* =====================================================================
   STATIC DATA DEFINITIONS
   Defined outside the component to prevent recreation on every render.
   ===================================================================== */

const MENU_FRUITS = ['Papaya', 'Apple', 'Pineapple', 'Cherry', 'Avocado', 'Kiwi', 'Banana'];

const PRODUCT_IMAGE_MAP = {
  'Orange Juice': { image: charOrange, burstImage: burstCreamOrange },
  'Pineapple Juice': { image: charPineapple, burstImage: burstCreamPineapple },
  'Papaya Juice': { image: charPapaya, burstImage: burstCreamPapaya },
};

/* =====================================================================
   MAIN COMPONENT
   ===================================================================== */

const Homepage = ({ showToast, onAuthRequest }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        const mapped = data.map((p) => {
          const images = PRODUCT_IMAGE_MAP[p.name] || {};
          return {
            id: p.id,
            title: p.name.replace(/(\w+)\s(\w+)/, '$1<br/>$2'),
            name: p.name,
            price: p.price,
            image: images.image || '',
            burstImage: images.burstImage || '',
            stock: p.stock,
          };
        });
        setProducts(mapped);
      })
      .catch(() => {});
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const emailSubject = form.emailSubject.value.trim();
    const message = form.message.value.trim();
    const email = form.email.value.trim();

    if (!firstName || !lastName || !emailSubject || !email) return;

    try {
      await subscribeNewsletter({ firstName, lastName, emailSubject, message, email });
      showToast('Subscribed successfully!', 'success');
      form.reset();
    } catch (err) {
      showToast(err.message || 'Subscription failed', 'error');
    }
  };

  return (
    <div className="homepage">
      
      {/* --- HERO SECTION (#home) --- */}
      <section id="home" className="hero-wrapper">
        <div className="hero-content">  
          
          {/* Left Column: Teal Berry */}
          <div className="fruit-col">
            <div className="image-stack">
              <img src={burstTeal} className="burst burst-teal" alt="" aria-hidden="true" />
              <img src={tealBerry} className="fruit" alt="Teal Berry" />
            </div>
            <div className="info-text">
              <span className="label">open from</span>
              <h2 className="time-text">
                <span className="num">8</span> am - <span className="num">10</span> pm
              </h2>
            </div>
          </div>

          {/* Center Column: Primary Call to Action */}
          <div className="center-col">
            <h1 className="hero-title">
              Treat yourself <br /> with something <br />
              <span className="highlight">fresh</span> & <span className="highlight">tasty</span>!
            </h1>
            
            {/* Optimization: Using MUI's native href prop instead of wrapping in <a> */}
            <Button 
              href="#promo"
              variant="contained" 
              className="btn-orange"
              disableRipple 
            >
              LEARN MORE
            </Button>
          </div>

          {/* Right Column: Red Apple */}
          <div className="fruit-col">
            <div className="image-stack">
              <img src={burstRed} className="burst burst-red" alt="" aria-hidden="true" />
              <img src={redApple} className="fruit" alt="Red Apple" />
            </div>
            <p className="side-caption">
              treat yourself <br /> with something fresh <br /> and tasty!
            </p>
          </div>
          
        </div>
      </section>

      {/* --- PROMO SECTION (#promo) --- */}
      <section id="promo" className="promo-wrapper">
        <div className="promo-content">
          
          <div className="promo-left">
            <p className="description">
             <strong>Lorem ipsum dolor sit amet</strong> consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas.
            </p>
            <Button 
              href="#beverages"
              variant="contained" 
              className="btn-black"
              disableRipple
            >
              SEE MENU
            </Button>
          </div>

          <div className="promo-right">
            <div className="speech-bubble-container">
              <img src={speechBubble} className="bubble-bg" alt="" aria-hidden="true" />
              
              {/* Scalable SVG Text for precise curvature */}
              <svg className="curved-sticker-svg" viewBox="0 0 500 240">
                <path id="topCurve" d="M 50,80 Q 250,60 450,80" fill="transparent" />
                <path id="bottomCurve" d="M 50,160 Q 250,140 450,160" fill="transparent" />      
                <text className="curved-text top-word">
                  <textPath href="#topCurve" startOffset="50%" textAnchor="middle">Deliciously</textPath>
                </text>
                <text className="curved-text bottom-word">
                  <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">Fresh!</textPath>
                </text>
              </svg>
            </div>
            <img src={orangePapaya} className="papaya" alt="Papaya" />
          </div>

        </div>
      </section>

      {/* --- MASTER CONTAINER (Grid & Floating Background Layers) --- */}
      <div className="menu-summer-container">
        <div className="grid-overlay"></div>
        <img src={hollowRed} className="full-bg-layer hollow-bubbles" alt="" aria-hidden="true" />
        <img src={solidRed} className="full-bg-layer solid-bubbles" alt="" aria-hidden="true" />

        {/* --- SECTION 3: ALL TIME FAVORITES (#beverages) --- */}
        <section id="beverages" className="favorites-wrapper">
          <div className="content-layer">
            <br />
            <h2 className="section-title">All time Favorites</h2>
            
            <div className="favorites-main-grid">
              <div className="fav-image-side">
                <img src={pineappleHero} className="pineapple-char" alt="Pineapple Mascot" />
              </div>

              <div className="fav-menu-side">
                <div className="dual-menu-grid">
                  
                  {/* Optimization: Dynamic rendering for Smoothies */}
                  <div className="menu-column">
                    <div className="category-pill">SMOOTHIES</div>
                    {MENU_FRUITS.map((fruit) => (
                      <div key={`smoothie-${fruit}`} className="menu-item">
                        <span className="item-name">{fruit} Smoothie</span>
                        <div className="dots"></div>
                        <span className="item-price">$2.30</span>
                      </div>
                    ))}
                  </div>

                  {/* Optimization: Dynamic rendering for Fresh Juice */}
                  <div className="menu-column">
                    <div className="category-pill">FRESH JUICE</div>
                    {MENU_FRUITS.map((fruit) => (
                      <div key={`juice-${fruit}`} className="menu-item">
                        <span className="item-name">{fruit} Fresh Juice</span>
                        <div className="dots"></div>
                        <span className="item-price">$2.30</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
          <br /><br /><br />
        </section>

        {/* --- SECTION 4: BEAT THE SUMMER HEAT (#beatsummer) --- */}
        <section id="beatsummer" className="summer-wrapper">
          <div className="content-layer">
            <div className="summer-content">
              
              <div className="summer-text-side">
                <h2 className="summer-title">
                  Beat summer <br /> heat with <br /> 
                  <span className="brand-highlight">quirky fruity<span className='brand-highlightblack'>!</span></span>
                </h2>
                <p className="summer-desc">
                  <strong>Lorem ipsum dolor sit amet</strong> consectetur adipiscing elit, 
                  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas.
                </p>
                <a href="#stores" style={{ textDecoration: 'none' }}>
                  <button className="btn-black-summer">SEE MORE</button>
                </a>        
              </div>

              <div className="summer-image-side">
                <div className="image-stack">
                  <img src={burstAvocado} className="burst-avo" alt="" aria-hidden="true" />
                  <img src={avocadoHero} className="fruit-avocado" alt="Avocado Mascot" />
                </div>
              </div>

            </div>
          </div>
        </section>
        <br /><br /><br />
      </div>

      {/* --- SECTION 5: JUICE PRODUCT CARDS (#stores) --- */}
      <section id="stores" className="juices-wrapper">
        <div className="juices-grid">
          {products.map((juice) => (
            <ProductCard 
              key={juice.id}
              product={juice}
              showToast={showToast}
              onAuthRequest={onAuthRequest}
            />
          ))}
        </div>
      </section>

      {/* --- SECTION 6: DISCOVERY --- */}
      <section className="discovery-section">
        <div className="content-layer">
          <br /><br />
          <div className="discovery-flex">
            <div className="discovery-image">
              <img src={trioWithBurst} alt="Fruit Trio" className="trio-png" />
            </div>
            <div className="discovery-text">
              <h2 className="big-title">
                Try something <br /> that feels <span className="highlight">new</span> <br /> and <span className="highlight">you</span>!
              </h2>
              <a href="#refresh">
                <button className="btn-black-summer">SEE MORE</button>
              </a> 
            </div>
          </div>
        </div>
        <br /><br /><br />
      </section>

      {/* --- SECTION 7: REFRESH --- */}
      <section className="refresh-section" id="refresh">
        {/* Floating Side Bursts */}
        <img src={middleBurstRight} className="side-burst burst-r" alt="" aria-hidden="true" />
        <img src={middleBurstLeft} className="side-burst burst-l" alt="" aria-hidden="true" />
        
        <div className="content-layer refresh-center">
          <h2 className="refresh-title">
            Feel refreshed and energize <br /> with these <span className="highlight">fresh fruit</span> drinks!
          </h2>
          <a href="#reviews">
            <button className="btn-orange">LEARN MORE</button>
          </a>
        </div>

        {/* Footer Line Graphic */}
        <div className="fruit-footer-line">
          <img src={bottomFruitLine} alt="Characters Footer Line" className="footer-line-img" />
        </div>
        <br /><br />
      </section>

      {/* --- SECTIONS 8 & 9 (Reusing Background Container) --- */}
      <div className="menu-summer-container">
        <div className="grid-overlay"></div>
        <img src={hollowRed} className="full-bg-layer hollow-bubbles" alt="" aria-hidden="true" />
        <img src={solidRed} className="full-bg-layer solid-bubbles" alt="" aria-hidden="true" />

        {/* --- SECTION 8: TESTIMONIAL (#reviews) --- */}
        <section id="reviews" className="testimonial-section">
          <div className="content-layer testimonial-content">
            <img src={reviewerAvatar} alt="Christian Amon" className="reviewer-avatar" />
            <h2 className="testimonial-name">
              Christian <span className="highlight">Amon</span>
            </h2>
            <p className="testimonial-text">
              <strong>Lorem ipsum dolor sit amet</strong> consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
            </p>
            <img src={fiveStars} alt="5 Stars Rating" className="five-stars-img" />
          </div>
        </section>

        {/* --- SECTION 9: NEWSLETTER --- */}
        <section className="newsletter-section">
          <div className="content-layer newsletter-content">
            <h2 className="newsletter-title">
              Newsletter <span className="highlight">Registration</span>
            </h2>
            
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="form-row form-row-2">
                <input type="text" name="firstName" placeholder="First Name*" className="form-input" required />
                <input type="text" name="lastName" placeholder="Last Name*" className="form-input" required />
              </div>
              <div className="form-row">
                <input type="email" name="email" placeholder="Email*" className="form-input" required />
              </div>
              <div className="form-row">
                <input type="text" name="emailSubject" placeholder="Subject*" className="form-input" required />
              </div>
              <div className="form-row">
                <textarea name="message" placeholder="Message..." className="form-input form-textarea"></textarea>
              </div>
              
              <div className="form-submit-wrapper">
                <button type="submit" className="btn-black btn-submit">SUBMIT EMAIL</button>
              </div>
            </form>
          </div>
        </section>
        <br /><br /><br /><br />
      </div>

      {/* --- SECTION 10: FOOTER (#about) --- */}
      <footer id="about" className="footer-wrapper">
        <div className="content-layer footer-content">
          
          <div className="footer-brand-col">
            <img src={quirkyFruityTitle} alt="Quirky Fruity" className="footer-logo-img" />
          </div>

          <div className="footer-links-grid">
            <div className="links-col">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#beverages">Menu</a>
            </div>
            <div className="links-col">
              <a href="#beverages">Smoothies</a>
              <a href="#beverages">Juices</a>
              <a href="#stores">Fruits</a>
            </div>
            <div className="links-col">
              <a href="#imports">Imports</a>
              <a href="#branches">Branches</a>
              <a href="#social">Social Media</a>
            </div>
            <div className="links-col">
              <a href="#history">History</a>
              <a href="#jobs">Job Vacancies</a>
            </div>
          </div>

          <div className="footer-char-col">
            <img src={quirkyFruityAppleChar} alt="Apple Character Mascot" className="footer-apple-img" />
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Homepage;