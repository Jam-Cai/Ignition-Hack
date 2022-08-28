import DecibelMeter from 'decibel-meter'

const decibelOutputNode = document.getElementById("decibel-output")

const dialNode = document.getElementById("dial")

const renderDial = (canvasNode, min, max, value) => {
    const ctx = canvasNode.getContext("2d")
    const width = canvasNode.width
    const height = canvasNode.height

    const radiansFromZero = Math.PI * (value - min) / (max - min)

    ctx.clearRect(0, 0, width, height)
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, width / 2, Math.PI, 0)
    ctx.stroke()
    ctx.translate(width / 2, height / 2)
    ctx.rotate(radiansFromZero)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-width / 2, 0)
    ctx.stroke()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
}

let locked = false

const meter = new DecibelMeter
meter.sources.then(console.log)
meter.listenTo(0, db => {
    if (!locked) {
        decibelOutputNode.innerHTML = db + 130
        renderDial(dialNode, 0, 140, db + 130)
        locked = true
        setTimeout(_ => locked = false, 100)
    }
})




const graphNode = document.getElementById("graph")

const renderGraph = (canvasNode, startX, endX, startY, endY, data) => {
    const ctx = canvasNode.getContext("2d")
    const width = canvasNode.width
    const height = canvasNode.height

    const shiftedData = data.map(([x, y]) => [
        width * (x - startX) / (endX - startX),
        height - height * (y - startY) / (endY - startY),
    ])

    let last = shiftedData[0]

    shiftedData.forEach(([x, y]) => {
        ctx.beginPath()
        ctx.moveTo(last[0], last[1])
        ctx.lineTo(x, y)
        ctx.stroke()
        last = [x, y]
    })
}
