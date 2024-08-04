package handler

import (
	"gateway/api/dto/request"
	"gateway/api/middleware"
	"gateway/api/service"
	"gateway/config"
	"gateway/types"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
	"net/http"
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
	router.Use(middleware.CheckJWT()).POST("/refresh", h.refreshToken)
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
	conn, exist := config.DbConnections[ctx.MustGet("tenant").(string)]
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
