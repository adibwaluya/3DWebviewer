Ort:
1. Das Programm befindet sich in team2\JTWebViewer
2. Um das Ergebnis vom Progamm im Webbrowser zu schauen, befindet sich die Datei index in team2\JTWebViewer\JTWebViewer

Anmerkungen:
1. Um das Programm zu debuggen, wird die Konsole des Webbrowsers verwendet. Vor Laden der JT-Datei muss die Konsole erstmal
   geoeffnet werden und die Breakpoints platziert werden

a. Google Chrome (strg + shift + j) bei Sources, in der linken Seite die Datei main.js im Ordner js oeffnen.
b. Mozilla Firefox (strg + shift + k) bei Debugger.

Die Integration sieht bisher sehr simpel aus, weil die JT-Reader erst nur die Hexadezimalzahl von File Header und 
Table of Contents lesen kann und diese zwei Datenstrukture braucht die GUI nicht. 