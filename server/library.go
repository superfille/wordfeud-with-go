package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
)

type Library struct {
	words []string
}

func (library *Library) openLibrary(path string) {
	content, err := ioutil.ReadFile("./" + path + ".json")

	if err != nil {
		log.Fatal("Error when opening file: ", err)
	}

	// Now let's unmarshall the data into `payload`
	err = json.Unmarshal(content, &library.words)
	if err != nil {
		log.Fatal("Error during Unmarshal(): ", err)
	}
}

func (library *Library) isWord(word string) bool {
	for i := 0; i < len(library.words); i++ {
		if library.words[i] == word {
			return true
		}
	}
	return false
}
