import * as THREE from 'three';

import './global.css'
import styles from './styles/App.module.css'
import leftside from './styles/LeftSide.module.css'
import rightside from './styles/RightSide.module.css'

import { useEffect, useState, useRef, ChangeEvent } from "react";

type TipoGeometria = "esfera" | "cubo" | "cone" | "cilindro" | "piramide";
type TipoCamera = "perspective" | "ortho";

export function App() {
  const [rotX, setRotX] = useState(0)
  const [rotY, setRotY] = useState(0)
  const [rotZ, setRotZ] = useState(0)

  const [traX, setTraX] = useState(0)
  const [traY, setTraY] = useState(0)
  const [traZ, setTraZ] = useState(0)

  const [scaX, setScaX] = useState(1)
  const [scaY, setScaY] = useState(1)
  const [scaZ, setScaZ] = useState(1)

  const [camX, setCamX] = useState(0)
  const [camY, setCamY] = useState(0)
  const [camZ, setCamZ] = useState(5)

  const [cX, setCX] = useState(0)
  const [cY, setCY] = useState(0)
  const [cZ, setCZ] = useState(0)

  const [fov, setFov] = useState(45)
  const [aspect, setAspect] = useState(1)

  const [near, setNear] = useState(0.1)
  const [far, setFar] = useState(1000)

  const [left, setLeft] = useState(-1)
  const [right, setRight] = useState(1)
  const [bottom, setBottom] = useState(-1)
  const [top, setTop] = useState(1)

  const [matrix, setMatrix] = useState<THREE.Matrix4>(new THREE.Matrix4)
  const [updateMatrix, setUpdateMatrix] = useState(true)

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tipoGeometria, setTipoGeometria] = useState<TipoGeometria>("cubo");
  const [projection, setProjection] = useState<TipoCamera>("perspective");

  
  useEffect(() => {
    const canvas = canvasRef.current!;
    const renderizador = new THREE.WebGLRenderer({ canvas });
    
    const cena = new THREE.Scene();   
    
    let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
    switch (projection) {
      case "ortho":
        camera = new THREE.OrthographicCamera(
          -2 / 2,
          2 / 2,
          (2/aspect) / 2,
          -(2/aspect) / 2,
          0.1,
          1000
        );
        break;
      default:
        camera = new THREE.PerspectiveCamera(
          75,
          canvas.clientWidth / canvas.clientHeight,
          0.1,
          1000
      );
      break;
    }

    let geometria: THREE.BufferGeometry;
    switch (tipoGeometria) {
      case "esfera":
        geometria = new THREE.SphereGeometry();
        break;
      case "cone":
        geometria = new THREE.ConeGeometry();
        break;
      case "cilindro":
        geometria = new THREE.CylinderGeometry();
        break;
      case "piramide":
        geometria = new THREE.TetrahedronGeometry();
        break;
      default:
        geometria = new THREE.BoxGeometry();
        break;
    }

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const malha = new THREE.Mesh(geometria, material);

    malha.rotateX(rotX)
    malha.rotateY(rotY)
    malha.rotateZ(rotZ)

    malha.translateX(traX)
    malha.translateY(traY)
    malha.translateZ(traZ)

    malha.scale.setX(scaX)
    malha.scale.setY(scaY)
    malha.scale.setZ(scaZ)

    // setMatrix(malha.matrix)

    if(updateMatrix) {
      malha.updateMatrixWorld()
      setMatrix(malha.matrix)
      setUpdateMatrix(false)
    }

    cena.add(malha);

    camera.position.x = camX
    camera.position.y = camY
    camera.position.z = camZ

    camera.rotation.set(cX, cY, cZ)

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov
      camera.aspect = aspect
    }
  
    if(camera instanceof THREE.OrthographicCamera) {
      camera.left = left
      camera.right = right
      camera.top = top
      camera.bottom = bottom
    }

    camera.near = near
    camera.far = far

    camera.updateProjectionMatrix();

    // function animate() {
    //   requestAnimationFrame(animate);
    //   malha.rotation.x += 0.01;
    //   malha.rotation.y += 0.01;
    // }
    renderizador.render(cena, camera);

    // animate();
  }, [
    tipoGeometria, 
    rotX, rotY, rotZ, 
    traX, traY, traZ, 
    scaX, scaY, scaZ, 
    camX, camY, camZ, 
    cX, cY, cZ,
    fov, aspect, near, far,
    projection,
    left, right, top, bottom,
    updateMatrix
  ]);
  
  function handleObject(evento: ChangeEvent<HTMLSelectElement>) {
    setTipoGeometria(evento.target.value as TipoGeometria);
  }

  function handleProjection(evento: ChangeEvent<HTMLSelectElement>) {
    setProjection(evento.target.value as TipoCamera)
  }

  function handleUpdate() {
    setUpdateMatrix(true)
  }

  return (
    <div className={styles.container}>
      <div className={leftside.left}>
        <div className={leftside.objContainer}>
          <h2>Objetos</h2>
          <div>
            <select value={tipoGeometria} onChange={handleObject}>
              <option value="cubo">Cubo</option>
              <option value="esfera">Esfera</option>
              <option value="cone">Cone</option>
              <option value="cilindro">Cilindro</option>
              <option value="piramide">Pirâmide</option>
            </select>
          </div>
        </div>

        <div className={leftside.box3d}>
          <h2>Rotação</h2>
          <div>
            <div>
              <label>x:</label>
              <input 
                type="number"
                value={rotX}
                onChange={(e) => setRotX(Number(e.target.value))}
              />
            </div>
            <div>
              <label>y:</label>
              <input 
                type="number"
                value={rotY}
                onChange={(e) => setRotY(Number(e.target.value))}
              />
            </div>
            <div>
              <label>z:</label>
              <input 
                type="number"
                value={rotZ}
                onChange={(e) => setRotZ(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className={leftside.box3d}>
          <h2>Translação</h2>
          <div>
          <div>
              <label>x:</label>
              <input 
                type="number"
                value={traX}
                onChange={(e) => setTraX(Number(e.target.value))}
              />
            </div>
            <div>
              <label>y:</label>
              <input 
                type="number"
                value={traY}
                onChange={(e) => setTraY(Number(e.target.value))}
              />
            </div>
            <div>
              <label>z:</label>
              <input 
                type="number"
                value={traZ}
                onChange={(e) => setTraZ(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className={leftside.box3d}>
          <h2>Escalonamento</h2>
          <div>
          <div>
              <label>x:</label>
              <input 
                type="number"
                value={scaX}
                onChange={(e) => setScaX(Number(e.target.value))}
              />
            </div>
            <div>
              <label>y:</label>
              <input 
                type="number"
                value={scaY}
                onChange={(e) => setScaY(Number(e.target.value))}
              />
            </div>
            <div>
              <label>z:</label>
              <input 
                type="number"
                value={scaZ}
                onChange={(e) => setScaZ(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="main">
        <canvas ref={canvasRef} />
        <div className={styles.matrix}>
          
          <div>
            <h3>Matriz Atual</h3>
            <button onClick={handleUpdate}>Atualizar</button>
          </div>
          
         <div>
          {matrix.elements.map((value, _i) => {
            if((_i+1) % 4 === 0) {
              return value + ' | '
            } else {
              return value + ' '
            }
          })}
         </div>
        </div>
      </div>
      <div className={rightside.right}>
        <div className={rightside.cameraContainer}>
          <h2>Câmera</h2>

          <div className={rightside.box3d}>
            <div>
              <label>x</label>
              <input 
                type="number" 
                value={camX}
                onChange={(e) => setCamX(Number(e.target.value))}
              />
            </div>
            <div>
              <label>y</label>
              <input 
                type="number" 
                value={camY}
                onChange={(e) => setCamY(Number(e.target.value))}
              />
            </div>
            <div>
              <label>z</label>
              <input 
                type="number" 
                value={camZ}
                onChange={(e) => setCamZ(Number(e.target.value))}
              />
            </div>
          </div>

          <div className={rightside.box3d}>
            <div>
              <label>cx</label>
              <input 
                type="number" 
                value={cX}
                onChange={(e) => setCX(Number(e.target.value))}
              />
            </div>
            <div>
              <label>cy</label>
              <input 
                type="number" 
                value={cY}
                onChange={(e) => setCY(Number(e.target.value))}
              />
            </div>
            <div>
              <label>cz</label>
              <input 
                type="number" 
                value={cZ}
                onChange={(e) => setCZ(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
          
        <div className={rightside.fov}>
          <label>FOV</label>
          <input 
            type="number" 
            value={fov}
            onChange={(e) => setFov(Number(e.target.value))}
          />
        </div>

        <div className={rightside.ra}>
          <label>RA</label>
          <input 
            type="number" 
            value={aspect}
            onChange={(e) => setAspect(Number(e.target.value))}
            step={0.1}
          />
        </div>

        <div className={rightside.nearFar}>
          <div>
            <label>Near</label>
            <input 
              type="number" 
              value={near}
              onChange={(e) => setNear(Number(e.target.value))}
              step={0.1}
            />
          </div>
          <div>
            <label>Far</label>
            <input 
              type="number" 
              value={far}
                onChange={(e) => setFar(Number(e.target.value))}
            />
          </div>
        </div>

        <div className={rightside.projectionType}>
          <h2>Tipo de Projeção</h2>
          <select value={projection} onChange={handleProjection}>
            <option value="perspective">Perspectiva</option>
            <option value="ortho">Ortho</option>
          </select>
        </div>

        <div className={rightside.xyContainer}>
          <div>
            <div>
              <label>Xmin</label>
              <input 
                type="number"
                disabled={projection != 'ortho'}
                value={left}
                onChange={(e) => setLeft(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Xmax</label>
              <input 
                type="number"
                disabled={projection != 'ortho'}
                value={right}
                onChange={(e) => setRight(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <div>
              <label>Ymin</label>
              <input 
                type="number"
                disabled={projection != 'ortho'}
                value={bottom}
                onChange={(e) => setBottom(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Ymax</label>
              <input 
                type="number"
                disabled={projection != 'ortho'}
                value={top}
                onChange={(e) => setTop(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

