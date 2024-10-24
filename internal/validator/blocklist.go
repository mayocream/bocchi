package validator

import (
	_ "embed"

	"gopkg.in/yaml.v3"
)

//go:embed blocklist.yaml
var BlocklistYAML []byte

var Blocklist struct {
	Usernames []string `yaml:"usernames"`
}

func init() {
	yaml.Unmarshal(BlocklistYAML, &Blocklist)
}

func IsUsernameBlocked(username string) bool {
	for _, blocked := range Blocklist.Usernames {
		if username == blocked {
			return true
		}
	}
	return false
}
