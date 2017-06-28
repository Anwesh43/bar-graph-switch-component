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
