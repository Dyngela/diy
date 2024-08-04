package entity

import (
	"gorm.io/gorm"
	"time"
)

type Users struct {
	gorm.Model
	Email                  string
	Password               string
	RefreshToken           string
	RefreshTokenExpiration time.Time
	Roles                  []Roles  `gorm:"many2many:user_has_roles;"`
	Access                 []Access `gorm:"many2many:user_has_access;"`
}

type Role int

const (
	Admin Role = iota
	User
)

type Roles struct {
	gorm.Model
	Role Role
}

type AccessType int

const (
	MyStock AccessType = iota
	MyLead
)

type Access struct {
	gorm.Model
	Access AccessType
}
