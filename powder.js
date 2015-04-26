
// dogescript powder.djs > powder.js 

var ctx = undefined;
var XRES = 576;
var YRES = 384;
var NPARTS = XRES * YRES ;

var pmap = [];
var parts = [];
var types = {};

var mouse = {};
mouse.x = 0 
mouse.y = 0 
mouse.down = false 

var SOLID = 0;
var LIQUID = 1;
var GAS = 2;
var POWDER = 3;

function Type (name, color, state, mass) { 
this.name = name || "" 
this.color = color || "#000" 

this.state = state || SOLID 
this.mass = mass || 1 
} 

function Particle (id, x, y, type) { 
this.id = id 
this.x = x 
this.y = y 
this.type = type 
} 

types.NONE = new Type("NONE", "#FFF", SOLID, 0);
types.DMND = new Type("DMND", "#CCFFFF", SOLID, 5);
types.DUST = new Type("DUST", "#FFE0A0", POWDER, 2);
types.GAS = new Type("GAS", "#E0FF20", GAS, 0);
types.WATR = new Type("WATR", "#2030FF", LIQUID, 1.5);

var pensize = 10;
var pentype = types.NONE;

function displace (p, nx, ny) { 
if (nx  < 0  || ny  < 0  || nx  >= XRES  || ny  >= YRES ) {
        return false
} 

if (p.x  === nx  && p.y  === ny ) {
        return true
} 

var r = pmap[ny][nx];
if (r ) {
if (r.type.mass  <= p.type.mass ) {
pmap[r.y][r.x] = p 
pmap[p.y][p.x] = r 

r.x = p.x 
r.y = p.y 
p.x = nx 
p.y = ny 
            return true
} 
} else {
pmap[p.y][p.x] = null 
pmap[ny][nx] = p 

p.x = nx 
p.y = ny 
} 
    return true
} 

function update (p) { 
var dx = 0;
var dy = 0;
if (p.type.state  === GAS ) {
dx = Math.floor(Math.random()*3-1) 
dy = Math.floor(Math.random()*3-1) 
} else if (p.type.state  === LIQUID ) {
dx = Math.floor(Math.random()*3-1) 
dy = Math.floor(Math.random()*p.type.mass*2) 
} else if (p.type.state  === POWDER ) {
dx = Math.round(Math.random()*2-1) 
dy = Math.floor(Math.random()*p.type.mass*2) 
} 

var nx = p.x+dx;
var ny = p.y+dy;

var r = displace(p, nx, ny);
if (r  === false ) {
pmap[p.y][p.x] = null 
parts[p.id] = null 
} 
} 

function spawn (type, x, y) { 
if (!pmap[y][x] ) {
var id = parts.length + 1 ;
var p = new Particle(id, x, y, type);
parts[id] = p 
pmap[y][x] = p 
} 
} 

function init () { 
var canvas = $("#screen");
canvas[0].width = XRES 
canvas[0].height = YRES 

canvas.on("mousemove", function (e) {
mouse.x = e.offsetX 
mouse.y = e.offsetY 
}) 
canvas.on("mousedown", function (e) {
mouse.down = true 
}) 
canvas.on("mouseup", function (e) {
mouse.down = false 
}) 
canvas.on("mousewheel", function (e) {
if (e.originalEvent.wheelDelta  > 0 ) {
pensize = pensize + 1 
} else if (pensize  > 1 ) {
pensize = pensize - 1 
} 
}) 

for (y=0 ; y  < YRES ; y  += 1 ) {
pmap[y] = [] 
for (x=0 ; x  < XRES ; x  += 1 ) {
pmap[y][x] = null 
} 
} 

ctx = canvas[0].getContext("2d");

requestAnimationFrame(frame);
} 

function frame () { 
requestAnimationFrame(frame);
ctx.clearRect(0, 0, XRES, YRES);

var pcount = 0;

for (i=0 ; i  < parts.length ; i  += 1 ) {
var p = parts[i];
if (p ) {
pcount = pcount + 1 
update(p);
ctx.fillStyle = p.type.color 
ctx.fillRect(p.x, p.y, 1.5, 1.5);
} 
} 

ctx.strokeStyle = "#fff" 
ctx.fillStyle = "#fff" 
ctx.strokeRect(mouse.x-pensize/2, mouse.y-pensize/2, pensize, pensize);
ctx.fillText(pcount.toString(), 5, 10);
ctx.fillText(parts.length.toString(), 5, 20);

var x = 5;
for (i in types ) {
ctx.fillStyle = types[i].color 
ctx.fillRect(x, YRES-20, 45, 15);
ctx.fillStyle = "#000" 
ctx.fillText(types[i].name, x+8, YRES-9);

if (mouse.down  && mouse.x  > x  && mouse.y  > YRES-20  && mouse.x  <= x+45  && mouse.y  <= YRES-5 ) {
pentype = types[i] 
mouse.down = false 
} 

if (pentype  === types[i] ) {
ctx.strokeStyle = "#F00" 
ctx.strokeRect(x, YRES-20, 45, 15);
} 

x = x + 50 
} 

if (mouse.down ) {
for (y=-Math.ceil(pensize/2) ; y  < Math.floor(pensize/2) ; y  += 1 ) {
for (x=-Math.ceil(pensize/2) ; x  < Math.floor(pensize/2) ; x  += 1 ) {
if (pentype  === types.NONE ) {
var p = pmap[mouse.y+y][mouse.x+x];
if (p ) {
parts[p.id] = null 
pmap[p.y][p.x] = null 
} 
} else {
spawn(pentype, mouse.x+x, mouse.y+y);
} 
} 
} 
} 
} 

$(init);

