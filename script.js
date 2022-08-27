const audioCtx = new AudioContext();

let recording = false;

if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({"audio": true}).then((streaam) => {
        const mediaRecorder = new MediaRecorder(stream);
        let chunks = [];
        mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data);
        }
        mediaRecorder.onstop = (event) => {
            const audio = new Audio();
            audio.setAttribute("controls", "");
            $("#sound-clip").append(audio);
            $("#sound-clip").append("<br />");
            const blob = new Blob(chunks, {"type": "audio/ogg; codecs=opus"});
            audio.src = window.URL.createObjectURL(blob);
            chunks = [];
        };
        $("#record").on("click", () => {
            if (recording) {
              mediaRecorder.stop();
              recording = false;
              $("#record").html("Record");
            } else {
              mediaRecorder.start();
              recording = true;
              $("#record").html("Stop");
            }
          });
    }).catch((err) => {
        alert("Oh no! Your browser cannot access your computer's microphone.");
      });
    } else {
      // Throw alert when the browser cannot access any media devices.
      alert("Oh no! Your browser cannot access your computer's microphone. Please update your browser.");
}
