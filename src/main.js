import kaplay from "kaplay";

const k = kaplay({
	width: 1350,
	height: 750,
	canvas: document.getElementById("game-canvas"),
	background: [135, 206, 235],
	global: false,
	debug: true,
	debugKey: "r",
});

function addSkyDecoration() {
	// Sonne
	k.add([k.circle(45), k.pos(1150, 90), k.color(255, 220, 0)]);

	// Wolke 1
	k.add([k.circle(25), k.pos(140, 100), k.color(255, 255, 255)]);

	k.add([k.circle(30), k.pos(170, 85), k.color(255, 255, 255)]);

	k.add([k.circle(25), k.pos(205, 100), k.color(255, 255, 255)]);

	// Wolke 2
	k.add([k.circle(22), k.pos(420, 140), k.color(255, 255, 255)]);

	k.add([k.circle(28), k.pos(450, 125), k.color(255, 255, 255)]);

	k.add([k.circle(22), k.pos(485, 140), k.color(255, 255, 255)]);

	// Wolke 3
	k.add([k.circle(24), k.pos(800, 110), k.color(255, 255, 255)]);

	k.add([k.circle(30), k.pos(835, 95), k.color(255, 255, 255)]);

	k.add([k.circle(24), k.pos(870, 110), k.color(255, 255, 255)]);
}

