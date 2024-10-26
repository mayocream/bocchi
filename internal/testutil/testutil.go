package testutil

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"

	"github.com/mayocream/twitter/ent"

	_ "github.com/mattn/go-sqlite3"
)

func InMemoryDatabase() *ent.Client {
	// https://entgo.io/docs/testing/
	client, err := ent.Open("sqlite3", "file:ent?mode=memory&_fk=1")
	if err != nil {
		panic(err)
	}
	if err := client.Schema.Create(context.Background()); err != nil {
		panic(err)
	}
	return client
}

func MakeTestRequest(method, path string, body interface{}) *http.Request {
	jsonBody, _ := json.Marshal(body)
	req := httptest.NewRequest(method, path, bytes.NewReader(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	return req
}
