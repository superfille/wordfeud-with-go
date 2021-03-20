package main

func someString(arr []string, comparison func(c1 string) bool) bool {
	for i := 0; i < len(arr); i++ {
		if comparison(arr[i]) {
			return true
		}
	}
	return false
}
