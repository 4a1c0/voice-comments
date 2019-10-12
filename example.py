#!/bin/env python3

def fibonachi(n=5):
    a = b = c = 1
    yield a
    yield b
    while c < n:
        c = a + b
        a = b
        b = c
        yield c

for f in fibonachi(int(input("Fibonachi until after: nº "))):
    print(f)
