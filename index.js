import { useState, useEffect, useRef } from "react";

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const useCountUp = (target, inView, duration = 1800) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return val;
};

const skills = [
  { name: "Website Development", pct: 95 },
  { name: "Prompt Engineering", pct: 90 },
  { name: "Problem Solving", pct: 90 },
  { name: "Web App Development", pct: 85 },
  { name: "AI Model Training", pct: 80 },
  { name: "UI/UX & Design", pct: 75 },
];

const tools = [
  { name: "VS Code", icon: "⬡" },
  { name: "Figma", icon: "◈" },
  { name: "Next.js", icon: "▲" },
  { name: "React.js", icon: "⚛" },
  { name: "Node.js", icon: "◉" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Python", icon: "🐍" },
  { name: "OpenAI API", icon: "✦" },
  { name: "Git & GitHub", icon: "⑂" },
  { name: "Postman", icon: "📮" },
];

const services = [
  { icon: "</>", title: "Website Development", desc: "High-performance and responsive websites tailored to your needs." },
  { icon: "⬛", title: "Web App Development", desc: "Scalable, secure and dynamic web applications for modern businesses." },
  { icon: "AI", title: "AI Model Training", desc: "Custom AI models trained for accuracy, speed & real-world use cases." },
  { icon: ">_", title: "Prompt Engineering", desc: "Crafting powerful prompts to get the best out of AI models." },
];

const stats = [
  { value: 20, suffix: "+", label: "Projects Completed" },
  { value: 10, suffix: "+", label: "Happy Clients" },
  { value: 2, suffix: "+", label: "Years Experience" },
  { value: 1000, suffix: "+", label: "Lines / Day" },
];

function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const down = () => setClicked(true);
    const up = () => setClicked(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mousedown", down); window.removeEventListener("mouseup", up); };
  }, []);
  useEffect(() => {
    const id = requestAnimationFrame(() => setTrail(p => ({ x: p.x + (pos.x - p.x) * 0.12, y: p.y + (pos.y - p.y) * 0.12 })));
    return () => cancelAnimationFrame(id);
  }, [pos, trail]);
  return (
    <>
      <div style={{ position: "fixed", left: pos.x - 5, top: pos.y - 5, width: 10, height: 10, borderRadius: "50%", background: "#00e5cc", pointerEvents: "none", zIndex: 9999, transition: "transform 0.1s", transform: clicked ? "scale(2)" : "scale(1)", mixBlendMode: "difference" }} />
      <div style={{ position: "fixed", left: trail.x - 18, top: trail.y - 18, width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #00e5cc44", pointerEvents: "none", zIndex: 9998 }} />
    </>
  );
}

function SkillBar({ name, pct, inView }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { if (inView) { setTimeout(() => setWidth(pct), 200); } }, [inView, pct]);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: "#ccc", fontSize: 13, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'Space Mono', monospace" }}>{name}</span>
        <span style={{ color: "#00e5cc", fontWeight: 700, fontSize: 13, fontFamily: "'Space Mono', monospace" }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: "linear-gradient(90deg, #00e5cc, #00a8ff)", borderRadius: 2, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 0 12px #00e5cc88" }} />
      </div>
    </div>
  );
}

function StatCard({ value, suffix, label }) {
  const [ref, inView] = useInView(0.3);
  const count = useCountUp(value, inView);
  return (
    <div ref={ref} style={{ textAlign: "center", padding: "24px 16px" }}>
      <div style={{ fontSize: 48, fontWeight: 900, fontFamily: "'Bebas Neue', sans-serif", color: "#00e5cc", lineHeight: 1, textShadow: "0 0 30px #00e5cc66" }}>
        {count}{suffix}
      </div>
      <div style={{ color: "#888", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginTop: 6, fontFamily: "'Space Mono', monospace" }}>{label}</div>
    </div>
  );
}

