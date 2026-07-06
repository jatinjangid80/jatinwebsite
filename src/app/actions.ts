"use server";

import { createClient } from "@supabase/supabase-js";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "All fields are required." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables");
    return { error: "Server configuration error." };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase
    .from("messages")
    .insert([{ name, email, message }]);

  if (error) {
    console.error("Supabase insert error:", error);
    return { error: `Failed to send message: ${error.message}` };
  }

  return { success: true };
}
