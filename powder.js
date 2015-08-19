
// dogescript powder.djs > powder.js 

var ctx = undefined;
var XRES = 576;
var YRES = 384;
var NPARTS = XRES * YRES ;

var pmap = [];
var parts = [];
var empty = [];
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

this.init = null 
this.update = null 
this.flammable = false 
} 

function Particle (id, x, y, type) { 
this.id = id 
this.x = x 
this.y = y 
this.type = type 
this.life = 0 
this.ctype = null 
} 

var pensize = 10;
var pentype = types.NONE;

var lastframe = undefined;
var fps = undefined;

types.NONE = new Type("NONE", "#FFF", SOLID, 0);
types.DMND = new Type("DMND", "#CCFFFF", SOLID, 5);
types.DUST = new Type("DUST", "#FFE0A0", POWDER, 2);
types.GAS = new Type("GAS", "#E0FF20", GAS, 0);
types.GAS.flammable = true 
types.WATR = new Type("WATR", "#2030FF", LIQUID, 1.5);
types.WTRV = new Type("WTRV", "#A0A0FF", GAS, 0);
types.FIRE = new Type("FIRE", "#FF0000", GAS, -2);
types.CLNE = new Type("CLNE", "#FFFF00", SOLID, 4);

function wtrv_init (p) { 
p.life = Math.random()*200+50 
} 
function wtrv_update (p) { 
p.life = p.life - 1 
if (p.life  <= 0 ) {
p.type = types.WATR 
} 
return true;
} 
types.WTRV.update = wtrv_update 

function fire_init (p) { 
p.life = Math.random()*100+50 
} 
function fire_update (p) { 
p.life = p.life - 1 
if (p.life  <= 0 ) {
despawn(p);
        return false
} 
function c (p) { 
if (p.type  === types.WATR ) {
p.type = types.WTRV 
p.life = Math.random()*200+50 
} else if (p.type.flammable ) {
p.type = types.FIRE 
} 
} 
neighbours(p, c, 2);
return true;
} 
types.FIRE.init = fire_init 
types.FIRE.update = fire_update 

function clne_update (p) { 
var dx = -1;
var dy = -1;
for (dy; dy  <= 1; dy  += 1 ) {
for (dx; dx  <= 1; dx  += 1 ) {
var pn = pmap[p.y+dy][p.x+dx];
if (pn ) {
if (!p.ctype  && pn.type  !== types.CLNE ) {
p.ctype = pn.type 
} 
} else {
if (p.ctype ) {
spawn(p.ctype, p.x+dx, p.y+dy);
} 
} 
} 
} 
} 
types.CLNE.update = clne_update 

function neighbours (p, c, r) { 
var dx = -r;
var dy = -r;
for (dy; dy  <= r; dy  += 1 ) {
for (dx; dx  <= r; dx  += 1 ) {
var pn = pmap[p.y+dy][p.x+dx];
if (pn ) {
c(pn);
} 
} 
} 
} 

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
if (p.type.update ) {
var r = p.type.update(p);
if (!r ) {
            return
} 
} 

var dx = 0;
var dy = 0;
if (p.type.state  === GAS ) {
dx = Math.floor(Math.random()*3-1) 
dy = Math.floor(Math.random()*p.type.mass*2-p.type.mass) 
} else if (p.type.state  === LIQUID ) {
dx = Math.floor(Math.random()*3-1) 
dy = Math.floor(Math.random()*p.type.mass*2) 
} else if (p.type.state  === POWDER ) {
dx = Math.round(Math.random()*2-1) 
dy = Math.floor(Math.random()*p.type.mass*2) 
} else if (p.type.state  === SOLID ) {
        return
} 

var nx = p.x+dx;
var ny = p.y+dy;

var r = displace(p, nx, ny);
if (r  === false ) {
despawn(p);
} 
} 

function spawn (type, x, y) { 
if (!pmap[y][x] ) {
var id = empty.pop();
if (id  === undefined ) {
id = parts.length 
} 
var p = new Particle(id, x, y, type);
if (p.type.init ) {
p.type.init(p);
} 
parts[id] = p 
pmap[y][x] = p 
} 
} 

function despawn (p) { 
pmap[p.y][p.x] = null 
parts[p.id] = null 
empty.push(p.id);
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

if (!lastframe ) {
lastframe = Date.now();
fps = 0 
} else {
var delta = (new Date().getTime() - lastframe) / 1000 ;
lastframe = Date.now();
fps = 1 / delta 
} 

ctx.clearRect(0, 0, XRES, YRES);

var pcount = 0;

for (i=0 ; i  < parts.length ; i  += 1 ) {
var p = parts[i];
if (p ) {
pcount = pcount + 1 
update(p);
ctx.fillStyle = p.type.color 
ctx.fillRect(p.x, p.y, 1, 1);
} 
} 

ctx.strokeStyle = "#fff" 
ctx.fillStyle = "#fff" 
ctx.strokeRect(mouse.x-pensize/2, mouse.y-pensize/2, pensize, pensize);

var pcount = pcount.toString() + " parts" ;
var palloc = parts.length.toString() + " alloc" ;
var pfps = Math.floor(fps).toString() + " fps" ;
ctx.fillText(pcount, 5, 10);
ctx.fillText(palloc, 5, 20);
ctx.fillText(pfps, 5, 30);

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
for (dy=-Math.ceil(pensize/2) ; dy  < Math.floor(pensize/2) ; dy  += 1 ) {
for (dx=-Math.ceil(pensize/2) ; dx  < Math.floor(pensize/2) ; dx  += 1 ) {
var x = mouse.x+dx;
var y = mouse.y+dy;
var p = pmap[y][x];

if (pentype  === types.NONE ) {
if (p ) {
despawn(p);
} 
} else if (p ) {
p.ctype = pentype 
} else {
spawn(pentype, x, y);
} 
} 
} 
} 
} 

$(init);

