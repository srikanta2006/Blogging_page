// src/pages/LandingPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, BookOpen, Users, Zap } from 'lucide-react';
import styles from './LandingPage.module.css';

function LandingPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // THE FIX: If a user is already logged in, redirect them to the main app homepage.
  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={styles.pageWrapper}>
      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <div 
          className={styles.glowOrb} 
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div className={styles.gridPattern}></div>
        <div className={styles.floatingParticles}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className={styles.particle} style={{ 
              left: `${Math.random() * 100}%`, 
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}></div>
          ))}
        </div>
      </div>

      <main className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Badge */}
          <div className={styles.badge}>
            <Sparkles size={16} />
            <span>Welcome to the future of writing</span>
          </div>

          {/* Main heading with animated text */}
          <h1 className={styles.title}>
            Where Great Ideas
            <span className={styles.burstText}> Burst</span>
            <span className={styles.titleAccent}> Into Life</span>
          </h1>

          {/* Enhanced subtitle */}
          <p className={styles.subtitle}>
            Join thousands of writers, creators, and visionaries sharing their stories 
            on the most beautiful and intuitive platform designed for modern storytelling.
          </p>

          {/* CTA buttons */}
          <div className={styles.ctaGroup}>
            <Link to="/login" className={styles.primaryCta}>
              <span>Start Creating</span>
              <ArrowRight size={20} />
            </Link>
            <Link to="/explore" className={styles.secondaryCta}>
              <BookOpen size={20} />
              <span>Explore Stories</span>
            </Link>
          </div>

          {/* Creator Story */}
          <div className={styles.creatorSection}>
            <div className={styles.creatorCard}>
              <div className={styles.creatorHeader}>
                <div className={styles.creatorAvatar}>
                  <span>S</span>
                </div>
                <div className={styles.creatorInfo}>
                  <h3>Meet Srikanta</h3>
                  <p>Creator & Developer</p>
                </div>
              </div>
              
              <div className={styles.storyTimeline}>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineIcon}>📚</div>
                  <div className={styles.timelineContent}>
                    <h4>It Started With a Book</h4>
                    <p>After finishing a great read, I wanted to write a review and share my thoughts...</p>
                  </div>
                </div>
                
                <div className={styles.timelineItem}>
                  <div className={styles.timelineIcon}>💡</div>
                  <div className={styles.timelineContent}>
                    <h4>The Lightbulb Moment</h4>
                    <p>"Why not build my own platform for writers?" - And so Burst was born.</p>
                  </div>
                </div>
                
                <div className={styles.timelineItem}>
                  <div className={styles.timelineIcon}>🚀</div>
                  <div className={styles.timelineContent}>
                    <h4>First Full-Stack Journey</h4>
                    <p>My first complete React project with multiple users. Lots of errors, tons of learning!</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.creatorQuote}>
                <blockquote>
                  "Burst isn't just a platform - it's the foundation of my developer portfolio and the start of something special."
                </blockquote>
              </div>
              
              <div className={styles.socialLinks}>
                <a href="https://github.com/srikanta2006" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/srikanta-bellamkonda/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
              
              <div className={styles.disclaimerLines}>
                <p>* Any inputs are accepted and if you find any errors let me know</p>
                <p>* This is my profile page showcasing my development journey</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;