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

k.add([k.circle(20), k.pos(320, 240), k.color("red")]);
k.add([k.rect(640, 20), k.pos(0, 460), k.color("green")]);

export default k;
