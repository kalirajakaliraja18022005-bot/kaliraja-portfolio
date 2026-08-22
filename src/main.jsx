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
import { portfolioData } from "./data/portfolioData";

/* =====================================================
   PROJECT ICON LOGIC
===================================================== */

function getProjectIcon(project) {
  const text = `${project.title || ""} ${project.technologies || ""}`.toLowerCase();

  if (
    text.includes("ai") ||
    text.includes("interview") ||
    text.includes("vision") ||
    text.includes("assistant")
  ) {
    return BrainCircuit;
  }

  if (
    text.includes("sql") ||
    text.includes("mysql") ||
    text.includes("database") ||
    text.includes("mongo")
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

  // Read data directly from static data without backend fetch failure
  const profile = portfolioData.profile;
  const projects = portfolioData.projects;
  const skills = portfolioData.skills;

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
    setOpen(false);
  };

  const resumeDownloadUrl = profile.resumeUrl || "/resume.pdf";
  const profileImageUrl = profile.profileImage || "/images/profile.jpg";

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
          {profile.name}
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
              {profile.title.toUpperCase()}
            </p>

            <h1>
              Turning <span>ideas</span> into
              <br />
              impactful solutions.
            </h1>

            <p className="hero-text">
              Hi, I'm <strong>{profile.name}</strong>. {profile.bio}
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
                alt={profile.name}
              />
            </div>

            <div className="mini-stat">
              <span>Focus</span>
              <strong>Full Stack & AI</strong>
            </div>

            <div className="mini-stat">
              <span>Tools</span>
              <strong>React · Node · Python · Tailwind</strong>
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
              Passionate about code.
              <br />
              <span>Driven by innovation.</span>
            </h2>
          </div>

          <div className="about-grid">
            <p>
              I am a final-year Computer Science graduate focused on building scalable, user-centric web applications and modern AI solutions.
            </p>

            <p>
              My tech stack revolves around React, Node.js, Express, MongoDB, Tailwind CSS, Python, and integrating cutting-edge AI APIs to solve real-world problems.
            </p>
          </div>
        </section>

        {/* =================================================
            SKILLS
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
              Tools & Technologies I work with.
            </h2>
          </div>

          <div className="skills-grid">
            {skills.map((s) => (
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
            ))}
          </div>
        </section>

        {/* =================================================
            PROJECTS
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
                    {project.imageUrl && (
                      <img
                        src={project.imageUrl}
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

                    {technologies.length > 0 && (
                      <div className="tags">
                        {technologies.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    )}

                    {(project.githubUrl || project.liveUrl) && (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "18px",
                          flexWrap: "wrap",
                        }}
                      >
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
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

                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
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
                Ready to build scalable web & <span>AI applications.</span>
              </h2>

              <p>
                Actively seeking opportunities to work as a Software Engineer / Full Stack Developer where I can build impactful tech solutions and grow rapidly.
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
              Let's <span>connect.</span>
            </h2>

            <p>
              Feel free to reach out for project collaborations or full-time opportunities.
            </p>
          </div>

          <div className="contact-links">
            <a href={`mailto:${profile.email}`}>
              <Mail size={20} />
              {profile.email}
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={20} />
              LinkedIn
            </a>

            <a
              href={profile.github}
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
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>
          Built with React & Vite
        </span>
      </footer>

    </div>
  );
}

/* =====================================================
   RENDER
===================================================== */

createRoot(document.getElementById("root")).render(<App />);