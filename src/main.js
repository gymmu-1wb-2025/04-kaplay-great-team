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

		apple.onCollide("basket", () => {
			score += apple.points;
			scoreText.text = "Score: " + score;
			apple.destroy();

			if (score >= 10) {
				k.go("nextLevel2", { score: score });
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
// ZWISCHENBILDSCHIRM ZU LEVEL 2
// ----------------------------
k.scene("nextLevel2", (data) => {
	k.add([
		k.text("Naechstes Level!\nDruecke Leertaste", {
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

	k.add([k.text("Level 2", { size: 28 }), k.pos(20, 60), k.color(255, 255, 0)]);

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

	k.loop(0.9, () => {
		const randomNumber = k.rand(0, 1);

		let appleColor = [255, 0, 0];
		let points = 1;

		if (randomNumber < 0.15) {
			appleColor = [255, 215, 0]; // gold
			points = 3;
		} else if (randomNumber < 0.55) {
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
			{ points: points },
			"apple",
		]);

		apple.onCollide("basket", () => {
			score += apple.points;
			scoreText.text = "Score: " + score;
			apple.destroy();

			if (score >= 25) {
				k.go("nextLevel3", { score: score });
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
// ZWISCHENBILDSCHIRM ZU LEVEL 3
// ----------------------------
k.scene("nextLevel3", (data) => {
	k.add([
		k.text("Level 3!\nDruecke Leertaste", { size: 40, align: "center" }),
		k.pos(470, 300),
		k.color(255, 255, 255),
	]);

	k.add([
		k.text("Dein Score: " + data.score, { size: 28 }),
		k.pos(560, 420),
		k.color(255, 255, 0),
	]);

	k.onKeyPress("space", () => {
		k.go("level3", { score: data.score });
	});
});

// ----------------------------
// LEVEL 3
// ----------------------------
k.scene("level3", (data) => {
	k.setGravity(350);

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
		const randomNumber = k.rand(0, 1);

		let appleColor = [255, 0, 0];
		let points = 1;
		let isDanger = false;

		if (randomNumber < 0.1) {
			appleColor = [160, 32, 240]; // violett
			points = 0;
			isDanger = true;
		} else if (randomNumber < 0.22) {
			appleColor = [255, 215, 0]; // gold
			points = 3;
		} else if (randomNumber < 0.6) {
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
		k.text("Druecke Leertaste zum Neustart", { size: 26 }),
		k.pos(410, 500),
		k.color(255, 255, 255),
	]);

	k.onKeyPress("space", () => {
		k.go("level1");
	});
});

// Spiel starten
k.go("level1");

export default k;
