# Setup Guide

This guide provides the necessary setup instructions for the Blood Bank Dashboard application.

## Admin User

The application has a predefined static admin email address:

- **Admin Email:** `admin@example.com`

To log in as an admin, you must use the "Continue with Google" feature with a Google account that uses this email address. Upon successful login, the application will automatically grant you admin privileges.

## Google OAuth Setup

To enable the "Continue with Google" feature, you must configure Google OAuth in your Supabase project. Please follow the detailed instructions in the `google_auth_setup.md` file.

## Database Setup

This application requires a Supabase database. The schema is defined in `scripts/setup.sql`. You must run this script in your Supabase SQL editor to create the necessary tables and policies.
