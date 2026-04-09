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

const player = k.add([
	k.circle(20),
	k.pos(320, 240),
	k.color("red"),
	k.body(),
	k.area(),
]);
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
