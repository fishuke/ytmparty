package main

var rickrollChannels = []string{"rick", "rickroll", "test", "0", "1337"}

func contains(arr []string, str string) bool {
	for _, a := range arr {
		if a == str {
			return true
		}
	}
	return false
}