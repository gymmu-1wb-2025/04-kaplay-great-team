import kaplay from "kaplay";

const k = kaplay({
	// Kaplay-Initialisierung
	width: 1350, // Spielbreite
	height: 750, // Spielhöhe
	canvas: document.getElementById("game-canvas"),
	background: [135, 206, 235], // Himmelblau
	global: false,
	debug: true, // Debug-Modus aktivieren
	debugKey: "r", // Debug-Modus mit "R" ein- und ausschalten
});

function addSkyDecoration() {
	// Funktion zur Dekoration des Himmels
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
	k.setGravity(350); // Schwerkraft für fallende Äpfel
	addSkyDecoration(); // Dekoration hinzufügen

	let score = 0;

	const scoreText = k.add([
		// Score-Anzeige
		k.text("Score: 0", { size: 32 }),
		k.pos(20, 20),
		k.color(255, 255, 255),
	]);

	k.add([
		// Level-Anzeige
		k.rect(1350, 80), // Boden
		k.pos(0, 670), // Bodenposition
		k.color(34, 139, 34), // Bodenfarbe
		k.area(),
		k.body({ isStatic: true }), // Boden soll nicht von der Schwerkraft beeinflusst werden
		"ground",
	]);

	const basket = k.add([
		// Korb
		k.rect(100, 40), // Korbgröße
		k.pos(620, 590), // Startposition des Korbs
		k.color(139, 69, 19), // Korbfarbe
		k.area(), // Kollisionserkennung aktivieren
		k.body({ isStatic: true }), // Korb soll nicht von der Schwerkraft beeinflusst werden
		"basket",
	]);

	basket.add([k.rect(100, 10), k.pos(0, 30), k.color(101, 67, 33)]); // Unterseite des Korbs

	basket.add([k.rect(10, 40), k.pos(0, 0), k.color(101, 67, 33)]); // Linke Seite des Korbs

	basket.add([k.rect(10, 40), k.pos(90, 0), k.color(101, 67, 33)]); // Rechte Seite des Korbs

	k.loop(1.2, () => {
		// Alle 1.2 Sekunden einen Apfel spawnen
		const isRed = k.rand(0, 1) > 0.5; // 50% Chance für roten oder grünen Apfel
		const appleColor = isRed ? [255, 0, 0] : [0, 200, 0]; // Rot = 1 Punkt, Grün = -1 Punkt
		const points = isRed ? 1 : -1;

		const apple = k.add([
			// Apfel erstellen
			k.circle(15), // Apfelgröße
			k.pos(k.rand(50, 1300), -20), // Zufällige Startposition des Apfels
			k.color(appleColor[0], appleColor[1], appleColor[2]), // Apfelfarbe
			k.area(),
			k.body(),
			{ points: points },
			"apple",
		]);

		apple.onCollide("basket", () => {
			// Wenn Apfel den Korb berührt
			score += apple.points;
			scoreText.text = "Score: " + score;
			apple.destroy();

			if (score >= 10) {
				// Bei 10 Punkten zum nächsten Level wechseln
				k.go("nextLevel2", { score: score });
			}
		});

		apple.onCollide("ground", () => {
			// Wenn Apfel den Boden berührt
			apple.destroy();
		});

		apple.onUpdate(() => {
			// Apfel zerstören, wenn er zu weit unten ist
			if (apple.pos.y > 750) {
				apple.destroy();
			}
		});
	});

	k.onKeyDown("d", () => {
		// Korb nach rechts bewegen
		if (basket.pos.x < 1250) {
			basket.pos.x += 12;
		}
	});

	k.onKeyDown("a", () => {
		// Korb nach links bewegen
		if (basket.pos.x > 0) {
			basket.pos.x -= 12;
		}
	});

	k.onKeyDown("right", () => {
		// Korb nach rechts bewegen
		if (basket.pos.x < 1250) {
			basket.pos.x += 12;
		}
	});

	k.onKeyDown("left", () => {
		// Korb nach links bewegen
		if (basket.pos.x > 0) {
			basket.pos.x -= 12;
		}
	});
});

// ----------------------------
// ZWISCHENBILDSCHIRM ZU LEVEL 2
// ----------------------------
k.scene("nextLevel2", (data) => {
	k.add([
		k.text("Nächstes Level!\nDrücke Leertaste", { size: 40, align: "center" }),
		k.pos(390, 300),
		k.color(255, 255, 255),
	]);

	k.add([
		// Aktuellen Score anzeigen
		k.text("Dein Score: " + data.score, { size: 28 }),
		k.pos(560, 420),
		k.color(255, 255, 0),
	]);

	k.onKeyPress("space", () => {
		// Bei Leertaste zum nächsten Level wechseln
		k.go("level2", { score: data.score });
	});
});

