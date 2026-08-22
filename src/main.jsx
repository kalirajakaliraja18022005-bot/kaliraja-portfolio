import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

function getProjectIcon(project) {
  const text = `${project.title || ""} ${project.technologies || ""}`.toLowerCase();
  if (text.includes("ai") || text.includes("interview") || text.includes("vision")) return BrainCircuit;
  if (text.includes("sql") || text.includes("database") || text.includes("mysql") || text.includes("sales")) return Database;
  return BarChart3;
}

function PortfolioHome() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data: profData } = await supabase.from("profile").select("*").eq("id", 1).single();
      const { data: pData } = await supabase.from("projects").select("*").order("id", { ascending: false });
      const { data: sData } = await supabase.from("skills").select("*").order("id", { ascending: false });

      if (profData) setProfile(profData);
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

  const name = profile.name || "Kaliraja S";
  const title = profile.title || "Aspiring Data Analyst";
  const bio = profile.bio || "Computer Science graduate transitioning into Data Analytics with a strong foundation in Python, SQL, Excel, and Power BI.";
  const email = profile.email || "kaliraja@example.com";
  const github = profile.github || "https://github.com/kalirajakaliraja18022005-bot";
  const linkedin = profile.linkedin || "https://linkedin.com/";
  const profileImg = profile.profile_image || "/images/profile.jpg";
  const resumeUrl = profile.resume_file || "/resume.pdf";

  return (
    <div className="app">
      <nav className="nav">
        <button className="brand" onClick={() => go("home")}>
          <span>K</span> {name}
        </button>

        <div className={`nav-links ${open ? "show" : ""}`}>
          {["about", "skills", "projects", "contact"].map((id) => (
            <button key={id} onClick={() => go(id)}>
              {id[0].toUpperCase() + id.slice(1)}
            </button>
          ))}
          <a className="nav-resume" href={resumeUrl} target="_blank" rel="noreferrer" download>
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
            <p className="eyebrow">{title.toUpperCase()}</p>
            <h1>Turning <span>data</span> into<br />actionable insights.</h1>
            <p className="hero-text">
              Hi, I'm <strong>{name}</strong>. {bio}
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
              <img src={profileImg} alt={name} />
            </div>
            <div className="mini-stat"><span>Focus</span><strong>Data Analytics & BI</strong></div>
            <div className="mini-stat"><span>Tools</span><strong>Python · SQL · Power BI · Excel</strong></div>
            <div className="mini-stat"><span>Education</span><strong>B.Sc Computer Science</strong></div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section">
          <div className="section-head">
            <p className="eyebrow">ABOUT ME</p>
            <h2>Passionate about data.<br /><span>Driven by insights.</span></h2>
          </div>
          <div className="about-grid">
            <p>{bio}</p>
            <p>I focus on exploratory data analysis (EDA), writing complex SQL queries, and designing interactive dashboards to solve real-world business problems.</p>
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
            <p style={{ color: "#64717d" }}>Loading projects from cloud database...</p>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => {
                const Icon = getProjectIcon(project);
                const technologies = project.technologies ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean) : [];

                return (
                  <article className="project-card" key={project.id} style={{ display: "flex", flexDirection: "column" }}>
                    {/* Image or Icon Container */}
                    {project.image_url ? (
                      <div style={{ width: "100%", height: "190px", borderRadius: "10px", overflow: "hidden", marginBottom: "14px", border: "1px solid #dfe5e9", background: "#f8fafc" }}>
                        <img 
                          src={project.image_url} 
                          alt={project.title} 
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
                        />
                      </div>
                    ) : (
                      <div className="project-icon" style={{ marginBottom: "14px" }}>
                        <Icon size={24} />
                      </div>
                    )}

                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <p className="project-label">PROJECT</p>
                      <h3 style={{ marginTop: "4px" }}>{project.title}</h3>
                      <p style={{ marginTop: "8px", flex: 1 }}>{project.description}</p>

                      {technologies.length > 0 && (
                        <div className="tags" style={{ marginTop: "14px" }}>
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
              <h2>Ready to start my journey in <span>Data Analytics.</span></h2>
              <p>Looking for an entry-level Data Analyst role to apply analytical modeling, SQL querying, and business intelligence reporting.</p>
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
            <a href={`mailto:${email}`}><Mail size={20} /> {email}</a>
            <a href={linkedin} target="_blank" rel="noreferrer"><Linkedin size={20} /> LinkedIn</a>
            <a href={github} target="_blank" rel="noreferrer"><Github size={20} /> GitHub</a>
          </div>
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} {name}</span>
        <span>Connected to Supabase Cloud Database</span>
      </footer>
    </div>
  );
}

// Protected Route Checks
function ProtectedAdminRoute() {
  const isAuth = localStorage.getItem("admin_auth") === "true";
  return isAuth ? <AdminDashboard /> : <Navigate to="/admin" replace />;
}

function AdminLoginRoute() {
  const isAuth = localStorage.getItem("admin_auth") === "true";
  return isAuth ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/admin" element={<AdminLoginRoute />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute />} />
        <Route path="*" element={<PortfolioHome />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);