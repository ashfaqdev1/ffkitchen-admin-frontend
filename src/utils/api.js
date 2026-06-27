export const apiRequest = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  // Uses the local proxy mapped in package.json
  const response = await fetch(endpoint, { ...config });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Server transaction failed.");
  }

  return result; // Returns the full object containing { status, data }
};
