import kaplay from "kaplay";

const k = kaplay({
	width: 1350,
	height: 750,
	canvas: document.getElementById("game-canvas"),
	background: [135, 206, 235], // Himmelblau
	global: false,
	debug: true,
	debugKey: "r",
});

// ----------------------------
// LEVEL 1
// ----------------------------
k.scene("level1", () => {
	k.setGravity(350);

	let score = 0;

	const scoreText = k.add([
		k.text("Score: 0", { size: 32 }),
		k.pos(20, 20),
		k.color(255, 255, 255),
	]);

	// Boden
	k.add([
		k.rect(1350, 80),
		k.pos(0, 670),
		k.color(34, 139, 34),
		k.area(),
		k.body({ isStatic: true }),
		"ground",
	]);

	// Korb
	const basket = k.add([
		k.rect(100, 40),
		k.pos(620, 590),
		k.color(139, 69, 19),
		k.area(),
		k.body({ isStatic: true }),
		"basket",
	]);

	// Korb schöner machen
	basket.add([k.rect(100, 10), k.pos(0, 30), k.color(101, 67, 33)]);

	basket.add([k.rect(10, 40), k.pos(0, 0), k.color(101, 67, 33)]);

	basket.add([k.rect(10, 40), k.pos(90, 0), k.color(101, 67, 33)]);

	// Äpfel in Level 1
	k.loop(1.2, () => {
		const isRed = k.rand(0, 1) > 0.5;
		const appleColor = isRed ? [255, 0, 0] : [0, 200, 0];
		const points = isRed ? 1 : -1;

		const apple = k.add([
			k.circle(15),
			k.pos(k.rand(50, 1300), -20),
			k.color(appleColor[0], appleColor[1], appleColor[2]),
			k.area(),
			k.body(),
			{ points: points },
			"apple",
		]);

		// Wenn Apfel den Korb trifft
		apple.onCollide("basket", () => {
			score += apple.points;
			scoreText.text = "Score: " + score;
			apple.destroy();

			// Ab 10 Punkten zu Level 2
			if (score >= 10) {
				k.go("nextLevel", { score: score });
			}
		});

		// Wenn Apfel den Boden trifft
		apple.onCollide("ground", () => {
			apple.destroy();
		});

		apple.onUpdate(() => {
			if (apple.pos.y > 750) {
				apple.destroy();
			}
		});
	});

	// Schnellere Steuerung
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
// ZWISCHENBILDSCHIRM
// ----------------------------
k.scene("nextLevel", (data) => {
	k.add([
		k.text("Nächstes Level!\nDrücke Leertaste", {
			size: 40,
			align: "center",
		}),
		k.pos(390, 300),
		k.color(255, 255, 255),
	]);

	k.add([
		k.text("Dein Score: " + data.score, { size: 28 }),
		k.pos(560, 420),
		k.color(255, 255, 0),
	]);

	k.onKeyPress("space", () => {
		k.go("level2", { score: data.score });
	});
});

// ----------------------------
// LEVEL 2
// ----------------------------
k.scene("level2", (data) => {
	k.setGravity(350);

	let score = data.score;

	const scoreText = k.add([
		k.text("Score: " + score, { size: 32 }),
		k.pos(20, 20),
		k.color(255, 255, 255),
	]);

	const levelText = k.add([
		k.text("Level 2", { size: 28 }),
		k.pos(20, 60),
		k.color(255, 255, 0),
	]);

	// Boden
	k.add([
		k.rect(1350, 80),
		k.pos(0, 670),
		k.color(34, 139, 34),
		k.area(),
		k.body({ isStatic: true }),
		"ground",
	]);

	// Korb
	const basket = k.add([
		k.rect(100, 40),
		k.pos(620, 590),
		k.color(139, 69, 19),
		k.area(),
		k.body({ isStatic: true }),
		"basket",
	]);

	// Korb schöner machen
	basket.add([k.rect(100, 10), k.pos(0, 30), k.color(101, 67, 33)]);

	basket.add([k.rect(10, 40), k.pos(0, 0), k.color(101, 67, 33)]);

	basket.add([k.rect(10, 40), k.pos(90, 0), k.color(101, 67, 33)]);

	// Mehr Äpfel in Level 2
	k.loop(0.9, () => {
		const randomNumber = k.rand(0, 1);

		let appleColor = [255, 0, 0];
		let points = 1;

		// Goldene Äpfel selten
		if (randomNumber < 0.15) {
			appleColor = [255, 215, 0]; // Gold
			points = 3;
		} else if (randomNumber < 0.55) {
			appleColor = [255, 0, 0]; // Rot
			points = 1;
		} else {
			appleColor = [0, 200, 0]; // Grün
			points = -1;
		}

		const apple = k.add([
			k.circle(15),
			k.pos(k.rand(50, 1300), -20),
			k.color(appleColor[0], appleColor[1], appleColor[2]),
			k.area(),
			k.body(),
			{ points: points },
			"apple",
		]);

		apple.onCollide("basket", () => {
			score += apple.points;
			scoreText.text = "Score: " + score;
			apple.destroy();
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

	// Schnellere Steuerung
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

// Spiel starten
k.go("level1");

export default k;
