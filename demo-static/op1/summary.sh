#!/bin/bash

rm summary.csv

for f in *.gz
do
    [ -f "$f" ] && gzip -d "$f"
done

for f in *.log
do
    [ -f "$f" ] && mv "$f" "${f%txt}-op1.csv"
done

cat *.csv > summary.csv

exit

