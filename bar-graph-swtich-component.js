const w = window.innerWidth,h = window.innerHeight
class BarGraphSwitchComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.n = parseFloat(this.getAttribute('n'))||4
        this.color = this.getAttribute('color') || 'blue'
        this.animationHandler = new AnimationHandler(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = this.n*(w/60)
        canvas.height = h/3
        const context = canvas.getContext('2d')
        if(!this.bars) {
            this.bars = []
            const y = canvas.height/8
            var x = 0
            for(var i=0;i<this.n;i++) {
                this.bars.push(new BarGraphSwitch(x,y,w/60,(canvas.height*7)/8))
                x+=w/60
            }
        }
       this.bars.forEach((bar)=>{
          bar.draw(context,this.color)
       })
       this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            const x = event.pageX,y = event.pageY
            if(this.bars) {
                this.bars.forEach((bar)=>{
                    if(bar.handleTap(x,y) == true) {
                        this.animationHandler.startAnimation(bar)
                    }
                })
            }
        }
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
        const condition =  x > this.x && x < this.x+this.w && y>this.y && y<this.y+h && this.dir == 0 && this.scale == 0
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
    stopped() {
        return this.dir == 0
    }
    draw(context,color) {
        context.strokeStyle = color
        context.fillStyle = color
        context.strokeRect(this.x,this.y,this.w,this.h)
        context.fillRect(this.x,this.y+this.h*(1-this.scale),this.w,this.h*this.scale)
    }
    setUpdate(dir) {
        this.dir = dir
    }
}
class AnimationHandler {
    constructor(component) {
        this.component = component
        this.animated = false
    }
    startAnimation(switchBtn) {
        if(this.animated == false) {
            this.animated = true
            if(this.prevSwitch) {
                this.prevSwitch.setUpdate(-1)
            }
            switchBtn.setUpdate(1)
            const interval = setInterval(()=>{
                this.component.render()
                if(this.prevSwitch) {
                    this.prevSwitch.update()
                }
                switchBtn.update()
                if(switchBtn.stopped() == true) {
                    this.prevSwitch = switchBtn
                    this.component.render()
                    clearInterval(interval)
                    this.animated = false
                }
            },50)
        }
    }
}
customElements.define('bar-graph',BarGraphSwitchComponent)
