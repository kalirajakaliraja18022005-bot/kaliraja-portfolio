import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Plus, Trash2, ArrowLeft, RefreshCw, CheckCircle, ExternalLink } from "lucide-react";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Form States
  const [pTitle, setPTitle] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pTech, setPTech] = useState("");
  const [pGithub, setPGithub] = useState("");
  const [pLive, setPLive] = useState("");
  const [pImg, setPImg] = useState("");

  const [sName, setSName] = useState("");
  const [sDesc, setSDesc] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const { data: projData } = await supabase.from("projects").select("*").order("id", { ascending: false });
    const { data: skillData } = await supabase.from("skills").select("*").order("id", { ascending: false });
    if (projData) setProjects(projData);
    if (skillData) setSkills(skillData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      setStatusMsg("Project added permanently to Supabase!");
      fetchData();
    }
    setLoading(false);
  };

  const handleDeleteProject = async (id) => {
    await supabase.from("projects").delete().eq("id", id);
    fetchData();
  };

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
      setStatusMsg("Skill added permanently!");
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
        <h2>🚀 Permanent Cloud Admin Panel</h2>
        <a href="/" style={{ textDecoration: "none", color: "#2563eb", fontWeight: "bold" }}>
          ← View Portfolio
        </a>
      </div>

      {statusMsg && (
        <div style={{ padding: "10px 15px", background: "#dcfce7", color: "#166534", borderRadius: "8px", marginBottom: "20px" }}>
          {statusMsg}
        </div>
      )}

      {/* ADD PROJECT */}
      <section style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", marginBottom: "30px", border: "1px solid #e2e8f0" }}>
        <h3>Add New Project</h3>
        <form onSubmit={handleAddProject} style={{ display: "grid", gap: "12px", marginTop: "15px" }}>
          <input placeholder="Project Title *" value={pTitle} onChange={(e) => setPTitle(e.target.value)} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <textarea placeholder="Description *" value={pDesc} onChange={(e) => setPDesc(e.target.value)} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="Technologies (e.g. React, Node.js, Tailwind)" value={pTech} onChange={(e) => setPTech(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="GitHub URL" value={pGithub} onChange={(e) => setPGithub(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="Live Demo URL" value={pLive} onChange={(e) => setPLive(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="Image URL (Unsplash or direct image link)" value={pImg} onChange={(e) => setPImg(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <button type="submit" disabled={loading} style={{ background: "#2563eb", color: "#fff", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            {loading ? "Saving..." : "+ Add Project"}
          </button>
        </form>
      </section>

      {/* ADD SKILL */}
      <section style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", marginBottom: "30px", border: "1px solid #e2e8f0" }}>
        <h3>Add New Skill</h3>
        <form onSubmit={handleAddSkill} style={{ display: "grid", gap: "12px", marginTop: "15px" }}>
          <input placeholder="Skill Name (e.g. React.js, Python, MongoDB) *" value={sName} onChange={(e) => setSName(e.target.value)} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <input placeholder="Skill Description (e.g. Frontend UI components & state)" value={sDesc} onChange={(e) => setSDesc(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          <button type="submit" disabled={loading} style={{ background: "#16a34a", color: "#fff", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            {loading ? "Saving..." : "+ Add Skill"}
          </button>
        </form>
      </section>

      {/* LIST CURRENT DATA */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div>
          <h3>Existing Projects ({projects.length})</h3>
          {projects.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "6px", marginTop: "10px" }}>
              <span>{p.title}</span>
              <button onClick={() => handleDeleteProject(p.id)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>Delete</button>
            </div>
          ))}
        </div>

        <div>
          <h3>Existing Skills ({skills.length})</h3>
          {skills.map((s) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "6px", marginTop: "10px" }}>
              <span>{s.name}</span>
              <button onClick={() => handleDeleteSkill(s.id)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}