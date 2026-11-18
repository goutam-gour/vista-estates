
import type { Agent } from "../types";

const API_URL = "http://localhost:5000/api/agents";

interface MongoAgent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  photo?: string;
  bio?: string;
  experience?: number;
  rating?: number;
  licenseNumber?: string;
  properties?: unknown[];
}

interface AgentResponse {
  success: boolean;
  message?: string;
  agents?: MongoAgent[];
  agent?: MongoAgent;
}

function getToken(): string {
  const token =
    localStorage.getItem("vista_token") ||
    sessionStorage.getItem("vista_token");

  if (!token) {
    throw new Error("Please login as admin.");
  }

  return token;
}

/* Convert MongoDB Agent to Frontend Agent */

function mapAgent(data: MongoAgent): Agent {
  return {
    id: data._id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role || "Real Estate Agent",
    listings: data.properties?.length ?? 0,
  };
}

/* API Request */

async function request(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<AgentResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (requiresAuth) {
    headers.Authorization = `Bearer ${getToken()}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = (await response.json()) as AgentResponse;

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Agent request failed.");
  }

  return data;
}

/* Get All Agents */

export async function getAgentsAPI(): Promise<Agent[]> {
  const data = await request("", { method: "GET" }, false);

  return (data.agents || []).map(mapAgent);
}

/* Create Agent */

export async function createAgentAPI(agent: Agent): Promise<Agent> {
  const data = await request("", {
    method: "POST",
    body: JSON.stringify({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      role: agent.role,
    }),
  });

  if (!data.agent) {
    throw new Error("Agent was not returned by the server.");
  }

  return mapAgent(data.agent);
}

/* Update Agent */

export async function updateAgentAPI(agent: Agent): Promise<Agent> {
  const data = await request(`/${agent.id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      role: agent.role,
    }),
  });

  if (!data.agent) {
    throw new Error("Updated agent was not returned by the server.");
  }

  return mapAgent(data.agent);
}

/* Delete Agent */

export async function deleteAgentAPI(id: string): Promise<void> {
  await request(`/${id}`, {
    method: "DELETE",
  });
}
