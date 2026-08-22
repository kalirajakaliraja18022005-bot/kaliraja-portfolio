import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Database,
  Download,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  Code2,
  BrainCircuit,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

import "./styles.css";
import { supabase } from "./supabaseClient";
import AdminDashboard from "./AdminDashboard";

function getProjectIcon(project) {
  const text = `${project.title || ""} ${project.technologies || ""}`.toLowerCase();
  if (text.includes("ai") || text.includes("interview") || text.includes("vision")) return BrainCircuit;
  if (text.includes("sql") || text.includes("database") || text.includes("mongo")) return Database;
  return BarChart3;
}

function PortfolioHome() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data: pData } = await supabase.from("projects").select("*").order("id", { ascending: false });
      const { data: sData } = await supabase.from("skills").select("*").order("id", { ascending: false });
      if (pData) setProjects(pData);
      if (sData) setSkills(sData);
      setLoading(false);
    }
    loadData();
  }, []);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <div className="app">
      <nav className="nav">
        <button className="brand" onClick={() => go("home")}>
          <span>K</span> Kaliraja S
        </button>

        <div className={`nav-links ${open ? "show" : ""}`}>
          {["about", "skills", "projects", "contact"].map((id) => (
            <button key={id} onClick={() => go(id)}>
              {id[0].toUpperCase() + id.slice(1)}
            </button>
          ))}
          <a className="nav-resume" href="/resume.pdf" target="_blank" rel="noreferrer" download>
            Resume <Download size={16} />
          </a>
        </div>

        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <main>
        {/* HERO */}
        <section id="home" className="hero section">
          <div className="hero-copy">
            <p className="eyebrow">FULL STACK DEVELOPER & AI ENTHUSIAST</p>
            <h1>Turning <span>ideas</span> into<br />impactful solutions.</h1>
            <p className="hero-text">
              Hi, I'm <strong>Kaliraja S</strong>, a Computer Science graduate building scalable web applications, modern UIs, and AI-driven platforms.
            </p>
            <div className="hero-actions">
              <button className="primary" onClick={() => go("projects")}>
                View My Work <ArrowUpRight size={18} />
              </button>
              <button className="secondary" onClick={() => go("contact")}>
                Contact Me <Mail size={18} />
              </button>
            </div>
            <div className="scroll-hint"><ChevronDown size={17} /> Scroll to explore</div>
          </div>

          <div className="hero-card">
            <div className="profile-circle">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" alt="Kaliraja S" />
            </div>
            <div className="mini-stat"><span>Focus</span><strong>Full Stack & AI</strong></div>
            <div className="mini-stat"><span>Tools</span><strong>React · Node · Python · Tailwind</strong></div>
            <div className="mini-stat"><span>Education</span><strong>B.Sc Computer Science</strong></div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section">
          <div className="section-head">
            <p className="eyebrow">ABOUT ME</p>
            <h2>Passionate about code.<br /><span>Driven by innovation.</span></h2>
          </div>
          <div className="about-grid">
            <p>I am a Computer Science graduate passionate about building responsive web applications and AI-enabled systems.</p>
            <p>My core skills include React, Node.js, Express, MongoDB, Tailwind CSS, Python, and integrating modern AI APIs.</p>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="section tinted">
          <div className="section-head">
            <p className="eyebrow">SKILLS</p>
            <h2>Tools & Technologies</h2>
          </div>
          <div className="skills-grid">
            {skills.map((s) => (
              <div className="skill-card" key={s.id}>
                <div className="icon-box"><Code2 size={22} /></div>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="section">
          <div className="section-head">
            <p className="eyebrow">PROJECTS</p>
            <h2>Things I've <span>built.</span></h2>
          </div>

          {loading ? (
            <p style={{ color: "#64717d" }}>Loading projects...</p>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => {
                const Icon = getProjectIcon(project);
                const technologies = project.technologies ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean) : [];

                return (
                  <article className="project-card" key={project.id}>
                    <div className="project-icon"><Icon size={24} /></div>
                    <div>
                      {project.image_url && (
                        <img src={project.image_url} alt={project.title} style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "10px", marginBottom: "14px", border: "1px solid #dfe5e9" }} />
                      )}
                      <p className="project-label">PROJECT</p>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      {technologies.length > 0 && (
                        <div className="tags">
                          {technologies.map((tag) => <span key={tag}>{tag}</span>)}
                        </div>
                      )}
                      {(project.github_url || project.live_url) && (
                        <div style={{ display: "flex", gap: "10px", marginTop: "18px", flexWrap: "wrap" }}>
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noreferrer" className="secondary" style={{ padding: "8px 12px", fontSize: "12px" }}>
                              <Github size={15} /> GitHub <ExternalLink size={14} />
                            </a>
                          )}
                          {project.live_url && (
                            <a href={project.live_url} target="_blank" rel="noreferrer" className="secondary" style={{ padding: "8px 12px", fontSize: "12px" }}>
                              Live Demo <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* CAREER */}
        <section className="section journey">
          <div className="journey-card">
            <div>
              <p className="eyebrow">CAREER GOAL</p>
              <h2>Ready to build scalable web & <span>AI applications.</span></h2>
              <p>Actively seeking opportunities as a Software Engineer / Full Stack Developer.</p>
            </div>
            <BriefcaseBusiness size={54} strokeWidth={1.2} />
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section contact">
          <div className="section-head">
            <p className="eyebrow">CONTACT</p>
            <h2>Let's <span>connect.</span></h2>
          </div>
          <div className="contact-links">
            <a href="mailto:kaliraja@example.com"><Mail size={20} /> kaliraja@example.com</a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer"><Linkedin size={20} /> LinkedIn</a>
            <a href="https://github.com/kalirajakaliraja18022005-bot" target="_blank" rel="noreferrer"><Github size={20} /> GitHub</a>
          </div>
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} Kaliraja S</span>
        <span>Connected with Cloud Database</span>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<PortfolioHome />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);