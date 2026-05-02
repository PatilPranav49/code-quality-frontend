const API_BASE_URL = "http://13.235.21.152:30050";

const request = async (path) => {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

// ✅ CORRECT ENDPOINTS
export const fetchProjects = () => request("/api/projects");
export const fetchDeveloperScores = () => request("/api/developers/scores");
export const fetchHealth = () => request("/api/health");