package main

func mapMatched(fn func(matchedWord MatchedWord) MatchedWord) func(arr []MatchedWord) []MatchedWord {
	return func(arr []MatchedWord) []MatchedWord {
		result := []MatchedWord{}
		for i := 0; i < len(arr); i++ {
			result = append(result, fn(arr[i]))
		}
		return result
	}
}
