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

k.setGravity(800);

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
]);

const basket = k.add([
	k.rect(80, 40),
	k.pos(620, 610),
	k.color(139, 69, 19),
	k.area(),
	"basket",
]);

k.loop(1.5, () => {
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
	]);

	apple.onCollide("basket", () => {
		score += apple.points;
		scoreText.text = "Score: " + score;
		apple.destroy();
	});

	apple.onUpdate(() => {
		if (apple.pos.y > 750) {
			apple.destroy();
		}
	});
});

k.onKeyDown("d", () => {
	if (basket.pos.x < 1270) {
		basket.move(300, 0);
	}
});

k.onKeyDown("a", () => {
	if (basket.pos.x > 0) {
		basket.move(-300, 0);
	}
});

k.onKeyDown("right", () => {
	if (basket.pos.x < 1270) {
		basket.move(300, 0);
	}
});

k.onKeyDown("left", () => {
	if (basket.pos.x > 0) {
		basket.move(-300, 0);
	}
});

export default k;