// ----------------------------
// LEVEL 1
// ----------------------------
k.scene("level1", () => {
	k.setGravity(350);
	addSkyDecoration();

	let score = 0; // Startscore, Variable fpr die Punktezahl des Spieles

	const scoreText = k.add([
		k.text("Score: 0", { size: 32 }), //erstellt den Text für die Punkteanzeige
		k.pos(20, 20), //Position der Punkteanzeige
		k.color(255, 255, 255), //Farbe der Punkteanzeige
	]);

	k.add([
		k.rect(1350, 80), //erstellt den Boden
		k.pos(0, 670), //Position des Bodens
		k.color(34, 139, 34), //Farbe des Bodens
		k.area(), //macht den Boden kollisionsfähig
		k.body({ isStatic: true }), //macht den Boden unbeweglich durch "isStatic: true"
		"ground", //Bezeichnung des Bodens
	]);

	const basket = k.add([
		//erstellt den Korb
		k.rect(100, 40), //Form und Größe des Korbs
		k.pos(620, 590), //Position des Korbs
		k.color(139, 69, 19), //RGB-Farbe des Korbs
		k.area(), //macht den Korb kollisionsfähig
		k.body({ isStatic: true }), //macht den Korb unbeweglich durch "isStatic: true"
		"basket", //Bezeichnung des Korbs
	]);

	basket.add([k.rect(100, 10), k.pos(0, 30), k.color(101, 67, 33)]); //erstellt die obere Fläche des Korbs: dunkelbraun

	basket.add([k.rect(10, 40), k.pos(0, 0), k.color(101, 67, 33)]);

	basket.add([k.rect(10, 40), k.pos(90, 0), k.color(101, 67, 33)]);

	k.loop(1.2, () => {
		//führt die Funktion alle 1.2 Sekunden aus (erstellt also alle 1.2 Sekunden einen neuen Apfel)
		const isRed = k.rand(0, 1) > 0.5; //bestimmt zufällig, ob der Apfel rot oder grün sein soll (50% Chance für rot, 50% Chance für grün)
		const appleColor = isRed ? [255, 0, 0] : [0, 200, 0]; //legt die Farbe des Apfels fest: rot für gute Äpfel, grün für giftige Äpfel
		const points = isRed ? 1 : -1; //legt die Punkte fest, die der Apfel bringt: 1 Punkt für rote Äpfel, -1 Punkt für grüne Äpfel

		const apple = k.add([
			//erstellt den Apfel
			k.circle(15), //Kreis mit einem Radius von 15 für den Apfel
			k.pos(k.rand(50, 1300), -20), //zufällige Startposition des Apfels: x-Koordinate zwischen 50 und 1300, y-Koordinate -20 (also knapp über dem Bildschirm)
			k.color(appleColor[0], appleColor[1], appleColor[2]), //Farbe des Apfels
			k.area(), //Kollisionsfläche
			k.body(), //Apfel wird von der Schwerkraft beeinflusst
			{ points: points }, //Speichert Punkte im Objekt selbst, damit sie beim Einsammeln des Apfels abgerufen werden können
			"apple", //Bezeichnung des Apfels
		]);

		apple.onCollide("basket", () => {
			//wenn der Apfel mit dem Korb gefangen wird, wird diese Funktion ausgeführt
			score += apple.points; //Punkte des Apfels werden zum Score addiert
			scoreText.text = "Score: " + score; //aktualisiert die Punkteanzeige mit dem neuen Score
			apple.destroy(); //der gefangene Apfel verschwindet vom Bildschirm

			if (score >= 10) {
				//wenn der Score 10 oder höher (>) ist, wird zum nächsten Level gewechselt
				k.go("nextLevel2", { score: score }); //Wechsel zum nächsten Level, der aktuelle Score wird übergeben und im nächsten Level angezeigt
			}
		});

		apple.onCollide("ground", () => {
			//wenn der Apfel den Boden berührt, wird diese Funktion ausgeführt
			apple.destroy(); //der Apfel verschwindet vom Bildschirm, da er heruntergefallen ist
		});

		apple.onUpdate(() => {
			//wird ständig ausgeführt, solange der Apfel existiert
			if (apple.pos.y > 750) {
				//wenn der Apfel eine y-Position von 750 überschreitet (also unter dem Bildschirm), wird er zerstört.
				apple.destroy(); //der Apfel verschwindet vom Bildschirm
			}
		});
	});

	k.onKeyDown("d", () => {
		//wenn die Taste "d" gedrückt wird, wird diese Funktion ausgeführt
		if (basket.pos.x < 1250) {
			//stellt sicher, dass der Korb nicht über die rechte Bildschirmkante hinaus bewegt werden kann (1250, da der Korb 100 Pixel breit ist und die Bildschirmbreite 1350 Pixel beträgt)
			basket.pos.x += 12; //bewegt den Korb um 12 Pixel nach rechts
		}
	});

	k.onKeyDown("a", () => {
		//wenn die Taste "a" gedrückt wird, wird diese Funktion ausgeführt
		if (basket.pos.x > 0) {
			//stellt sicher, dass der Korb nicht über die linke Bildschirmkante hinaus bewegt werden kann (0 Pixel)
			basket.pos.x -= 12; //bewegt den Korb um 12 Pixel nach links
		}
	});

	k.onKeyDown("right", () => {
		//wenn die rechte Pfeiltaste gedrückt wird, wird diese Funktion ausgeführt
		if (basket.pos.x < 1250) {
			//damit der Korb nicht über die rechte Bildschirmkante hinaus bewegt werden kann
			basket.pos.x += 12; //bew
		}
	});

	k.onKeyDown("left", () => {
		//wenn die linke Pfeiltaste gedrückt wird, wird diese Funktion ausgeführt
		if (basket.pos.x > 0) {
			//damit der Korb nicht über die linke Bildschirmkante hinaus bewegt werden kann
			basket.pos.x -= 12; //bewegt den Korb um 12 Pixel nach links
		}
	});
});

