import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Plus, Trash2, ArrowLeft, RefreshCw, CheckCircle, Save } from "lucide-react";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Profile Form States
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  // Project Form States
  const [pTitle, setPTitle] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pTech, setPTech] = useState("");
  const [pGithub, setPGithub] = useState("");
  const [pLive, setPLive] = useState("");
  const [pImg, setPImg] = useState("");

  // Skill Form States
  const [sName, setSName] = useState("");
  const [sDesc, setSDesc] = useState("");

  const fetchData = async () => {
    setLoading(true);
    // 1. Fetch Profile
    const { data: profData } = await supabase.from("profile").select("*").eq("id", 1).single();
    if (profData) {
      setName(profData.name || "");
      setTitle(profData.title || "");
      setBio(profData.bio || "");
      setEmail(profData.email || "");
      setGithub(profData.github || "");
      setLinkedin(profData.linkedin || "");
      setProfileImg(profData.profile_image || "");
      setResumeUrl(profData.resume_file || "");
    }

    // 2. Fetch Projects
    const { data: projData } = await supabase.from("projects").select("*").order("id", { ascending: false });
    if (projData) setProjects(projData);

    // 3. Fetch Skills
    const { data: skillData } = await supabase.from("skills").select("*").order("id", { ascending: false });
    if (skillData) setSkills(skillData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Profile Details
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("profile").upsert({
      id: 1,
      name,
      title,
      bio,
      email,
      github,
      linkedin,
      profile_image: profileImg,
      resume_file: resumeUrl
    });

    if (!error) {
      setStatusMsg("Profile updated successfully in Supabase!");
      setTimeout(() => setStatusMsg(""), 4000);
    }
    setLoading(false);
  };

  // Add Project
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!pTitle || !pDesc) return;
    setLoading(true);
    const { error } = await supabase.from("projects").insert([
      {
        title: pTitle,
        description: pDesc,
        technologies: pTech,
        github_url: pGithub,
        live_url: pLive,
        image_url: pImg
      }
    ]);
    if (!error) {
      setPTitle("");
      setPDesc("");
      setPTech("");
      setPGithub("");
      setPLive("");
      setPImg("");
      setStatusMsg("Project added successfully!");
      setTimeout(() => setStatusMsg(""), 4000);
      fetchData();
    }
    setLoading(false);
  };

  const handleDeleteProject = async (id) => {
    await supabase.from("projects").delete().eq("id", id);
    fetchData();
  };

  // Add Skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!sName) return;
    setLoading(true);
    const { error } = await supabase.from("skills").insert([
      { name: sName, description: sDesc }
    ]);
    if (!error) {
      setSName("");
      setSDesc("");
      setStatusMsg("Skill added successfully!");
      setTimeout(() => setStatusMsg(""), 4000);
      fetchData();
    }
    setLoading(false);
  };

  const handleDeleteSkill = async (id) => {
    await supabase.from("skills").delete().eq("id", id);
    fetchData();
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <h2>🚀 Full Portfolio Admin Control Panel</h2>
        <a href="/" style={{ textDecoration: "none", color: "#2563eb", fontWeight: "bold" }}>
          ← View Live Portfolio
        </a>
      </div>

      {statusMsg && (
        <div style={{ padding: "12px 16px", background: "#dcfce7", color: "#166534", borderRadius: "8px", marginBottom: "20px", fontWeight: "bold" }}>
          {statusMsg}
        </div>
      )}

      {/* 1. EDIT PROFILE SECTION */}
      <section style={{ background: "#f8fafc", padding: "22px", borderRadius: "12px", marginBottom: "30px", border: "1px solid #e2e8f0" }}>
        <h3>👤 Edit Personal & Contact Details</h3>
        <form onSubmit={handleUpdateProfile} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "15px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "4px" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Professional Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Full Stack Developer & AI Enthusiast" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "4px" }} />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Hero / Bio Description</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "4px" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Email Address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "4px" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>GitHub Profile URL</label>
            <input value={github} onChange={(e) => setGithub(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "4px" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>LinkedIn Profile URL</label>
            <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "4px" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Resume File URL / Drive Link</label>
            <input value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="/resume.pdf or Google Drive link" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "4px" }} />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#475569" }}>Profile Image URL (Direct Link)</label>
            <input value={profileImg} onChange={(e) => setProfileImg(e.target.value)} placeholder="https://images.unsplash.com/... or direct image link" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "4px" }} />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <button type="submit" disabled={loading} style={{ background: "#0f172a", color: "#fff", padding: "12px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
              {loading ? "Saving Profile..." : "💾 Save Profile Changes"}
            </button>
          </div>
        </form>
      </section>

      {/* 2. ADD PROJECT */}
      <section style={{ background: "#f8fafc", padding: "22px", borderRadius: "12px", marginBottom: "30px", border: "1px solid #e2e8f0" }}>
        <h3>📁 Add New Project</h3>
        <form onSubmit={handleAddProject} style={{ display: "grid", gap: "12px", marginTop: "15px" }}>
          <input placeholder="Project Title *" value={pTitle} onChange={(e) => setPTitle(e.target.value)} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <textarea placeholder="Description *" value={pDesc} onChange={(e) => setPDesc(e.target.value)} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="Technologies (e.g. React, Node.js, Tailwind, Python)" value={pTech} onChange={(e) => setPTech(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="GitHub URL" value={pGithub} onChange={(e) => setPGithub(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="Live Demo URL" value={pLive} onChange={(e) => setPLive(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="Project Image URL" value={pImg} onChange={(e) => setPImg(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <button type="submit" disabled={loading} style={{ background: "#2563eb", color: "#fff", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            {loading ? "Saving..." : "+ Add Project"}
          </button>
        </form>
      </section>

      {/* 3. ADD SKILL */}
      <section style={{ background: "#f8fafc", padding: "22px", borderRadius: "12px", marginBottom: "30px", border: "1px solid #e2e8f0" }}>
        <h3>⚡ Add New Skill</h3>
        <form onSubmit={handleAddSkill} style={{ display: "grid", gap: "12px", marginTop: "15px" }}>
          <input placeholder="Skill Name (e.g. React.js, Python, MongoDB) *" value={sName} onChange={(e) => setSName(e.target.value)} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="Skill Description (e.g. Frontend UI components & state)" value={sDesc} onChange={(e) => setSDesc(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <button type="submit" disabled={loading} style={{ background: "#16a34a", color: "#fff", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            {loading ? "Saving..." : "+ Add Skill"}
          </button>
        </form>
      </section>

      {/* 4. CURRENT ITEMS LIST */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ marginBottom: "12px" }}>Projects ({projects.length})</h3>
          {projects.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #f1f5f9" }}>
              <span><strong>{p.title}</strong></span>
              <button onClick={() => handleDeleteProject(p.id)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", fontWeight: "bold" }}>Delete</button>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ marginBottom: "12px" }}>Skills ({skills.length})</h3>
          {skills.map((s) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #f1f5f9" }}>
              <span><strong>{s.name}</strong></span>
              <button onClick={() => handleDeleteSkill(s.id)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", fontWeight: "bold" }}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}