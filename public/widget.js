(function() {
  const WIDGET_URL = 'https://agentmaya.vercel.app/widget';
  
  // Create container for the iframe
  const container = document.createElement('div');
  container.id = 'maya-widget-container';
  container.style.position = 'fixed';
  container.style.bottom = '0';
  container.style.right = '0';
  container.style.zIndex = '999999';
  container.style.width = '420px';
  container.style.height = '700px';
  container.style.pointerEvents = 'none'; // Allow clicking through to underlying site when widget is closed
  document.body.appendChild(container);

  // Create the iframe
  const iframe = document.createElement('iframe');
  iframe.src = WIDGET_URL;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.background = 'transparent';
  iframe.style.pointerEvents = 'auto'; // Enable pointer events for the iframe content
  iframe.allow = 'clipboard-read; clipboard-write';
  
  container.appendChild(iframe);

  // Communication logic can be added here if needed (e.g., resizing based on widget state)
})();
