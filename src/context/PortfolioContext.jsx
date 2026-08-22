import React, { createContext, useContext, useState, useEffect } from "react";
import { portfolioData } from "../data/portfolioData";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("portfolio_local_data");
    return saved ? JSON.parse(saved) : portfolioData;
  });

  useEffect(() => {
    localStorage.setItem("portfolio_local_data", JSON.stringify(data));
  }, [data]);

  const addProject = (project) => {
    setData((prev) => ({
      ...prev,
      projects: [{ id: Date.now(), ...project }, ...prev.projects]
    }));
  };

  const deleteProject = (id) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  const addSkill = (skill) => {
    setData((prev) => ({
      ...prev,
      skills: [{ id: Date.now(), ...skill }, ...prev.skills]
    }));
  };

  const deleteSkill = (id) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id)
    }));
  };

  const updateProfile = (profile) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profile }
    }));
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile: data.profile,
        projects: data.projects,
        skills: data.skills,
        addProject,
        deleteProject,
        addSkill,
        deleteSkill,
        updateProfile
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);