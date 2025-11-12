// Simple icon generator using Canvas API
const fs = require('fs');

function createIcon(size) {
  // Create a simple HTML file that will generate the icon
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Icon Generator</title>
</head>
<body>
    <canvas id="canvas" width="${size}" height="${size}"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, ${size}, ${size});
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ${size}, ${size});
        
        // Draw focus icon (target/circle)
        ctx.strokeStyle = 'white';
        ctx.lineWidth = ${Math.max(1, size / 8)};
        ctx.beginPath();
        ctx.arc(${size/2}, ${size/2}, ${size/3}, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw center dot
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(${size/2}, ${size/2}, ${size/8}, 0, 2 * Math.PI);
        ctx.fill();
        
        // Convert to data URL
        const dataURL = canvas.toDataURL('image/png');
        console.log(dataURL);
    </script>
</body>
</html>`;
  
  return html;
}

// Create HTML files for each icon size
[16, 48, 128].forEach(size => {
  const html = createIcon(size);
  fs.writeFileSync(`icon${size}.html`, html);
  console.log(`Created icon${size}.html - open in browser and copy the data URL`);
});

console.log('Open each HTML file in a browser, copy the data URL from console, and save as PNG files.');
