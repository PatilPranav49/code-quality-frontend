const ProjectTable = ({ projects = [] }) => {
  if (!projects.length) {
    return (
      <div className="text-center text-slate-400 py-10">
        No project data available
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900/80 text-slate-300">
          <tr>
            <th className="px-6 py-4">Project</th>
            <th className="px-6 py-4">Bugs</th>
            <th className="px-6 py-4">Vulnerabilities</th>
            <th className="px-6 py-4">Code Smells</th>
            <th className="px-6 py-4">Coverage</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800">
          {projects.map((project) => {
            // ✅ SUPPORT BOTH STRUCTURES (important)
            const metrics = project.metrics || project;

            return (
              <tr key={project.key || project.name} className="text-slate-200">
                <td className="px-6 py-4 font-semibold text-white">
                  {project.name || "N/A"}
                </td>

                <td className="px-6 py-4">
                  {metrics.bugs ?? 0}
                </td>

                <td className="px-6 py-4">
                  {metrics.vulnerabilities ?? 0}
                </td>

                <td className="px-6 py-4">
                  {metrics.code_smells ?? metrics.codeSmells ?? 0}
                </td>

                <td className="px-6 py-4">
                  {(metrics.coverage ?? 0)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;