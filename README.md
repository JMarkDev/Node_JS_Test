Notes API
A RESTful API for a simple note-taking application with Google OAuth authentication built with NestJS and MongoDB.
Tech Stack

NodeJS: v20.8.1 (LTS)
NestJS: v9.0.0
TypeScript: v5.2.2
MongoDB: v6.0.6
Authentication: Google OAuth, JWT

Features

Google OAuth authentication
CRUD operations for notes
Authorization for note operations (only the owner can modify their notes)
Input validation and error handling
Pagination for listing notes
Optional tagging for notes
Support for user roles

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v20.8.1)
MongoDB (v6.0.6)

Getting Started

1. Clone the repository
   bashgit clone https://github.com/JMarkDev/Node_JS_Test.git
   cd notes-api
2. Install dependencies
   bashnpm install
3. Set up environment variables
   Create a .env file in the root directory with the following variables:
   bash# Database
   MONGODB_URI=mongodb://localhost:27017/notes-api

# Google OAuth

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# JWT

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1d 4. Setting up Google OAuth

Go to the Google Cloud Console
Create a new project or select an existing one
Navigate to "APIs & Services" > "Credentials"
Click "Create credentials" > "OAuth client ID"
Configure the consent screen if prompted
Select "Web application" as the application type
Add http://localhost:3001/api/auth/google/callback as an authorized redirect URI
Copy the Client ID and Client Secret to your .env file

5. Start the application
   Development mode
   bashnpm run start:dev
   Production mode
   bashnpm run build
   npm run start:prod
   The API will be available at http://localhost:3001.
   Project Structure
   notes-api/
   ├── src/
   │ ├── auth/ # Authentication module
   │ ├── common/ # Common utilities, filters, etc.
   │ ├── notes/ # Notes module
   │ ├── users/ # Users module
   │ ├── app.controller.ts
   │ ├── app.module.ts
   │ ├── app.service.ts
   │ └── main.ts
   ├── test/ # End-to-end tests
   ├── .env # Environment variables
   ├── .gitignore
   ├── nest-cli.json
   ├── package.json
   ├── README.md
   ├── tsconfig.json
   └── tsconfig.build.json
   API Documentation
   For detailed API documentation, please refer to API-DOCUMENTATION.md.
   Testing
   Running unit tests
   bashnpm run test
   Running e2e tests
   bashnpm run test:e2e
   Running test coverage
   bashnpm run test:cov
   Optional Features Implemented

Pagination: The API supports pagination for listing notes.
Tagging: Notes can be tagged for easier categorization.
User Roles: The API supports user roles (admin, user) with different permissions.

License
This project is licensed under the MIT License - see the LICENSE file for details.
