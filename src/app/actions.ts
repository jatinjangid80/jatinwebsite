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

  // Try inserting into contact_messages first, fallback to messages
  let { error } = await supabase.from("contact_messages").insert([
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
    // Fallback to messages table if contact_messages table doesn't exist yet
    const fallbackRes = await supabase.from("messages").insert([
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
    if (fallbackRes.error) {
      console.error("Supabase insert error:", fallbackRes.error);
      return { error: `Failed to send message: ${fallbackRes.error.message}` };
    }
  }

  return { success: true };
}

export async function submitQuickInquiry(formData: FormData) {
  const name = ((formData.get("name") as string) || "").trim();
  const email = ((formData.get("email") as string) || "").trim();
  const whatAreYouBuilding = ((formData.get("message") as string) || "").trim();
  const budget = ((formData.get("budget") as string) || "").trim() || null;
  const timeline = ((formData.get("projectType") as string) || (formData.get("timeline") as string) || "").trim() || null;

  if (!name || !email || !whatAreYouBuilding) {
    return { error: "Your name, work email, and what you are building are required." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables");
    return { error: "Server configuration error." };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Try inserting into project_inquiries first
  let { error } = await supabase.from("project_inquiries").insert([
    {
      name,
      email,
      what_are_you_building: whatAreYouBuilding,
      budget,
      target_timeline: timeline,
      status: "unread",
    },
  ]);

  if (error) {
    // Fallback to messages table if project_inquiries doesn't exist
    const fallbackRes = await supabase.from("messages").insert([
      {
        name,
        email,
        message: whatAreYouBuilding,
        budget,
        project_type: timeline,
        status: "unread",
      },
    ]);
    if (fallbackRes.error) {
      console.error("Supabase insert error:", fallbackRes.error);
      return { error: `Failed to submit inquiry: ${fallbackRes.error.message}` };
    }
  }

  return { success: true };
}

