# User manager

A simple React user CRUD app that saves users in Firebase Firestore.

## Run locally

1. Create a Firebase project, register a web app, and create a Firestore database.
2. Copy `.env.example` to `.env` and fill in the Firebase web app settings.
3. Make sure your Firestore security rules allow the intended users to read and write the `users` collection. Do not use unrestricted rules in production.
4. Install dependencies with `npm install`.
5. Start the app with `npm run dev`.

The app adds, lists, edits, and deletes users with the fields name, email, mobile, and age. The user list updates live when Firestore changes.
