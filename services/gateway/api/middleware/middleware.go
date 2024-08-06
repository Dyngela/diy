package middleware

import (
	"gateway/config"
	"gateway/types"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/spf13/cast"
	"net/http"
	"time"
)

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, Authorization, accept, Origin, enctype")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
	}
}

func CheckJWT() gin.HandlerFunc {

	// Check le JWT ici
	// Si le JWT est valide, on continue et on set le tenantId, extrait du jwt, dans le context pour se connecter à la bonne DB
	// Sinon on renvoie une erreur 401 et le browser réessayera avec le refresh token

	return func(ctx *gin.Context) {
		if len(ctx.GetHeader("Authorization")) < 10 {
			config.Logger.Debug().Msgf("aze: %v", ctx.GetHeader("Authorization"))
			ctx.JSON(http.StatusUnauthorized, types.APIError{Message: "Vous n'êtes pas connecté."})
			ctx.Abort()
			return
		}
		claims := jwt.MapClaims{}
		tokenHeader := ctx.GetHeader("Authorization")[7:]
		token, err := jwt.ParseWithClaims(tokenHeader, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(config.Config.Secret), nil
		}, jwt.WithLeeway(5*time.Second))

		if err != nil || !token.Valid {
			config.Logger.Error().Msgf("%v", err)
			config.Logger.Error().Msgf("%v", token.Valid)
			ctx.JSON(http.StatusUnauthorized, types.APIError{Message: "Vous n'êtes pas connecté."})
			ctx.Abort()
			return
		}

		if cast.ToTime(claims["expireAt"]).Before(time.Now()) {
			ctx.JSON(http.StatusUnauthorized, types.APIError{Message: "Votre session a expiré merci de vous reconnecter"})
			ctx.Abort()
			return
		} else {
			ctx.Set("tenant", cast.ToString(claims["tenant"]))
			ctx.Set("email", cast.ToString(claims["email"]))
			ctx.Set("access", cast.ToIntSlice(claims["access"]))
			ctx.Set("roles", cast.ToString(claims["roles"]))
			ctx.Next()
			return
		}
	}
}
