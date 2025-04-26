import sys
import tiktoken

def main():
    model = "gpt-3.5-turbo"
    enc = tiktoken.encoding_for_model(model)
    input_text = sys.argv[1]
    tokens = enc.encode(input_text)
    print(len(tokens))

if __name__ == "__main__":
    main()