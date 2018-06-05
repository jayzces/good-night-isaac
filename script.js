window.onload = () => {
    const audioContext = new AudioContext()
    const audio = document.querySelector('#music')

    audio.crossOrigin = 'anonymous'
    audio.load()
    audio.play()

    const audioSource = audioContext.createMediaElementSource(audio)
    const analyser = audioContext.createAnalyser()

    audioSource.connect(analyser)
    analyser.connect(audioContext.destination)
    analyser.fftSize = 1024

    let bufferLength = analyser.frequencyBinCount
    let bufferLengthCut = bufferLength / 2
    let timeDomainData = new Uint8Array(bufferLength)

    const canvas = document.querySelector('#canvas')
    const WIDTH = window.innerWidth
    const HEIGHT = window.innerHeight
    const canvasContext = canvas.getContext('2d')

    canvas.width = WIDTH
    canvas.height = HEIGHT

    let renderFrame = () => {
        requestAnimationFrame(renderFrame)
        analyser.getByteTimeDomainData(timeDomainData)

        let lineWidth = WIDTH / bufferLength
        let lineHeight = 2
        let x = 0
        let initialY = HEIGHT / 2
        let baseline = 128 + 64
        let amplificationDegree = 6

        // canvasContext.clearRect(0, 0, WIDTH, HEIGHT)
        canvasContext.beginPath()
        canvasContext.moveTo(x, initialY)

        for (let i = 0; i < bufferLength; i++) {
            let difference = baseline - timeDomainData[i]
            let y = difference >= 0 ? (initialY - difference * amplificationDegree) : (initialY + difference * amplificationDegree)
            y += 64 * amplificationDegree
            canvasContext.lineTo(x, y)
            x += lineWidth
        }

        let gradient = canvasContext.createLinearGradient(0, 0, WIDTH, 0)

        let colorDegree = 360 / 7
        let colorStops = 1.0 / 7
        for (let i = 0; i < 7; i++) {
            gradient.addColorStop(colorStops * i, `hsl(${colorDegree * i}, 100%, 60%)`)
        }

        canvasContext.strokeStyle = gradient
        canvasContext.lineWidth = 3
        canvasContext.stroke()
    }

    renderFrame()
}