// ----------------------------
// ZWISCHENBILDSCHIRM ZU LEVEL 2
// ----------------------------
k.scene("nextLevel2", (data) => {
	//der Score aus dem vorherigen Level wird als "data" übergeben und kann hier verwendet werden, um den aktuellen Score anzuzeigen
	k.add([
		//erstellt den Text für den Zwischenbildschirm, der den Spieler über das Erreichen des nächsten Levels informiert
		k.text("Nächstes Level!\nDrücke Leertaste", {
			//Text, welcher angezeigt wird, wenn der Spieler das nächste Level erreicht hat
			size: 40, //Größe des Textes
			align: "center", //Text wird zentriert ausgerichtet
		}),
		k.pos(390, 300), //Position des Textes auf dem Bildschirm
		k.color(255, 255, 255), //Farbe des Textes (weiß)
	]);

	k.add([
		//erstellt den Text, der den aktuellen Score anzeigt, damit der Spieler seinen Score sehen kann
		k.text("Dein Score: " + data.score, { size: 28 }), //Text, welcher den aktuellen Score anzeigt, die Größe des Textes ist 28
		k.pos(560, 420), //Position des Textes auf dem Bildschirm
		k.color(255, 255, 0), //Farbe des Textes (gelb)
	]);

	k.onKeyPress("space", () => {
		//wenn die Leertaste gedrückt wird, wird diese Funktion ausgeführt
		k.go("level2", { score: data.score }); //wechsel zum nächsten Level, der Score wird ebenfalls übergeben, damit er im nächsten Level angezeigt werden kann
	});
});

