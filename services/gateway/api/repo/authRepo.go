package repo

import (
	"gateway/api/entity"
	"gateway/config"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
	"gorm.io/gorm"
)

type AuthRepo interface {
	FindByEmail(ctx *gin.Context, email string, associations ...string) (entity.Users, error)
	UpdateUser(ctx *gin.Context, user entity.Users) error
}

type authRepo struct {
	logger zerolog.Logger
}

func NewAuthRepo() AuthRepo {
	return &authRepo{
		logger: config.Logger,
	}
}

func (a authRepo) FindByEmail(ctx *gin.Context, email string, associations ...string) (entity.Users, error) {
	conn := ctx.MustGet("db").(*gorm.DB)
	var user entity.Users
	query := conn.Model(&entity.Users{})
	for _, association := range associations {
		query = query.Preload(association)
	}

	err := query.Where("email = ?", email).First(&user).Error
	return user, err
}

func (a authRepo) UpdateUser(ctx *gin.Context, user entity.Users) error {
	conn := ctx.MustGet("db").(*gorm.DB)
	return conn.Save(&user).Error
}
