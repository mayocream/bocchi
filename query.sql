-- name: GetUser :one
SELECT * FROM users WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username = $1;

-- name: GetUsers :many
SELECT * FROM users ORDER BY id;

-- name: CreateUser :one
INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *;

-- name: UpdateUser :one
UPDATE users SET username = $2, email = $3, password_hash = $4, name = $5, bio = $6, avatar_url = $7, profile_image_url = $8, email_verified = $9, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;