// ----------------------------
// LEVEL 2
// ----------------------------
k.scene("level2", (data) => {
	//Score aus dem vorherigen Level wird übergeben, damit er im aktuellen Level angezeigt werden kann
	k.setGravity(350); //setzt die Schwerkraft für dieses Level, damit die Äpfel nach unten fallen
	addSkyDecoration(); //fügt Dekorationen wie Sonne und Wolken hinzu, damit das Spiel ansprechender aussieht
	let score = data.score; //fügt den Score aus dem vorherigen Level ein, damit er im aktuellen Level weiterverwendet und aktualisiert werden kann

	const scoreText = k.add([
		//erstellt den Text für die Punkteanzeige, damit der Spieler seinen aktuellen Score sehen kann
		k.text("Score: " + score, { size: 32 }), //Text, welcher den aktuellen Score anzeigt, die Größe des Textes ist 32
		k.pos(20, 20), //Position des Textes auf dem Bildschirm
		k.color(255, 255, 255), //Farbe des Textes (weiß)
	]);

	k.add([k.text("Level 2", { size: 28 }), k.pos(20, 60), k.color(255, 255, 0)]); //erstellt den Text der das aktuelle Level anzeigt, damit der Spieler weiß, in welchem Level er sich befindet (Text: "Level 2", Größe: 28, Position: (20, 60), Farbe: gelb)

	k.add([
		//erstellt den Boden, damit die Äpfel darauf fallen können
		k.rect(1350, 80), //Grösse des Bodens
		k.pos(0, 670), //Position des Bodens
		k.color(34, 139, 34), //Farbe des Bodens (grün)
		k.area(), //macht den Boden kollisionsfähig, damit die Äpfel darauf fallen können
		k.body({ isStatic: true }), //macht den Boden unbeweglich, damit er nicht von den Äpfeln verschoben werden kann
		"ground", //Bezeichnung des Bodens
	]);

	k.add([
		k.rect(100, 40), //erstellt den Korb, damit der Spieler die Äpfel fangen kann
		k.pos(620, 590), //Position des Korbs
		k.color(139, 69, 19), //Farbe des Korbs (braun)
		k.area(), //macht den Korb kollisionsfähig, damit er die Äpfel fangen kann
		k.body({ isStatic: true }), //macht den Korb unbeweglich
		"basket", //Bezeichnung des Korbs
	]);

	basket.add([k.rect(100, 10), k.pos(0, 30), k.color(101, 67, 33)]); //erstellt die obere Fläche des Korbs: dunkelbraun, damit der Korb realistischer aussieht

	basket.add([k.rect(10, 40), k.pos(0, 0), k.color(101, 67, 33)]); //erstellt die linke Seite des Korbs: dunkelbraun

	basket.add([k.rect(10, 40), k.pos(90, 0), k.color(101, 67, 33)]); //erstellt die rechte Seite des Korbs: dunkelbraun
	k.loop(0.9, () => {
		//führt die Funktion alle 0.9 Sekunden aus, damit die Äpfel schneller fallen als im vorherigen Level und das Spiel somit schwieriger wird
		const randomNumber = k.rand(0, 1); //generiert eine Zufallszahl zwischen 0 und 1, um die Art des Apfels zu bestimmen (roter, grüner oder goldener Apfel)

		let appleColor = [255, 0, 0]; //Standardfarbe für den Apfel (rot)
		let points = 1; //Standardpunkte für den Apfel (1 Punkt für rote Äpfel)

		if (randomNumber < 0.15) {
			//15% Chance, dass ein goldener Apfel erscheint, welcher mehr Punkte bringt als der rote Apfel
			appleColor = [255, 215, 0]; // gold // RGB-Farbe für goldene Äpfel
			points = 3; //Punkte für goldene Äpfel (3 Punkte)
		} else if (randomNumber < 0.55) {
			//40% Chance, dass ein roter Apfel erscheint, welcher 1 Punkt bringt
			appleColor = [255, 0, 0]; // rot // RGB-Farbe für rote Äpfel
			points = 1; //Punkte für rote Äpfel (1 Punkt)
		} else {
			appleColor = [0, 200, 0]; // grün
			points = -1; //Punkte für grüne Äpfel (-1 Punkt)
		}

		const apple = k.add([
			//erstellt den Apfel, der vom Himmel fällt
			k.circle(15), //Form und Größe des Apfels (Kreis mit einem Radius von 15)
			k.pos(k.rand(50, 1300), -20), //zufällige Startposition des Apfels
			k.color(appleColor[0], appleColor[1], appleColor[2]), //Farbe des Apfels, abhängig von der Art des Apfels
			{ points: points }, //Punkte, die der Apfel bringt, werden im Objekt selbst gespeichert, damit sie beim Einsammeln des Apfels eingesammelt werden können
			"apple", //Bezeichnung des Apfels
		]);

		apple.onCollide("basket", () => {
			//wenn der Apfel mit dem Korb gefangen wird , wird diese Funktion ausgeführt
			score += apple.points; //Punkte des Apfels werden zum Score addiert
			scoreText.text = "Score: " + score; //aktualisiert die Punkteanzeige mit dem neuen Score
			apple.destroy(); //der gefangene Apfel verschwindet vom Bildschirm

			if (score >= 25) {
				//wenn der Score 25 oder höher ist, wird zum nächsten Level gewechselt
				k.go("nextLevel3", { score: score }); //Wechsel zum nächsten Level, der aktuelle Score wird übergeben und im nächsten Level angezeigt
			}
		});

		apple.onCollide("ground", () => {
			//wenn der Apfel den Boden berührt, wird diese Funktion ausgeführt
			apple.destroy(); //der Apfel verschwindet vom Bildschirm da er heruntergefallen ist
		});

		apple.onUpdate(() => {
			//wird ständig ausgeführt, solange der Apfel existiert
			if (apple.pos.y > 750) {
				//wenn der Apfel eine höhere y-Position als 750 hat (also unter dem Bildschirm), wird er zerstört
				apple.destroy(); //der Apfel verschwindet vom Bildschirm
			}
		});
	});

	k.onKeyDown("d", () => {
		//wenn die Taste "d" gedrückt wird, wird diese Funktion ausgeführt
		if (basket.pos.x < 1250) {
			//damit der Korb nicht über die rechte Bildschirmkante hinaus bewegt werden kann
			basket.pos.x += 12; //bewegt den Korb um 12 Pixel nach rechts
		}
	});

	k.onKeyDown("a", () => {
		//wenn die Taste "a" gedrückt wird, wird diese Funktion ausgeführt
		if (basket.pos.x > 0) {
			//damit der Korb nicht über die linke Bildschirmkante hinaus bewegt werden kann
			basket.pos.x -= 12; //bewegt den Korb um 12 Pixel nach links
		}
	});

	k.onKeyDown("right", () => {
		//wenn die rechte Pfeiltaste gedrückt wird, wird diese Funktion ausgeführt
		if (basket.pos.x < 1250) {
			//damit der Korb hier ebenfalls nicht über die rechte Bildschirmkante hinaus bewegt werden kann
			basket.pos.x += 12; //bewegt den Korb ebenfalls um 12 Pixel nach rechts
		}
	});

	k.onKeyDown("left", () => {
		//wenn die linke Pfeiltaste gedrückt wird, wird diese Funktion ausgeführt
		if (basket.pos.x > 0) {
			//damit der Korb hier ebenfalls nicht über die linke Bildschirmkante hinaus bewegt werden kann
			basket.pos.x -= 12; //bewegt den Korb ebenfalls um 12 Pixel nach links
		}
	});
});

