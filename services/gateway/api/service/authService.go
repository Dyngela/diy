package service

import (
	"errors"
	"fmt"
	"gateway/api/dto/request"
	"gateway/api/repo"
	"gateway/common"
	"gateway/config"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/rs/zerolog"
	"time"
)

type AuthService interface {
	Login(ctx *gin.Context, email string, password string, uuid string) (string, string, error)
	GenerateRefreshToken(ctx *gin.Context, input request.JWT) (string, error)
}

type authService struct {
	authRepo repo.AuthRepo
	logger   zerolog.Logger
}

func NewAuthService() AuthService {
	return &authService{
		authRepo: repo.NewAuthRepo(),
		logger:   config.Logger,
	}
}

func (a authService) Login(ctx *gin.Context, email string, password string, uuid string) (string, string, error) {
	user, err := a.authRepo.FindByEmail(ctx, email, "Roles", "Access")
	if err != nil {
		return "", "", err
	}
	if !common.CheckPasswordHash(password, user.Password) {
		return "", "", errors.New("Mot de passe ou email incorrect")
	}

	token, err := common.CreateJwtToken(user, uuid)
	if err != nil {
		a.logger.Error().Msg(err.Error())
		return "", "", errors.New("Erreur lors de la création du token")
	}

	refreshToken, _ := common.CreateRefreshToken()
	user.RefreshToken = refreshToken
	user.RefreshTokenExpiration = time.Now().Add(time.Hour * 24 * 7 * 30)
	err = a.authRepo.UpdateUser(ctx, user)
	if err != nil {
		a.logger.Error().Msg(err.Error())
		return "", "", errors.New("Erreur lors de la mise à jour de l'utilisateur")
	}
	return token, refreshToken, nil
}

func (a authService) GenerateRefreshToken(ctx *gin.Context, input request.JWT) (string, error) {
	claims := jwt.MapClaims{}
	if len(input.AccessToken) < 10 {
		return "", errors.New("Erreur avec votre authentication. merci de réessayer.")
	}
	token, err := jwt.ParseWithClaims(input.AccessToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.Config.Secret), nil
	}, jwt.WithLeeway(5*time.Second))
	if err != nil || !token.Valid {
		return "", errors.New("Vous n'êtes pas connecté.")
	}

	email := fmt.Sprintf("%v", claims["email"])
	user, err := a.authRepo.FindByEmail(ctx, email, "Roles", "Access")
	if err != nil {
		a.logger.Info().Msg(err.Error())
		return "", errors.New("Erreur interne. Merci de vous reconnecter")
	}

	if user.RefreshToken == "" || user.RefreshToken != input.RefreshToken || user.RefreshTokenExpiration.Before(time.Now()) {
		return "", errors.New("Votre session a expiré, merci de vous reconnecter")
	}
	tenant := fmt.Sprintf("%v", claims["tenant"])
	bearer, _ := common.CreateJwtToken(user, tenant)
	return bearer, nil
}
