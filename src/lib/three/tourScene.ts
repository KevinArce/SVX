import * as THREE from 'three';

export interface MonumentAnchor {
  slug: string;
  order: number;
  title: string;
  position: THREE.Vector3;
  cameraOffset: THREE.Vector3;
  markerMesh: THREE.Group;
}

export interface TourSceneSetup {
  scene: THREE.Scene;
  anchors: MonumentAnchor[];
  routePoints: THREE.Vector3[];
  updatePulse: (time: number) => void;
  updateTheme: (isDark: boolean) => void;
  cleanup: () => void;
}

// Bauhaus Palette
const COLOR_RED = 0xD02020;
const COLOR_BLUE = 0x1040C0;
const COLOR_YELLOW = 0xF0C020;
const COLOR_BLACK = 0x121212;

function createEdges(geometry: THREE.BufferGeometry, color = COLOR_BLACK, opacity = 0.85): THREE.LineSegments {
  const edges = new THREE.EdgesGeometry(geometry, 25);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: opacity < 1,
    opacity,
  });
  return new THREE.LineSegments(edges, material);
}

function createTextTexture(text: string, bgColor: string, textColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#121212';
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = '900 68px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 68);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ---------------------------------------------------------------------------
// Monument 1: Palacio Nacional (Neoclassical, colonnade, grand courtyard)
// ---------------------------------------------------------------------------
function buildPalacioNacional(isDark: boolean): THREE.Group {
  const group = new THREE.Group();
  const stoneColor = isDark ? 0x2A2A30 : 0xF2EFE6;
  const roofColor = isDark ? 0x1A1A22 : 0xDDD7CA;
  const edgeColor = isDark ? 0x909090 : COLOR_BLACK;

  const matStone = new THREE.MeshLambertMaterial({ color: stoneColor });
  const matRoof = new THREE.MeshLambertMaterial({ color: roofColor });
  const matAccent = new THREE.MeshLambertMaterial({ color: COLOR_BLUE });
  const matGold = new THREE.MeshLambertMaterial({ color: COLOR_YELLOW });

  // Plinth
  const plinthGeo = new THREE.BoxGeometry(16, 0.4, 12);
  const plinth = new THREE.Mesh(plinthGeo, matStone);
  plinth.position.y = 0.2;
  plinth.add(createEdges(plinthGeo, edgeColor));
  group.add(plinth);

  // Wings forming courtyard
  const wingNorthGeo = new THREE.BoxGeometry(16, 3.2, 3);
  const wingNorth = new THREE.Mesh(wingNorthGeo, matStone);
  wingNorth.position.set(0, 2.0, -4.5);
  wingNorth.add(createEdges(wingNorthGeo, edgeColor));
  group.add(wingNorth);

  const wingSouthGeo = new THREE.BoxGeometry(16, 3.2, 3);
  const wingSouth = new THREE.Mesh(wingSouthGeo, matStone);
  wingSouth.position.set(0, 2.0, 4.5);
  wingSouth.add(createEdges(wingSouthGeo, edgeColor));
  group.add(wingSouth);

  const wingWestGeo = new THREE.BoxGeometry(3, 3.2, 6);
  const wingWest = new THREE.Mesh(wingWestGeo, matStone);
  wingWest.position.set(-6.5, 2.0, 0);
  wingWest.add(createEdges(wingWestGeo, edgeColor));
  group.add(wingWest);

  // Courtyard center floor
  const courtyardGeo = new THREE.BoxGeometry(10, 0.05, 6);
  const courtyard = new THREE.Mesh(courtyardGeo, matRoof);
  courtyard.position.set(0, 0.42, 0);
  group.add(courtyard);

  // Courtyard Fountain
  const fountainGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 16);
  const fountain = new THREE.Mesh(fountainGeo, matAccent);
  fountain.position.set(0, 0.55, 0);
  fountain.add(createEdges(fountainGeo, edgeColor));
  group.add(fountain);

  // East Facade Colonnade (Facing Plaza Barrios)
  const colGeo = new THREE.CylinderGeometry(0.22, 0.25, 3.2, 12);
  for (let i = -5; i <= 5; i += 2) {
    const col = new THREE.Mesh(colGeo, matStone);
    col.position.set(6.8, 2.0, i);
    col.add(createEdges(colGeo, edgeColor, 0.5));
    group.add(col);
  }

  // Classical Triangular Pediment on Facade
  const pedimentShape = new THREE.Shape();
  pedimentShape.moveTo(-3, 0);
  pedimentShape.lineTo(3, 0);
  pedimentShape.lineTo(0, 1.6);
  pedimentShape.closePath();
  const pedimentGeo = new THREE.ExtrudeGeometry(pedimentShape, { depth: 0.8, bevelEnabled: false });
  const pediment = new THREE.Mesh(pedimentGeo, matStone);
  pediment.rotation.y = Math.PI / 2;
  pediment.position.set(6.9, 3.6, 0);
  pediment.add(createEdges(pedimentGeo, edgeColor));
  group.add(pediment);

  // Roof cornice rim
  const corniceGeo = new THREE.BoxGeometry(16.4, 0.3, 12.4);
  const cornice = new THREE.Mesh(corniceGeo, matGold);
  cornice.position.set(0, 3.75, 0);
  cornice.add(createEdges(corniceGeo, edgeColor));
  group.add(cornice);

  return group;
}

