package config

import (
	"database/sql"
	"fmt"
	"gateway/api/entity"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"

	"time"

	"github.com/spf13/viper"
	"log"
	"os"
)

type config struct {
	Port   string
	Secret string
	Mode   string
}

type DBConfig struct {
	UUID     string `mapstructure:"uuid"`
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	Dbname   string `mapstructure:"dbname"`
}

var Config = &config{}
var Logger zerolog.Logger
var DbConnections = make(map[string]*gorm.DB)

func SetupEnv() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}
	Config.Port = os.Getenv("PORT")
	if Config.Port == "" {
		panic("PORT is not set")
	}
	Config.Secret = os.Getenv("SECRET")
	if Config.Secret == "" {
		panic("SECRET is not set")
	}
	Config.Mode = os.Getenv("MODE")
	if Config.Mode == "" {
		panic("MODE is not set")
	}

	InitLogger()

	viper.SetConfigName("database-provider") // Name of the config file (without extension)
	viper.SetConfigType("toml")              // Config file type
	viper.AddConfigPath(".././")             // Path to look for the config file

	// Read the config file
	if err = viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file: %v", err)
	}

	// Unmarshal the database configurations
	var dbConfigs []DBConfig
	if err := viper.UnmarshalKey("databases", &dbConfigs); err != nil {
		log.Fatalf("Error unmarshaling database configs: %v", err)
	}

	for _, c := range dbConfigs {
		err = connectToDatabase(c)
		if err != nil {
			panic(fmt.Sprintf("Unable to connect to %s database: %v", c.UUID, err))
		}
	}
}

func connectToDatabase(config DBConfig) error {
	var err error
	var db *gorm.DB
	var conn *sql.DB

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=disable", config.Host, config.User, config.Password, config.Dbname, config.Port)
	if db, err = gorm.Open(postgres.Open(dsn),
		&gorm.Config{
			TranslateError: true,
			NowFunc: func() time.Time {
				//loc, err := time.LoadLocation("Europe/Paris")
				//if err != nil {
				//	panic(err)
				//}
				// No idea why but it's not working without adding 1 hour
				//return time.Now().In(loc).Add(time.Hour * 1)
				//return time.Now().Add(time.Hour * 1)
				return time.Now()
			},
			NamingStrategy: schema.NamingStrategy{
				TablePrefix:         "",
				SingularTable:       true,
				NameReplacer:        nil,
				NoLowerCase:         false,
				IdentifierMaxLength: 0,
			}}); err != nil {
		return nil
	}
	if conn, err = db.DB(); err != nil {
		return err
	}
	conn.SetMaxIdleConns(10)
	conn.SetMaxOpenConns(10)
	conn.SetConnMaxLifetime(time.Hour)

	err = db.AutoMigrate(&entity.Users{}, &entity.Roles{}, &entity.Access{})
	if err != nil {
		panic(fmt.Sprintf("Unable to auto migrate %s database) %v", config.UUID, err))
	}

	DbConnections[config.UUID] = db

	return nil
}

func InitLogger() {
	runLogFile, _ := os.OpenFile(
		"gateway.log",
		os.O_APPEND|os.O_CREATE|os.O_WRONLY,
		0664,
	)

	zerolog.TimeFieldFormat = "02-01-2006 à 15:04:05"
	output := zerolog.MultiLevelWriter(os.Stdout, runLogFile)
	Logger = zerolog.New(output).With().Timestamp().Caller().Logger()
}
