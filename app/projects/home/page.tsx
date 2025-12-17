"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import LogoutButton from "@/components/LogoutButton";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Pencil,
  Trash2,
  Plus,
  Clock,
} from "lucide-react";

/* --------------------------- DELETE PROJECT --------------------------- */

async function deleteProject(id: string, reload: () => void) {
  const ok = confirm(
    "Are you sure you want to permanently delete this project?"
  );
  if (!ok) return;

  try {
    await api.delete(`/projects/${id}`);
    reload();
  } catch (e) {
    console.error("Delete failed", e);
    alert("Failed to delete project.");
  }
}

/* ------------------------------ TYPES ------------------------------ */

type Project = {
  id: string;
  name: string;
  startYear?: number;
  forecastYears?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

/* ------------------------------ HELPERS ------------------------------ */

function formatDate(value?: string) {
  if (!value) return "unknown";
  const d = new Date(value);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ------------------------------ PAGE ------------------------------ */

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
      } catch (e) {
        console.error(e);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ----------------------------- UI ----------------------------- */

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <LogoutButton />
      </div>

      {/* ERROR */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* NEW PROJECT */}
      <Button
        className="mb-6 gap-2"
        onClick={() => router.push("/projects/new")}
      >
        <Plus size={16} />
        New Project
      </Button>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500">Loading projects…</p>
      )}

      {/* PROJECT LIST */}
      <div className="flex flex-col gap-4">
        {!loading &&
          projects.map((p) => (
            <Card
              key={p.id}
              className="transition hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                {/* LEFT */}
                <div
                  className="cursor-pointer group"
                  onClick={() =>
                    router.push(`/projects/${p.id}/pl`)
                  }
                >
                  <CardTitle className="text-lg group-hover:underline">
                    {p.name}
                  </CardTitle>

                  <div className="text-sm text-gray-500 mt-2 space-y-1">
                    <div>
                      Start year: {p.startYear ?? "unknown"}
                    </div>

                    <div>
                      Forecast years: {p.forecastYears ?? "unknown"}
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      Last updated:{" "}
                      {formatDate(p.updatedAt ?? p.createdAt)}
                    </div>
                  </div>
                </div>

                {/* RIGHT: ACTIONS */}
                <div className="flex gap-1">
                  {/* EDIT → P&L PAGE */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      router.push(`/projects/${p.id}/pl`)
                    }
                    aria-label="Edit project (open P&L)"
                  >
                    <Pencil size={16} />
                  </Button>

                  {/* DELETE */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() =>
                      deleteProject(p.id, () =>
                        setProjects((prev) =>
                          prev.filter((pr) => pr.id !== p.id)
                        )
                      )
                    }
                    aria-label="Delete project"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardHeader>

              {p.description && (
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    {p.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}

        {/* EMPTY STATE */}
        {!loading && projects.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <p className="mb-2">
              You don’t have any projects yet.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/projects/new")}
            >
              Create your first project
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
