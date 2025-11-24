"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function deleteProject(id: string, reload: () => void) {
  const ok = confirm("Are you sure you want to permanently delete this project?");
  if (!ok) return;

  try {
    await api.delete(`/projects/${id}`);   // <-- FIXED
    reload();
  } catch (e) {
    console.error("Delete failed", e);
    alert("Failed to delete project.");
  }
}

type Project = {
  id: string;
  name: string;
  startYear?: number;
  description?: string;
  createdAt?: string;
};

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* --------------------------- LOAD PROJECTS --------------------------- */

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/projects");
        setProjects(res.data || []);
      } catch (e: any) {
        console.error(e);
        setError("Failed to load projects. Are you logged in?");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ----------------------------- UI RENDER ----------------------------- */

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Projects</h1>

      {/* ERROR */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* NEW PROJECT BUTTON */}
      <Button
        className="mb-6"
        onClick={() => router.push("/projects/new")}
      >
        + New Project
      </Button>

      {/* LOADING */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* PROJECT LIST */}
      <div className="flex flex-col gap-4">
        {!loading &&
          projects.map((p) => (
<Card key={p.id} className="hover:shadow-md transition">
  <CardHeader className="flex flex-row items-center justify-between">
    <div
      className="cursor-pointer"
      onClick={() => router.push(`/projects/${p.id}/pl`)}
    >
      <CardTitle className="text-lg">{p.name}</CardTitle>
    </div>

    <button
      onClick={() =>
        deleteProject(p.id, () => {
          setProjects(prev => prev.filter(pr => pr.id !== p.id));
        })
      }
      className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
    >
      Delete
    </button>
  </CardHeader>

  <CardContent>
    <p className="text-gray-500 text-sm">
      Start Year: {p.startYear ?? "unknown"}
    </p>

    {p.description && (
      <p className="text-gray-600 text-sm mt-1">{p.description}</p>
    )}
  </CardContent>
</Card>
          ))}

        {/* EMPTY STATE */}
        {!loading && projects.length === 0 && (
          <p className="text-gray-500">You have no projects yet.</p>
        )}
      </div>
    </main>
  );
}
