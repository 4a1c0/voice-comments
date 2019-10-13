#!/bin/env python3

def fibonachi(n=5):
    i = 0
    a = [1, 0, 0]
    while c < n:
        yield a[i]
        i = (i + 1)%3
        a[i] = a[i - 1] + a[i - 2]

for f in fibonachi(int(input("Fibonachi until after: nº "))):

    print(f)
