package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-kit/log"
	"github.com/tommycalvy/smltown/crud_service/post"
	service "github.com/tommycalvy/smltown/crud_service/service"
	"github.com/tommycalvy/smltown/crud_service/user"
)

func main() {

	var (
		httpAddr = flag.String("http.addr", ":5656", "HTTP listen address")
	)
	flag.Parse()

	var logger log.Logger
	{
		logger = log.NewLogfmtLogger(os.Stderr)
		logger = log.With(logger, "ts", log.DefaultTimestampUTC)
		logger = log.With(logger, "caller", log.DefaultCaller)
	}

	var s service.Service 
	{
		tableName := os.Getenv("AWS_TABLE_NAME")
		fmt.Println("Table Name: ", tableName)
		userRepo := user.NewUserRepo(tableName)
		dynamoPostRepo := post.NewDynamoPostRepo(tableName)
		filterServiceEndpoint := os.Getenv("FILTER_SERVICE_ENDPOINT")
		filterServiceRepo := post.NewFilterServiceRepo(filterServiceEndpoint)
		defer filterServiceRepo.CloseConn()


		s = service.NewService(userRepo, dynamoPostRepo, filterServiceRepo)
		s = service.NewLoggingService(log.With(logger, "component", "profile"), s)
	}
	
	var h http.Handler
	{
		h = service.MakeHTTPHandler(s, log.With(logger, "component", "HTTP"))
	}

	errs := make(chan error)
	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, syscall.SIGINT, syscall.SIGTERM)
		errs <- fmt.Errorf("%s", <-c)
	}()

	go func() {
		logger.Log("transport", "HTTP", "addr", *httpAddr)
		fmt.Println("listening on port", *httpAddr)
		errs <- http.ListenAndServe(*httpAddr, h)
	}()

	logger.Log("exit", <-errs)
}
