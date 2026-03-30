import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdWork, MdAutoAwesome, MdDashboard, MdSearch,
  MdEmail, MdTrendingUp, MdCheckCircle, MdArrowForward,
  MdMenu, MdClose
} from 'react-icons/md';
import {
  BsBriefcaseFill, BsGraphUp, BsRobot, BsShieldCheck
} from 'react-icons/bs';
import { FaUserTie, FaRocket } from 'react-icons/fa';

// ─── SCROLL REVEAL HOOK ───────────────────────────────
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

// ─── NAVBAR ───────────────────────────────────────────
const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav style={{
      ...s.nav,
      backgroundColor: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.07)' : 'none',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
    }}>
      <div style={s.navInner}>
        <div style={s.navLogo}>
          <div style={s.navLogoIcon}><MdWork size={18} color="#fff" /></div>
          <span style={s.navLogoText}>JobTracker</span>
        </div>
        <div style={s.navLinks}>
          {['features', 'how-it-works', 'ai-tools'].map(id => (
            <button key={id} style={s.navLink} onClick={() => scrollTo(id)}>
              {id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>
        <div style={s.navCTAs}>
          <button style={s.navSignIn} onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button style={s.navGetStarted} onClick={() => navigate('/register')}>
            Get Started Free
          </button>
        </div>
      </div>
    </nav>
  );
};

// ─── HERO ─────────────────────────────────────────────
const Hero = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState({ apps: 0, users: 0, rate: 0 });

  useEffect(() => {
    const targets = { apps: 500, users: 200, rate: 93 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCount({
        apps: Math.floor(targets.apps * progress),
        users: Math.floor(targets.users * progress),
        rate: Math.floor(targets.rate * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={s.hero}>
      {/* Background */}
      <div style={s.heroBg} />
      <div style={s.heroGrid} />

      <div style={s.heroContent}>
        <div style={s.heroBadge}>
          <BsRobot size={13} color="#0A66C2" />
          <span>AI-Powered Job Search Management</span>
        </div>

        <h1 style={s.heroTitle}>
          Track Every Application.
          <br />
          <span style={s.heroTitleBlue}>Land Your Dream Job.</span>
        </h1>

        <p style={s.heroDesc}>
          Stop losing track of where you applied. Manage your entire
          job search pipeline like a pro — with AI tools that write
          cover letters, prep you for interviews, and optimize your resume.
        </p>

        <div style={s.heroCTAs}>
          <button style={s.heroPrimary} onClick={() => navigate('/register')}>
            Start Tracking Free
            <MdArrowForward size={18} />
          </button>
          <button style={s.heroSecondary} onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>

        <div style={s.heroNote}>
          ✓ Free forever &nbsp;&nbsp; ✓ No credit card &nbsp;&nbsp; ✓ Setup in 2 minutes
        </div>

        {/* Stats */}
        <div style={s.heroStats}>
          {[
            { num: `${count.apps}+`, label: 'Jobs Tracked' },
            { num: `${count.users}+`, label: 'Active Users' },
            { num: `${count.rate}%`, label: 'Success Rate' },
          ].map(stat => (
            <div key={stat.label} style={s.heroStat}>
              <span style={s.heroStatNum}>{stat.num}</span>
              <span style={s.heroStatLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Visual — App Preview */}
      <div style={s.heroVisual}>
        <div style={s.appPreview}>
          <div style={s.appPreviewBar}>
            <div style={s.appPreviewDots}>
              <span style={{ ...s.appDot, background: '#FF5F57' }} />
              <span style={{ ...s.appDot, background: '#FFBD2E' }} />
              <span style={{ ...s.appDot, background: '#28CA41' }} />
            </div>
            <span style={s.appPreviewUrl}>job-tracker.vercel.app/dashboard</span>
          </div>
          <div style={s.appPreviewBody}>
            {/* Mini Stats */}
            <div style={s.miniStats}>
              {[
                { label: 'Total', num: '24', color: '#0A66C2' },
                { label: 'Interview', num: '6', color: '#8B5CF6' },
                { label: 'Offers', num: '2', color: '#10B981' },
                { label: 'Rejected', num: '8', color: '#EF4444' },
              ].map(s2 => (
                <div key={s2.label} style={s.miniStat}>
                  <span style={{ ...s.miniStatNum, color: s2.color }}>{s2.num}</span>
                  <span style={s.miniStatLabel}>{s2.label}</span>
                </div>
              ))}
            </div>
            {/* Mini Table */}
            <div style={s.miniTable}>
              {[
                { company: 'Google', role: 'Frontend Dev', status: 'Interview', color: '#8B5CF6' },
                { company: 'Amazon', role: 'SDE Intern', status: 'Applied', color: '#3B82F6' },
                { company: 'Microsoft', role: 'React Dev', status: 'Offered', color: '#10B981' },
                { company: 'Flipkart', role: 'Full Stack', status: 'Rejected', color: '#EF4444' },
              ].map(row => (
                <div key={row.company} style={s.miniRow}>
                  <div style={s.miniCompany}>
                    <div style={s.miniIcon}><MdWork size={10} color="#0A66C2" /></div>
                    <div>
                      <div style={s.miniCompanyName}>{row.company}</div>
                      <div style={s.miniRoleName}>{row.role}</div>
                    </div>
                  </div>
                  <span style={{ ...s.miniStatus, color: row.color, backgroundColor: `${row.color}15` }}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── FEATURES ─────────────────────────────────────────
const Features = () => {
  const [ref, visible] = useReveal();
  const features = [
    {
      icon: <BsBriefcaseFill size={24} />,
      color: '#0A66C2',
      bg: '#EFF6FF',
      title: 'Smart Application Tracking',
      desc: 'Manage every job application in one place. Track status, dates, notes and job links — organized like a professional CRM pipeline.',
    },
    {
      icon: <MdAutoAwesome size={24} />,
      color: '#8B5CF6',
      bg: '#F5F3FF',
      title: '4 AI-Powered Tools',
      desc: 'Generate tailored cover letters, prepare for interviews, write follow-up emails, and get resume tips — all powered by Groq AI.',
    },
    {
      icon: <BsGraphUp size={24} />,
      color: '#10B981',
      bg: '#ECFDF5',
      title: 'Pipeline Analytics',
      desc: 'See your application stats at a glance — total applied, interviews, offers and rejections. Understand your job search performance.',
    },
    {
      icon: <MdSearch size={24} />,
      color: '#F59E0B',
      bg: '#FFFBEB',
      title: 'Search & Filter',
      desc: 'Instantly find any application by company name, role, or status. Never lose track of where you applied again.',
    },
    {
      icon: <MdEmail size={24} />,
      color: '#EF4444',
      bg: '#FEF2F2',
      title: 'Password Recovery',
      desc: 'Secure forgot password flow with time-limited reset links sent directly to your email. Your data is always safe.',
    },
    {
      icon: <BsShieldCheck size={24} />,
      color: '#0A66C2',
      bg: '#EFF6FF',
      title: 'Secure & Private',
      desc: 'JWT authentication ensures only you can see your applications. Your job search data is completely private.',
    },
  ];

  return (
    <section id="features" style={s.section} ref={ref}>
      <div style={{
        ...s.sectionInner,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.7s ease',
      }}>
        <div style={s.sectionLabel}>Features</div>
        <h2 style={s.sectionTitle}>
          Everything you need to
          <span style={s.titleBlue}> manage your job search</span>
        </h2>
        <p style={s.sectionSubtitle}>
          Built by a job seeker, for job seekers. Every feature
          solves a real pain point in the job hunt process.
        </p>
        <div style={s.featuresGrid}>
          {features.map((f, i) => (
            <div key={f.title} style={{
              ...s.featureCard,
              animationDelay: `${i * 0.1}s`,
            }}>
              <div style={{ ...s.featureIcon, backgroundColor: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3 style={s.featureTitle}>{f.title}</h3>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── HOW IT WORKS ─────────────────────────────────────
const HowItWorks = () => {
  const [ref, visible] = useReveal();
  const steps = [
    {
      num: '01',
      icon: <FaRocket size={22} />,
      color: '#0A66C2',
      title: 'Create Free Account',
      desc: 'Sign up in 30 seconds. No credit card required. Your data is private and secure.',
    },
    {
      num: '02',
      icon: <BsBriefcaseFill size={22} />,
      color: '#8B5CF6',
      title: 'Add Your Applications',
      desc: 'Log every job you apply to — company, role, status, date, and link. Takes 10 seconds per application.',
    },
    {
      num: '03',
      icon: <MdTrendingUp size={22} />,
      color: '#10B981',
      title: 'Track Your Pipeline',
      desc: 'Update statuses as you progress. Watch your pipeline move from Applied → Interview → Offer.',
    },
    {
      num: '04',
      icon: <MdAutoAwesome size={22} />,
      color: '#F59E0B',
      title: 'Use AI to Stand Out',
      desc: 'Generate personalized cover letters, prep for interviews, and get resume tips — all in one click.',
    },
  ];

  return (
    <section id="how-it-works" style={{ ...s.section, backgroundColor: '#F8FAFC' }} ref={ref}>
      <div style={{
        ...s.sectionInner,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.7s ease',
      }}>
        <div style={s.sectionLabel}>How It Works</div>
        <h2 style={s.sectionTitle}>
          From signup to
          <span style={s.titleBlue}> dream job in 4 steps</span>
        </h2>
        <p style={s.sectionSubtitle}>
          Get started in under 2 minutes. No complicated setup.
        </p>
        <div style={s.stepsGrid}>
          {steps.map((step, i) => (
            <div key={step.num} style={s.stepCard}>
              <div style={s.stepTop}>
                <div style={{ ...s.stepIconBox, backgroundColor: `${step.color}15`, color: step.color }}>
                  {step.icon}
                </div>
                <span style={{ ...s.stepNum, color: `${step.color}30` }}>{step.num}</span>
              </div>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
              {i < steps.length - 1 && (
                <div style={s.stepArrow}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── AI TOOLS ─────────────────────────────────────────
const AIToolsSection = () => {
  const [ref, visible] = useReveal();
  const navigate = useNavigate();
  const tools = [
    {
      emoji: '✉️',
      title: 'Cover Letter Generator',
      desc: 'Paste the job description and get a tailored, professional cover letter in seconds.',
      color: '#0A66C2',
    },
    {
      emoji: '🎯',
      title: 'Interview Prep',
      desc: 'Get role-specific interview questions with expert tips on how to answer each one.',
      color: '#8B5CF6',
    },
    {
      emoji: '📧',
      title: 'Follow-up Email Writer',
      desc: 'Generate the perfect follow-up email based on your current application status.',
      color: '#10B981',
    },
    {
      emoji: '📄',
      title: 'Resume Tips',
      desc: 'Get ATS keywords and skills to highlight based on the exact job description.',
      color: '#F59E0B',
    },
  ];

  return (
    <section id="ai-tools" style={s.section} ref={ref}>
      <div style={{
        ...s.sectionInner,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.7s ease',
      }}>
        <div style={s.aiHeader}>
          <div>
            <div style={s.aiBadge}>
              <MdAutoAwesome size={14} color="#F59E0B" />
              Powered by Groq Llama 3.3 70B
            </div>
            <h2 style={s.sectionTitle}>
              AI tools that give you
              <span style={s.titleBlue}> an unfair advantage</span>
            </h2>
            <p style={s.sectionSubtitle}>
              While other candidates send generic applications,
              you'll stand out with AI-personalized materials.
            </p>
            <button style={s.aiCTA} onClick={() => navigate('/register')}>
              Try AI Tools Free
              <MdArrowForward size={16} />
            </button>
          </div>
          <div style={s.aiToolsGrid}>
            {tools.map(tool => (
              <div key={tool.title} style={s.aiToolCard}>
                <span style={s.aiToolEmoji}>{tool.emoji}</span>
                <div>
                  <h3 style={{ ...s.aiToolTitle, color: tool.color }}>{tool.title}</h3>
                  <p style={s.aiToolDesc}>{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── TESTIMONIALS ─────────────────────────────────────
const Testimonials = () => {
  const [ref, visible] = useReveal();
  const reviews = [
    {
      name: 'Priya S.',
      role: 'Got hired at Infosys',
      text: 'The AI cover letter generator saved me hours. Each application felt personalized and professional. Got my first job offer within 3 weeks!',
      avatar: 'PS',
      color: '#0A66C2',
    },
    {
      name: 'Arjun M.',
      role: 'Software Engineer at TCS',
      text: 'I used to lose track of where I applied. Now I have a clear pipeline. The interview prep questions were spot on for my TCS interview!',
      avatar: 'AM',
      color: '#8B5CF6',
    },
    {
      name: 'Sneha R.',
      role: 'Fresher at Wipro',
      text: 'As a fresher I was overwhelmed by applications. JobTracker organized everything perfectly. The resume tips helped me pass ATS filters.',
      avatar: 'SR',
      color: '#10B981',
    },
  ];

  return (
    <section style={{ ...s.section, backgroundColor: '#F8FAFC' }} ref={ref}>
      <div style={{
        ...s.sectionInner,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.7s ease',
      }}>
        <div style={s.sectionLabel}>Testimonials</div>
        <h2 style={s.sectionTitle}>
          Loved by job seekers
          <span style={s.titleBlue}> across India</span>
        </h2>
        <div style={s.reviewsGrid}>
          {reviews.map(review => (
            <div key={review.name} style={s.reviewCard}>
              <div style={s.reviewStars}>{'⭐'.repeat(5)}</div>
              <p style={s.reviewText}>"{review.text}"</p>
              <div style={s.reviewAuthor}>
                <div style={{ ...s.reviewAvatar, backgroundColor: review.color }}>
                  {review.avatar}
                </div>
                <div>
                  <p style={s.reviewName}>{review.name}</p>
                  <p style={s.reviewRole}>{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CTA SECTION ──────────────────────────────────────
const CTASection = () => {
  const navigate = useNavigate();
  const [ref, visible] = useReveal();

  return (
    <section style={s.ctaSection} ref={ref}>
      <div style={{
        ...s.ctaInner,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.7s ease',
      }}>
        <h2 style={s.ctaTitle}>
          Ready to take control of your job search?
        </h2>
        <p style={s.ctaDesc}>
          Join hundreds of job seekers who track smarter,
          apply better, and land jobs faster.
        </p>
        <div style={s.ctaBtns}>
          <button style={s.ctaPrimary} onClick={() => navigate('/register')}>
            Get Started — It's Free
            <MdArrowForward size={18} />
          </button>
          <button style={s.ctaSecondary} onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
        <p style={s.ctaNote}>
          ✓ Free forever &nbsp; ✓ No credit card &nbsp; ✓ Cancel anytime
        </p>
      </div>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────
const Footer = () => (
  <footer style={s.footer}>
    <div style={s.footerInner}>
      <div style={s.footerTop}>
        <div style={s.footerBrand}>
          <div style={s.footerLogoRow}>
            <div style={s.navLogoIcon}><MdWork size={16} color="#fff" /></div>
            <span style={s.footerLogoText}>JobTracker</span>
          </div>
          <p style={s.footerTagline}>
            AI-powered job search management for modern job seekers.
          </p>
        </div>
        <div style={s.footerLinks}>
          <div style={s.footerCol}>
            <p style={s.footerColTitle}>Product</p>
            <p style={s.footerLink}>Features</p>
            <p style={s.footerLink}>AI Tools</p>
            <p style={s.footerLink}>How It Works</p>
          </div>
          <div style={s.footerCol}>
            <p style={s.footerColTitle}>Developer</p>
            <a href="https://github.com/RamRaj1440" style={s.footerLink} target="_blank" rel="noreferrer">GitHub</a>
            <a href="YOUR_LINKEDIN" style={s.footerLink} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="YOUR_PORTFOLIO" style={s.footerLink} target="_blank" rel="noreferrer">Portfolio</a>
          </div>
        </div>
      </div>
      <div style={s.footerBottom}>
        <p style={s.footerCopy}>© 2026 JobTracker by RamRaj Devulapalli</p>
        <p style={s.footerBuilt}>Built with React + Node.js + Groq AI</p>
      </div>
    </div>
  </footer>
);

// ─── MAIN LANDING PAGE ────────────────────────────────
export default function Landing() {
  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        button { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <AIToolsSection />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────
const s = {
  page: { overflowX: 'hidden', backgroundColor: '#fff' },

  // NAV
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, transition: 'all 0.3s ease' },
  navInner: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navLogo: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  navLogoIcon: { width: '32px', height: '32px', backgroundColor: '#0A66C2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navLogoText: { fontSize: '18px', fontWeight: '800', color: '#1a1a2e', letterSpacing: '-0.5px' },
  navLinks: { display: 'flex', gap: '4px' },
  navLink: { background: 'none', border: 'none', fontSize: '14px', fontWeight: '500', color: '#444', cursor: 'pointer', padding: '8px 14px', borderRadius: '8px' },
  navCTAs: { display: 'flex', gap: '10px', alignItems: 'center' },
  navSignIn: { padding: '8px 18px', background: 'none', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#333', cursor: 'pointer' },
  navGetStarted: { padding: '8px 18px', backgroundColor: '#0A66C2', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },

  // HERO
  hero: { minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 24px 60px', maxWidth: '1200px', margin: '0 auto', gap: '60px', position: 'relative' },
  heroBg: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 70% 50%, #EFF6FF 0%, transparent 60%)', pointerEvents: 'none', zIndex: -1 },
  heroGrid: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(#E2E8F015 1px, transparent 1px), linear-gradient(90deg, #E2E8F015 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: -1 },
  heroContent: { flex: 1, maxWidth: '560px' },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '20px', fontSize: '13px', fontWeight: '600', color: '#0A66C2', marginBottom: '24px' },
  heroTitle: { fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: '800', color: '#1a1a2e', lineHeight: '1.15', letterSpacing: '-2px', marginBottom: '20px' },
  heroTitleBlue: { color: '#0A66C2' },
  heroDesc: { fontSize: '17px', color: '#555', lineHeight: '1.7', marginBottom: '32px' },
  heroCTAs: { display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' },
  heroPrimary: { display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', backgroundColor: '#0A66C2', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },
  heroSecondary: { padding: '14px 28px', backgroundColor: '#fff', color: '#333', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  heroNote: { fontSize: '13px', color: '#94A3B8', marginBottom: '40px' },
  heroStats: { display: 'flex', gap: '36px' },
  heroStat: { display: 'flex', flexDirection: 'column', gap: '2px' },
  heroStatNum: { fontSize: '28px', fontWeight: '800', color: '#0A66C2', letterSpacing: '-1px' },
  heroStatLabel: { fontSize: '12px', color: '#888', fontWeight: '500' },
  heroVisual: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' },

  // APP PREVIEW
  appPreview: { width: '100%', maxWidth: '480px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #E2E8F0', overflow: 'hidden', animation: 'float 4s ease-in-out infinite' },
  appPreviewBar: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' },
  appPreviewDots: { display: 'flex', gap: '6px' },
  appDot: { width: '10px', height: '10px', borderRadius: '50%' },
  appPreviewUrl: { fontSize: '11px', color: '#94A3B8', marginLeft: '8px', fontFamily: 'monospace' },
  appPreviewBody: { padding: '16px' },
  miniStats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' },
  miniStat: { backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '10px 8px', textAlign: 'center', border: '1px solid #F1F5F9' },
  miniStatNum: { fontSize: '20px', fontWeight: '800', display: 'block', letterSpacing: '-0.5px' },
  miniStatLabel: { fontSize: '10px', color: '#94A3B8', fontWeight: '500' },
  miniTable: { display: 'flex', flexDirection: 'column', gap: '6px' },
  miniRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #F1F5F9' },
  miniCompany: { display: 'flex', alignItems: 'center', gap: '8px' },
  miniIcon: { width: '24px', height: '24px', backgroundColor: '#EFF6FF', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  miniCompanyName: { fontSize: '11px', fontWeight: '700', color: '#1a1a2e' },
  miniRoleName: { fontSize: '10px', color: '#94A3B8' },
  miniStatus: { fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' },

  // SECTIONS
  section: { padding: '100px 24px' },
  sectionInner: { maxWidth: '1200px', margin: '0 auto' },
  sectionLabel: { fontSize: '13px', fontWeight: '700', color: '#0A66C2', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' },
  sectionTitle: { fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', color: '#1a1a2e', letterSpacing: '-1px', marginBottom: '16px', lineHeight: '1.2' },
  sectionSubtitle: { fontSize: '16px', color: '#666', lineHeight: '1.7', maxWidth: '560px', marginBottom: '52px' },
  titleBlue: { color: '#0A66C2' },

  // FEATURES
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
  featureCard: { padding: '28px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' },
  featureIcon: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
  featureTitle: { fontSize: '17px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' },
  featureDesc: { fontSize: '14px', color: '#666', lineHeight: '1.7' },

  // HOW IT WORKS
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px', position: 'relative' },
  stepCard: { padding: '28px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', position: 'relative' },
  stepTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  stepIconBox: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontSize: '40px', fontWeight: '800', letterSpacing: '-2px' },
  stepTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' },
  stepDesc: { fontSize: '14px', color: '#666', lineHeight: '1.7' },
  stepArrow: { position: 'absolute', right: '-16px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#CBD5E1', zIndex: 1 },

  // AI TOOLS
  aiHeader: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' },
  aiBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#92400E', marginBottom: '16px' },
  aiCTA: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#0A66C2', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' },
  aiToolsGrid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  aiToolCard: { display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #F1F5F9' },
  aiToolEmoji: { fontSize: '28px', flexShrink: 0 },
  aiToolTitle: { fontSize: '15px', fontWeight: '700', marginBottom: '4px' },
  aiToolDesc: { fontSize: '13px', color: '#666', lineHeight: '1.6' },

  // TESTIMONIALS
  reviewsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  reviewCard: { padding: '28px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  reviewStars: { fontSize: '14px', marginBottom: '12px' },
  reviewText: { fontSize: '14px', color: '#444', lineHeight: '1.7', marginBottom: '20px', fontStyle: 'italic' },
  reviewAuthor: { display: 'flex', alignItems: 'center', gap: '12px' },
  reviewAvatar: { width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: '700', flexShrink: 0 },
  reviewName: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e' },
  reviewRole: { fontSize: '12px', color: '#10B981', fontWeight: '600' },

  // CTA
  ctaSection: { padding: '100px 24px', backgroundColor: '#0A66C2' },
  ctaInner: { maxWidth: '700px', margin: '0 auto', textAlign: 'center' },
  ctaTitle: { fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', color: '#fff', letterSpacing: '-1px', marginBottom: '16px', lineHeight: '1.2' },
  ctaDesc: { fontSize: '17px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', marginBottom: '36px' },
  ctaBtns: { display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' },
  ctaPrimary: { display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', backgroundColor: '#fff', color: '#0A66C2', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },
  ctaSecondary: { padding: '14px 28px', backgroundColor: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  ctaNote: { fontSize: '13px', color: 'rgba(255,255,255,0.6)' },

  // FOOTER
  footer: { backgroundColor: '#1a1a2e', padding: '60px 24px 32px' },
  footerInner: { maxWidth: '1200px', margin: '0 auto' },
  footerTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '32px' },
  footerBrand: { maxWidth: '280px' },
  footerLogoRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  footerLogoText: { fontSize: '18px', fontWeight: '800', color: '#fff' },
  footerTagline: { fontSize: '14px', color: '#64748B', lineHeight: '1.6' },
  footerLinks: { display: 'flex', gap: '48px' },
  footerCol: { display: 'flex', flexDirection: 'column', gap: '10px' },
  footerColTitle: { fontSize: '13px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' },
  footerLink: { fontSize: '14px', color: '#64748B', cursor: 'pointer', textDecoration: 'none' },
  footerBottom: { borderTop: '1px solid #2d2d3e', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' },
  footerCopy: { fontSize: '13px', color: '#475569' },
  footerBuilt: { fontSize: '13px', color: '#475569' },
};