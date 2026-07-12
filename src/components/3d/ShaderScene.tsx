import { Canvas, extend, type Object3DNode, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useMemo, useEffect } from 'react';

// 1. Materiale pulito: rimosso uTime e uPointer, teniamo solo uResolution e uSeed
const ShadertoyGalaxyMaterial = shaderMaterial(
  { 
    uResolution: new THREE.Vector2(),
    uSeed: 0.0 
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform vec2 uResolution;
    uniform float uSeed;

    varying vec2 vUv;

    #define fxrand uSeed
    #define hash1 rnd(fxrand)
    #define hash2 rnd(fxrand+.111)
    #define hash3 rnd(fxrand+.222)
    #define hash4 rnd(fxrand+.333)
    #define hash5 rnd(fxrand+.444)
    #define hash8 rnd(fxrand+.777)
    #define hash10 rnd(fxrand+.997)
    #define hash12 rnd(fxrand+1.411777)

    float hash(vec2 p) {
        vec3 p3  = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }

    float noise(vec2 x) {
        vec2 i = floor(x);
        vec2 f = fract(x);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm (in vec2 p) {
        float value = 0.0;
        float freq = 1.0;
        float amp = .5;
        for (int i = 0; i < 8; i++) {
            value += amp * (noise((p - vec2(1.0)) * freq));
            freq *= 1.9;
            amp *= 0.6;
        }
        return value;
    }

    mat2 rot(float a) {
        float s=sin(a), c=cos(a);
        return mat2(c,s,-s,c);
    }

    float rnd(float p) {
        p*=1234.5678;
        p = fract(p * .1031);
        p *= p + 33.33;
        return fract(2.*p*p);
    }

    vec3 render(vec3 dir) {
        float s=0.3, fade=1., pa=0., sd=0.2;
        vec3 v=vec3(0.);
        dir.y+=4.*hash4;
        dir.x+=hash5;
        
        for (float r=0.; r<10.; r++) {
            vec3 p=s*dir;
            mat2 rt=rot(r);
            p.xz*=rt;
            p.xy*=rt;
            p.yz*=rt;
            p = abs(1.-mod(p*(hash1*2.+1.),2.));
            float pa,a=pa=0.;
            
            for (int i=0; i<10; i++) {
                p=abs(p)/dot(p,p)-.7-step(.5,hash10)*.1;
                float l=length(p)*.5;
                a+=abs(l-pa);
                pa=length(p);
            }
            fade*=.96;
            sd+=.5;
            float cv=abs(2.-mod(sd,4.));
            v+=normalize(vec3(cv*2.,cv*cv,cv*cv*cv))*pow(a*.02,2.)*fade;
            v.rb*=rot(hash3*3.);
            v=abs(v);
            pa=a;
            s+=.05;
        }
        float sta=v.x;
        vec3 roj=vec3(1.5,1.,.8);
        
        vec2 uvd = dir.xy;
        uvd.x*=sign(hash12-.5);
        uvd*=rot(radians(360.*hash8));
        uvd.y*=1.+(uvd.x+.5)*1.;
        v=pow(v,1.-.5*vec3(smoothstep(.5,0.,abs(uvd.y))));
        
        // Rimossa ogni dipendenza dal tempo per i colori
        v+=.04/(.1+abs(uvd.y*uvd.y))*roj*0.8;
        float core=smoothstep(.3,0.,length(uvd))*1.2;
        v+=core*roj;
        v=mix(vec3(length(v)*.7),v,.45);
        float neb=fbm(dir.xy*15.)-.5;
        uvd.y+=neb*.3;
        neb=pow(smoothstep(.8,.0,abs(uvd.y)),2.)*.9;
        v=mix(v*vec3(1.,.9,1.2),vec3(0.),max(neb,.7-neb)+core*.06-sta*.1);
        return pow(v,vec3(1.05))*1.2;
    }

    void main() {
        vec2 uv = vUv - 0.5;
        uv.x *= uResolution.x / uResolution.y;
        
        vec3 dir = normalize(vec3(uv, 1.0));
        vec3 col = render(dir);
        gl_FragColor = vec4(col, 1.0);
    }
  `
);

extend({ ShadertoyGalaxyMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    shadertoyGalaxyMaterial: Object3DNode<any, typeof ShadertoyGalaxyMaterial>;
  }
}

const Scene = () => {
  const materialRef = useRef<any>(null);
  // Estraiamo size per la risoluzione e invalidate per forzare un render
  const { viewport, size, invalidate } = useThree();
  
  const randomSeed = useMemo(() => Math.random() * 100.0, []);

  // Usiamo useEffect invece di useFrame. 
  // Questo codice gira SOLO al montaggio o se la finestra cambia dimensione.
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uResolution.set(size.width, size.height);
      materialRef.current.uSeed = randomSeed;
      
      // Diciamo a Three.js: "Fai un singolo render adesso"
      invalidate(); 
    }
  }, [size, randomSeed, invalidate]);

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shadertoyGalaxyMaterial ref={materialRef} />
    </mesh>
  );
};

export default function ShaderCanvas() {
  return (
    <div className="h-screen w-full bg-[#050505] absolute inset-0 -z-10">
      {/* LA MAGIA È QUI: frameloop="demand" disattiva il render loop continuo */}
      <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]} frameloop="demand">
        <Scene />
      </Canvas>
    </div>
  );
}