// ----------------------------
// ZWISCHENBILDSCHIRM ZU LEVEL 3
// ----------------------------
k.scene("nextLevel3", (data) => {
	//der Score aus dem vorherigen Level wird übergeben und kann hier verwendet werden, um den aktuellen Score anzuzeigen
	k.add([
		//erstellt den Text für den Zwischenbildschirm, der den Spieler über das Erreichen des nächsten Levels informiert
		k.text("Level 3!\nDrücke Leertaste", { size: 40, align: "center" }), //Text, welcher angezeigt wird, wenn der Spieler das nächste Level erreicht hat, die Größe des Textes ist 40 und der Text wird zentriert ausgerichtet
		k.pos(470, 300), //position des Textes auf dem Bildschirm
		k.color(255, 255, 255), //Farbe des Textes (weiss)
	]);

	k.add([
		//erstellt den Text für den Zwischenbildschirm, der den Spieler über ihren aktuellen Score informiert
		k.text("Dein Score: " + data.score, { size: 28 }), //Text, welcher den aktuellen Score anzeigt, die Grösse des Textes ist 28
		k.pos(560, 420), //Position des Textes auf dem Bildschirm
		k.color(255, 255, 0), //Farbe des Textes (gelb)
	]);

	k.onKeyPress("space", () => {
		//wenn die Leertaste gedrückt wird, wird diese Funktion ausgeführt
		k.go("level3", { score: data.score }); //wechsel zum nächsten Level, der Score wird ebenfalls übergeben, damit er im nächsten Level angezeigt werden kann
	});
});

