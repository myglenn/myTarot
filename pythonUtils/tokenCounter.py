import sys
import tiktoken

def main():
    if len(sys.argv) < 2:
        return 0

    model = "gpt-4"
    enc = tiktoken.encoding_for_model(model)
    input_text = sys.argv[1]
    tokens = enc.encode(input_text)

    return len(tokens)

if __name__ == "__main__":
    result = main()
    print(result)