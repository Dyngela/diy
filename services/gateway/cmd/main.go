package main

import (
	"fmt"
	"gateway/api/handler"
	"gateway/api/middleware"
	"gateway/config"
	"gateway/proxy"
	"github.com/gin-gonic/gin"
)

func main() {
	config.SetupEnv()

	if config.Config.Mode == "dev" {
		gin.ForceConsoleColor()
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()
	router.Use(middleware.CORS())

	handler.AuthHandlerRoutes(router.Group("/connect"))

	router.Use(middleware.CheckJWT()).Any("internal/*path", proxy.ReverseProxy)
	if err := router.Run(fmt.Sprintf(":%s", config.Config.Port)); err != nil {
		panic(err)
	}
}
