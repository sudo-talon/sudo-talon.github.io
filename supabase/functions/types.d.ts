declare const Deno: {
  env: { get(name: string): string | undefined };
};

declare module "https://deno.land/std@0.208.0/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  import type { SupabaseClient } from "@supabase/supabase-js";
  export function createClient<Database = unknown>(
    url: string,
    key: string,
    options?: unknown,
  ): SupabaseClient<Database, "public", "public">;
}

declare module "https://esm.sh/zod@3.25.76" {
  export * from "zod";
}