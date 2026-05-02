import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { fetchProjects } from "../services/api";
import MetricCard from "../components/MetricCard";
import SectionHeader from "../components/SectionHeader";
import ChartCard from "../components/ChartCard";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import ProjectTable from "../components/ProjectTable";

const COLORS = ["#0ea5a4", "#f59e0b", "#f97316"];

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const loadData = async () => {
    try {
      const res = await fetchProjects();

      const projectsArray = res.projects || [];

      const formatted = projectsArray.map((p) => {
  console.log("RAW PROJECT:", p);

  return {
    key: p.key || p.id || p.name,
    name: p.name || "Unknown",

    // ✅ CORRECT ACCESS
    bugs: Number(p.metrics?.bugs) || 0,
    vulnerabilities: Number(p.metrics?.vulnerabilities) || 0,
    codeSmells: Number(p.metrics?.code_smells) || 0,
    coverage: Number(p.metrics?.coverage) || 0
  };
});

      setProjects(formatted);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);
  if (loading) return <Loading message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} />;

  const totals = {
    totalBugs: projects.reduce((sum, p) => sum + p.bugs, 0),
    totalVulnerabilities: projects.reduce((sum, p) => sum + p.vulnerabilities, 0),
    totalCodeSmells: projects.reduce((sum, p) => sum + p.codeSmells, 0),
    averageCoverage:
      projects.length > 0
        ? Math.round(
            projects.reduce((sum, p) => sum + p.coverage, 0) / projects.length
          )
        : 0
  };

  const issueData = [
    { name: "Bugs", value: totals.totalBugs },
    { name: "Vulnerabilities", value: totals.totalVulnerabilities },
    { name: "Code Smells", value: totals.totalCodeSmells }
  ];

  const trend = projects.map((p) => ({
    label: p.name,
    bugs: p.bugs,
    vulnerabilities: p.vulnerabilities,
    code_smells: p.codeSmells
  }));

  return (
    <div className="space-y-10 animate-rise">
      <SectionHeader
        title="Multi-Project Overview"
        subtitle="Unified snapshot of code health across all projects."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Bugs" value={totals.totalBugs} tone="coral" />
        <MetricCard label="Total Vulnerabilities" value={totals.totalVulnerabilities} tone="amber" />
        <MetricCard label="Total Code Smells" value={totals.totalCodeSmells} tone="lagoon" />
        <MetricCard label="Average Coverage" value={`${totals.averageCoverage}%`} tone="teal" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Bugs Per Project">
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projects}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bugs" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Issue Distribution">
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={issueData} dataKey="value" nameKey="name">
                  {issueData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Project Trend">
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bugs" stroke="#f97316" />
              <Line type="monotone" dataKey="vulnerabilities" stroke="#f59e0b" />
              <Line type="monotone" dataKey="code_smells" stroke="#0ea5a4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ProjectTable projects={projects} />
    </div>
  );
};

export default Dashboard;