// ---------------------------------------------------------------------------
// Monument 2: Catedral Metropolitana (Campanarios gemelos, cúpula dorada)
// ---------------------------------------------------------------------------
function buildCatedralMetropolitana(isDark: boolean): THREE.Group {
  const group = new THREE.Group();
  const stoneColor = isDark ? 0x24242A : 0xFAFAFA;
  const edgeColor = isDark ? 0x888888 : COLOR_BLACK;

  const matStone = new THREE.MeshLambertMaterial({ color: stoneColor });
  const matGold = new THREE.MeshLambertMaterial({ color: COLOR_YELLOW });
  const matBlue = new THREE.MeshLambertMaterial({ color: COLOR_BLUE });

  // Base
  const baseGeo = new THREE.BoxGeometry(12, 0.4, 18);
  const base = new THREE.Mesh(baseGeo, matStone);
  base.position.y = 0.2;
  base.add(createEdges(baseGeo, edgeColor));
  group.add(base);

  // Main Nave
  const naveGeo = new THREE.BoxGeometry(8, 5.5, 14);
  const nave = new THREE.Mesh(naveGeo, matStone);
  nave.position.set(0, 3.15, -1);
  nave.add(createEdges(naveGeo, edgeColor));
  group.add(nave);

  // Twin Bell Towers (Campanarios) on front (South facade)
  const towerGeo = new THREE.BoxGeometry(2.8, 9.5, 2.8);
  const towerCapGeo = new THREE.ConeGeometry(2.0, 2.5, 4);

  // Left Tower
  const towerLeft = new THREE.Mesh(towerGeo, matStone);
  towerLeft.position.set(-3.8, 5.15, 6.2);
  towerLeft.add(createEdges(towerGeo, edgeColor));
  const capLeft = new THREE.Mesh(towerCapGeo, matGold);
  capLeft.position.set(-3.8, 11.15, 6.2);
  capLeft.rotation.y = Math.PI / 4;
  capLeft.add(createEdges(towerCapGeo, edgeColor));
  group.add(towerLeft, capLeft);

  // Right Tower
  const towerRight = new THREE.Mesh(towerGeo, matStone);
  towerRight.position.set(3.8, 5.15, 6.2);
  towerRight.add(createEdges(towerGeo, edgeColor));
  const capRight = new THREE.Mesh(towerCapGeo, matGold);
  capRight.position.set(3.8, 11.15, 6.2);
  capRight.rotation.y = Math.PI / 4;
  capRight.add(createEdges(towerCapGeo, edgeColor));
  group.add(towerRight, capRight);

  // Entrance portal archway
  const portalGeo = new THREE.BoxGeometry(4.2, 3.6, 1.2);
  const portal = new THREE.Mesh(portalGeo, matBlue);
  portal.position.set(0, 2.2, 6.8);
  portal.add(createEdges(portalGeo, edgeColor));
  group.add(portal);

  // Iconic Rear Dome (Cúpula)
  const drumGeo = new THREE.CylinderGeometry(2.6, 2.6, 1.5, 18);
  const drum = new THREE.Mesh(drumGeo, matStone);
  drum.position.set(0, 6.6, -4.5);
  drum.add(createEdges(drumGeo, edgeColor));
  group.add(drum);

  const domeGeo = new THREE.SphereGeometry(2.6, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, matGold);
  dome.position.set(0, 7.35, -4.5);
  dome.add(createEdges(domeGeo, edgeColor));
  group.add(dome);

  // Cross atop dome
  const crossVGeo = new THREE.BoxGeometry(0.18, 1.2, 0.18);
  const crossHGeo = new THREE.BoxGeometry(0.7, 0.18, 0.18);
  const matCross = new THREE.MeshBasicMaterial({ color: COLOR_BLACK });
  const crossV = new THREE.Mesh(crossVGeo, matCross);
  crossV.position.set(0, 10.5, -4.5);
  const crossH = new THREE.Mesh(crossHGeo, matCross);
  crossH.position.set(0, 10.7, -4.5);
  group.add(crossV, crossH);

  return group;
}

