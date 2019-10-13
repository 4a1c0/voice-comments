#!/bin/env python3

# generator for the Fibonacci sequence
def fibonacci(n=float("inf")):
    i = 0
    a = [1, 0, 0]
    while a[i] < n:
        yield a[i]
        i = (i + 1)%3
        a[i] = a[i - 1] + a[i - 2]  # Fibonacci sequence   


# all numbers of the Fibonacci sequence
for f in fibonacci(int(input("Fibonacci until: nº "))):
    print(f)     