import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.25.76";

const SUPABASE_URL = Deno.env.get("EDGE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("EDGE_SUPABASE_ANON_KEY")!;

const projectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  project_url: z.string().url().nullable().optional(),
  technologies: z.array(z.string()).nullable().optional(),
  published_date: z.string().nullable().optional(),
  sort_order: z.number().int().nullable().optional(),
});

const payloadSchema = z.object({
  action: z.enum(["insert", "update", "delete"]),
  project: projectSchema.optional(),
  id: z.string().uuid().optional(),
});

serve(async (req: Request) => {
  try {
    const supabase: any = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: req.headers.get("Authorization") ?? "" },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const roleResp = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();
    const roleData = roleResp.data as { role?: "admin" | "user" } | null;

    if (roleData?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const json = await req.json();
    const parsed = payloadSchema.safeParse(json);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid payload", details: parsed.error.flatten() }), {
        status: 400,
      });
    }

    const { action } = parsed.data;
    let entityId: string | undefined;
    let projectPayload: Record<string, unknown> | undefined;

    if (action === "delete") {
      const id = parsed.data.id;
      if (!id) {
        return new Response(JSON.stringify({ error: "Missing id for delete" }), { status: 400 });
      }
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }
      entityId = id;
    } else if (action === "insert") {
      const project = parsed.data.project;
      if (!project) {
        return new Response(JSON.stringify({ error: "Missing project for insert" }), { status: 400 });
      }
      const insertData = {
        title: project.title,
        description: project.description ?? null,
        image_url: project.image_url ?? null,
        project_url: project.project_url ?? null,
        technologies: project.technologies ?? null,
        published_date: project.published_date ?? null,
        sort_order: project.sort_order ?? 0,
      };
      const { data, error } = await supabase.from("projects").insert(insertData as any).select("id").single();
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }
      entityId = (data as { id: string }).id;
      projectPayload = insertData;
    } else if (action === "update") {
      const project = parsed.data.project;
      if (!project?.id) {
        return new Response(JSON.stringify({ error: "Missing project.id for update" }), { status: 400 });
      }
      const updateData = {
        title: project.title,
        description: project.description ?? null,
        image_url: project.image_url ?? null,
        project_url: project.project_url ?? null,
        technologies: project.technologies ?? null,
        published_date: project.published_date ?? null,
        sort_order: project.sort_order ?? 0,
      };
      const { error } = await supabase.from("projects").update(updateData as any).eq("id", project.id);
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }
      entityId = project.id;
      projectPayload = updateData;
    }

    if (entityId) {
      await supabase.from("admin_audit_logs").insert({
        actor_user_id: user.id,
        action,
        entity: "projects",
        entity_id: entityId,
        payload: projectPayload ?? null,
      } as any);
    }

    return new Response(JSON.stringify({ ok: true, id: entityId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error", details: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});