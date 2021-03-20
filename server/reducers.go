package main

func reduceMatchedWords(arr []string, initial []MatchedWord, reducer func(acc []MatchedWord, current string) []MatchedWord) []MatchedWord {
	temp := initial
	for i := 0; i < len(arr); i++ {
		temp = reducer(temp, arr[i])
	}
	return temp
}
