const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const assetUrl = (path) => {
  if (!path) return "";
  const base = import.meta.env.VITE_ASSET_URL || "http://localhost:5000";
  return `${base}${path}`;
};

export const apiRequest = async (endpoint, options = {}, token) => {
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};