// ---------------------------------------------------------------------------
// Monument 3: Iglesia El Rosario (Bóveda parabólica de concreto y vitrales)
// ---------------------------------------------------------------------------
function buildIglesiaElRosario(isDark: boolean): THREE.Group {
  const group = new THREE.Group();
  const concreteColor = isDark ? 0x33353A : 0x7A7E85;
  const edgeColor = isDark ? 0x888888 : COLOR_BLACK;

  const matConcrete = new THREE.MeshLambertMaterial({ color: concreteColor });

  // Plinth
  const plinthGeo = new THREE.BoxGeometry(14, 0.4, 20);
  const plinth = new THREE.Mesh(plinthGeo, matConcrete);
  plinth.position.y = 0.2;
  plinth.add(createEdges(plinthGeo, edgeColor));
  group.add(plinth);

  // Stepped Parabolic Barrel Arch Ribs along Z
  const ribColors = [COLOR_RED, COLOR_YELLOW, COLOR_BLUE, 0x00A86B, COLOR_RED, COLOR_YELLOW, COLOR_BLUE];
  const steps = 7;
  const stepLength = 2.4;

  for (let i = 0; i < steps; i++) {
    const zPos = -7.2 + i * stepLength;
    // Parabolic stepped arch ring
    const archShape = new THREE.Shape();
    const w = 11.5 - Math.abs(i - 3) * 0.4;
    const h = 6.2 - Math.abs(i - 3) * 0.3;

    archShape.moveTo(-w / 2, 0);
    archShape.quadraticCurveTo(0, h * 1.3, w / 2, 0);
    archShape.lineTo(w / 2 - 0.7, 0);
    archShape.quadraticCurveTo(0, h * 1.3 - 0.7, -w / 2 + 0.7, 0);
    archShape.closePath();

    const ribGeo = new THREE.ExtrudeGeometry(archShape, { depth: stepLength * 0.65, bevelEnabled: false });
    const ribMesh = new THREE.Mesh(ribGeo, matConcrete);
    ribMesh.position.set(0, 0.4, zPos);
    ribMesh.add(createEdges(ribGeo, edgeColor, 0.7));
    group.add(ribMesh);

    // Stained Glass Emissive Band
    const glassColor = ribColors[i % ribColors.length];
    const matGlass = new THREE.MeshLambertMaterial({
      color: glassColor,
      emissive: glassColor,
      emissiveIntensity: 0.55,
    });
    const glassGeo = new THREE.ExtrudeGeometry(archShape, { depth: stepLength * 0.28, bevelEnabled: false });
    const glassMesh = new THREE.Mesh(glassGeo, matGlass);
    glassMesh.position.set(0, 0.4, zPos + stepLength * 0.67);
    group.add(glassMesh);
  }

  // End wall with Brutalist Eye of God Cross
  const wallGeo = new THREE.BoxGeometry(11, 4.5, 0.8);
  const wall = new THREE.Mesh(wallGeo, matConcrete);
  wall.position.set(0, 2.65, 9.8);
  wall.add(createEdges(wallGeo, edgeColor));
  group.add(wall);

  // Entrance angular canopy
  const canopyGeo = new THREE.BoxGeometry(5.2, 0.4, 3.2);
  const matRed = new THREE.MeshLambertMaterial({ color: COLOR_RED });
  const canopy = new THREE.Mesh(canopyGeo, matRed);
  canopy.position.set(0, 2.2, 11.2);
  canopy.rotation.x = 0.1;
  canopy.add(createEdges(canopyGeo, edgeColor));
  group.add(canopy);

  return group;
}

