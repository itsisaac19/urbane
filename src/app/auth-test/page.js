'use client';

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://qjpeursbnlmjowsuwigl.supabase.co";
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcGV1cnNibmxtam93c3V3aWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU0ODI5OTYsImV4cCI6MjAwMTA1ODk5Nn0.s6bnKJbvt24vwIUIZ83uexzMz6YGyUmPxPC3nzXXQI8`;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Page({ searchParams }) {
    return (
        <div style={{width: '400px'}}>
        <Auth 
            supabaseClient={supabase}
            appearance={{theme: ThemeSupa}}
            theme="dark"
        />
        </div>
    )
}