package types

type APIError struct {
	Message string `json:"message"`
	Data    any    `json:"data"`
}
