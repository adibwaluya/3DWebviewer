﻿
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';  // Importing from OrbitControls
import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js';



var scene, camera, renderer, exporter, mesh, points, dot;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);      // Settings for the Camera
    camera.position.set(200, 100, 200);     // Camera Position
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);       // Background Color
    //scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);     // Creating the Fog for the Scene

    //
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);  // Settings for the Hemisphere-Light
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff);  // Setting for the direct Light for the Object
    directionalLight.position.set(0, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top = 180;
    directionalLight.shadow.camera.bottom = - 100;
    directionalLight.shadow.camera.left = - 120;
    directionalLight.shadow.camera.right = 120;
    scene.add(directionalLight);
    // ground
    var ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })); // Adding the Objects to the Ground
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);              // Adding the Scene
    var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    //var particles = 20; // The Count of the Particles
    var geometry = new THREE.BufferGeometry();
    //var positions = [];
    var colors = [];
    //var color = new THREE.Color();
    //var n = 1000, n2 = n / 2; // particles spread in the cube
    //for ( var i = 0; i < particles; i ++ ) {
    // positions

    //var x = Math.random() * n - n2; // till now, they are random 
    //var y = Math.random() * n - n2;
    //var z = Math.random() * n - n2;
    //positions.push( x, y, z );
    //colors
    //var vx = ( x / n ) + 0.5; // Colors for the particles
    //var vy = ( y / n ) + 0.5;
    // var vz = ( z / n ) + 0.5;
    //color.setRGB( vx, vy, vz );
    //colors.push( color.r, color.g, color.b );
    //}
    //geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    //geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    //geometry.computeBoundingSphere();

    // var vertices = new Float32Array([ 
    //    -1.0, -1.0,  1.0,
    //     1.0, -1.0,  1.0,
    //     1.0,  1.0,  1.0,

    //     1.0,  1.0,  1.0,
    //    -1.0,  1.0,  1.0,
    //    -1.0, -1.0,  1.0,

    //     5.0,  1.0,  1.0,
    //     -1.0,  2.0,  1.0,
    //     -1.0, -1.0,  3.0
    //         ]);
    //let x_array=new Float32Array([-10,-5,20,10,4,5,6]);
    var KOO = new kacke;

    let x_array = RealCoordinates;
    let y_array = new Float32Array([0, 15, 15, 0, 5, 5]);
    let z_array = new Float32Array([0, 0, 0, 0, 4, 2]);


    //This loop re_create yours three.Vector3;
    var array_of_threejs_points = new THREE.Geometry();
    var pointCloud = new THREE.Points(array_of_threejs_points, tmaterial);
    let i = 0;
    for (i = 0; i < x_array.length; i++) {
        array_of_threejs_points.vertices.push(new THREE.Vector3(x_array[i], y_array[i], z_array[i]));
    }
    var tmaterial = new THREE.PointsMaterial({
        color: 0xff0000,
        size: 5,
        opacity: 1
    });

    // var tgeometry = new THREE.Geometry();
    // var pointCloud = new THREE.Points(tgeometry, tmaterial);

    // for(var k = 0; k< 1000; k++) {
    //   var  x = (Math.random() * 200) - 100;
    //    var y = (Math.random() * 200) - 100;
    //    var z = (Math.random() * 200) - 100;
    //     tgeometry.vertices.push(new THREE.Vector3(x, y, z));
    // }
    array_of_threejs_points.verticesNeedUpdate = true;
    array_of_threejs_points.computeVertexNormals();

    scene.add(pointCloud);



    renderer = new THREE.WebGLRenderer({ antialias: true });                // Rendering
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    //
    var controls = new OrbitControls(camera, renderer.domElement); // Settings for Controlling the Object
    controls.target.set(0, 25, 0);
    controls.update();
    //
    window.addEventListener('resize', onWindowResize, false); // To Relocate the Object

}
function onWindowResize() {                                     // Keep the Shape of the Objects in the Window
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
