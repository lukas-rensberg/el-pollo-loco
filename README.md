# Work in progress

# 🐔 El Pollo Loco

<div align="center">

![El Pollo Loco Banner](assets/img/9_intro_outro_screens/start/startscreen_1.png)

Ein actionreiches Jump-and-Run Spiel, entwickelt mit purem JavaScript, HTML5 Canvas und CSS3.

[Demo](https://lukas-rensberg.developerakademie.net/el-pollo-loco/)

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/de/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange.svg)](https://developer.mozilla.org/de/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Responsive-blue.svg)](https://developer.mozilla.org/de/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📖 Über das Projekt

**El Pollo Loco** ist ein klassisches Jump-and-Run Spiel im mexikanischen Stil. Steuere den mutigen Pepe durch eine gefährliche Welt voller verrückter Hühner und kämpfe gegen den mächtigen Endboss - das legendäre "El Pollo Loco"!

Das Projekt demonstriert fortgeschrittene Konzepte der objektorientierten Programmierung in JavaScript und zeigt den Einsatz moderner Webtechnologien zur Spieleentwicklung.

### ✨ Features

- 🎮 **Flüssiges Gameplay** - Intuitive Steuerung mit Tastatur oder Touch-Buttons
- 🎨 **Animierte Charaktere** - Detaillierte Sprite-Animationen für alle Figuren
- 🎵 **Sound-Design** - Atmosphärische Hintergrundmusik und Soundeffekte
- 📱 **Mobile-First** - Optimiert für Desktop und Mobile (Querformat)
- 💾 **Local Storage** - Speicherung von Spieleinstellungen
- 🏆 **Fortschrittssystem** - Sammle Münzen und Flaschen
- 👾 **Verschiedene Gegnertypen** - Jeder mit eigenem Verhalten und Schwierigkeitsgrad
- 🎯 **Endboss-Kampf** - Epischer Showdown mit El Pollo Loco

---

## 🎮 Spielanleitung

### Steuerung (Desktop)

| Taste       | Aktion                |
|-------------|-----------------------|
| `←` / `→`   | Bewegung links/rechts |
| `Leertaste` | Springen              |
| `D`         | Flasche werfen        |

### Steuerung (Mobile)

Verwende die Touch-Buttons am Bildschirmrand:
- **Pfeil-Buttons**: Bewegung
- **Jump-Button**: Springen  
- **Wurf-Button**: Flasche werfen

### Spielziel

1. **Sammle Münzen und Flaschen** während du durch die Level läufst
2. **Besiege Gegner** durch Springen oder Flaschenwürfe
3. **Kämpfe gegen den Endboss** am Ende des Levels
4. **Überlebe** - Vermeide Schaden und halte deine Lebensenergie hoch!

### Spielmechanik

- 💚 **Leben**: Wird durch Gegnerkontakt reduziert
- 🪙 **Münzen**: Sammelobjekte für Punkte
- 🍾 **Flaschen**: Munition zum Werfen (sammeln erforderlich)
- 🐔 **Normale Gegner**: Durch Draufspringen oder Flaschenwurf besiegbar
- 👑 **Endboss**: Erfordert mehrere Treffer mit Flaschen

---

## 🚀 Installation & Start

### Voraussetzungen

- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- Optional: Live Server für lokale Entwicklung

### Lokale Installation

1. **Repository klonen**
   ```bash
   git clone https://github.com/yourusername/el-pollo-loco.git
   cd el-pollo-loco
   ```

2. **Projekt öffnen**
   - Öffne die `index.html` direkt im Browser, oder
   - Verwende einen lokalen Server (empfohlen):
   ```bash
   # Mit Python
   python -m http.server 8000
   
   # Mit Node.js (http-server)
   npx http-server
   
   # Mit VS Code Live Server Extension
   ```

3. **Spiel starten**
   - Navigiere zu `http://localhost:8000` (je nach Server)
   - Klicke auf "Start Game"
   - Viel Spaß! 🎉

---

## 🏗️ Projektstruktur

```
el-pollo-loco/
├── index.html                 # Hauptseite
├── impressum.html            # Impressum & Datenschutz
├── style.css                 # Haupt-Stylesheet
├── js/
│   ├── game.js               # Hauptspiel-Logik
│   ├── models/
│   │   ├── world.class.js    # Spielwelt-Verwaltung
│   │   ├── character.class.js
│   │   ├── chicken.class.js
│   │   ├── endboss.class.js
│   │   ├── cloud.class.js
│   │   ├── background-object.class.js
│   │   ├── throwable-object.class.js
│   │   ├── status-bar.class.js
│   │   └── ...
│   ├── levels/
│   │   └── level1.js         # Level-Konfiguration
│   └── templates/
│       └── ui-templates.js   # UI-Vorlagen
├── assets/
│   ├── img/                  # Alle Grafiken & Sprites
│   ├── audio/                # Sounds & Musik
│   └── fonts/                # Lokale Schriftarten
└── README.md
```

---

## 💻 Technische Details

### Technologie-Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Canvas API**: Für Rendering und Animation
- **Audio API**: Für Sound-Management
- **Local Storage**: Für Persistierung

### Architektur-Prinzipien

✅ **Objektorientierte Programmierung**
- Klassenbasierte Struktur für alle Spielobjekte
- Vererbung für gemeinsame Funktionalität
- Kapselung und Modularität

✅ **Clean Code Standards**
- Funktionen mit maximal 14 Zeilen
- Eine Funktion = Eine Aufgabe
- Konsistente Namenskonventionen (camelCase)
- JSDoc-Dokumentation für alle Methoden
- Maximal 400 LOC pro Datei

✅ **Performance-Optimierung**
- Effiziente Kollisionserkennung
- RequestAnimationFrame für flüssige Animationen (60 FPS)
- Sprite-Caching zur Reduzierung von Ladezeiten

### Responsive Design

- Desktop: Vollständige Tastatursteuerung
- Mobile/Tablet: Touch-Button-Interface (nur Querformat)
- Hochformat-Warnung: "Turn your Device to play"
- Dynamische Canvas-Skalierung

---

## 🎨 Design & Assets

### Grafiken

Alle Grafiken stammen aus dem offiziellen El Pollo Loco Asset-Pack:
- Charakter-Sprites (Idle, Walk, Jump, Hurt, Dead, Sleep)
- Gegner-Sprites (verschiedene Hühner-Typen + Endboss)
- Hintergrund-Elemente (nahtlos wiederholbar)
- UI-Elemente (Status-Bars, Buttons, Icons)

### Animationen

- **60 FPS Gameplay** für flüssige Bewegungen
- **Sprite-Animationen** für alle Charaktere
- **Partikeleffekte** bei Kollisionen
- **Statusbar-Updates** in Echtzeit

### Audio

- 🎵 Hintergrundmusik (Loop)
- 🔊 Charakter-Sounds (Jump, Hurt, Snoring)
- 🔊 Gegner-Sounds (Chicken Cluck, Boss Scream)
- 🔊 Umgebungs-Sounds (Collect Coin, Bottle Splash)
- 🔇 Mute-Button mit Local Storage Integration

---

## 📋 Development Checklist

### Git-Workflow
- [x] GitHub Repository erstellt
- [x] Sinnvolle Commit-Messages
- [x] `.gitignore` konfiguriert
- [x] Regelmäßige Commits nach jeder Session

### Funktionalität
- [ ] Alle Buttons funktionieren
- [ ] Keine Console-Errors
- [ ] Keine `console.log()` Ausgaben im Production-Code

### Design
- [ ] Lokale Schriftarten eingebunden
- [ ] Favicon vorhanden
- [ ] `cursor: pointer` auf interaktiven Elementen
- [ ] Responsive Design (Desktop + Mobile Querformat)

### Code-Qualität
- [ ] JSDoc-Dokumentation vollständig
- [ ] Clean Code Prinzipien eingehalten
- [ ] Projektstruktur organisiert (classes Ordner)
- [ ] Konsistente Namenskonventionen

### Gameplay
- [ ] Flüssige Animationen
- [ ] Keine Lücken im Hintergrund
- [ ] Balancierte Gegner (nicht zu stark/schwach)
- [ ] Korrekte Kollisionserkennung
- [ ] Statusbars aktualisieren korrekt
- [ ] Sound-Management funktioniert
- [ ] Restart-Funktion ohne Page-Reload

### Mobile
- [ ] Touch-Buttons nur in Mobile-Ansicht
- [ ] Querformat-Warnung im Hochformat
- [ ] Kontextmenü bei Touch-Buttons deaktiviert

---

## 🤝 Contributing

Contributions sind willkommen! Bitte beachte folgende Richtlinien:

1. Fork das Projekt
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Pushe zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

### Code-Standards

- Befolge die Clean Code Prinzipien
- JSDoc-Dokumentation für neue Funktionen
- Teste deine Änderungen auf Desktop UND Mobile
- Keine Console-Errors

---

## 📝 User Stories

<details>
<summary><strong>Story 1: Spielerklärung & Landingpage</strong></summary>

Als Benutzer möchte ich eine ansprechende Landingpage mit Spielerklärung.

**Akzeptanzkriterien:**
- Ansprechendes Hintergrundbild
- Angepasste Schriftart
- Tastenbelegung einsehbar
- Dialog mit Spielerklärung
- Optional: Story-Hintergrund, Fullscreen-Modus
</details>

<details>
<summary><strong>Story 2: Spielstart & Gameplay</strong></summary>

Als Benutzer möchte ich ein flüssiges Spielerlebnis.

**Akzeptanzkriterien:**
- Start-Button vorhanden
- Kein sofortiges Überrennen bei Start
- Nahtloser Hintergrund
- Hintergrundmusik & Soundeffekte
- Mute-Button mit Local Storage
- Endscreen bei Win/Loss
- Restart & Exit Funktionen
</details>

<details>
<summary><strong>Story 3: Charakter-Animationen</strong></summary>

Als Benutzer möchte ich einen lebendigen, animierten Charakter.

**Akzeptanzkriterien:**
- Flüssige Animationen (Walk, Jump, Hurt, Dead)
- Idle-Animation als Standard
- Sleep-Animation nach 15 Sekunden
- Coins & Flaschen sammelbar
- Flaschen werfbar (mit Gegner-Interaktion)
- Charakter-Sounds (Snoring, Hurt, etc.)
- Statusbar aktualisiert sich korrekt
</details>

<details>
<summary><strong>Story 4: Gegner & Endboss</strong></summary>

Als Benutzer möchte ich herausfordernde Gegner.

**Akzeptanzkriterien:**
- Mindestens 2 Gegnertypen + Endboss
- Unterschiedliche Größen & Geschwindigkeiten
- Flüssige Animationen (auch bei Tod)
- Korrekte Kollisionserkennung (Offsets)
- Gegner-Sounds
- Endboss ist deutlich stärker
</details>

<details>
<summary><strong>Story 5: Mobile Gaming</strong></summary>

Als Benutzer möchte ich auf Mobilgeräten spielen.

**Akzeptanzkriterien:**
- Querformat-Unterstützung
- Touch-Buttons in Mobile-Ansicht
- Kontextmenü deaktiviert bei Touch-Buttons
- Hochformat-Warnung ("Drehe dein Gerät")
</details>

<details>
<summary><strong>Story 6: Impressum</strong></summary>

Als Benutzer möchte ich rechtliche Informationen einsehen.

**Akzeptanzkriterien:**
- Link zum Impressum vorhanden
- Separate Impressum-Seite
- Alle rechtlichen Informationen enthalten
</details>

---

## 🐛 Bekannte Issues & Troubleshooting

### Häufige Probleme

**Animationen zu schnell/langsam**
- Überprüfe die `requestAnimationFrame` Implementierung
- Stelle sicher, dass Delta-Time korrekt berechnet wird

**Lücken im Hintergrund**
- Hintergrundbilder müssen exakt aneinander passen
- Canvas-Breite muss Vielfaches der Bild-Breite sein

**Kollisionserkennung fehlerhaft**
- Prüfe die Offset-Werte in den Charakter-Klassen
- Debug mit visuellen Hitboxen (dev mode)

**Sounds funktionieren nicht**
- Browser benötigt User-Interaktion vor Audio-Playback
- Überprüfe Audio-Dateiformate (MP3/OGG für Kompatibilität)

---

## 📄 Lizenz

Dieses Projekt ist lizenziert unter der MIT License - siehe [LICENSE](LICENSE) Datei für Details.

---

## 👤 Autor

**Lukas Rensberg**

- GitHub: [@lukas-rensberg](https://github.com/lukas-rensberg)
- Portfolio: [lukas-rensberg.de](https://lukas-rensberg.de)

---

## 🙏 Danksagungen

- Grafik-Assets von [Developer Akademie](https://developerakademie.com/)
- Inspiration durch klassische Jump-and-Run Spiele
- Sound-Effekte aus freien Quellen (freesound.org)

---

## 📚 Weitere Ressourcen

- [JavaScript Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [Game Development Patterns](https://gameprogrammingpatterns.com/)
- [JSDoc Documentation](https://jsdoc.app/)
- [Clean Code Principles](https://www.amazon.de/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)

---

<div align="center">

**⭐ Gefällt dir das Projekt? Gib ihm einen Stern! ⭐**

Made with ❤️ and lots of ☕

[Nach oben ⬆️](#-el-pollo-loco)

</div>

