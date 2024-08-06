package proxy

import (
	"fmt"
	"gateway/api/entity"
	"gateway/config"
	"github.com/gin-gonic/gin"
	"net/http"
	"net/http/httputil"
	"net/url"
	"slices"
	"strings"
)

func ReverseProxy(ctx *gin.Context) {
	path := ctx.Request.URL.Path
	accessParam := ctx.MustGet("access").([]int)
	var accessTypes []entity.AccessType
	for _, val := range accessParam {
		accessTypes = append(accessTypes, entity.AccessType(val))
	}
	target, err := Target(path, accessTypes)
	if err != nil {
		go config.Logger.Error().Err(err).Msg(err.Error())
		ctx.AbortWithStatusJSON(http.StatusNotFound, err.Error())
		return
	}
	if targetUrl, err := url.Parse(target); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
	} else {
		tenant, exist := ctx.Get("tenant")
		if !exist {
			ctx.AbortWithStatus(http.StatusInternalServerError)
		}
		email, exist := ctx.Get("email")
		if !exist {
			ctx.AbortWithStatus(http.StatusInternalServerError)
		}
		roles, exist := ctx.Get("roles")
		if !exist {
			ctx.AbortWithStatus(http.StatusInternalServerError)
		}
		ctx.Request.Header.Set("EMAIL", email.(string))
		ctx.Request.Header.Set("TENANT", tenant.(string))
		ctx.Request.Header.Set("ROLES", roles.(string))
		Proxy(targetUrl).ServeHTTP(ctx.Writer, ctx.Request)
	}
}

func Target(path string, accesses []entity.AccessType) (string, error) {
	parts := strings.Split(strings.TrimPrefix(path, "/"), "/")
	if len(parts) <= 1 {
		return "", fmt.Errorf("failed to parse target from path: %s", path)
	}
	var targetAddr string
	switch parts[1] {
	case "my-stock":
		{
			if slices.Contains(accesses, entity.MyStock) {
				targetAddr = "http://localhost:8083" + path
			} else {
				return "", fmt.Errorf("Vous n'avez pas la license nécessaire pour aller ici.")
			}

		}

	default:
		return "", fmt.Errorf("failed to parse target from path: %s", path)
	}
	return targetAddr, nil
}

func Proxy(address *url.URL) *httputil.ReverseProxy {
	p := httputil.NewSingleHostReverseProxy(address)
	p.Director = func(request *http.Request) {
		request.Host = address.Host
		request.URL.Scheme = address.Scheme
		request.URL.Host = address.Host
		request.URL.Path = address.Path
	}
	return p
}