// ----------------------------
// LEVEL 3
// ----------------------------
k.scene("level3", (data) => {
	//Score aus dem vorherigen Level wird hier ebenfalls übergeben, damit er im aktuellen Level angezeigt werden kann
	k.setGravity(350); //setzt die Schwerkraft für dieses Level, damit die Äpfel nach unten fallen
	addSkyDecoration(); //fügt Dekorationen wie Sonne und Wolken hinzu
	let score = data.score;
	const scoreText = k.add([
		k.text("Score: " + score, { size: 32 }),
		k.pos(20, 20),
		k.color(255, 255, 255),
	]);

	k.add([k.text("Level 3", { size: 28 }), k.pos(20, 60), k.color(255, 255, 0)]);

	k.add([
		k.rect(1350, 80),
		k.pos(0, 670),
		k.color(34, 139, 34),
		k.area(),
		k.body({ isStatic: true }),
		"ground",
	]);

	const basket = k.add([
		k.rect(100, 40),
		k.pos(620, 590),
		k.color(139, 69, 19),
		k.area(),
		k.body({ isStatic: true }),
		"basket",
	]);

	basket.add([k.rect(100, 10), k.pos(0, 30), k.color(101, 67, 33)]);

	basket.add([k.rect(10, 40), k.pos(0, 0), k.color(101, 67, 33)]);

	basket.add([k.rect(10, 40), k.pos(90, 0), k.color(101, 67, 33)]);

	k.loop(0.8, () => {
		//führt die Funktion alle 0.8 Sekunden aus, damit die Äpfel schneller fallen als im vorherigen Level und das Spiel somit schwieriger wird
		const randomNumber = k.rand(0, 1); //generiert eine Zufallszahl zwischen 0 und 1, um die Art des Apfels zu bestimmen (roter, grüner, goldener oder violetter Apfel)

		let appleColor = [255, 0, 0]; //farbe für den Apfel (rot)
		let points = 1; //Punkte für den Apfel (1 Punkt für rote Äpfel)
		let isDanger = false; //Bestimmt, ob der Apfel gefährlich ist (in diesem Fall nicht, da es ein roter Apfel ist)

		if (randomNumber < 0.1) {
			//10% Chance, dass ein violetter Apfel erscheint, welcher gefährlich ist und keine Punkte bringt
			appleColor = [160, 32, 240]; // violett
			points = 0; //Gibt keine Punkte
			isDanger = true; //gefährlicher Apfel
		} else if (randomNumber < 0.22) {
			//12% Chance, dass eine Bombe erscheint, welche gefährlich ist und keine Punkte bringt
			appleColor = [255, 215, 0]; // gold
			points = 3; //Punkte für goldene Äpfel, in diesem Fall 3
		} else if (randomNumber < 0.6) {
			//38% Chance, dass ein roter Apfel erscheint, welcher 1 Punkt bringt
			appleColor = [255, 0, 0]; // rot
			points = 1;
		} else {
			appleColor = [0, 200, 0]; // grün
			points = -1;
		}

		const apple = k.add([
			//erstellt den Apfel, der vom Himmel fällt
			k.circle(15), //Radius des Apfels, hierbei 15
			k.pos(k.rand(50, 1300), -20),

			k.color(appleColor[0], appleColor[1], appleColor[2]),
			k.area(),
			k.body(),
			{ points: points, isDanger: isDanger }, //Punkte und Gefährlichkeit des Apfels werden im Objekt selbst gespeichert, damit sie beim Einsammeln des Apfels ausgeführt werden können
			"apple", //Bezeichnung
		]);

		apple.onCollide("basket", () => {
			//wenn der Apfel mit dem Korb gefangen wird, wird diese Funktion ausgeführt
			if (apple.isDanger) {
				//"wenn der Apfel gefährlich ist"
				k.go("gameOver", { score: score }); //Wechsel zum game over Bildschirm
				return;
			}

			score += apple.points; //Punkte des Apfels werden zum Score addiert
			scoreText.text = "Score: " + score;
			apple.destroy();

			if (score >= 45) {
				k.go("nextLevel4", { score: score });
			}
		});

		apple.onCollide("ground", () => {
			apple.destroy();
		});

		apple.onUpdate(() => {
			if (apple.pos.y > 750) {
				apple.destroy();
			}
		});
	});

	k.onKeyDown("d", () => {
		if (basket.pos.x < 1250) {
			basket.pos.x += 12;
		}
	});

	k.onKeyDown("a", () => {
		if (basket.pos.x > 0) {
			basket.pos.x -= 12;
		}
	});

	k.onKeyDown("right", () => {
		if (basket.pos.x < 1250) {
			basket.pos.x += 12;
		}
	});

	k.onKeyDown("left", () => {
		if (basket.pos.x > 0) {
			basket.pos.x -= 12;
		}
	});
});

// ----------------------------
// ZWISCHENBILDSCHIRM ZU LEVEL 4
// ----------------------------
k.scene("nextLevel4", (data) => {
	k.add([
		k.text("Level 4!\nDrücke Leertaste", { size: 40, align: "center" }),
		k.pos(470, 300),
		k.color(255, 255, 255),
	]);

	k.add([
		k.text("Dein Score: " + data.score, { size: 28 }),
		k.pos(560, 420),
		k.color(255, 255, 0),
	]);

	k.onKeyPress("space", () => {
		k.go("level4", { score: data.score });
	});
});

