#!/bin/bash
ip="130.162.34.50"

# open bash here and start ./deploy.sh

echo "Builing frontend..."
cd ../frontend
ng build
cd ..


echo "Preparing dist..."
# Lista plików do skopiowania
FILES_AND_FOLDERS=(
    "router.js"
    "todo.js"
    "package.json"
    "package-lock.json"
    "controllers"
    "db"
    "models"
    "public"
    ".env"
)

SOURCE_DIR='backend'
DEST_DIR='dist'

rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"

# Pętla kopiująca pliki i foldery
for ITEM in "${FILES_AND_FOLDERS[@]}"; do
    # Sprawdzenie, czy element jest katalogiem
    if [ -d "$SOURCE_DIR/$ITEM" ]; then
        echo "Kopiowanie katalogu: $ITEM"
        cp -r "$SOURCE_DIR/$ITEM" "$DEST_DIR/"
    elif [ -f "$SOURCE_DIR/$ITEM" ]; then
        echo "Kopiowanie pliku: $ITEM"
        cp "$SOURCE_DIR/$ITEM" "$DEST_DIR/"
    else
        echo "Ostrzeżenie: $ITEM nie istnieje w katalogu źródłowym"
    fi
done


echo "Push dist to temp repo..."
cd "$DEST_DIR"
git init
git remote add origin https://github.com/pawelmat142/dist.git
git branch -M main
git add .
git commit -m "deploy todo app - temp dist"
git push --force origin main


# instalacja zdalnie
echo "Instalation on server..."
ssh -i C:/Users/ppp/.ssh/oracle ubuntu@130.162.34.50 'pm2 stop 1' #<- niestety nie dziala trzeba puscic recznie
ssh -i C:/Users/ppp/.ssh/oracle ubuntu@130.162.34.50 'rm -rf app/todo'
ssh -i C:/Users/ppp/.ssh/oracle ubuntu@130.162.34.50 'mkdir app/todo'
ssh -i C:/Users/ppp/.ssh/oracle ubuntu@130.162.34.50 'cd app/todo'
ssh -i C:/Users/ppp/.ssh/oracle ubuntu@130.162.34.50 'git clone https://github.com/pawelmat142/dist.git app/todo'
ssh -i C:/Users/ppp/.ssh/oracle ubuntu@130.162.34.50 'npm i' #<- niestety nie dziala trzeba puscic recznie
ssh -i C:/Users/ppp/.ssh/oracle ubuntu@130.162.34.50 'pm2 start todo.js' #<- niestety nie dziala trzeba puscic recznie

# # wyczysc dist i temp repo
echo "Cleaning temp repo..."
rm -rf *
rm -rf .env
git init
git remote add origin https://github.com/pawelmat142/dist.git
git add .
git commit -m "Cleaning repo history"
git branch -m master main
git push --force origin main

echo "App started"