// ---------------------------------------------------------------------------
// Monument 4: Teatro Nacional (Renacentista Francés, mansarda, logia de arcos)
// ---------------------------------------------------------------------------
function buildTeatroNacional(isDark: boolean): THREE.Group {
  const group = new THREE.Group();
  const stoneColor = isDark ? 0x2A2724 : 0xECE7DC;
  const roofColor = isDark ? 0x1E222A : 0x4A5364;
  const edgeColor = isDark ? 0x888888 : COLOR_BLACK;

  const matStone = new THREE.MeshLambertMaterial({ color: stoneColor });
  const matRoof = new THREE.MeshLambertMaterial({ color: roofColor });
  const matGold = new THREE.MeshLambertMaterial({ color: COLOR_YELLOW });

  // Plinth
  const plinthGeo = new THREE.BoxGeometry(13, 0.5, 14);
  const plinth = new THREE.Mesh(plinthGeo, matStone);
  plinth.position.y = 0.25;
  plinth.add(createEdges(plinthGeo, edgeColor));
  group.add(plinth);

  // Main Volume
  const bodyGeo = new THREE.BoxGeometry(12, 5.0, 13);
  const body = new THREE.Mesh(bodyGeo, matStone);
  body.position.set(0, 3.0, 0);
  body.add(createEdges(bodyGeo, edgeColor));
  group.add(body);

  // Triple Arched Entrance Portico (Loggia) on South facade
  const archBlockGeo = new THREE.BoxGeometry(9, 3.6, 1.4);
  const archBlock = new THREE.Mesh(archBlockGeo, matStone);
  archBlock.position.set(0, 2.3, 6.7);
  archBlock.add(createEdges(archBlockGeo, edgeColor));
  group.add(archBlock);

  // Entrance staircase
  for (let s = 0; s < 3; s++) {
    const stepGeo = new THREE.BoxGeometry(9.6 - s * 0.6, 0.18, 0.6);
    const step = new THREE.Mesh(stepGeo, matStone);
    step.position.set(0, 0.1 + s * 0.18, 7.5 + s * 0.5);
    step.add(createEdges(stepGeo, edgeColor, 0.4));
    group.add(step);
  }

  // Mansard Roof (Pavilion style)
  const roofGeo = new THREE.ConeGeometry(7.5, 3.2, 4);
  const roof = new THREE.Mesh(roofGeo, matRoof);
  roof.position.set(0, 7.1, 0);
  roof.rotation.y = Math.PI / 4;
  roof.add(createEdges(roofGeo, edgeColor));
  group.add(roof);

  // Central Opera Dome Lantern
  const lanternGeo = new THREE.CylinderGeometry(1.6, 1.6, 1.2, 16);
  const lantern = new THREE.Mesh(lanternGeo, matGold);
  lantern.position.set(0, 8.8, 0);
  lantern.add(createEdges(lanternGeo, edgeColor));
  group.add(lantern);

  const spikeGeo = new THREE.ConeGeometry(0.2, 1.6, 8);
  const spike = new THREE.Mesh(spikeGeo, matGold);
  spike.position.set(0, 10.2, 0);
  group.add(spike);

  return group;
}

