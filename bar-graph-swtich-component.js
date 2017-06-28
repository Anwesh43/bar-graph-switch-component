const w = window.innerWidth,h = window.innerHeight
class BarGraphSwitchComponent extends HTMLElement {
    constructor() {
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.n = this.getAttribute('n')
        this.color = this.getAttribute('color') || 'blue'
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = this.n*(w/15)
        canvas.height = h/3
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class BarGraphSwitch {
    constructor(x,y,w,h) {
        this.scale = 0
        this.dir = 0
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
    startUpdating() {
        if(this.scale == 0) {
            this.dir = 1
        }
        if(this.scale == 1) {
            this.dir = -1
        }
    }
    handleTap(x,y) {
        const condition =  x > this.x && x < this.x+this.w && y>this.y && y<this.y+h && this.dir == 0
        if(condition) {
            this.startUpdating()
        }
        return condition
    }
    update() {
        this.scale += this.dir * 0.2
        if(this.scale > 1) {
            this.scale = 1
            this.dir = 0
        }
        if(this.scale < 0) {
            this.scale = 0
            this.dir = 0
        }
    }
    draw(context,color) {
        context.strokeStyle = color
        context.fillStyle = color
        context.strokeRect(this.x,this.y,this.w,this.h)
        context.fillRect(this.x+this.h*(1-this.scale),this.y,this.w,this.h*this.scale)
    }
}
