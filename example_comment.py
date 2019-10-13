#!/bin/env python3

def fibonacci(n=5):
    # Generator for the fibonacci sequence
    i = 0
    a = [1, 0, 0]
    while c < n:
        yield a[i]
        i = (i + 1)%3
        a[i] = a[i - 1] + a[i - 2]  # Fibonacci sequence

# Print all numbers of the fibonacci sequence up till N and the value right after.
for f in fibonacci(int(input("fibonacci until after: nº "))):
    print(f)