// ---------------------------------------------------------------------------
// Urban Base: Street Grid, Plazas, Trees & Generic Blocks
// ---------------------------------------------------------------------------
function buildUrbanBase(isDark: boolean): THREE.Group {
  const group = new THREE.Group();
  const groundColor = isDark ? 0x161618 : 0xE8E6E0;
  const streetColor = isDark ? 0x101012 : 0xD5D2CA;
  const plazaColor = isDark ? 0x222226 : 0xF5F3EC;
  const blockColor = isDark ? 0x1E1E22 : 0xFFFFFF;
  const edgeColor = isDark ? 0x404044 : 0xC0BDB5;

  const matGround = new THREE.MeshLambertMaterial({ color: groundColor });
  const matStreet = new THREE.MeshLambertMaterial({ color: streetColor });
  const matPlaza = new THREE.MeshLambertMaterial({ color: plazaColor });
  const matBlock = new THREE.MeshLambertMaterial({ color: blockColor });
  const matTreeTrunk = new THREE.MeshLambertMaterial({ color: 0x5A3D28 });
  const matTreeCrown = new THREE.MeshLambertMaterial({ color: isDark ? 0x2A4530 : 0x5C8C64 });
  const matStatueGold = new THREE.MeshLambertMaterial({ color: COLOR_YELLOW });

  // Master Ground
  const groundGeo = new THREE.PlaneGeometry(160, 140);
  const ground = new THREE.Mesh(groundGeo, matGround);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  group.add(ground);

  // Urban Streets Network (Avenidas Norte-Sur y Calles Oriente-Poniente)
  const streetSegments = [
    // Avenidas (North-South)
    { x: -2, z: 0, w: 4.8, d: 130 },
    { x: 16, z: 0, w: 4.5, d: 130 },
    { x: 38, z: 0, w: 4.5, d: 130 },
    // Calles (East-West)
    { x: 0, z: -17, w: 150, d: 4.5 },
    { x: 0, z: 6, w: 150, d: 4.5 },
    { x: 0, z: 20, w: 150, d: 4.5 },
  ];

  streetSegments.forEach(({ x, z, w, d }) => {
    const sGeo = new THREE.PlaneGeometry(w, d);
    const sMesh = new THREE.Mesh(sGeo, matStreet);
    sMesh.rotation.x = -Math.PI / 2;
    sMesh.position.set(x, 0.01, z);
    group.add(sMesh);
  });

  // Plaza Gerardo Barrios (Center-West)
  const plazaBarriosGeo = new THREE.BoxGeometry(22, 0.12, 20);
  const plazaBarrios = new THREE.Mesh(plazaBarriosGeo, matPlaza);
  plazaBarrios.position.set(4, 0.06, -7);
  plazaBarrios.add(createEdges(plazaBarriosGeo, edgeColor));
  group.add(plazaBarrios);

  // Gerardo Barrios Equestrian Monument in center of plaza
  const pedGeo = new THREE.BoxGeometry(1.6, 2.2, 1.6);
  const ped = new THREE.Mesh(pedGeo, matBlock);
  ped.position.set(4, 1.15, -7);
  ped.add(createEdges(pedGeo, edgeColor));
  const statueGeo = new THREE.BoxGeometry(0.8, 1.0, 1.6);
  const statue = new THREE.Mesh(statueGeo, matStatueGold);
  statue.position.set(4, 2.7, -7);
  group.add(ped, statue);

  // Plaza Libertad (East, near El Rosario)
  const plazaLibertadGeo = new THREE.BoxGeometry(20, 0.12, 18);
  const plazaLibertad = new THREE.Mesh(plazaLibertadGeo, matPlaza);
  plazaLibertad.position.set(28, 0.06, 0);
  plazaLibertad.add(createEdges(plazaLibertadGeo, edgeColor));
  group.add(plazaLibertad);

  // Angel of Liberty Column in Plaza Libertad
  const angelColGeo = new THREE.CylinderGeometry(0.35, 0.45, 5.0, 12);
  const angelCol = new THREE.Mesh(angelColGeo, matBlock);
  angelCol.position.set(28, 2.6, 0);
  angelCol.add(createEdges(angelColGeo, edgeColor));
  const angelWingGeo = new THREE.ConeGeometry(0.5, 1.2, 5);
  const angelWing = new THREE.Mesh(angelWingGeo, matStatueGold);
  angelWing.position.set(28, 5.7, 0);
  group.add(angelCol, angelWing);

  // Plaza Morazán (North-East, in front of Teatro)
  const plazaMorazanGeo = new THREE.BoxGeometry(16, 0.12, 14);
  const plazaMorazan = new THREE.Mesh(plazaMorazanGeo, matPlaza);
  plazaMorazan.position.set(4, 0.06, 26);
  plazaMorazan.add(createEdges(plazaMorazanGeo, edgeColor));
  group.add(plazaMorazan);

  // Stylized Trees
  const treePositions = [
    [-3, -15], [11, -15], [-3, 1], [11, 1],
    [21, -7], [35, -7], [21, 7], [35, 7],
    [-2, 21], [10, 21], [-2, 31], [10, 31],
  ];
  const trunkGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.2, 8);
  const crownGeo = new THREE.IcosahedronGeometry(1.0, 0);

  treePositions.forEach(([tx, tz]) => {
    const trunk = new THREE.Mesh(trunkGeo, matTreeTrunk);
    trunk.position.set(tx, 0.6, tz);
    const crown = new THREE.Mesh(crownGeo, matTreeCrown);
    crown.position.set(tx, 1.8, tz);
    crown.add(createEdges(crownGeo, edgeColor, 0.3));
    group.add(trunk, crown);
  });

  // Surrounding contextual city blocks
  const genericBlocks = [
    // North blocks
    { x: -30, z: -25, w: 16, d: 16, h: 3 },
    { x: -10, z: -25, w: 18, d: 14, h: 2.8 },
    { x: 14, z: -25, w: 20, d: 14, h: 3.2 },
    { x: 38, z: -25, w: 18, d: 14, h: 2.5 },
    // South blocks
    { x: -30, z: 24, w: 16, d: 18, h: 2.7 },
    { x: 26, z: 24, w: 22, d: 18, h: 3.4 },
    { x: -14, z: 32, w: 12, d: 12, h: 2.2 },
    // East blocks
    { x: 44, z: -2, w: 12, d: 24, h: 3.0 },
    // West blocks
    { x: -32, z: -2, w: 12, d: 22, h: 3.5 },
  ];

  genericBlocks.forEach(({ x, z, w, d, h }) => {
    const bGeo = new THREE.BoxGeometry(w, h, d);
    const bMesh = new THREE.Mesh(bGeo, matBlock);
    bMesh.position.set(x, h / 2, z);
    bMesh.add(createEdges(bGeo, edgeColor, 0.5));
    group.add(bMesh);
  });

  return group;
}

