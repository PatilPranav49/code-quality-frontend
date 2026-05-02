const API_BASE_URL = "/api";

const request = async (path) => {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

// ✅ CORRECT ENDPOINTS
export const fetchProjects = () => request("/projects");
export const fetchDeveloperScores = () => request("/developers/scores");
export const fetchHealth = () => request("/health");