// ----------------------------
// LEVEL 4
// ----------------------------
k.scene("level4", (data) => {
	k.setGravity(500);
	addSkyDecoration();
	let score = data.score;

	const scoreText = k.add([
		k.text("Score: " + score, { size: 32 }),
		k.pos(20, 20),
		k.color(255, 255, 255),
	]);

	k.add([k.text("Level 4", { size: 28 }), k.pos(20, 60), k.color(255, 255, 0)]);

	k.add([
		k.rect(1350, 80),
		k.pos(0, 670),
		k.color(34, 139, 34),
		k.area(),
		k.body({ isStatic: true }),
		"ground",
	]);

	const basket = k.add([
		k.rect(100, 40),
		k.pos(620, 590),
		k.color(139, 69, 19),
		k.area(),
		k.body({ isStatic: true }),
		"basket",
	]);

	basket.add([k.rect(100, 10), k.pos(0, 30), k.color(101, 67, 33)]);

	basket.add([k.rect(10, 40), k.pos(0, 0), k.color(101, 67, 33)]);

	basket.add([k.rect(10, 40), k.pos(90, 0), k.color(101, 67, 33)]);

	k.loop(0.6, () => {
		const randomNumber = k.rand(0, 1);

		let appleColor = [255, 0, 0];
		let points = 1;
		let isDanger = false;
		let isBomb = false;

		if (randomNumber < 0.25) {
			appleColor = [160, 32, 240]; // violett
			points = 0;
			isDanger = true;
		} else if (randomNumber < 0.35) {
			appleColor = [0, 0, 0]; // Bombe
			points = 0;
			isBomb = true;
		} else if (randomNumber < 0.48) {
			appleColor = [255, 215, 0]; // gold
			points = 3;
		} else if (randomNumber < 0.73) {
			appleColor = [255, 0, 0]; // rot
			points = 1;
		} else {
			appleColor = [0, 200, 0]; // grün
			points = -1;
		}

		const apple = k.add([
			k.circle(15),
			k.pos(k.rand(50, 1300), -20),
			k.color(appleColor[0], appleColor[1], appleColor[2]),
			k.area(),
			k.body(),
			{ points: points, isDanger: isDanger, isBomb: isBomb },
			"apple",
		]);

		apple.onCollide("basket", () => {
			if (apple.isDanger || apple.isBomb) {
				k.go("level4", { score: 45 });
				return;
			}

			score += apple.points;
			scoreText.text = "Score: " + score;
			apple.destroy();

			if (score >= 70) {
				k.go("win", { score: score });
			}
		});

		apple.onCollide("ground", () => {
			apple.destroy();
		});

		apple.onUpdate(() => {
			if (apple.pos.y > 750) {
				apple.destroy();
			}
		});
	});

	// Korb langsamer in Level 4
	k.onKeyDown("d", () => {
		if (basket.pos.x < 1250) {
			basket.pos.x += 7;
		}
	});

	k.onKeyDown("a", () => {
		if (basket.pos.x > 0) {
			basket.pos.x -= 7;
		}
	});

	k.onKeyDown("right", () => {
		if (basket.pos.x < 1250) {
			basket.pos.x += 7;
		}
	});

	k.onKeyDown("left", () => {
		if (basket.pos.x > 0) {
			basket.pos.x -= 7;
		}
	});
});

// ----------------------------
// GAME OVER
// ----------------------------
k.scene("gameOver", (data) => {
	k.add([
		k.text("GAME OVER", { size: 60 }),
		k.pos(470, 250),
		k.color(255, 0, 0),
	]);

	k.add([
		k.text("Du hast einen violetten Apfel gefangen!", { size: 28 }),
		k.pos(350, 350),
		k.color(255, 255, 255),
	]);

	k.add([
		k.text("Endscore: " + data.score, { size: 32 }),
		k.pos(520, 420),
		k.color(255, 255, 0),
	]);

	k.add([
		k.text("Drücke Leertaste zum Neustart", { size: 26 }),
		k.pos(410, 500),
		k.color(255, 255, 255),
	]);

	k.onKeyPress("space", () => {
		k.go("level1");
	});
});

// ----------------------------
// GEWONNEN
// ----------------------------
k.scene("win", (data) => {
	k.add([
		k.text("DU HAST GEWONNEN!", { size: 55 }),
		k.pos(320, 250),
		k.color(255, 215, 0),
	]);

	k.add([
		k.text("Endscore: " + data.score, { size: 32 }),
		k.pos(520, 370),
		k.color(255, 255, 255),
	]);

	k.add([
		k.text("Drücke Leertaste zum Neustart", { size: 26 }),
		k.pos(410, 470),
		k.color(255, 255, 255),
	]);

	k.onKeyPress("space", () => {
		k.go("level1");
	});
});

// Spiel starten
k.go("level1");

export default k;