// ---------------------------------------------------------------------------
// 3D Tour Route Ribbon & Animated Beacon
// ---------------------------------------------------------------------------
function buildRouteRibbon(points: THREE.Vector3[]): { routeGroup: THREE.Group; updatePulse: (t: number) => void } {
  const routeGroup = new THREE.Group();

  // Create smooth spline path between waypoints
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.2);

  // Elevated Ribbon
  const ribbonGeo = new THREE.TubeGeometry(curve, 100, 0.35, 8, false);
  const ribbonMat = new THREE.MeshBasicMaterial({ color: COLOR_RED });
  const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
  routeGroup.add(ribbon);

  // Animated traveling beacon dot
  const beaconGeo = new THREE.SphereGeometry(0.7, 16, 16);
  const beaconMat = new THREE.MeshBasicMaterial({ color: COLOR_YELLOW });
  const beacon = new THREE.Mesh(beaconGeo, beaconMat);
  beacon.position.copy(points[0]);
  routeGroup.add(beacon);

  const pulseRingGeo = new THREE.RingGeometry(0.8, 1.4, 24);
  pulseRingGeo.rotateX(-Math.PI / 2);
  const pulseRingMat = new THREE.MeshBasicMaterial({
    color: COLOR_YELLOW,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  });
  const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
  pulseRing.position.y = 0.25;
  routeGroup.add(pulseRing);

  const updatePulse = (time: number) => {
    const loopT = (time * 0.12) % 1;
    const currentPos = curve.getPointAt(loopT);
    beacon.position.copy(currentPos);
    pulseRing.position.set(currentPos.x, 0.3, currentPos.z);
    const s = 1 + (Math.sin(time * 6) + 1) * 0.35;
    pulseRing.scale.set(s, s, s);
    pulseRingMat.opacity = Math.max(0.1, 1 - (s - 1));
  };

  return { routeGroup, updatePulse };
}

