import React from "react";
import { createRoot } from "react-dom/client";
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
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

/* =====================================================
   API BASE URL
===================================================== */

const API_URL = "https://kaliraja-portfolio-backend.onrender.com";

/* =====================================================
   PROJECT ICON LOGIC
===================================================== */

function getProjectIcon(project) {
  const text = `${project.title || ""} ${
    project.technologies || ""
  }`.toLowerCase();

  if (
    text.includes("ai") ||
    text.includes("interview") ||
    text.includes("fastapi") ||
    text.includes("vision")
  ) {
    return BrainCircuit;
  }

  if (
    text.includes("sql") ||
    text.includes("mysql") ||
    text.includes("database") ||
    text.includes("student")
  ) {
    return Database;
  }

  return BarChart3;
}

/* =====================================================
   MAIN PORTFOLIO APP
===================================================== */

function App() {
  const [open, setOpen] = React.useState(false);

  const [projects, setProjects] = React.useState([]);
  const [skills, setSkills] = React.useState([]);
  const [profile, setProfile] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  /* =====================================================
     FETCH DYNAMIC DATA (PROJECTS, SKILLS, PROFILE)
  ===================================================== */

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError("");

      const [projRes, skillRes, profRes] = await Promise.all([
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/skills`),
        fetch(`${API_URL}/profile`),
      ]);

      if (!projRes.ok) {
        throw new Error("Failed to fetch projects");
      }

      const projData = await projRes.json();
      const skillData = skillRes.ok ? await skillRes.json() : { skills: [] };
      const profData = profRes.ok ? await profRes.json() : {};

      const projectList = Array.isArray(projData)
        ? projData
        : Array.isArray(projData.projects)
        ? projData.projects
        : [];

      const skillList = Array.isArray(skillData)
        ? skillData
        : Array.isArray(skillData.skills)
        ? skillData.skills
        : [];

      setProjects(projectList);
      setSkills(skillList);
      setProfile(profData || {});
    } catch (err) {
      console.error("Portfolio fetch error:", err);
      setError(
        "Unable to load projects. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPortfolioData();
  }, []);

  /* =====================================================
     SMOOTH SCROLL
  ===================================================== */

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
    setOpen(false);
  };

  // Dynamic Assets with Fallbacks
  const resumeDownloadUrl = profile.resume_file
    ? `${API_URL}${profile.resume_file}`
    : "/resume.pdf";

  const profileImageUrl = profile.profile_image
    ? `${API_URL}${profile.profile_image}`
    : "/images/profile.jpg";

  return (
    <div className="app">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="nav">
        <button
          className="brand"
          onClick={() => go("home")}
        >
          <span>K</span>
          Kaliraja S
        </button>

        <div className={`nav-links ${open ? "show" : ""}`}>
          {["about", "skills", "projects", "contact"].map((id) => (
            <button
              key={id}
              onClick={() => go(id)}
            >
              {id[0].toUpperCase() + id.slice(1)}
            </button>
          ))}

          <a
            className="nav-resume"
            href={resumeDownloadUrl}
            target="_blank"
            rel="noreferrer"
            download
          >
            Resume
            <Download size={16} />
          </a>
        </div>

        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <main>

        {/* =================================================
            HOME (HERO)
        ================================================= */}

        <section
          id="home"
          className="hero section"
        >
          <div className="hero-copy">
            <p className="eyebrow">
              ASPIRING DATA ANALYST
            </p>

            <h1>
              Turning <span>data</span> into
              <br />
              meaningful insights.
            </h1>

            <p className="hero-text">
              Hi, I'm <strong>Kaliraja S</strong>, a B.Sc Computer Science
              graduate focused on Data Analytics, SQL, Python, and Power BI.
            </p>

            <div className="hero-actions">
              <button
                className="primary"
                onClick={() => go("projects")}
              >
                View My Work
                <ArrowUpRight size={18} />
              </button>

              <button
                className="secondary"
                onClick={() => go("contact")}
              >
                Contact Me
                <Mail size={18} />
              </button>
            </div>

            <div className="scroll-hint">
              <ChevronDown size={17} />
              Scroll to explore
            </div>
          </div>

          {/* PROFILE CARD */}
          <div className="hero-card">
            <div className="profile-circle">
              <img
                src={profileImageUrl}
                alt="Kaliraja S"
              />
            </div>

            <div className="mini-stat">
              <span>Focus</span>
              <strong>Data Analytics</strong>
            </div>

            <div className="mini-stat">
              <span>Tools</span>
              <strong>Python · SQL · Power BI</strong>
            </div>

            <div className="mini-stat">
              <span>Education</span>
              <strong>B.Sc Computer Science</strong>
            </div>
          </div>
        </section>

        {/* =================================================
            ABOUT
        ================================================= */}

        <section
          id="about"
          className="section"
        >
          <div className="section-head">
            <p className="eyebrow">
              ABOUT ME
            </p>

            <h2>
              Curious about data.
              <br />
              <span>Focused on growth.</span>
            </h2>
          </div>

          <div className="about-grid">
            <p>
              I am a Computer Science graduate building my career in Data
              Analytics. I enjoy working with data, finding patterns, and
              presenting information clearly to drive better decisions.
            </p>

            <p>
              My stack includes Python, Pandas, NumPy, SQL, MySQL, Excel, and
              Power BI, along with hands-on experience building full-stack web
              and AI-driven applications.
            </p>
          </div>
        </section>

        {/* =================================================
            SKILLS (DYNAMIC FROM DB)
        ================================================= */}

        <section
          id="skills"
          className="section tinted"
        >
          <div className="section-head">
            <p className="eyebrow">
              SKILLS
            </p>

            <h2>
              Tools I use to{" "}
              <span>work with data.</span>
            </h2>
          </div>

          <div className="skills-grid">
            {skills.length > 0 ? (
              skills.map((s) => (
                <div
                  className="skill-card"
                  key={s.id || s.name}
                >
                  <div className="icon-box">
                    <Code2 size={22} />
                  </div>

                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                </div>
              ))
            ) : (
              <p style={{ color: "#64717d" }}>No skills added yet.</p>
            )}
          </div>
        </section>

        {/* =================================================
            PROJECTS (DYNAMIC WITH IMAGES)
        ================================================= */}

        <section
          id="projects"
          className="section"
        >
          <div className="section-head">
            <p className="eyebrow">
              PROJECTS
            </p>

            <h2>
              Things I've{" "}
              <span>built.</span>
            </h2>
          </div>

          {/* PROJECT LOADING */}
          {loading && (
            <p style={{ color: "#64717d" }}>
              Loading projects...
            </p>
          )}

          {/* PROJECT ERROR */}
          {error && (
            <p style={{ color: "#c0392b" }}>
              {error}
            </p>
          )}

          {/* PROJECT CARDS */}
          {!loading && !error && projects.length > 0 && (
            <div className="projects-grid">
              {projects.map((project) => {
                const Icon = getProjectIcon(project);

                const technologies = project.technologies
                  ? project.technologies
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean)
                  : [];

                return (
                  <article
                    className="project-card"
                    key={project.id || project.title}
                  >
                    <div className="project-icon">
                      <Icon size={24} />
                    </div>

                    <div>
                      {/* Uploaded Project Thumbnail Image */}
                      {project.image_url && (
                        <img
                          src={`${API_URL}${project.image_url}`}
                          alt={project.title}
                          style={{
                            width: "100%",
                            height: "190px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            marginBottom: "14px",
                            border: "1px solid #dfe5e9",
                          }}
                        />
                      )}

                      <p className="project-label">
                        PROJECT
                      </p>

                      <h3>{project.title}</h3>

                      <p>{project.description}</p>

                      {/* TECHNOLOGIES */}
                      {technologies.length > 0 && (
                        <div className="tags">
                          {technologies.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      )}

                      {/* PROJECT LINKS */}
                      {(project.github_url || project.live_url) && (
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "18px",
                            flexWrap: "wrap",
                          }}
                        >
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="secondary"
                              style={{
                                padding: "8px 12px",
                                fontSize: "12px",
                              }}
                            >
                              <Github size={15} />
                              GitHub
                              <ExternalLink size={14} />
                            </a>
                          )}

                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noreferrer"
                              className="secondary"
                              style={{
                                padding: "8px 12px",
                                fontSize: "12px",
                              }}
                            >
                              Live Demo
                              <ExternalLink size={14} />
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

          {/* NO PROJECTS */}
          {!loading && !error && projects.length === 0 && (
            <p style={{ color: "#64717d" }}>
              No projects added yet.
            </p>
          )}
        </section>

        {/* =================================================
            CAREER GOAL
        ================================================= */}

        <section className="section journey">
          <div className="journey-card">
            <div>
              <p className="eyebrow">
                CAREER GOAL
              </p>

              <h2>
                Ready to start my journey in{" "}
                <span>Data Analytics.</span>
              </h2>

              <p>
                Looking for an opportunity where I can apply my analytical
                skills, learn from real-world data, and deliver impactful business insights.
              </p>
            </div>

            <BriefcaseBusiness
              size={54}
              strokeWidth={1.2}
            />
          </div>
        </section>

        {/* =================================================
            CONTACT
        ================================================= */}

        <section
          id="contact"
          className="section contact"
        >
          <div className="section-head">
            <p className="eyebrow">
              CONTACT
            </p>

            <h2>
              Let's{" "}
              <span>connect.</span>
            </h2>

            <p>
              If you have an opportunity or want to collaborate on a project,
              feel free to reach out.
            </p>
          </div>

          <div className="contact-links">
            <a href="mailto:your-email@example.com">
              <Mail size={20} />
              your-email@example.com
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={20} />
              LinkedIn
            </a>

            <a
              href="https://github.com/kalirajakaliraja18022005-bot"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={20} />
              GitHub
            </a>
          </div>
        </section>

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer>
        <span>
          © {new Date().getFullYear()} Kaliraja S
        </span>

        <span>
          Built with React & FastAPI
        </span>
      </footer>

    </div>
  );
}

/* =====================================================
   ROOT / ADMIN ROUTING
===================================================== */

function Root() {
  const path = window.location.pathname;

  /* ADMIN LOGIN */
  if (path === "/admin") {
    return (
      <AdminLogin
        onLogin={() => {
          window.location.href = "/admin/dashboard";
        }}
      />
    );
  }

  /* ADMIN DASHBOARD */
  if (path === "/admin/dashboard") {
    return <AdminDashboard />;
  }

  /* NORMAL PORTFOLIO */
  return <App />;
}

/* =====================================================
   RENDER
===================================================== */

createRoot(
  document.getElementById("root")
).render(
  <Root />
);