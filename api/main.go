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

	m.HandleConnect(func(s *melody.Session) {
		channel := s.Request.URL.String()[1:]

		if contains(rickrollChannels, channel) {
			s.Write([]byte(`{"event":"play","id":"dQw4w9WgXcQ"}`))
		}

	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		// dont send to sender
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
