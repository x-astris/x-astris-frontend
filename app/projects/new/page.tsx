"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [forecastYears, setForecastYears] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    try {
      setLoading(true);
      setError("");

      const res = await api.post("/projects", {
        name,
        description,
        startYear,
        forecastYears,
      });

      const project = res.data;
      if (!project?.id) throw new Error("Invalid response");

      // Redirect to P&L tab
      router.push(`/projects/${project.id}/pl`);
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {error && <p className="text-red-500">{error}</p>}

          <div>
            <label className="text-sm font-medium">Project Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Startup"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional project description"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Start Year of Model</label>
            <Input
              type="number"
              min={2025}
              max={2050}
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Number of Forecast Years</label>
            <Input
              type="number"
              min={3}
              max={10}
              value={forecastYears}
              onChange={(e) => setForecastYears(Number(e.target.value))}
            />
          </div>

          <Button disabled={loading} onClick={submit}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
