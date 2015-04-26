
shh dogescript powder.djs > powder.js

very ctx
very XRES is 576
very YRES is 384
very NPARTS is XRES * YRES

very pmap is []
very parts is []
very types is {}

very mouse is {}
mouse.x is 0
mouse.y is 0
mouse.down is false

very SOLID is 0
very LIQUID is 1
very GAS is 2
very POWDER is 3

such Type much name color state mass
    this.name is name || ""
    this.color is color || "#000"

    this.state is state || SOLID
    this.mass is mass || 1
wow

such Particle much id x y type
    this.id is id
    this.x is x
    this.y is y
    this.type is type
wow

types.NONE is new Type with "NONE" "#FFF" SOLID 0
types.DMND is new Type with "DMND" "#CCFFFF" SOLID 5
types.DUST is new Type with "DUST" "#FFE0A0" POWDER 2
types.GAS is new Type with "GAS" "#E0FF20" GAS 0
types.WATR is new Type with "WATR" "#2030FF" LIQUID 1.5

very pensize is 10
very pentype is types.NONE

such displace much p nx ny
    rly nx smaller 0 or ny smaller 0 or nx biggerish XRES or ny biggerish YRES
        return false
    wow

    rly p.x is nx and p.y is ny
        return true
    wow

    very r is pmap[ny][nx]
    rly r
        rly r.type.mass smallerish p.type.mass
            pmap[r.y][r.x] is p
            pmap[p.y][p.x] is r

            r.x is p.x
            r.y is p.y
            p.x is nx
            p.y is ny
            return true
        wow
    but
        pmap[p.y][p.x] is null
        pmap[ny][nx] is p

        p.x is nx
        p.y is ny
    wow
    return true
wow

such update much p
    very dx is 0
    very dy is 0
    rly p.type.state is GAS
        dx is Math.floor(Math.random()*3-1)
        dy is Math.floor(Math.random()*3-1)
    but rly p.type.state is LIQUID
        dx is Math.floor(Math.random()*3-1)
        dy is Math.floor(Math.random()*p.type.mass*2)
    but rly p.type.state is POWDER
        dx is Math.round(Math.random()*2-1)
        dy is Math.floor(Math.random()*p.type.mass*2)
    wow

    very nx is p.x+dx
    very ny is p.y+dy

    very r is plz displace with p nx ny
    rly r is false
        pmap[p.y][p.x] is null
        parts[p.id] is null
    wow
wow

such spawn much type x y
    rly !pmap[y][x]
        very id is parts.length + 1
        very p is new Particle with id x y type
        parts[id] is p
        pmap[y][x] is p
    wow
wow

such init
    very canvas is plz $ with "#screen"
    canvas[0].width is XRES
    canvas[0].height is YRES

    plz canvas.on with "mousemove" much e
        mouse.x is e.offsetX
        mouse.y is e.offsetY
    wow&
    plz canvas.on with "mousedown" much e
        mouse.down is true
    wow&
    plz canvas.on with "mouseup" much e
        mouse.down is false
    wow&
    plz canvas.on with "mousewheel" much e
        rly e.originalEvent.wheelDelta bigger 0
            pensize is pensize + 1
        but rly pensize bigger 1
            pensize is pensize - 1
        wow
    wow&

    much y=0 next y smaller YRES next y more 1
        pmap[y] is []
        much x=0 next x smaller XRES next x more 1
            pmap[y][x] is null
        wow
    wow

    ctx is canvas[0] dose getContext with "2d"

    plz requestAnimationFrame with frame
wow

such frame
    plz requestAnimationFrame with frame
    ctx dose clearRect with 0 0 XRES YRES

    very pcount is 0

    much i=0 next i smaller parts.length next i more 1
        very p is parts[i]
        rly p
            pcount is pcount + 1
            plz update with p
            ctx.fillStyle is p.type.color
            ctx dose fillRect with p.x p.y 1.5 1.5
        wow
    wow

    ctx.strokeStyle is "#fff"
    ctx.fillStyle is "#fff"
    ctx dose strokeRect with mouse.x-pensize/2 mouse.y-pensize/2 pensize pensize
    ctx dose fillText with pcount.toString() 5 10
    ctx dose fillText with parts.length.toString() 5 20

    very x is 5
    much i in types
        ctx.fillStyle is types[i].color
        ctx dose fillRect with x YRES-20 45 15
        ctx.fillStyle is "#000"
        ctx dose fillText with types[i].name x+8 YRES-9

        rly mouse.down and mouse.x bigger x and mouse.y bigger YRES-20 and mouse.x smallerish x+45 and mouse.y smallerish YRES-5
            pentype is types[i]
            mouse.down is false
        wow

        rly pentype is types[i]
            ctx.strokeStyle is "#F00"
            ctx dose strokeRect with x YRES-20 45 15
        wow

        x is x + 50
    wow

    rly mouse.down
        much y=-Math.ceil(pensize/2) next y smaller Math.floor(pensize/2) next y more 1
            much x=-Math.ceil(pensize/2) next x smaller Math.floor(pensize/2) next x more 1
                rly pentype is types.NONE
                    very p is pmap[mouse.y+y][mouse.x+x]
                    rly p
                        parts[p.id] is null
                        pmap[p.y][p.x] is null
                    wow
                but
                    plz spawn with pentype mouse.x+x mouse.y+y
                wow
            wow
        wow
    wow
wow

plz $ with init
