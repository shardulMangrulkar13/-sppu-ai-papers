import axios from "axios";

const api = axios.create({
  baseURL: "https://sppu-ai-backend-304115043483.asia-south1.run.app",
});

export default api;
