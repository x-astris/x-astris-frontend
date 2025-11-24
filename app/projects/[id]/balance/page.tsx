"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import BalanceInput from "@/components/balance/BalanceInput";

export default function BalancePage() {
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
      <BalanceInput projectId={id} startYear={project.startYear} forecastYears={project.forecastYears} />
    </div>
  );
}
