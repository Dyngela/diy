package common

import (
	"gateway/api/entity"
	"gateway/config"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"time"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func CreateJwtToken(user entity.Users, tenant string) (string, error) {
	var accesses []int
	var roles []int

	for _, access := range user.Access {
		accesses = append(accesses, int(access.Access))
	}
	for _, role := range user.Roles {
		roles = append(roles, int(role.Role))
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"email":    user.Email,
			"tenant":   tenant,
			"access":   accesses,
			"roles":    roles,
			"expireAt": time.Now().Add(time.Minute * 10),
		})

	tokenString, err := token.SignedString([]byte(config.Config.Secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func CreateRefreshToken() (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"expireAt": time.Now().Add(time.Hour * 24 * 7 * 30),
		})

	tokenString, err := token.SignedString([]byte(config.Config.Secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
