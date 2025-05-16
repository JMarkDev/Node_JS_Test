Notes API Documentation
This document provides documentation for the Notes API, a RESTful API for a simple note-taking application with Google OAuth authentication.

Base URL
http://localhost:3001
Authentication
The API uses Google OAuth for authentication followed by JWT tokens for API access.

Google OAuth Authentication Flow
Redirect user to the Google login page:
GET /api/auth/google
After successful Google login, the user will be redirected to:
GET /api/auth/google/callback
This endpoint will return a JWT token that should be used for all subsequent API calls. Response format:
json
{
"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"email": "user@example.com",
"firstName": "John",
"lastName": "Doe",
"picture": "https://example.com/profile.jpg"
}
}
For all API requests, include the JWT token in the Authorization header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User Profile
Get User Profile
GET /api/users/profile
Headers:

Authorization: Bearer {token}
Response:

json
{
"email": "user@example.com",
"firstName": "Mark",
"lastName": "Test",
"picture": "https://example.com/profile.jpg",
"role": "user"
}
Notes Endpoints
Create a new note
POST /api/notes
Headers:

Authorization: Bearer {token}
Content-Type: application/json
Request Body:

json
{
"title": "My Note Title",
"content": "Note content goes here",
"tags": ["personal", "important"] // Optional
}
Response (201 Created):

json
{
"\_id": "60d21b4667d0d8992e610c85",
"title": "My Note Title",
"content": "Note content goes here",
"tags": ["personal", "important"],
"owner": "60d21b4667d0d8992e610c84",
"createdAt": "2023-06-22T14:30:23.456Z",
"updatedAt": "2023-06-22T14:30:23.456Z"
}
Get all notes for authenticated user
GET /api/notes
Headers:

Authorization: Bearer {token}
Query Parameters:

page (optional, default: 1): Page number for pagination
limit (optional, default: 10): Number of items per page
Response (200 OK):

json
{
"notes": [
{
"\_id": "60d21b4667d0d8992e610c85",
"title": "My Note Title",
"content": "Note content goes here",
"tags": ["personal", "important"],
"owner": "60d21b4667d0d8992e610c84",
"createdAt": "2023-06-22T14:30:23.456Z",
"updatedAt": "2023-06-22T14:30:23.456Z"
},
{
"\_id": "60d21b4667d0d8992e610c86",
"title": "Another Note",
"content": "Another note content",
"tags": ["work"],
"owner": "60d21b4667d0d8992e610c84",
"createdAt": "2023-06-22T15:30:23.456Z",
"updatedAt": "2023-06-22T15:30:23.456Z"
}
],
"total": 2,
"pages": 1
}
Get a specific note
GET /api/notes/:noteId
Headers:

Authorization: Bearer {token}
Response (200 OK):

json
{
"\_id": "60d21b4667d0d8992e610c85",
"title": "My Note Title",
"content": "Note content goes here",
"tags": ["personal", "important"],
"owner": "60d21b4667d0d8992e610c84",
"createdAt": "2023-06-22T14:30:23.456Z",
"updatedAt": "2023-06-22T14:30:23.456Z"
}
Update a note
PUT /api/notes/:noteId
Headers:

Authorization: Bearer {token}
Content-Type: application/json
Request Body:

json
{
"title": "Updated Title",
"content": "Updated content",
"tags": ["personal", "important", "updated"]
}
Response (200 OK):

json
{
"\_id": "60d21b4667d0d8992e610c85",
"title": "Updated Title",
"content": "Updated content",
"tags": ["personal", "important", "updated"],
"owner": "60d21b4667d0d8992e610c84",
"createdAt": "2023-06-22T14:30:23.456Z",
"updatedAt": "2023-06-22T16:30:23.456Z"
}
Delete a note
DELETE /api/notes/:noteId
Headers:

Authorization: Bearer {token}
Response (204 No Content): Empty response body on successful deletion.

Error Responses
The API returns consistent error responses in the following format:

json
{
"statusCode": 400,
"message": "Descriptive error message",
"error": "Error type",
"timestamp": "2023-06-22T16:35:23.456Z"
}
Common error status codes:

400: Bad Request (invalid input data)
401: Unauthorized (missing or invalid authentication)
403: Forbidden (insufficient permissions)
404: Not Found (resource does not exist)
409: Conflict (e.g., duplicate entry)
500: Internal Server Error
