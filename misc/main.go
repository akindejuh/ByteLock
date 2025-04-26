// Golang Version, can ignore

package main

import (
	"net/http"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"unicode/utf8"
)

type ByteLock struct{}

func (b *ByteLock) jsonStringify(data interface{}) *string {
	if data == nil {
		return nil
	}
	bytes, err := json.Marshal(data)
	if err != nil {
		return nil
	}
	result := string(bytes)
	return &result
}

func (b *ByteLock) jsonParse(data string) interface{} {
	if data == "" {
		return nil
	}
	var result interface{}
	err := json.Unmarshal([]byte(data), &result)
	if err != nil {
		return nil
	}
	return result
}

func (b *ByteLock) getCharCode(char rune) int {
	return int(char)
}

func (b *ByteLock) reverseCharCode(charCode int) string {
	return string(rune(charCode))
}

func (b *ByteLock) isASCIIOrANSIChar(char rune) bool {
	code := b.getCharCode(char)
	return code >= 32 && code <= 255
}

func (b *ByteLock) hashString(data string) int {
	hash := 0
	for _, char := range data {
		hash = (hash << 5) - hash + int(char)
		hash = hash & hash
	}
	return hash
}

func (b *ByteLock) GenerateCipherKey(senderID, receiverID string) *int {
	if senderID == "" || receiverID == "" {
		return nil
	}
	combined := senderID + receiverID
	hash := b.hashString(combined)
	randomNumber := abs(hash) % 10000
	if randomNumber < 1 {
		randomNumber = 1
	}
	key := randomNumber % 50
	return &key
}

func (b *ByteLock) CipherMessage(message string, secretKey *int) string {
	if secretKey == nil {
		return ""
	}

	var ciphered strings.Builder

	for _, char := range message {
		if b.isASCIIOrANSIChar(char) {
			charCode := b.getCharCode(char)
			newKey := charCode + *secretKey
			hashed := fmt.Sprintf("%d%02x", newKey/255, newKey%255)
			ciphered.WriteString(hashed)
		} else {
			ciphered.WriteRune(char)
		}
	}

	reversed := reverseString(ciphered.String())
	jsonStr := b.jsonStringify(reversed)
	if jsonStr == nil {
		return ""
	}
	return *jsonStr
}

func (b *ByteLock) DecipherMessage(message string, secretKey *int) string {
	if secretKey == nil {
		return ""
	}

	var jsonDecoded string
	if err := json.Unmarshal([]byte(message), &jsonDecoded); err != nil {
		return ""
	}

	text := reverseString(jsonDecoded)
	var result strings.Builder
	index := 0

	for index < len(text) {
		r, _ := utf8.DecodeRuneInString(text[index:])
		if b.isASCIIOrANSIChar(r) && index+3 <= len(text) {
			segment := text[index : index+3]
			prefix := segment[0]
			hexPart := segment[1:3]

			decVal, err := strconv.ParseInt(hexPart, 16, 0)
			if err != nil {
				index++
				continue
			}

			val := int(decVal)
			if prefix == '1' {
				val += 255
			}

			original := val - *secretKey
			result.WriteString(b.reverseCharCode(original))
			index += 3
		} else {
			result.WriteByte(text[index])
			index++
		}
	}

	return result.String()
}

func reverseString(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}

func abs(n int) int {
	if n < 0 {
		return -n
	}
	return n
}

func BytelockHandler(w http.ResponseWriter, r *http.Request) {
	bl := &ByteLock{}

	sender_id := "66abe1cc11f58bf19a8dcef7"
	receiver_id := "66b1097c4ede2430559fa193"
	message := "Hello, Bob!"

	key := bl.GenerateCipherKey(sender_id, receiver_id)

	if key == nil {
		http.Error(w, "Failed to generate cipher key", http.StatusInternalServerError)
		return
	}

	ciphered := bl.CipherMessage(message, key)
	deciphered := bl.DecipherMessage(ciphered, key)

	response := fmt.Sprintf(
		"Generated Key: %d\nCiphered Message: %s\nDeciphered Message: %s\n",
		*key,
		ciphered,
		deciphered,
	)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(response))
}
