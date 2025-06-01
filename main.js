const canvas = document.getElementById('stampCanvas');
const ctx = canvas.getContext('2d');
const outerInput = document.getElementById('outerText');
const centerInput = document.getElementById('centerText');
const bottomInput = document.getElementById('bottomText');

// Outer text controls
const outerTextFontSizeSlider = document.getElementById('outerTextFontSize');
const outerTextFontSizeValue = document.getElementById('outerTextFontSizeValue');
const outerTextRadiusSlider = document.getElementById('outerTextRadius');
const outerTextRadiusValue = document.getElementById('outerTextRadiusValue');
const outerTextStartAngleSlider = document.getElementById('outerTextStartAngle');
const outerTextStartAngleValue = document.getElementById('outerTextStartAngleValue');

// Element controls
const elementRadiusSlider = document.getElementById('elementRadius');
const elementAngleSlider = document.getElementById('elementAngle');
const elementSizeSlider = document.getElementById('elementSize');
const elementRadiusValue = document.getElementById('elementRadiusValue');
const elementAngleValue = document.getElementById('elementAngleValue');
const elementSizeValue = document.getElementById('elementSizeValue');

// Ring controls
const ringCountSlider = document.getElementById('ringCount');
const ringCountValue = document.getElementById('ringCountValue');
const ring1RadiusSlider = document.getElementById('ring1Radius');
const ring1WidthSlider = document.getElementById('ring1Width');
const ring2RadiusSlider = document.getElementById('ring2Radius');
const ring2WidthSlider = document.getElementById('ring2Width');
const ring3RadiusSlider = document.getElementById('ring3Radius');
const ring3WidthSlider = document.getElementById('ring3Width');

const ring1RadiusValue = document.getElementById('ring1RadiusValue');
const ring1WidthValue = document.getElementById('ring1WidthValue');
const ring2RadiusValue = document.getElementById('ring2RadiusValue');
const ring2WidthValue = document.getElementById('ring2WidthValue');
const ring3RadiusValue = document.getElementById('ring3RadiusValue');
const ring3WidthValue = document.getElementById('ring3WidthValue');

