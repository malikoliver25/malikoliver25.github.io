import type { Project } from "@/types";

export const projects: Project[] = [
  {
    codename: "SENTINEL-CORE",
    name: "Automated Security Orchestration Engine",
    description:
      "Graph-based security orchestration engine designed to transform raw network scan data into high-fidelity attack path reports using an agentic workflow.",
    url: "https://github.com/malikoliver25/sentinel-core",
    techStack: ["Python", "LangGraph", "Agentic Workflow"],
    status: "ACTIVE",
  },
  {
    codename: "MTM-INDUSTRIAL-AI",
    name: "Production AI Portal",
    description:
      "CMMC-compliant AI portal engineered for manufacturing, serving Llama 3.2 Vision locally via air-gapped infrastructure without external API dependencies.",
    url: "https://github.com/malikoliver25/mtm-industrial-ai-portal",
    techStack: ["Python", "Streamlit", "LangGraph", "MinIO", "MySQL", "Qdrant"],
    status: "ACTIVE",
  },
  {
    codename: "PORTFOLIO-ASSISTANT",
    name: "Agentic Orchestration Microservice",
    description:
      "Asynchronous orchestration microservice built with Python and FastAPI featuring deterministic context routing and prompt validation optimized for low-latency LLM reasoning.",
    url: "https://github.com/malikoliver25/portfolio-assistant-api",
    techStack: ["Python", "FastAPI", "Async", "LLM Routing"],
    status: "ACTIVE",
  },
  {
    codename: "NETRUNNER-DECK",
    name: "Interactive Engineer Terminal HUD",
    description:
      "Responsive, production-ready interactive terminal interface optimized for asynchronous streaming responses and client-side interactions.",
    url: "https://github.com/malikoliver25/malikoliver25.github.io",
    techStack: ["React", "TypeScript", "Terminal UI", "Streaming"],
    status: "DEPLOYED",
  },
];
