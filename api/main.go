package main

import (
	"github.com/gin-gonic/gin"
	"gopkg.in/olahol/melody.v1"
	"os"
)

func main() {
	r := gin.Default()
	m := melody.New()

	r.GET("/:channel", func(c *gin.Context) {
		m.HandleRequest(c.Writer, c.Request)
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		m.BroadcastFilter(msg, func(q *melody.Session) bool {
			return q.Request.URL.Path == s.Request.URL.Path && q != s
		})
	})

	port := os.Getenv("PORT")

    if port == "" {
        port = "5000" // Default port if not specified
    }

	r.Run(":" + port)
}