// ----------------------------
// LEVEL 2
// ----------------------------
k.scene("level2", (data) => {
	k.setGravity(350);
	addSkyDecoration();

	let score = data.score;

	const scoreText = k.add([
		k.text("Score: " + score, { size: 32 }),
		k.pos(20, 20),
		k.color(255, 255, 255),
	]);

	k.add([k.text("Level 2", { size: 28 }), k.pos(20, 60), k.color(255, 255, 0)]);

	k.add([
		// Boden
		k.rect(1350, 80),
		k.pos(0, 670),
		k.color(34, 139, 34),
		k.area(),
		k.body({ isStatic: true }),
		"ground",
	]);

	const basket = k.add([
		// Korb
		k.rect(100, 40), // Korbgröße
		k.pos(620, 590), // Startposition des Korbs
		k.color(139, 69, 19),
		k.area(), // Kollisionserkennung aktivieren
		k.body({ isStatic: true }), // Korb soll nicht von der Schwerkraft beeinflusst werden
		"basket",
	]);

	basket.add([k.rect(100, 10), k.pos(0, 30), k.color(101, 67, 33)]);

	basket.add([k.rect(10, 40), k.pos(0, 0), k.color(101, 67, 33)]); // Linke Seite des Korbs

	basket.add([k.rect(10, 40), k.pos(90, 0), k.color(101, 67, 33)]); // Rechte Seite des Korbs

	k.loop(0.9, () => {
		// Alle 0.9 Sekunden einen Apfel spawnen
		const randomNumber = k.rand(0, 1);

		let appleColor = [255, 0, 0];
		let points = 1;

		if (randomNumber < 0.15) {
			// 15% Chance für violetten Apfel
			appleColor = [255, 215, 0];
			points = 3;
		} else if (randomNumber < 0.55) {
			// 40% Chance für roten Apfel
			appleColor = [255, 0, 0];
			points = 1;
		} else {
			appleColor = [0, 200, 0]; // 45% Chance für grünen Apfel
			points = -1;
		}

		const apple = k.add([
			k.circle(15),
			k.pos(k.rand(50, 1300), -20), // Zufällige Startposition des Apfels
			k.color(appleColor[0], appleColor[1], appleColor[2]),
			k.area(),
			k.body(),
			{ points: points },
			"apple",
		]);

		apple.onCollide("basket", () => {
			// Wenn Apfel den Korb berührt
			score += apple.points;
			scoreText.text = "Score: " + score;
			apple.destroy();

			if (score >= 25) {
				// Bei 25 Punkten zum nächsten Level wechseln
				k.go("nextLevel3", { score: score });
			}
		});

		apple.onCollide("ground", () => {
			// Wenn Apfel den Boden berührt
			apple.destroy();
		});

		apple.onUpdate(() => {
			// Apfel zerstören, wenn er zu weit unten ist
			if (apple.pos.y > 750) {
				apple.destroy();
			}
		});
	});

	k.onKeyDown("d", () => {
		// Korb nach rechts bewegen
		if (basket.pos.x < 1250) {
			basket.pos.x += 12;
		}
	});

	k.onKeyDown("a", () => {
		// Korb nach links bewegen
		if (basket.pos.x > 0) {
			basket.pos.x -= 12;
		}
	});

	k.onKeyDown("right", () => {
		// Korb nach rechts bewegen
		if (basket.pos.x < 1250) {
			basket.pos.x += 12;
		}
	});

	k.onKeyDown("left", () => {
		// Korb nach links bewegen
		if (basket.pos.x > 0) {
			basket.pos.x -= 12;
		}
	});
});

// ----------------------------
// ZWISCHENBILDSCHIRM ZU LEVEL 3
// ----------------------------
k.scene("nextLevel3", (data) => {
	// Zwischenscreen für Level 3
	k.add([
		k.text("Level 3!\nDrücke Leertaste", { size: 40, align: "center" }),
		k.pos(470, 300),
		k.color(255, 255, 255),
	]);

	k.add([
		// Aktuellen Score anzeigen
		k.text("Dein Score: " + data.score, { size: 28 }),
		k.pos(560, 420),
		k.color(255, 255, 0),
	]);

	k.onKeyPress("space", () => {
		// Bei Leertaste zum nächsten Level wechseln
		k.go("level3", { score: data.score });
	});
});

// ----------------------------
// LEVEL 3
// ----------------------------
k.scene("level3", (data) => {
	k.setGravity(350);
	addSkyDecoration();

	let score = data.score; // Score aus vorherigem Level übernehmen

	const scoreText = k.add([
		// Score-Anzeige
		k.text("Score: " + score, { size: 32 }),
		k.pos(20, 20),
		k.color(255, 255, 255),
	]);

	k.add([k.text("Level 3", { size: 28 }), k.pos(20, 60), k.color(255, 255, 0)]); // Level-Anzeige

	k.add([
		// Boden
		k.rect(1350, 80),
		k.pos(0, 670),
		k.color(34, 139, 34),
		k.area(),
		k.body({ isStatic: true }),
		"ground",
	]);

	const basket = k.add([
		// Korb
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
		const randomNumber = k.rand(0, 1);

		let appleColor = [255, 0, 0];
		let points = 1;
		let isDanger = false;

		if (randomNumber < 0.1) {
			appleColor = [160, 32, 240];
			points = 0;
			isDanger = true;
		} else if (randomNumber < 0.22) {
			appleColor = [255, 215, 0];
			points = 3;
		} else if (randomNumber < 0.6) {
			appleColor = [255, 0, 0];
			points = 1;
		} else {
			appleColor = [0, 200, 0];
			points = -1;
		}

		const apple = k.add([
			k.circle(15),
			k.pos(k.rand(50, 1300), -20),
			k.color(appleColor[0], appleColor[1], appleColor[2]),
			k.area(),
			k.body(),
			{ points: points, isDanger: isDanger },
			"apple",
		]);

		apple.onCollide("basket", () => {
			if (apple.isDanger) {
				k.go("gameOver", { score: score });
				return;
			}

			score += apple.points;
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
			appleColor = [160, 32, 240];
			points = 0;
			isDanger = true;
		} else if (randomNumber < 0.35) {
			appleColor = [0, 0, 0];
			points = 0;
			isBomb = true;
		} else if (randomNumber < 0.48) {
			appleColor = [255, 215, 0];
			points = 3;
		} else if (randomNumber < 0.73) {
			appleColor = [255, 0, 0];
			points = 1;
		} else {
			appleColor = [0, 200, 0];
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
