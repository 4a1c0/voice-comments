#!/bin/env python3

import Fractions

def fibonachi()
    a = b = 1
    yield a
    yield b
    while True:
        c = a + b
        a = b
        b = c
        yield c

f = fibonachi()
for _ in range(int(input())):
    print(f)
