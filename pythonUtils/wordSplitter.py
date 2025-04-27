import sys
import wordninja
import re

def main():
    if len(sys.argv) < 2:
        return 0
    
    inputText = sys.argv[1]
    
    words = wordninja.split(inputText)
    
    english_words = [word for word in words if re.fullmatch(r'[a-zA-Z]+', word)]

    return len(english_words)

if __name__ == "__main__":
    result = main()
    print(result)