export default function Portfolio() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const heroRef = useRef(null);
  const [aboutRef, aboutInView] = useInView();
  const [skillsRef, skillsInView] = useInView();
  const [toolsRef, toolsInView] = useInView();
  const [servicesRef, servicesInView] = useInView();
  const [contactRef, contactInView] = useInView();

  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 200); }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = ["home", "about", "skills", "services", "contact"];

  const glitchStyle = glitch ? {
    textShadow: "3px 0 #ff0055, -3px 0 #00e5cc",
    animation: "none",
    transform: "translate(-2px, 0)",
  } : {};

  return (
    <div style={{ background: "#070710", minHeight: "100vh", color: "#fff", fontFamily: "'Rajdhani', sans-serif", cursor: "none", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; cursor: none !important; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a15; }
        ::-webkit-scrollbar-thumb { background: #00e5cc; border-radius: 2px; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
        @keyframes pulse-border { 0%,100%{box-shadow:0 0 0 0 #00e5cc44} 50%{box-shadow:0 0 0 8px #00e5cc00} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .nav-link:hover { color: #00e5cc !important; }
        .service-card:hover { border-color: #00e5cc !important; transform: translateY(-6px) !important; box-shadow: 0 20px 40px #00e5cc18 !important; }
        .tool-chip:hover { background: #00e5cc22 !important; border-color: #00e5cc !important; color: #00e5cc !important; transform: scale(1.08) !important; }
        .cta-btn:hover { background: transparent !important; color: #00e5cc !important; box-shadow: 0 0 30px #00e5cc44 !important; }
        .social-link:hover { color: #00e5cc !important; transform: translateY(-3px) !important; }
        .noise { position: fixed; top:0;left:0;width:100%;height:100%; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events:none; z-index:1; opacity:0.35; }
      `}</style>

      <Cursor />
      <div className="noise" />

      {/* Scanline effect */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "2px", background: "linear-gradient(transparent, #00e5cc22, transparent)", animation: "scanline 6s linear infinite", pointerEvents: "none", zIndex: 2 }} />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 5%", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrollY > 50 ? "rgba(7,7,16,0.95)" : "transparent", backdropFilter: scrollY > 50 ? "blur(20px)" : "none", borderBottom: scrollY > 50 ? "1px solid #00e5cc18" : "none", transition: "all 0.4s" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 4, color: "#00e5cc" }}>VIBHANSH</div>
        <div style={{ display: "flex", gap: 36, listStyle: "none" }}>
          {navLinks.map(link => (
            <button key={link} className="nav-link" onClick={() => scrollTo(link)} style={{ background: "none", border: "none", color: activeSection === link ? "#00e5cc" : "#888", textTransform: "uppercase", letterSpacing: 2, fontSize: 12, fontFamily: "'Space Mono', monospace", transition: "color 0.3s", fontWeight: 700 }}>
              {link}
            </button>
          ))}
        </div>
        <a href="mailto:vvibhansh@gmail.com" className="cta-btn" style={{ background: "#00e5cc", color: "#000", padding: "8px 20px", borderRadius: 3, fontSize: 11, fontFamily: "'Space Mono', monospace", letterSpacing: 2, textDecoration: "none", textTransform: "uppercase", border: "1px solid #00e5cc", transition: "all 0.3s", fontWeight: 700 }}>Hire Me</a>
      </nav>

      {/* HERO */}
      <section id="home" ref={heroRef} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 5%", position: "relative", overflow: "hidden" }}>
        {/* BG grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#00e5cc08 1px, transparent 1px), linear-gradient(90deg, #00e5cc08 1px, transparent 1px)", backgroundSize: "60px 60px", transform: `translateY(${scrollY * 0.3}px)` }} />

        {/* Glow orb */}
        <div style={{ position: "absolute", right: "5%", top: "15%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #00e5cc18 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "20%", bottom: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #0055ff12 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 3, maxWidth: 900 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 16px", border: "1px solid #00e5cc44", borderRadius: 2, marginBottom: 24, animation: "fadeUp 0.6s ease both" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e5cc", animation: "pulse-border 2s infinite" }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00e5cc", letterSpacing: 3, textTransform: "uppercase" }}>Tech Enthusiast • Ajmer, India</span>
          </div>

          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(80px, 16vw, 170px)", lineHeight: 0.9, letterSpacing: 4, animation: "fadeUp 0.7s 0.1s ease both", opacity: 0, animationFillMode: "forwards", ...glitchStyle, transition: "text-shadow 0.1s, transform 0.1s" }}>
            VIBHANSH
          </h1>

          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "clamp(16px, 2.5vw, 22px)", color: "#00e5cc", fontStyle: "italic", letterSpacing: 3, marginTop: 8, marginBottom: 32, animation: "fadeUp 0.7s 0.2s ease both", opacity: 0, animationFillMode: "forwards" }}>
            I Build. I Innovate. I Elevate.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 48, animation: "fadeUp 0.7s 0.3s ease both", opacity: 0, animationFillMode: "forwards" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 24px", border: "1px solid #1a1a2e", borderRadius: 3, background: "#0d0d1a" }}>
              <span style={{ fontSize: 20 }}>👤</span>
              <div>
                <div style={{ fontSize: 11, color: "#555", fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}>EXPERIENCE</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>2+ Years</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 24px", border: "1px solid #1a1a2e", borderRadius: 3, background: "#0d0d1a" }}>
              <span style={{ fontSize: 20 }}>📍</span>
              <div>
                <div style={{ fontSize: 11, color: "#555", fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}>LOCATION</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Ajmer, India</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, animation: "fadeUp 0.7s 0.4s ease both", opacity: 0, animationFillMode: "forwards" }}>
            <button className="cta-btn" onClick={() => scrollTo("contact")} style={{ padding: "14px 36px", background: "#00e5cc", color: "#000", border: "1px solid #00e5cc", borderRadius: 3, fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}>
              Let's Connect →
            </button>
            <button className="cta-btn" onClick={() => scrollTo("services")} style={{ padding: "14px 36px", background: "transparent", color: "#00e5cc", border: "1px solid #00e5cc44", borderRadius: 3, fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}>
              My Services
            </button>
          </div>
        </div>

        {/* Role badge */}
        <div style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", textAlign: "right", animation: "fadeUp 0.7s 0.5s ease both", opacity: 0, animationFillMode: "forwards" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 4vw, 48px)", color: "#fff", lineHeight: 1.1 }}>WEBSITE MAKER</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 4vw, 48px)", color: "#00e5cc", lineHeight: 1.1, textShadow: "0 0 30px #00e5cc88" }}>DEVELOPER</div>
          <div style={{ width: 60, height: 2, background: "#00e5cc", marginLeft: "auto", marginTop: 12 }} />
          <p style={{ color: "#666", fontSize: 13, marginTop: 12, fontFamily: "'Space Mono', monospace", lineHeight: 1.6 }}>
            Tech enthusiast who loves<br />building things that solve<br />real problems.
          </p>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "float 2s ease-in-out infinite" }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#444", letterSpacing: 3, textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #00e5cc, transparent)" }} />
        </div>
      </section>

      {/* STATS MARQUEE */}
      <div style={{ background: "#00e5cc", padding: "14px 0", overflow: "hidden", position: "relative" }}>
        <div style={{ display: "flex", animation: "marquee 20s linear infinite", width: "200%" }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 40, whiteSpace: "nowrap", flex: "0 0 50%" }}>
              {["20+ Projects Completed", "10+ Satisfied Clients", "2+ Years Experience", "1000+ Lines of Code Daily", "Always Learning • Always Building", "Website Development • AI • Prompt Engineering"].map((t, j) => (
                <span key={j} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3, color: "#000", display: "flex", alignItems: "center", gap: 40 }}>
                  {t} <span style={{ color: "#00000044" }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" ref={aboutRef} style={{ padding: "120px 5%", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div style={{ opacity: aboutInView ? 1 : 0, transform: aboutInView ? "translateX(0)" : "translateX(-50px)", transition: "all 0.8s ease" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00e5cc", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>// 01 About Me</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1, marginBottom: 24 }}>
              Turning Ideas<br />Into <span style={{ color: "#00e5cc" }}>Digital</span><br />Reality
            </h2>
            <div style={{ width: 60, height: 2, background: "#00e5cc", marginBottom: 28 }} />
            <p style={{ color: "#999", lineHeight: 1.9, fontSize: 16, fontFamily: "'Rajdhani', sans-serif", fontWeight: 400, borderLeft: "2px solid #00e5cc", paddingLeft: 20 }}>
              I'm a tech enthusiast who loves building websites, web apps, and smart AI solutions. From idea to implementation, I enjoy creating digital experiences that make an impact. With a strong foundation in both development and AI, I bridge the gap between creativity and technology.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 24 }}>
              {["vvibhansh@gmail.com", "@vibhansh_04"].map((item, i) => (
                <div key={i} style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00e5cc", letterSpacing: 1 }}>{item}</div>
              ))}
            </div>
          </div>

          <div style={{ opacity: aboutInView ? 1 : 0, transform: aboutInView ? "translateX(0)" : "translateX(50px)", transition: "all 0.8s 0.2s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: i % 2 === 0 ? "#0d0d1a" : "#0a1628", border: "1px solid #1a1a2e", padding: "32px 24px", textAlign: "center" }}>
                  <StatCard {...s} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" ref={skillsRef} style={{ padding: "120px 5%", background: "#0a0a15", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -100, top: "50%", transform: "translateY(-50%)", width: 400, height: 400, borderRadius: "50%", border: "1px solid #00e5cc12", animation: "spin-slow 20s linear infinite" }} />
        <div style={{ position: "absolute", right: -50, top: "50%", transform: "translateY(-50%)", width: 250, height: 250, borderRadius: "50%", border: "1px solid #00e5cc20", animation: "spin-slow 15s linear infinite reverse" }} />

        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00e5cc", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>// 02 My Skills</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 72px)" }}>What I <span style={{ color: "#00e5cc" }}>Do Best</span></h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
            <div style={{ opacity: skillsInView ? 1 : 0, transform: skillsInView ? "translateY(0)" : "translateY(30px)", transition: "all 0.7s ease" }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 3, color: "#00e5cc", marginBottom: 32 }}>PROFICIENCY</h3>
              {skills.map((s, i) => <SkillBar key={i} {...s} inView={skillsInView} />)}
            </div>

            <div ref={toolsRef} style={{ opacity: toolsInView ? 1 : 0, transform: toolsInView ? "translateY(0)" : "translateY(30px)", transition: "all 0.7s 0.2s ease" }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 3, color: "#00e5cc", marginBottom: 32 }}>TOOLS I USE</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {tools.map((t, i) => (
                  <div key={i} className="tool-chip" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", border: "1px solid #1a1a2e", borderRadius: 3, background: "#0d0d1a", color: "#aaa", fontSize: 13, fontFamily: "'Space Mono', monospace", transition: "all 0.3s", animationDelay: `${i * 0.05}s` }}>
                    <span style={{ fontSize: 16 }}>{t.icon}</span>
                    {t.name}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 40, padding: 24, border: "1px solid #00e5cc22", borderRadius: 4, background: "linear-gradient(135deg, #0d0d1a, #0a1628)" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 2, color: "#00e5cc", marginBottom: 16 }}>★ ACHIEVEMENTS</div>
                {["20+ Projects Completed", "10+ Satisfied Clients", "2+ Years of Hands-on Experience", "1000+ Lines of Code Written Daily", "Always Learning, Always Building"].map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, color: "#ccc", fontSize: 13, fontFamily: "'Rajdhani', sans-serif", fontWeight: 500 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5cc", flexShrink: 0 }} />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" ref={servicesRef} style={{ padding: "120px 5%" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00e5cc", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>// 03 Services</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 72px)" }}>What I <span style={{ color: "#00e5cc" }}>Offer</span></h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, maxWidth: 900, margin: "0 auto" }}>
          {services.map((s, i) => (
            <div key={i} className="service-card" style={{ padding: 36, border: "1px solid #1a1a2e", borderRadius: 4, background: "#0d0d1a", opacity: servicesInView ? 1 : 0, transform: servicesInView ? "translateY(0)" : "translateY(40px)", transition: `all 0.6s ${i * 0.1}s ease`, cursor: "none" }}>
              <div style={{ width: 48, height: 48, border: "1px solid #00e5cc44", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontSize: 14, color: "#00e5cc", marginBottom: 20 }}>
                {s.icon}
              </div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, marginBottom: 12 }}>{s.title}</h3>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.7, fontFamily: "'Rajdhani', sans-serif", fontWeight: 400 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section style={{ padding: "80px 5%", background: "linear-gradient(135deg, #0a1628, #0d0d1a)", borderTop: "1px solid #00e5cc18", borderBottom: "1px solid #00e5cc18", textAlign: "center" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(32px, 5vw, 60px)", lineHeight: 1.1, marginBottom: 20 }}>
          LET'S BUILD SOMETHING <span style={{ color: "#00e5cc" }}>AMAZING</span>
        </div>
        <p style={{ color: "#666", fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: 1, marginBottom: 36 }}>
          Got an idea? Let's turn it into something powerful.
        </p>
        <button className="cta-btn" onClick={() => scrollTo("contact")} style={{ padding: "16px 48px", background: "#00e5cc", color: "#000", border: "1px solid #00e5cc", borderRadius: 3, fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}>
          Start a Project →
        </button>
      </section>

      {/* CONTACT */}
      <section id="contact" ref={contactRef} style={{ padding: "120px 5%" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00e5cc", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>// 04 Contact</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 72px)" }}>Get In <span style={{ color: "#00e5cc" }}>Touch</span></h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, opacity: contactInView ? 1 : 0, transform: contactInView ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s ease" }}>
            <div>
              <div style={{ marginBottom: 40 }}>
                {[
                  { icon: "✉", label: "Email", value: "vvibhansh@gmail.com", href: "mailto:vvibhansh@gmail.com" },
                  { icon: "🌐", label: "Website", value: "portfoliovibhansh.vercel.app", href: "https://portfoliovibhansh.vercel.app" },
                  { icon: "📸", label: "Instagram", value: "@vibhansh_04", href: "https://instagram.com/vibhansh_04" },
                ].map((item, i) => (
                  <a key={i} href={item.href} className="social-link" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, color: "#aaa", textDecoration: "none", transition: "all 0.3s" }}>
                    <div style={{ width: 44, height: 44, border: "1px solid #1a1a2e", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: "#0d0d1a", flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: "#555", letterSpacing: 2, textTransform: "uppercase" }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontFamily: "'Rajdhani', sans-serif", fontWeight: 500, marginTop: 2 }}>{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { placeholder: "Your Name", type: "text" },
                { placeholder: "Your Email", type: "email" },
              ].map((f, i) => (
                <input key={i} type={f.type} placeholder={f.placeholder} style={{ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: 3, padding: "14px 18px", color: "#fff", fontFamily: "'Rajdhani', sans-serif", fontSize: 15, outline: "none", width: "100%", transition: "border-color 0.3s" }}
                  onFocus={e => e.target.style.borderColor = "#00e5cc"}
                  onBlur={e => e.target.style.borderColor = "#1a1a2e"} />
              ))}
              <textarea placeholder="Your Message" rows={4} style={{ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: 3, padding: "14px 18px", color: "#fff", fontFamily: "'Rajdhani', sans-serif", fontSize: 15, outline: "none", width: "100%", resize: "none", transition: "border-color 0.3s" }}
                onFocus={e => e.target.style.borderColor = "#00e5cc"}
                onBlur={e => e.target.style.borderColor = "#1a1a2e"} />
              <button className="cta-btn" style={{ padding: "14px 32px", background: "#00e5cc", color: "#000", border: "1px solid #00e5cc", borderRadius: 3, fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s" }}
                onClick={() => window.location.href = "mailto:vvibhansh@gmail.com"}>
                Send Message →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 5%", borderTop: "1px solid #1a1a2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 4, color: "#00e5cc" }}>VIBHANSH</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#444", letterSpacing: 1 }}>
          © 2026 Vibhansh. Built with passion.
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {navLinks.map(link => (
            <button key={link} className="nav-link" onClick={() => scrollTo(link)} style={{ background: "none", border: "none", color: "#555", fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", transition: "color 0.3s" }}>
              {link}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
