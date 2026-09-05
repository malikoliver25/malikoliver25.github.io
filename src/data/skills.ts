import type { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    category: "BACKEND & AI ORCHESTRATION",
    icon: "◈",
    skills: [
      { name: "Python (Pandas, NumPy)", level: 5 },
      { name: "FastAPI", level: 5 },
      { name: "JavaScript / TypeScript", level: 4 },
      { name: "LangGraph", level: 5 },
      { name: "LangChain", level: 4 },
      { name: "RAG Pipeline Design", level: 4 },
      { name: "Agentic Architecture", level: 5 },
      { name: "Model Context Protocol", level: 4 },
      { name: "FastMCP", level: 4 },
      { name: "RESTful APIs", level: 5 },
      { name: "Redis", level: 3 },
      { name: "SQL", level: 4 },
    ],
  },
  {
    category: "INFRASTRUCTURE & ORCHESTRATION",
    icon: "⬡",
    skills: [
      { name: "Kubernetes (K8s)", level: 5 },
      { name: "Docker", level: 5 },
      { name: "Terraform (IaC)", level: 4 },
      { name: "CI/CD Pipelines", level: 5 },
      { name: "Azure", level: 4 },
      { name: "Apache Airflow", level: 3 },
      { name: "Air-Gapped Deployments", level: 4 },
    ],
  },
  {
    category: "MODEL SERVING & LLOPS",
    icon: "◉",
    skills: [
      { name: "vLLM", level: 5 },
      { name: "Secure Edge AI", level: 4 },
      { name: "Containerized Inference", level: 5 },
      { name: "OpenCode", level: 4 },
      { name: "Claude Desktop / Code", level: 4 },
      { name: "Cursor / PyCharm", level: 4 },
    ],
  },
  {
    category: "OBSERVABILITY & RELIABILITY",
    icon: "◎",
    skills: [
      { name: "Langfuse", level: 4 },
      { name: "New Relic", level: 4 },
      { name: "Pytest", level: 5 },
      { name: "Playwright", level: 3 },
      { name: "TDD", level: 4 },
      { name: "Model Evaluation (Ragas)", level: 3 },
    ],
  },
];
