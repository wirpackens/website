# Git-Problem beheben - Wir Packens UG

## Das Problem
```
error: could not lock config file .git/config: File exists
fatal: could not set 'remote.origin.url'
fatal: 'origin' does not appear to be a git repository
```

## Lösung: Git-Repository neu einrichten

### Schritt 1: Alle Git-Lock-Dateien entfernen
```bash
cd ~/workspace
rm -f .git/index.lock .git/config.lock .git/HEAD.lock .git/refs/heads/main.lock
```

### Schritt 2: Git-Repository komplett neu initialisieren
```bash
# Altes Git-Repository entfernen
rm -rf .git

# Neues Git-Repository erstellen
git init

# Git-Benutzer konfigurieren (falls noch nicht geschehen)
git config user.name "Ihr Name"
git config user.email "ihre-email@example.com"

# Alle Dateien hinzufügen
git add .

# Ersten Commit erstellen
git commit -m "Complete Wir Packens UG website with email system and GDPR compliance"

# Main Branch setzen
git branch -M main
```

### Schritt 3: GitHub Repository hinzufügen und pushen
```bash
# Remote Repository hinzufügen
git remote add origin https://github.com/miguelhaeslerde/wirpackens.git

# Code zu GitHub pushen
git push -u origin main
```

## Falls das GitHub Repository nicht existiert

1. Gehen Sie zu https://github.com/miguelhaeslerde
2. Klicken Sie auf "New repository" 
3. Repository Name: `wirpackens`
4. Beschreibung: `Professional German waste clearance company landing page`
5. Public Repository wählen
6. Keine README, .gitignore oder License hinzufügen (bereits vorhanden)
7. Repository erstellen

## Schnelle Ein-Zeilen-Lösung
```bash
cd ~/workspace && rm -rf .git && git init && git add . && git commit -m "Complete Wir Packens UG website" && git branch -M main && git remote add origin https://github.com/miguelhaeslerde/wirpackens.git && git push -u origin main
```

Das löst alle Git-Lock-Probleme und richtet das Repository sauber neu ein.