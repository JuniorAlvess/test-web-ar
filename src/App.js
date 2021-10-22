import { useEffect } from 'react';
import './App.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import astronaut from './assets/Astronaut (1).glb'

const THREE = require('three');
function App() {
  // Generic definitions - variables

  let width = document.body.clientWidth, height = document.body.clientHeight;

  navigator.getMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

  window.addEventListener("compassneedscalibration", function (event) {
    window.self.supported = true;
    alert('Your compass needs calibrating!');
    event.preventDefault();
  }, true);

  if (!navigator.getMedia) {
    alert("Oh noes! Your browser does not support webcam video :(");
  }

  let scene = new THREE.Scene()
  let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  let renderer = new THREE.WebGLRenderer({ alpha: true })
  let light
  let geometry
  let north
  let south
  let east
  let west
  let ctx

  // Generic definitions functions
  function deg2rad(angle) {
    return (angle / 180.0) * Math.PI;
  }

  function draw() {
    let width = document.body.clientWidth
    let height = document.body.clientHeight;
    let video = document.querySelector("video")
    ctx.fillStyle = "#ff00ff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(video, 0, 0, width, height);

    // north.rotation.y += 0.05;
    // south.rotation.y += 0.05;

    // east.rotation.y += 0.05;
    // west.rotation.y += 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(draw);
  }

  function updateOrientation(e) {
    let heading = e.alpha,
      pitch = e.gamma;

    // Correcting the sensors being "clever"
    if (Math.abs(e.beta) > 45) {
      heading += 90;
    } else {
      heading -= 90;
    }

    if (pitch < 0) {
      pitch = -90 - pitch;
    } else {
      pitch = 90 - pitch;
    }

    if (heading < 0) heading = 360 - heading;

    camera.rotation.set(deg2rad(pitch), deg2rad(heading), 0);
    e.preventDefault();
  }

  // Initialisiation and run!

  camera.eulerOrder = 'YXZ'; // We want to rotate around the Y axis first or our perspective is screwed up

  light = new THREE.PointLight(0xffffff, 5, 100);
  scene.add(light);

  // geometry = new THREE.BoxGeometry(10, 10, 10);
  // north = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  // south = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
  // east = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
  // west = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffff00 }));

  const loader = new GLTFLoader();

loader.load(astronaut, (gltf) => {
  north = (gltf.scene);
  south = (gltf.scene);
  east = (gltf.scene);
  west = (gltf.scene); 

  // north.position.set(-2, -2, -2);
  north.position.set(0, 0, -5);
  south.position.set(0, 0, 5);

  east.position.set(5, 0, 0);
  west.position.set(-5, 0, 0);
  scene.add(north);
  scene.add(east);
  scene.add(south);
  scene.add(west);
}, undefined, (err) => {
  console.log(err)
});


  // north.position.set(0, 0, -50);
  // south.position.set(0, 0, 50);

  // east.position.set(50, 0, 0);
  // west.position.set(-50, 0, 0);

  // scene.add(north);
  // scene.add(east);
  // scene.add(south);
  // scene.add(west);

  window.addEventListener("deviceorientation", updateOrientation);

  const handleButton = () => {
    let canvas = document.getElementById("camera")
    canvas.classList.remove('hidden')

    if (document.body.webkitRequestFullscreen) document.body.webkitRequestFullscreen();
    else if (document.body.mozRequestFullScreen) document.body.mozRequestFullScreen();

    document.body.appendChild(renderer.domElement);
    renderer.setSize(width, height);
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");

    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { facingMode: 'environment' } })
      .then((mediaStream) => {
        const video = document.querySelector("video");

        video.srcObject = mediaStream;
        video.play();
      })
      .catch(function (err) {
        alert("Not Camera allowed", err.message);
      });


    draw();
  }

  return (
    <>
      <div id="instructions">
        <h1>Instructions</h1>
        <p>Please hold your phone in landscape mode with the top of the phone in your left hand.</p>
        <p>Allow fullscreen and access to the webcam for the demo to work properly.</p>
        <button onClick={() => handleButton()}>Click me to start!</button>
      </div>
      <canvas className="hidden" id="camera" width="300" height="300"></canvas>
      <video preload="metadata" muted playsInline></video>
    </>
  );
}

export default App;