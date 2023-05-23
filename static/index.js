document.addEventListener('DOMContentLoaded', function() {
  var submitButton = document.getElementById('submit-button');
  var shortUrlInput = document.getElementById('short-url-input');
  var copyButton = document.getElementById('copy-button');

  submitButton.addEventListener('click', function() {
    var urlInput = document.getElementById('url-input').value;

    // Check if URL is empty
    if (urlInput.trim() === '') {
      document.getElementById('error-message').textContent = 'Please enter a valid URL.';
      document.getElementById('result-container').style.display = 'block';
      shortUrlInput.value = '';
      return;
    }

    // Send a request to the server to shorten the URL
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/shorturl', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        if (response.error) {
          document.getElementById('error-message').textContent = response.error;
          shortUrlInput.value = '';
        } else {
          document.getElementById('error-message').textContent = '';
          shortUrlInput.value = window.location.origin + '/' + response.short_url;
        }
        document.getElementById('result-container').style.display = 'block';
      }
    };

    xhr.send(JSON.stringify({ url: urlInput }));
  });

  copyButton.addEventListener('click', function() {
    shortUrlInput.select();
    document.execCommand('copy');

    // Show the "Copied to Clipboard" toast
    var toastElement = document.createElement('div');
    toastElement.classList.add('toast');
    toastElement.textContent = 'Copied to Clipboard';
    document.body.appendChild(toastElement);

    // Fade out the toast after 2 seconds
    setTimeout(function() {
      toastElement.classList.add('show');
      setTimeout(function() {
        toastElement.classList.remove('show');
        document.body.removeChild(toastElement);
      }, 2000);
    }, 100);

    // Prevent the button from triggering form submission
    event.preventDefault();
  });
});
