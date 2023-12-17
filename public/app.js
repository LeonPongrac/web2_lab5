if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const soundList = document.getElementById('soundList');
  
    // Fetch MP3 files from the server
    const response = await fetch('/api/sounds');
    const sounds = await response.json();
  
    // Populate the list of sounds
    sounds.forEach(sound => {
      console.log(sound);
      const fileName = sound.split('/').pop();
      const listItem = document.createElement('li');
      listItem.innerHTML = `
      <div class="sound-item">
        <p>${fileName}</p>
        <audio controls><source src="${sound}" type="audio/mpeg">Your browser does not support the audio tag.</audio>
      </div>
    `;
      soundList.appendChild(listItem);
    });
});