// ---------------------------------------------------------------------------
// Floating Pin Markers for each monument
// ---------------------------------------------------------------------------
function createMonumentMarker(order: number, title: string, position: THREE.Vector3): THREE.Group {
  const markerGroup = new THREE.Group();
  markerGroup.position.set(position.x, position.y + 11.5, position.z);

  // Billboard sprite with order number
  const texture = createTextTexture(String(order), '#D02020', '#FFFFFF');
  const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(3.2, 3.2, 1);
  markerGroup.add(sprite);

  // Floating stem pointing down
  const stemGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 8);
  const stemMat = new THREE.MeshBasicMaterial({ color: COLOR_BLACK });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = -1.8;
  markerGroup.add(stem);

  // Floating shadow target ring on building roof
  const ringGeo = new THREE.RingGeometry(0.8, 1.2, 16);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: COLOR_RED,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = -3.1;
  markerGroup.add(ring);

  markerGroup.userData = { order, title };
  return markerGroup;
}

// ---------------------------------------------------------------------------
// Main Setup Orchestrator
// ---------------------------------------------------------------------------
export function initTour3DScene(isDark: boolean): TourSceneSetup {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(isDark ? 0x121214 : 0xEEEEEC);

  // Directional & Ambient Lighting for crisp Bauhaus isometric shadows
  const ambLight = new THREE.AmbientLight(0xffffff, isDark ? 0.75 : 0.95);
  scene.add(ambLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 0.9 : 1.1);
  dirLight.position.set(40, 60, 30);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
  fillLight.position.set(-30, 40, -40);
  scene.add(fillLight);

  // Urban Context
  let urbanGroup = buildUrbanBase(isDark);
  scene.add(urbanGroup);

  // The 4 Iconic Monuments
  // Parada 1: Palacio Nacional (Center-West)
  const palacioPos = new THREE.Vector3(-12, 0, -7);
  let palacioMesh = buildPalacioNacional(isDark);
  palacioMesh.position.copy(palacioPos);
  scene.add(palacioMesh);

  // Parada 2: Catedral Metropolitana (North, facing Plaza Barrios)
  const catedralPos = new THREE.Vector3(4, 0, -22);
  let catedralMesh = buildCatedralMetropolitana(isDark);
  catedralMesh.position.copy(catedralPos);
  scene.add(catedralMesh);

  // Parada 3: Iglesia El Rosario (East, near Plaza Libertad)
  const rosarioPos = new THREE.Vector3(38, 0, 0);
  let rosarioMesh = buildIglesiaElRosario(isDark);
  rosarioMesh.position.copy(rosarioPos);
  scene.add(rosarioMesh);

  // Parada 4: Teatro Nacional (South, near Plaza Morazán)
  const teatroPos = new THREE.Vector3(4, 0, 16);
  let teatroMesh = buildTeatroNacional(isDark);
  teatroMesh.position.copy(teatroPos);
  scene.add(teatroMesh);

  // Markers
  const marker1 = createMonumentMarker(1, 'Palacio Nacional', palacioPos);
  const marker2 = createMonumentMarker(2, 'Catedral Metropolitana', catedralPos);
  const marker3 = createMonumentMarker(3, 'Iglesia El Rosario', rosarioPos);
  const marker4 = createMonumentMarker(4, 'Teatro Nacional', teatroPos);
  scene.add(marker1, marker2, marker3, marker4);

  // Anchors metadata for camera focus
  const anchors: MonumentAnchor[] = [
    {
      slug: 'palacio-nacional',
      order: 1,
      title: 'Palacio Nacional de El Salvador',
      position: palacioPos.clone().add(new THREE.Vector3(0, 2, 0)),
      cameraOffset: new THREE.Vector3(22, 22, 20),
      markerMesh: marker1,
    },
    {
      slug: 'catedral-metropolitana',
      order: 2,
      title: 'Catedral Metropolitana',
      position: catedralPos.clone().add(new THREE.Vector3(0, 3, 0)),
      cameraOffset: new THREE.Vector3(20, 24, 22),
      markerMesh: marker2,
    },
    {
      slug: 'iglesia-el-rosario',
      order: 3,
      title: 'Iglesia El Rosario',
      position: rosarioPos.clone().add(new THREE.Vector3(0, 3, 0)),
      cameraOffset: new THREE.Vector3(22, 22, 20),
      markerMesh: marker3,
    },
    {
      slug: 'teatro-nacional',
      order: 4,
      title: 'Teatro Nacional',
      position: teatroPos.clone().add(new THREE.Vector3(0, 3, 0)),
      cameraOffset: new THREE.Vector3(22, 24, 20),
      markerMesh: marker4,
    },
  ];

  // Route points walking sequence:
  // Palacio -> Crossing Plaza Barrios to Catedral -> Calle Delgado down to El Rosario -> South-west to Teatro -> Back to Plaza Barrios
  const routePoints = [
    new THREE.Vector3(-12, 0.4, -7), // Palacio
    new THREE.Vector3(-2, 0.4, -7),  // Plaza Barrios crossing
    new THREE.Vector3(4, 0.4, -18),  // Catedral
    new THREE.Vector3(12, 0.4, -12), // 2a Calle Oriente
    new THREE.Vector3(26, 0.4, -8),  // Plaza Libertad entrance
    new THREE.Vector3(38, 0.4, 0),   // El Rosario
    new THREE.Vector3(28, 0.4, 6),   // Return along Calle Delgado
    new THREE.Vector3(16, 0.4, 12),  // Plaza Morazán approach
    new THREE.Vector3(4, 0.4, 16),   // Teatro Nacional
    new THREE.Vector3(-4, 0.4, 8),   // Return to Plaza Barrios
    new THREE.Vector3(-12, 0.4, -7), // Loop
  ];

  const { routeGroup, updatePulse } = buildRouteRibbon(routePoints);
  scene.add(routeGroup);

  const updateTheme = (dark: boolean) => {
    scene.background = new THREE.Color(dark ? 0x121214 : 0xEEEEEC);
    ambLight.intensity = dark ? 0.75 : 0.95;
    dirLight.intensity = dark ? 0.9 : 1.1;

    // Replace urban & monuments with updated materials
    scene.remove(urbanGroup, palacioMesh, catedralMesh, rosarioMesh, teatroMesh);
    urbanGroup = buildUrbanBase(dark);
    palacioMesh = buildPalacioNacional(dark);
    palacioMesh.position.copy(palacioPos);
    catedralMesh = buildCatedralMetropolitana(dark);
    catedralMesh.position.copy(catedralPos);
    rosarioMesh = buildIglesiaElRosario(dark);
    rosarioMesh.position.copy(rosarioPos);
    teatroMesh = buildTeatroNacional(dark);
    teatroMesh.position.copy(teatroPos);
    scene.add(urbanGroup, palacioMesh, catedralMesh, rosarioMesh, teatroMesh);
  };

  const cleanup = () => {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
      }
    });
  };

  return {
    scene,
    anchors,
    routePoints,
    updatePulse,
    updateTheme,
    cleanup,
  };
}
