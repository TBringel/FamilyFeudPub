@echo off
echo Compilation...
javac -d out src\Main.java
if errorlevel 1 (
  echo Erreur de compilation.
  pause
  exit /b 1
)
echo Demarrage du serveur...
java -cp out Main
pause
