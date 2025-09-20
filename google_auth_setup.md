# Google OAuth Setup Guide

This guide will walk you through the process of setting up Google as an authentication provider for your Supabase project.

## Step 1: Enable Google Provider in Supabase

1.  Go to your Supabase project dashboard.
2.  In the left sidebar, navigate to **Authentication** > **Providers**.
3.  Find **Google** in the list and enable it.
4.  You will see a **Redirect URI**. Copy this URI; you will need it in the next step. It should look something like this: `https://<your-project-ref>.supabase.co/auth/v1/callback`.

## Step 2: Create Google Cloud Project and OAuth Credentials

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  In the sidebar, navigate to **APIs & Services** > **Credentials**.
4.  Click **+ CREATE CREDENTIALS** at the top and select **OAuth client ID**.
5.  If you haven't configured a consent screen, you will be prompted to do so.
    *   Choose **External** for the user type.
    *   Fill in the required fields (App name, User support email, Developer contact information).
    *   You can skip the "Scopes" and "Test users" sections for now.
6.  Once the consent screen is configured, you can create the OAuth client ID.
    *   Select **Web application** as the application type.
    *   Give it a name (e.g., "Supabase Auth").
    *   Under **Authorized JavaScript origins**, add your application's URL (e.g., your Vercel URL or `http://localhost:5173` for local development).
    *   Under **Authorized redirect URIs**, paste the **Redirect URI** you copied from your Supabase project in Step 1.
7.  Click **Create**. You will be shown your **Client ID** and **Client Secret**.

## Step 3: Add Google Credentials to Supabase

1.  Go back to the Google provider settings in your Supabase dashboard (from Step 1).
2.  Paste the **Client ID** and **Client Secret** you got from the Google Cloud Console into the corresponding fields.
3.  Click **Save**.

That's it! Your application should now be able to authenticate users with their Google accounts.
