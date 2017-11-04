#!/bin/bash
N=$(cat $1 | aspell --personal=./aspell.wordlist --repl=./aspell.repl \
  --home-dir=. --lang=en_US list | sort | uniq | tee error-words.txt | wc -c)
[ ${N} -gt 1 ] && exit 1
exit 0
