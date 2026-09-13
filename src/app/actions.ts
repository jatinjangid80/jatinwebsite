"use server";

import { createClient } from "@supabase/supabase-js";

export async function submitContactForm(formData: FormData) {
  const name = ((formData.get("name") as string) || "").trim();
  const email = ((formData.get("email") as string) || "").trim();
  const message = ((formData.get("message") as string) || "").trim();
  const company = ((formData.get("company") as string) || "").trim() || null;
  const phone = ((formData.get("phone") as string) || "").trim() || null;
  const budget = ((formData.get("budget") as string) || "").trim() || null;
  const projectType = ((formData.get("projectType") as string) || (formData.get("project_type") as string) || "").trim() || null;

  if (!name || !email || !message) {
    return { error: "Name, email and project details are required." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables");
    return { error: "Server configuration error." };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase
    .from("messages")
    .insert([
      {
        name,
        email,
        message,
        phone,
        company,
        budget,
        project_type: projectType,
        status: "unread",
      },
    ]);

  if (error) {
    console.error("Supabase insert error:", error);
    return { error: `Failed to send message: ${error.message}` };
  }

  return { success: true };
}
