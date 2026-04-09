import kaplay from "kaplay";
import sc00 from "./scenes/sc-00";
import sc01 from "./scenes/sc-01";

const k = kaplay({
	height: 750,
	width: 1350,
	canvas: document.getElementById("game-canvas"),
	background: "#82b4b4",
	global: false,
	debug: true,
	debugKey: "r",
});

k.scene("init", sc00);
k.scene("lvl-01", sc01);

k.go("init");

k.setGravity(800);

// score anzeigen
let score = 0;
const scoreText = k.add([
	k.text("Score: 0", { size: 32 }),
	k.pos(20, 20),
	k.color(255, 255, 255),
]);

// Korb (Spieler) - aus mehreren Rechtecken gebaut
const basket = k.add([
	k.pos(320, 420),
	k.area({ width: 80, height: 40 }),
	k.body({ isStatic: true }),
	"basket",
]);

// Korb-Boden
basket.add([
	k.rect(80, 10),
	k.pos(0, 30),
	k.color(139, 69, 19), // Braun
]);

// Korb-Linke Seite
basket.add([k.rect(10, 40), k.pos(0, 0), k.color(139, 69, 19)]);

// Korb-Rechte Seite
basket.add([k.rect(10, 40), k.pos(70, 0), k.color(139, 69, 19)]);

// Grüner Boden (Gras)
k.add([
	k.rect(1350, 80),
	k.pos(0, 670),
	k.color(34, 139, 34), // Grün
	k.body({ isStatic: true }),
	k.area(),
]);

// Äpfel spawnen
k.loop(1.5, () => {
	// Zufällig roten oder grünen Apfel
	const isRed = k.rand() > 0.5;
	const appleColor = isRed ? [255, 0, 0] : [0, 200, 0];
	const points = isRed ? 1 : -1;

	const apple = k.add([
		k.circle(15),
		k.pos(k.rand(50, 1300), -20),
		k.color(appleColor[0], appleColor[1], appleColor[2]),
		k.area(),
		k.body(),
		{ points: points },
	]);

	// Wenn Apfel den Korb trifft
	apple.onCollide("basket", () => {
		score += points;
		scoreText.text = "Score: " + score;
		apple.destroy();
	});

	// Apfel löschen wenn er unten ist
	apple.onUpdate(() => {
		if (apple.pos.y > 750) {
			apple.destroy();
		}
	});
});

k.add([
	k.rect(640, 20),
	k.pos(0, 460),
	k.color("green"),
	k.body({ isStatic: true }),
	k.area(),
]);

player.onKeyPress("space", () => {
	player.jump();
});

player.onKeyDown("d", () => {
	player.move(320, 0);
});
player.onKeyDown("a", () => {
	player.move(-320, 0);
});

player.onKeyPress("enter", () => {
	player.destroy();
});

export default k;
