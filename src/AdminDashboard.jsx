import React, { useEffect, useState } from "react";

const API_URL = "https://kaliraja-portfolio-backend.onrender.com";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState({ profile_image: "", resume_file: "" });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Project Form State ---
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    technologies: "",
    github_url: "",
    live_url: "",
  });
  const [projectImage, setProjectImage] = useState(null);

  // --- Skill Form State ---
  const [skillForm, setSkillForm] = useState({
    name: "",
    description: "",
  });

  // --- Profile / Resume Files State ---
  const [profileImgFile, setProfileImgFile] = useState(null);
  const [resumePdfFile, setResumePdfFile] = useState(null);

  // =====================================================
  // FETCH ALL DATA
  // =====================================================

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [projRes, skillRes, profRes] = await Promise.all([
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/skills`),
        fetch(`${API_URL}/profile`),
      ]);

      if (projRes.ok) {
        const pData = await projRes.json();
        setProjects(pData.projects || []);
      }

      if (skillRes.ok) {
        const sData = await skillRes.json();
        setSkills(sData.skills || []);
      }

      if (profRes.ok) {
        const prData = await profRes.json();
        setProfile(prData || {});
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // =====================================================
  // PROJECT ACTIONS (Add / Edit / Delete)
  // =====================================================

  const handleProjectInput = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: "",
      description: "",
      technologies: "",
      github_url: "",
      live_url: "",
    });
    setProjectImage(null);
    setEditingProjectId(null);
    setShowProjectForm(false);
  };

  const startEditProject = (proj) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title || "",
      description: proj.description || "",
      technologies: proj.technologies || "",
      github_url: proj.github_url || "",
      live_url: proj.live_url || "",
    });
    setShowProjectForm(true);
    setMessage("");
  };

  const saveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      setMessage("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("title", projectForm.title);
      formData.append("description", projectForm.description);
      formData.append("technologies", projectForm.technologies);
      formData.append("github_url", projectForm.github_url);
      formData.append("live_url", projectForm.live_url);
      if (projectImage) {
        formData.append("image", projectImage);
      }

      const url = editingProjectId
        ? `${API_URL}/projects/${editingProjectId}`
        : `${API_URL}/projects`;

      const method = editingProjectId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to save project");
      }

      setMessage(
        editingProjectId
          ? "Project updated successfully!"
          : "Project added successfully!"
      );
      resetProjectForm();
      await loadAllData();
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Project deleted successfully!");
        await loadAllData();
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SKILL ACTIONS (Add / Delete)
  // =====================================================

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) {
      setMessage("Skill name is required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillForm),
      });

      if (res.ok) {
        setMessage("Skill added successfully!");
        setSkillForm({ name: "", description: "" });
        await loadAllData();
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Delete this skill?")) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/skills/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Skill deleted successfully!");
        await loadAllData();
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete skill");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PROFILE & RESUME UPLOAD
  // =====================================================

  const handleProfileAssetsUpload = async (e) => {
    e.preventDefault();
    if (!profileImgFile && !resumePdfFile) {
      setMessage("Please select at least one file to upload");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      if (profileImgFile) formData.append("profile_image", profileImgFile);
      if (resumePdfFile) formData.append("resume_file", resumePdfFile);

      const res = await fetch(`${API_URL}/profile/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("Profile image and Resume updated successfully!");
        setProfileImgFile(null);
        setResumePdfFile(null);
        await loadAllData();
      } else {
        throw new Error("Failed to upload assets");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    window.location.href = "/admin";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f9fb", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "36px", color: "#17202a" }}>Admin Dashboard</h1>
            <p style={{ color: "#64717d", marginTop: "6px" }}>Manage Projects, Skills, Profile Image & Resume</p>
          </div>
          <button
            onClick={logout}
            style={{
              padding: "9px 16px",
              border: "1px solid #dfe5e9",
              borderRadius: "8px",
              background: "white",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {/* STATUS MESSAGE */}
        {message && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: "20px",
              background: "#eef5f3",
              borderRadius: "8px",
              color: "#155d4e",
              fontWeight: "500",
            }}
          >
            {message}
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
          {[
            { id: "projects", label: `Projects (${projects.length})` },
            { id: "skills", label: `Skills (${skills.length})` },
            { id: "profile", label: "Profile & Resume" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMessage("");
              }}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "1px solid #dfe5e9",
                background: activeTab === tab.id ? "#17202a" : "white",
                color: activeTab === tab.id ? "white" : "#17202a",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =====================================================
            TAB 1: PROJECTS
        ===================================================== */}
        {activeTab === "projects" && (
          <div>
            {!showProjectForm && (
              <button
                onClick={() => {
                  resetProjectForm();
                  setShowProjectForm(true);
                }}
                style={{
                  padding: "11px 20px",
                  background: "#17202a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  marginBottom: "20px",
                }}
              >
                + Add Project
              </button>
            )}

            {showProjectForm && (
              <form
                onSubmit={saveProject}
                style={{
                  background: "white",
                  border: "1px solid #dfe5e9",
                  borderRadius: "14px",
                  padding: "25px",
                  marginBottom: "25px",
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  {editingProjectId ? "Edit Project" : "Add New Project"}
                </h3>

                <label style={labelStyle}>Project Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={projectForm.title}
                  onChange={handleProjectInput}
                  placeholder="e.g. Sales Performance Dashboard"
                  style={inputStyle}
                />

                <label style={labelStyle}>Description *</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={projectForm.description}
                  onChange={handleProjectInput}
                  placeholder="Explain what problem this project solved..."
                  style={inputStyle}
                />

                <label style={labelStyle}>Technologies (comma separated)</label>
                <input
                  type="text"
                  name="technologies"
                  value={projectForm.technologies}
                  onChange={handleProjectInput}
                  placeholder="Python, SQL, Power BI"
                  style={inputStyle}
                />

                <label style={labelStyle}>GitHub URL</label>
                <input
                  type="text"
                  name="github_url"
                  value={projectForm.github_url}
                  onChange={handleProjectInput}
                  placeholder="https://github.com/..."
                  style={inputStyle}
                />

                <label style={labelStyle}>Live Demo URL</label>
                <input
                  type="text"
                  name="live_url"
                  value={projectForm.live_url}
                  onChange={handleProjectInput}
                  placeholder="https://..."
                  style={inputStyle}
                />

                <label style={labelStyle}>Project Image / Screenshot</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProjectImage(e.target.files[0])}
                  style={inputStyle}
                />

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "10px 20px",
                      background: "#1e7a65",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {loading ? "Saving..." : editingProjectId ? "Update Project" : "Save Project"}
                  </button>

                  <button
                    type="button"
                    onClick={resetProjectForm}
                    style={{
                      padding: "10px 20px",
                      background: "white",
                      border: "1px solid #dfe5e9",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* PROJECT LIST */}
            {projects.length === 0 ? (
              <div style={{ background: "white", padding: "25px", borderRadius: "12px", border: "1px solid #dfe5e9" }}>
                No projects found.
              </div>
            ) : (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  style={{
                    background: "white",
                    border: "1px solid #dfe5e9",
                    borderRadius: "14px",
                    padding: "20px",
                    marginBottom: "15px",
                    display: "flex",
                    gap: "20px",
                    alignItems: "center",
                  }}
                >
                  {proj.image_url && (
                    <img
                      src={`${API_URL}${proj.image_url}`}
                      alt={proj.title}
                      style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 6px 0" }}>{proj.title}</h3>
                    <p style={{ margin: "0 0 6px 0", color: "#64717d", fontSize: "14px" }}>{proj.description}</p>
                    <span style={{ fontSize: "12px", color: "#1e7a65", fontWeight: "600" }}>{proj.technologies}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => startEditProject(proj)}
                      style={{ padding: "7px 12px", border: "1px solid #dfe5e9", background: "white", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProject(proj.id)}
                      style={{ padding: "7px 12px", background: "#c0392b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* =====================================================
            TAB 2: SKILLS
        ===================================================== */}
        {activeTab === "skills" && (
          <div>
            <form
              onSubmit={handleAddSkill}
              style={{
                background: "white",
                border: "1px solid #dfe5e9",
                borderRadius: "14px",
                padding: "20px",
                marginBottom: "25px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Add New Skill</h3>
              <label style={labelStyle}>Skill Name *</label>
              <input
                type="text"
                required
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                placeholder="e.g. Power BI"
                style={inputStyle}
              />

              <label style={labelStyle}>Description *</label>
              <input
                type="text"
                required
                value={skillForm.description}
                onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                placeholder="e.g. Data visualization and DAX modeling"
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  background: "#17202a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                + Save Skill
              </button>
            </form>

            {skills.map((s) => (
              <div
                key={s.id}
                style={{
                  background: "white",
                  border: "1px solid #dfe5e9",
                  borderRadius: "10px",
                  padding: "15px 20px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong style={{ fontSize: "16px" }}>{s.name}</strong>
                  <p style={{ margin: "4px 0 0 0", color: "#64717d", fontSize: "13px" }}>{s.description}</p>
                </div>
                <button
                  onClick={() => deleteSkill(s.id)}
                  style={{
                    padding: "6px 12px",
                    background: "#c0392b",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* =====================================================
            TAB 3: PROFILE & RESUME
        ===================================================== */}
        {activeTab === "profile" && (
          <div
            style={{
              background: "white",
              border: "1px solid #dfe5e9",
              borderRadius: "14px",
              padding: "25px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Update Profile Picture & Resume</h3>

            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "14px", color: "#64717d" }}>Current Uploaded Assets:</p>
              {profile.profile_image ? (
                <p style={{ fontSize: "13px" }}>
                  <strong>Profile Image:</strong> {profile.profile_image}
                </p>
              ) : (
                <p style={{ fontSize: "13px", color: "#999" }}>No profile picture uploaded.</p>
              )}

              {profile.resume_file ? (
                <p style={{ fontSize: "13px" }}>
                  <strong>Resume File:</strong>{" "}
                  <a href={`${API_URL}${profile.resume_file}`} target="_blank" rel="noreferrer">
                    View Current Resume
                  </a>
                </p>
              ) : (
                <p style={{ fontSize: "13px", color: "#999" }}>No resume PDF uploaded.</p>
              )}
            </div>

            <form onSubmit={handleProfileAssetsUpload}>
              <label style={labelStyle}>Choose New Profile Picture (JPG / PNG)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImgFile(e.target.files[0])}
                style={inputStyle}
              />

              <label style={labelStyle}>Choose New Resume (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResumePdfFile(e.target.files[0])}
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "11px 22px",
                  background: "#1e7a65",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                {loading ? "Uploading..." : "Upload & Update"}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#333",
  marginBottom: "4px",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "11px",
  marginTop: "4px",
  marginBottom: "16px",
  border: "1px solid #dfe5e9",
  borderRadius: "8px",
  fontSize: "14px",
  boxSizing: "border-box",
};

export default AdminDashboard;