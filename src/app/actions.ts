"use server";

import { createClient } from "@supabase/supabase-js";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const company = (formData.get("company") as string) || "";
  const phone = (formData.get("phone") as string) || "";
  const budget = (formData.get("budget") as string) || "";
  const projectType = (formData.get("projectType") as string) || "";

  if (!name || !email || !message) {
    return { error: "Name, email and project details are required." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables");
    return { error: "Server configuration error." };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Build full message including extra fields
  const extras = [
    company && `Company: ${company}`,
    phone && `Phone: ${phone}`,
    budget && `Budget: ${budget}`,
    projectType && `Project Type: ${projectType}`,
  ].filter(Boolean).join("\n");

  const fullMessage = extras ? `${message}\n\n---\n${extras}` : message;

  const { error } = await supabase
    .from("messages")
    .insert([{ name, email, message: fullMessage }]);

  if (error) {
    console.error("Supabase insert error:", error);
    return { error: `Failed to send message: ${error.message}` };
  }

  return { success: true };
}
