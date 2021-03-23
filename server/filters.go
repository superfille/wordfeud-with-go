package main

func filterMatchedWords(comparison func(matchedWord MatchedWord) bool) func(arr []MatchedWord) []MatchedWord {
	return func(arr []MatchedWord) []MatchedWord {
		result := []MatchedWord{}
		for i := 0; i < len(arr); i++ {
			if comparison(arr[i]) {
				result = append(result, arr[i])
			}
		}
		return result
	}
}
