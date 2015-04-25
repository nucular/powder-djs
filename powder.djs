
shh dogescript powder.djs > powder.js

very ctx
very XRES is 576
very YRES is 384
very NPARTS is XRES * YRES

very pmap is []
very parts is []
very types is {}

very SOLID is 0
very LIQUID is 1
very GAS is 2
very POWDER is 3

such Type much name color state
    this.name is name || ""
    this.color is color || "#000"

    this.state is state || SOLID
wow

such Particle much id x y type
    this.id is id
    this.x is x
    this.y is y
    this.type is type

    this.vx is 0
    this.vy is 0

    this.flags is 0
wow

types.DUST is new Type with "DUST" "#FFE0A0" POWDER
types.WATR is new Type with "WATR" "#6060FF" LIQUID

such displace much p nx ny
    rly nx smaller 0 or ny smaller 0 or nx biggerish XRES or ny biggerish YRES
        return false
    wow

    rly p.x is nx and p.y is ny
        return true
    wow

    very r is pmap[ny][nx]
    rly r
        rly r.type.mass smaller p.type.mass
            pmap[r.y][r.x] is p
            pmap[p.x][p.y] is r

            r.x is p.x
            r.y is p.y
            p.x is nx
            p.y is ny
            return true
        wow
    but
        pmap[p.y][p.x] is null
        pmap[nx][ny] is p

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
        dy is Math.floor(Math.random()*2)
    but rly p.type.state is POWDER
        dy is Math.floor(Math.random()*3)
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
    very id is parts.length + 1
    very p is new Particle with id x y type
    parts[id] is p
    pmap[y][x] is p
wow

such init
    very canvas is plz $ with "#screen"
    canvas[0].width is XRES
    canvas[0].height is YRES

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
    much i=0 next i smaller parts.length next i more 1
        very p is parts[i]
        rly p
            plz update with p
            ctx.fillStyle is p.type.color
            ctx dose fillRect with p.x p.y 1.5 1.5
        wow
    wow
wow

plz $ with init
