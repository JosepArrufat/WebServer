# Web Server API Documentation

A RESTful API server built with Express.js, TypeScript, and PostgreSQL using Drizzle ORM. Supports user authentication with JWT tokens, chirp (message) management, and webhook integrations.

## Base URL
```
http://localhost:8080
```

## Authentication

Most endpoints require authentication via JWT Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

Webhook endpoints require API key authentication:
```
Authorization: ApiKey <api_key>
```

---

## API Endpoints

### Health Check

#### GET `/api/healthz`
Check if the server is running and healthy.

**Response:**
```json
{
  "status": "ok"
}
```

---

### User Management

#### POST `/api/users`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (201):**
```json
{
  "id": "uuid-string",
  "createdAt": "2025-12-05T10:30:00.000Z",
  "updatedAt": "2025-12-05T10:30:00.000Z", 
  "email": "user@example.com",
  "isChirpyRed": false
}
```

#### PUT `/api/users`
Update user email and/or password. **Requires authentication.**

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "password": "newpassword"
}
```

**Response (200):**
```json
{
  "id": "uuid-string",
  "createdAt": "2025-12-05T10:30:00.000Z",
  "updatedAt": "2025-12-05T10:35:00.000Z",
  "email": "newemail@example.com", 
  "isChirpyRed": false
}
```

---

### Authentication

#### POST `/api/login`
Authenticate user and receive access and refresh tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response (200):**
```json
{
  "id": "uuid-string",
  "createdAt": "2025-12-05T10:30:00.000Z",
  "updatedAt": "2025-12-05T10:30:00.000Z",
  "email": "user@example.com",
  "isChirpyRed": false,
  "token": "jwt-access-token",
  "refreshToken": "long-refresh-token-string"
}
```

#### POST `/api/refresh`
Get a new access token using a refresh token.

**Request Body:**
```json
{
  "token": "refresh-token-string"
}
```

**Response (200):**
```json
{
  "token": "new-jwt-access-token"
}
```

#### POST `/api/revoke`
Revoke (invalidate) a refresh token. **Requires authentication.**

**Request Body:**
```json
{
  "token": "refresh-token-to-revoke"
}
```

**Response (200):**
```json
{}
```

---

### Chirps (Messages)

#### POST `/api/chirps`
Create a new chirp. **Requires authentication.**

**Request Body:**
```json
{
  "body": "This is my chirp message content"
}
```

**Response (201):**
```json
{
  "id": "uuid-string",
  "createdAt": "2025-12-05T10:30:00.000Z",
  "updatedAt": "2025-12-05T10:30:00.000Z",
  "body": "This is my chirp message content",
  "userId": "user-uuid-string"
}
```

#### GET `/api/chirps`
Get all chirps or chirps by a specific author.

**Query Parameters (Optional):**
- `authorId`: Filter chirps by user ID

**Examples:**
- `GET /api/chirps` - Get all chirps
- `GET /api/chirps?authorId=uuid-string` - Get chirps by specific author

**Response (200):**
```json
[
  {
    "id": "uuid-string-1",
    "createdAt": "2025-12-05T10:30:00.000Z",
    "updatedAt": "2025-12-05T10:30:00.000Z",
    "body": "First chirp message",
    "userId": "user-uuid-1"
  },
  {
    "id": "uuid-string-2", 
    "createdAt": "2025-12-05T10:35:00.000Z",
    "updatedAt": "2025-12-05T10:35:00.000Z",
    "body": "Second chirp message",
    "userId": "user-uuid-2"
  }
]
```

#### GET `/api/chirps/:chirpID`
Get a specific chirp by ID.

**Response (200):**
```json
{
  "id": "uuid-string",
  "createdAt": "2025-12-05T10:30:00.000Z", 
  "updatedAt": "2025-12-05T10:30:00.000Z",
  "body": "Chirp message content",
  "userId": "user-uuid-string"
}
```

#### DELETE `/api/chirps/:chirpID`
Delete a chirp. **Requires authentication.** Users can only delete their own chirps.

**Response (200):**
```json
{
  "id": "uuid-string",
  "createdAt": "2025-12-05T10:30:00.000Z",
  "updatedAt": "2025-12-05T10:30:00.000Z", 
  "body": "Deleted chirp content",
  "userId": "user-uuid-string"
}
```

---

### Webhooks

#### POST `/api/polka/webhooks`
Handle Polka webhook events. **Requires API key authentication.**

**Request Body:**
```json
{
  "event": "user.upgraded",
  "data": {
    "userId": "uuid-string"
  }
}
```

**Response (200):**
```json
{}
```

---

### Admin Endpoints

#### GET `/admin/metrics`
Get server hit metrics.

**Response (200):**
```json
{
  "hits": {
    "count": 42
  }
}
```

#### POST `/admin/reset`
Reset server metrics and clear data (development only).

**Response (200):**
```json
{
  "message": "Reset successful"
}
```

---

## Error Responses

All endpoints may return the following error formats:

**400 Bad Request:**
```json
{
  "error": "Email and password are required"
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid or missing token"
}
```

**403 Forbidden:**
```json
{
  "error": "Access denied"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Data Types

### User Object (Safe)
```typescript
{
  id: string;                    // UUID
  createdAt: string;            // ISO 8601 timestamp  
  updatedAt: string;            // ISO 8601 timestamp
  email: string;                // Email address
  isChirpyRed: boolean;         // Premium user status
}
```

### Chirp Object  
```typescript
{
  id: string;                    // UUID
  createdAt: string;            // ISO 8601 timestamp
  updatedAt: string;            // ISO 8601 timestamp  
  body: string;                 // Message content
  userId: string;               // UUID of chirp author
}
```

### JWT Token Claims
```typescript
{
  iss: "chirpy";                // Issuer
  sub: string;                  // User ID (UUID)
  iat: number;                  // Issued at (Unix timestamp)
  exp: number;                  // Expires at (Unix timestamp)
}
```

---

## Notes

- All timestamps are in ISO 8601 format
- All IDs are UUIDs (version 4)
- Access tokens expire after 1 hour
- Refresh tokens expire after 60 days
- Password requirements are enforced on the client side
- Chirp content has a maximum length limit
- Users can only modify/delete their own content (except admin operations)