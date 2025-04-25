import sys
import json
import wordninja

def main():
    if len(sys.argv) < 2:
        return
    
    inputText = sys.argv[1]
    return wordninja.split(inputText)

if __name__ == "__main__":
    result = main()