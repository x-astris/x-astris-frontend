"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import FinancialStatementsInput from "@/components/financialstatements/FinancialStatementsInput";

export default function FinancialStatementsPage() {
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    }
    load();
  }, [id]);

  if (!project) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <FinancialStatementsInput
        projectId={id}
        startYear={project.startYear}
        forecastYears={project.forecastYears}
      />
    </div>
  );
}
