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

renderGraph(graphNode, 0, 1, 0, 1, [[0, 0], [0.5, 0.25], [1, 1]])

const soundInputNode = document.getElementById("sound-input")
const recordButtonNode = document.getElementById("record")


// Set up the AudioContext.
const audioCtx = new AudioContext();

// Top-level variable keeps track of whether we are recording or not.
let recording = false;

// Ask user for access to the microphone.
if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({"audio": true}).then((stream) => {

        // Instantiate the media recorder.
        const mediaRecorder = new MediaRecorder(stream);

        // Create a buffer to store the incoming data.
        let chunks = [];
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        }

        // When you stop the recorder, create a empty audio clip.
        mediaRecorder.onstop = (event) => {
            const audio = new Audio();
            audio.setAttribute("controls", "");
            soundInputNode.appendChild(audio)
            soundInputNode.appendChild(document.createElement("br"));

            // Combine the audio chunks into a blob, then point the empty audio clip to that blob.
            const blob = new Blob(chunks, {"type": "audio/ogg; codecs=opus"});
            audio.src = window.URL.createObjectURL(blob);

            // Clear the `chunks` buffer so that you can record again.
            chunks = [];
        };

        // Set up event handler for the "Record" button.
        recordButtonNode.addEventListener("click", () => {
            if (recording) {
                mediaRecorder.stop();
                recording = false;
                recordButtonNode.innerHTML = "Record";
            } else {
                mediaRecorder.start();
                recording = true;
                recordButtonNode.innerHTML = "Stop";
            }
        });

    }).catch((err) => {
        // Throw alert when the browser is unable to access the microphone.
        alert("Your browser cannot access your computer's microphone. Try reconnecting or troubleshooting your microphone");
    });
} else {
    // Throw alert when the browser cannot access any media devices.
    alert("Oh no! Your browser cannot access your computer's microphone. Please update your browser.");
}
