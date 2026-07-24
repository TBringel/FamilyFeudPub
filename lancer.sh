#!/bin/bash
set -e
echo "Compilation..."
javac -d out src/Main.java
echo "Demarrage du serveur..."
java -cp out Main
