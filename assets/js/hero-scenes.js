/* Hero figure scenes — one per research focus area, in the same order as
   hero.pillars in data/site.json. Each scene is plain SVG animated with CSS;
   index.js rotates them and replays them whenever the home page is shown. */
(function () {
  var W = 520, H = 440;

  function f(n) { return n.toFixed(1); }
  function svg(label, body) {
    return '<svg class="scene-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + label + '">' + body + '</svg>';
  }
  function delay(ms) { return ' style="animation-delay:' + Math.round(ms * 0.16) + 'ms"'; }

  // 1. Materials modeling: two grains of a square lattice meeting at a tilted boundary.
  function grainBoundary() {
    var a = 34, r = 6.5, atoms = [];
    function boundaryX(y) { return W * 0.52 + (y - H / 2) * 0.18; }
    function grain(angle, side) {
      var cos = Math.cos(angle), sin = Math.sin(angle);
      for (var i = -20; i <= 20; i++) {
        for (var j = -20; j <= 20; j++) {
          var x = W / 2 + i * a * cos - j * a * sin;
          var y = H / 2 + i * a * sin + j * a * cos;
          if (x < r || x > W - r || y < r || y > H - r) continue;
          var d = x - boundaryX(y);
          if (side < 0 ? d > -4 : d < 4) continue;
          atoms.push({ x: x, y: y, gb: Math.abs(d) < a * 0.8, side: side });
        }
      }
    }
    grain(0, -1);
    grain(Math.PI / 7.5, 1);
    var circles = atoms.map(function (p) {
      var cls = p.gb ? 'atom atom-gb' : (p.side < 0 ? 'atom atom-a' : 'atom atom-b');
      return '<circle class="' + cls + '" cx="' + f(p.x) + '" cy="' + f(p.y) + '" r="' + (p.gb ? r + 0.8 : r) + '"' + delay(Math.abs(p.x - boundaryX(p.y)) * 2.2) + '/>';
    }).join('');
    return svg('Two crystal grains meeting at a grain boundary',
      '<line class="gb-line" x1="' + f(boundaryX(0)) + '" y1="0" x2="' + f(boundaryX(H)) + '" y2="' + H + '"/>' + circles);
  }

  // 2. Materials informatics: a crystal structure feeds a neural network that predicts properties.
  function neuralNet() {
    var cols = [150, 235, 320, 395], counts = [5, 6, 5, 3], gaps = [60, 56, 60, 95];
    var outputs = [['Band gap', '1.42 eV'], ['Bulk modulus', '76 GPa'], ['Stability', 'Stable']];
    var layers = counts.map(function (n, k) {
      var nodes = [];
      for (var i = 0; i < n; i++) nodes.push({ x: cols[k], y: H / 2 + (i - (n - 1) / 2) * gaps[k] });
      return nodes;
    });
    var source = { x: 100, y: H / 2 };
    var edges = '', pulses = '';
    function link(p, q, stage) {
      var at = ' x1="' + f(p.x) + '" y1="' + f(p.y) + '" x2="' + f(q.x) + '" y2="' + f(q.y) + '"';
      edges += '<line class="nn-edge"' + at + delay(stage * 150) + '/>';
      pulses += '<line class="nn-pulse" pathLength="100"' + at + delay(1200 + stage * 600) + '/>';
    }
    layers[0].forEach(function (n) { link(source, n, 0); });
    for (var k = 0; k < layers.length - 1; k++) {
      layers[k].forEach(function (p) { layers[k + 1].forEach(function (q) { link(p, q, k + 1); }); });
    }

    var crystal = '';
    for (var i = 0; i < 3; i++) {
      crystal += '<line class="nn-bond" x1="36" y1="' + (196 + i * 24) + '" x2="84" y2="' + (196 + i * 24) + '"/>';
      crystal += '<line class="nn-bond" x1="' + (36 + i * 24) + '" y1="196" x2="' + (36 + i * 24) + '" y2="244"/>';
    }
    for (i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        crystal += '<circle class="atom ' + ((i + j) % 2 ? 'atom-b' : 'atom-a') + '" cx="' + (36 + i * 24) + '" cy="' + (196 + j * 24) + '" r="7"' + delay((i + j) * 60) + '/>';
      }
    }
    crystal += '<text class="scene-label" x="60" y="276" text-anchor="middle">Structure</text>';

    var nodes = layers.map(function (layer, k) {
      return layer.map(function (n) {
        var out = k === layers.length - 1;
        return '<circle class="nn-node' + (out ? ' nn-out' : '') + '" cx="' + f(n.x) + '" cy="' + f(n.y) + '" r="' + (out ? 10 : 9) + '"' + delay(out ? 3600 : k * 150 + 100) + '/>';
      }).join('');
    }).join('');

    var labels = layers[layers.length - 1].map(function (n, i) {
      return '<g class="nn-value"' + delay(3600 + i * 120) + '><text class="scene-label" x="412" y="' + f(n.y - 4) + '">' + outputs[i][0] + '</text><text class="scene-value" x="412" y="' + f(n.y + 15) + '">' + outputs[i][1] + '</text></g>';
    }).join('');

    return svg('A neural network reading a crystal structure and predicting its properties', crystal + edges + pulses + nodes + labels);
  }

  // 3. Quantum computing: a four-qubit variational circuit, then measured outcomes.
  function quantumCircuit() {
    var wires = [70, 135, 200, 265], x0 = 72, x1 = 455, out = '';
    wires.forEach(function (y) {
      var at = ' x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '"';
      out += '<text class="scene-label q-ket" x="58" y="' + (y + 5) + '" text-anchor="end">|0⟩</text>';
      out += '<line class="q-wire"' + at + '/><line class="q-wire-live" pathLength="100"' + at + '/>';
    });
    function gate(x, y, label, col) {
      return '<g class="q-gate"' + delay(col * 220) + '><rect x="' + (x - 17) + '" y="' + (y - 17) + '" width="34" height="34" rx="5"/><text x="' + x + '" y="' + (y + 5.5) + '" text-anchor="middle">' + label + '</text></g>';
    }
    function cnot(x, c, t, col) {
      var yc = wires[c], yt = wires[t];
      return '<g class="q-gate"' + delay(col * 220) + '><line class="q-link" x1="' + x + '" y1="' + yc + '" x2="' + x + '" y2="' + yt + '"/><circle class="q-ctrl" cx="' + x + '" cy="' + yc + '" r="5"/><circle class="q-target" cx="' + x + '" cy="' + yt + '" r="12"/><line class="q-link" x1="' + (x - 12) + '" y1="' + yt + '" x2="' + (x + 12) + '" y2="' + yt + '"/><line class="q-link" x1="' + x + '" y1="' + (yt - 12) + '" x2="' + x + '" y2="' + (yt + 12) + '"/></g>';
    }
    function measure(x, y, col) {
      return '<g class="q-gate"' + delay(col * 220) + '><rect x="' + (x - 17) + '" y="' + (y - 17) + '" width="34" height="34" rx="5"/><path class="q-meter" d="M' + (x - 10) + ' ' + (y + 7) + ' A11 11 0 0 1 ' + (x + 10) + ' ' + (y + 7) + '"/><line class="q-meter" x1="' + x + '" y1="' + (y + 7) + '" x2="' + (x + 7) + '" y2="' + (y - 8) + '"/></g>';
    }
    wires.forEach(function (y) { out += gate(112, y, 'H', 0); });
    out += cnot(175, 0, 1, 1) + cnot(230, 1, 2, 2) + cnot(285, 2, 3, 3);
    out += gate(345, wires[0], 'Ry', 4) + gate(345, wires[2], 'Ry', 4);
    wires.forEach(function (y) { out += measure(425, y, 5); });

    var probs = [0.95, 0.08, 0.06, 0.13, 0.05, 0.1, 0.07, 0.15, 0.11, 0.06, 0.12, 0.05, 0.09, 0.07, 0.1, 0.86];
    out += '<text class="scene-label" x="' + x0 + '" y="322">Measured outcomes</text>';
    probs.forEach(function (p, i) {
      var h = Math.max(3, p * 72), x = x0 + i * 24.6;
      out += '<rect class="q-bar' + (p > 0.5 ? ' q-bar-hi' : '') + '" x="' + f(x) + '" y="' + f(410 - h) + '" width="16" height="' + f(h) + '" rx="2"' + delay(3600 + i * 35) + '/>';
    });
    out += '<text class="scene-label q-state" x="' + (x0 + 8) + '" y="430" text-anchor="middle">0000</text>';
    out += '<text class="scene-label q-state" x="' + f(x0 + 15 * 24.6 + 8) + '" y="430" text-anchor="middle">1111</text>';
    return svg('A four-qubit quantum circuit and its measured outcomes', out);
  }

  // 4. Virtual characterization: simulated X-ray diffraction of FCC aluminum, ambient vs. shock-compressed.
  function diffraction() {
    var peaks = [[38.47, 100, '111'], [44.74, 47, '200'], [65.13, 22, '220'], [78.23, 24, '311'], [82.44, 7, '222']];
    var x0 = 50, x1 = 490, h = 130;
    function X(t) { return x0 + (t - 30) / 60 * (x1 - x0); }
    function shifted(t, s) {
      var sin = Math.sin(t / 2 * Math.PI / 180) / s;
      return 2 * Math.asin(Math.min(sin, 0.999)) * 180 / Math.PI;
    }
    function intensity(t, s, width, scale) {
      var I = 2 + 1.2 * Math.sin(t * 7.3) + 0.8 * Math.sin(t * 13.1 + 1);
      peaks.forEach(function (p) { I += p[1] * scale / (1 + Math.pow((t - shifted(p[0], s)) / width, 2)); });
      return I;
    }
    function trace(base, s, width, scale) {
      var d = '';
      for (var t = 30; t <= 90.001; t += 0.15) d += (d ? 'L' : 'M') + f(X(t)) + ' ' + f(base - intensity(t, s, width, scale) / 100 * h);
      return d;
    }
    var out = '';
    peaks.forEach(function (p) {
      out += '<line class="xrd-guide" x1="' + f(X(p[0])) + '" y1="52" x2="' + f(X(p[0])) + '" y2="384"/>';
    });
    out += '<path class="xrd-trace" pathLength="100" d="' + trace(380, 1, 0.25, 1) + '"/>';
    out += '<path class="xrd-trace xrd-shock" pathLength="100" d="' + trace(200, 0.96, 0.6, 0.75) + '"/>';
    out += '<text class="scene-label xrd-name"' + delay(200) + ' x="' + x1 + '" y="240" text-anchor="end">Ambient</text>';
    out += '<text class="scene-label xrd-name xrd-shock-name"' + delay(2000) + ' x="' + x1 + '" y="60" text-anchor="end">Shock-compressed</text>';
    peaks.forEach(function (p, i) {
      var top = 380 - intensity(p[0], 1, 0.25, 1) / 100 * h;
      out += '<text class="scene-label xrd-hkl"' + delay(1800 + i * 100) + ' x="' + f(X(p[0])) + '" y="' + f(top - 8) + '" text-anchor="middle">(' + p[2] + ')</text>';
    });
    out += '<line class="xrd-axis" x1="' + x0 + '" y1="392" x2="' + x1 + '" y2="392"/>';
    [30, 45, 60, 75, 90].forEach(function (t) {
      out += '<line class="xrd-axis" x1="' + f(X(t)) + '" y1="392" x2="' + f(X(t)) + '" y2="398"/><text class="scene-label" x="' + f(X(t)) + '" y="414" text-anchor="middle">' + t + '</text>';
    });
    out += '<text class="scene-label" x="' + (x0 + x1) / 2 + '" y="436" text-anchor="middle">2θ (degrees)</text>';
    return svg('Simulated X-ray diffraction of aluminum at ambient pressure and under shock compression', out);
  }

  window.MatIQScenes = [
    { svg: grainBoundary, caption: 'Two crystal grains meeting at a grain boundary. Boundary atoms shown in blue.' },
    { svg: neuralNet, caption: 'A neural network reads a crystal structure and predicts its properties.' },
    { svg: quantumCircuit, caption: 'A variational circuit entangles four qubits, then measures them.' },
    { svg: diffraction, caption: 'Simulated X-ray diffraction of aluminum, at ambient pressure and under shock compression.' }
  ];
})();
