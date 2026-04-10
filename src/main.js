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

// Äpfel langsamer fallen lassen
k.setGravity(350);

// Score
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

// KORB
// Wir machen den Korb aus einem Hauptobjekt mit Trefferfläche
const basket = k.add([
	k.rect(100, 40),
	k.pos(620, 590),
	k.color(139, 69, 19),
	k.area(),
	k.body({ isStatic: true }),
	"basket",
]);

// Damit es mehr wie ein Korb aussieht
basket.add([k.rect(100, 10), k.pos(0, 30), k.color(101, 67, 33)]);

basket.add([k.rect(10, 40), k.pos(0, 0), k.color(101, 67, 33)]);

basket.add([k.rect(10, 40), k.pos(90, 0), k.color(101, 67, 33)]);

// Äpfel spawnen
k.loop(2, () => {
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
	});

	// Wenn Apfel den Boden trifft
	apple.onCollide("ground", () => {
		apple.destroy();
	});

	// Falls ein Apfel ganz rausfällt
	apple.onUpdate(() => {
		if (apple.pos.y > 750) {
			apple.destroy();
		}
	});
});

// SCHNELLERE STEUERUNG
k.onKeyDown("d", () => {
	if (basket.pos.x < 1250) {
		basket.pos.x += 10;
	}
});

k.onKeyDown("a", () => {
	if (basket.pos.x > 0) {
		basket.pos.x -= 10;
	}
});

k.onKeyDown("right", () => {
	if (basket.pos.x < 1250) {
		basket.pos.x += 10;
	}
});

k.onKeyDown("left", () => {
	if (basket.pos.x > 0) {
		basket.pos.x -= 10;
	}
});

export default k;
