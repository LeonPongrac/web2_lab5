document.addEventListener('DOMContentLoaded', () => {
    // Microphone Recording Section
    const startRecordingButton = document.getElementById('startRecording');
    const stopRecordingButton = document.getElementById('stopRecording');
    const recordingStatus = document.getElementById('recordingStatus');
    const recordedAudio = document.getElementById('recordedAudio');
    const soundNameInput = document.getElementById('soundName');
    const uploadMicrophoneButton = document.getElementById('uploadMicrophone');
    
    // MP3 File Upload Section
    const mp3FileInput = document.getElementById('mp3FileInput');
    const uploadFileButton = document.getElementById('uploadFile');
  
    let mediaRecorder;
    let chunks = [];
  
    // Check for microphone support
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // If microphone is supported, hide MP3 file upload section
        document.getElementById('file-upload-section').style.display = 'none';

        startRecordingButton.addEventListener('click', startRecording);
        stopRecordingButton.addEventListener('click', stopRecording);
        uploadMicrophoneButton.addEventListener('click', uploadMicrophone);
    } else {
        // If microphone is not supported, hide microphone section
        document.getElementById('microphone-section').style.display = 'none';

        // Enable MP3 file upload section
        mp3FileInput.removeAttribute('disabled');
        uploadFileButton.removeAttribute('disabled');
    }
  
    // Event listener for MP3 file upload
    uploadFileButton.addEventListener('click', uploadFile);
  
    function startRecording() {
        chunks = [];
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = handleDataAvailable;
          mediaRecorder.onstop = handleRecordingStop;
  
          startRecordingButton.setAttribute('disabled', true);
          stopRecordingButton.removeAttribute('disabled');
          recordingStatus.innerHTML = 'Recording...';
  
          mediaRecorder.start();
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
        });
    }
  
    function stopRecording() {
      mediaRecorder.stop();
    }
  
    function handleDataAvailable(event) {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    }
  
    function handleRecordingStop() {
      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      recordedAudio.src = URL.createObjectURL(blob);
      recordedAudio.controls = true;
  
      startRecordingButton.removeAttribute('disabled');
      stopRecordingButton.setAttribute('disabled', true);
      recordingStatus.innerHTML = 'Recording stopped.';
    }
  
    function uploadMicrophone() {
      const soundName = soundNameInput.value;
      if (!soundName) {
        alert('Please enter a name for the sound.');
        return;
      }
  
      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      const formData = new FormData();
      formData.append('sound', blob, soundName + '.mp3');
  
      fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
      })
      .catch(error => {
        console.error('Error uploading sound:', error);
      });
    }
  
    function uploadFile() {
      const selectedFile = mp3FileInput.files[0];
      if (!selectedFile) {
        alert('Please select an MP3 file to upload.');
        return;
      }
  
      const formData = new FormData();
      formData.append('sound', selectedFile);
  
      fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
      })
      .catch(error => {
        console.error('Error uploading sound:', error);
      });
    }
  });
  