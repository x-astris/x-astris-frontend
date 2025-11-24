"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import DashboardInput from "@/components/dashboard/dashboardInput";

export default function DashboardPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await api.get(`/projects/${projectId}`);
      setProject(res.data);
    }
    load();
  }, [projectId]);

  if (!project) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <DashboardInput projectId={projectId} startYear={project.startYear} forecastYears={project.forecastYears} />
    </div>
  );
}