function drawCircularText(text, centerX, centerY, radius, fontSize, color, isBottom = false, startAngleDeg = -144) {
  if (!text.trim()) return;
  ctx.save();
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const totalAngle = Math.PI * 1.81; // Always the same, so text starts at startAngleDeg
  const startAngle = startAngleDeg * Math.PI / 180;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const angle = startAngle + (i / (text.length - 1 || 1)) * totalAngle;
    ctx.save();
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    ctx.translate(x, y);
    ctx.rotate(angle + (isBottom ? -Math.PI / 2 : Math.PI / 2));
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

function drawDecorations(centerX, centerY, radius, angleDeg, size, decoration, color) {
  if (decoration === 'none') return;
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  const angle = angleDeg * Math.PI / 180;
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  ctx.save();
  ctx.translate(x, y);
  switch (decoration) {
    case 'star':
      drawStar(0, 0, 5, size, size/2);
      break;
    case 'dot':
      ctx.beginPath();
      ctx.arc(0, 0, size/2, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'diamond':
      drawDiamond(0, 0, size, size*1.3);
      break;
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(0, -size/1.2);
      ctx.lineTo(size/1.1, size/1.5);
      ctx.lineTo(-size/1.1, size/1.5);
      ctx.closePath();
      ctx.fill();
      break;
    case 'square':
      ctx.fillRect(-size/2, -size/2, size, size);
      break;
  }
  ctx.restore();
  ctx.restore();
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;
    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

function drawDiamond(cx, cy, w, h) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy);
  ctx.closePath();
  ctx.fill();
}

function drawRings(centerX, centerY, ringSettings, color) {
  for (let i = 0; i < ringSettings.length; i++) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = ringSettings[i].width;
    ctx.beginPath();
    ctx.arc(centerX, centerY, ringSettings[i].radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }
}

function updateRingControls() {
  const count = parseInt(ringCountSlider.value, 10);
  document.getElementById('ring2-controls').style.display = count >= 2 ? '' : 'none';
  document.getElementById('ring3-controls').style.display = count >= 3 ? '' : 'none';
  ringCountValue.textContent = count;
}

function updateStamp() {
  // Always fill white background first
  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  const outerText = outerInput.value.toUpperCase();
  const centerText = centerInput.value;
  const bottomText = bottomInput.value;
  const decoration = document.querySelector('.decoration-option input:checked').value;
  const color = document.querySelector('.color-option.active').dataset.color;

  // Outer text controls
  const outerFontSize = Number(outerTextFontSizeSlider.value);
  const outerTextRadius = Number(outerTextRadiusSlider.value);
  const outerStartAngle = Number(outerTextStartAngleSlider.value);

  // Get element controls
  const decoRadius = Number(elementRadiusSlider.value);
  const decoAngle = Number(elementAngleSlider.value);
  const decoSize = Number(elementSizeSlider.value);

  // Get ring controls
  const ringCount = parseInt(ringCountSlider.value, 10);
  const ringSettings = [
    { radius: Number(ring1RadiusSlider.value), width: Number(ring1WidthSlider.value) }
  ];
  if (ringCount >= 2) ringSettings.push({ radius: Number(ring2RadiusSlider.value), width: Number(ring2WidthSlider.value) });
  if (ringCount >= 3) ringSettings.push({ radius: Number(ring3RadiusSlider.value), width: Number(ring3WidthSlider.value) });

  // Draw rings
  drawRings(225, 225, ringSettings, color);

  // Use user-selected radius for outer text, always start at set angle
  drawCircularText(outerText, 225, 225, outerTextRadius, outerFontSize, color, false, outerStartAngle);
  if (bottomText.trim()) {
    drawCircularText(bottomText, 225, 225, outerTextRadius, outerFontSize, color, true, outerStartAngle);
  }
  drawDecorations(225, 225, decoRadius, decoAngle, decoSize, decoration, color);
  ctx.save();
  ctx.font = `bold ${Math.round(outerFontSize * 1.35)}px Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(centerText, 225, 225);
  ctx.restore();
}

// Event listeners for inputs
[
  outerInput, centerInput, bottomInput,
  outerTextFontSizeSlider, outerTextRadiusSlider, outerTextStartAngleSlider,
  elementRadiusSlider, elementAngleSlider, elementSizeSlider,
  ringCountSlider, ring1RadiusSlider, ring1WidthSlider,
  ring2RadiusSlider, ring2WidthSlider,
  ring3RadiusSlider, ring3WidthSlider
].forEach(el => {
  el.addEventListener('input', () => {
    updateRingControls();
    updateStamp();
  });
  el.addEventListener('change', () => {
    updateRingControls();
    updateStamp();
  });
});

// Show slider values live
outerTextFontSizeSlider.addEventListener('input', () => { outerTextFontSizeValue.textContent = outerTextFontSizeSlider.value; });
outerTextRadiusSlider.addEventListener('input', () => { outerTextRadiusValue.textContent = outerTextRadiusSlider.value; });
outerTextStartAngleSlider.addEventListener('input', () => { outerTextStartAngleValue.textContent = outerTextStartAngleSlider.value; });
elementRadiusSlider.addEventListener('input', () => { elementRadiusValue.textContent = elementRadiusSlider.value; });
elementAngleSlider.addEventListener('input', () => { elementAngleValue.textContent = elementAngleSlider.value; });
elementSizeSlider.addEventListener('input', () => { elementSizeValue.textContent = elementSizeSlider.value; });
ring1RadiusSlider.addEventListener('input', () => { ring1RadiusValue.textContent = ring1RadiusSlider.value; });
ring1WidthSlider.addEventListener('input', () => { ring1WidthValue.textContent = ring1WidthSlider.value; });
ring2RadiusSlider.addEventListener('input', () => { ring2RadiusValue.textContent = ring2RadiusSlider.value; });
ring2WidthSlider.addEventListener('input', () => { ring2WidthValue.textContent = ring2WidthSlider.value; });
ring3RadiusSlider.addEventListener('input', () => { ring3RadiusValue.textContent = ring3RadiusSlider.value; });
ring3WidthSlider.addEventListener('input', () => { ring3WidthValue.textContent = ring3WidthSlider.value; });

ringCountSlider.addEventListener('input', () => { updateRingControls(); updateStamp(); });

document.querySelectorAll('.decoration-option').forEach(option => {
  option.addEventListener('click', function() {
    document.querySelectorAll('.decoration-option').forEach(o => o.classList.remove('active'));
    this.classList.add('active');
    this.querySelector('input').checked = true;
    updateStamp();
  });
});

document.querySelectorAll('.color-option').forEach(option => {
  option.addEventListener('click', function() {
    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
    this.classList.add('active');
    updateStamp();
  });
});

function downloadStamp(type) {
  // Already has white background in preview
  let link = document.createElement('a');
  if (type === 'jpg') {
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.download = 'stamp.jpg';
  } else {
    link.href = canvas.toDataURL('image/png');
    link.download = 'stamp.png';
  }
  link.click();
}

// Set initial slider values
outerTextFontSizeValue.textContent = outerTextFontSizeSlider.value;
outerTextRadiusValue.textContent = outerTextRadiusSlider.value;
outerTextStartAngleValue.textContent = outerTextStartAngleSlider.value;
elementRadiusValue.textContent = elementRadiusSlider.value;
elementAngleValue.textContent = elementAngleSlider.value;
elementSizeValue.textContent = elementSizeSlider.value;
ring1RadiusValue.textContent = ring1RadiusSlider.value;
ring1WidthValue.textContent = ring1WidthSlider.value;
ring2RadiusValue.textContent = ring2RadiusSlider.value;
ring2WidthValue.textContent = ring2WidthSlider.value;
ring3RadiusValue.textContent = ring3RadiusSlider.value;
ring3WidthValue.textContent = ring3WidthSlider.value;
updateRingControls();
updateStamp();