package handler

import (
	"gateway/api/dto/request"
	"gateway/api/service"
	"gateway/config"
	"gateway/types"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/rs/zerolog"
	"github.com/spf13/cast"
	"net/http"
	"time"
)

type authHandler struct {
	authService service.AuthService
	logger      zerolog.Logger
}

func newAuthHandler() *authHandler {
	return &authHandler{
		authService: service.NewAuthService(),
		logger:      config.Logger,
	}
}

func AuthHandlerRoutes(router *gin.RouterGroup) {
	h := newAuthHandler()
	router.POST("/login", h.Login)
	router.POST("/refresh", h.refreshToken)
}

func (h *authHandler) Login(ctx *gin.Context) {

	var req request.LoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, types.APIError{Message: err.Error()})
		return
	}
	conn, exist := config.DbConnections[req.SocieteUUID]
	if !exist {
		ctx.JSON(400, types.APIError{Message: "Societe not found"})
		return
	}
	ctx.Set("db", conn)

	token, refreshToken, err := h.authService.Login(ctx, req.Email, req.Password, req.SocieteUUID)
	if err != nil {
		ctx.JSON(400, types.APIError{Message: err.Error()})
		return
	}
	ctx.JSON(200, gin.H{
		"token":        token,
		"refreshToken": refreshToken,
	})
}

func (h *authHandler) refreshToken(ctx *gin.Context) {
	var input request.JWT
	if err := ctx.ShouldBindJSON(&input); err != nil {
		config.Logger.Debug().Msg(err.Error())
		ctx.JSON(http.StatusForbidden, types.APIError{Message: "Une erreur est survenu, merci de vous reconnecter"})
		return
	}
	h.logger.Info().Msgf("input: %v", input)
	// get refresh token and extract tenant claim from it
	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(input.RefreshToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.Config.Secret), nil
	}, jwt.WithLeeway(5*time.Second))
	if err != nil || !token.Valid {
		config.Logger.Error().Msgf("%v", err)
		config.Logger.Error().Msgf("%v", token.Valid)
		ctx.JSON(http.StatusUnauthorized, types.APIError{Message: "Vous n'êtes plus connecté. Votre session a pris fin. Merci de vous reconnecter"})
		ctx.Abort()
		return
	}

	conn, exist := config.DbConnections[cast.ToString(claims["tenant"])]
	if !exist {
		ctx.JSON(400, types.APIError{Message: "Societe not found"})
		return
	}
	ctx.Set("db", conn)

	bearer, err := h.authService.GenerateRefreshToken(ctx, input)
	if err != nil {
		config.Logger.Debug().Msg(err.Error())
		ctx.JSON(http.StatusForbidden, types.APIError{Message: err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"accessToken": bearer,
	})
}
