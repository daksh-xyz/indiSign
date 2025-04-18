/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei/native'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder001: THREE.SkinnedMesh
    Cylinder001_1: THREE.SkinnedMesh
    Cylinder001_2: THREE.SkinnedMesh
    spine: THREE.Bone
    kneeikL: THREE.Bone
    heelikL: THREE.Bone
    coreik: THREE.Bone
    elbowIKL: THREE.Bone
    handIKL: THREE.Bone
    headTARGET: THREE.Bone
    kneeikR: THREE.Bone
    heelikR: THREE.Bone
    elbowIKR: THREE.Bone
    handIKR: THREE.Bone
  }
  materials: {
    ['Material.001']: THREE.MeshStandardMaterial
    Pant: THREE.MeshStandardMaterial
    Gold: THREE.MeshStandardMaterial
  }
}

type ActionName =
  | 'metarig|metarig|all'
  | 'metarig|metarig|Hello'
  | 'metarig|metarig|Nice to meet you'
  | 'metarig|metarig|same'
  | 'Sorry'
type GLTFActions = Record<ActionName, THREE.AnimationAction>

export function Model({ submittedText, ...props }: ModelProps) {
  const group = useRef<THREE.Group>();
  const { nodes, materials, animations } = useGLTF(require('../assets/Hope.glb')) as GLTFResult;
  const { actions } = useAnimations<GLTFActions>(animations, group);
  const lastAnimationRef = useRef<string | null>(null);

  useEffect(() => {
    console.log('Submitted text in Model:', submittedText);
  
    const fadeOutAndPlay = (newAnimationName: string) => {
      // Fade out the last played animation
      if (lastAnimationRef.current && actions[lastAnimationRef.current]) {
        actions[lastAnimationRef.current]?.fadeOut(0.5);
      }
  
      // Fade in and play the new animation
      if (actions[newAnimationName]) {
        actions[newAnimationName]?.reset().fadeIn(0.5).play();
      }
  
      // Update the last animation ref
      lastAnimationRef.current = newAnimationName;
    };
  
    if (submittedText?.includes('Hello') || submittedText?.includes("Hi")) {
      fadeOutAndPlay("metarig|metarig|Hello");
    } else if (submittedText?.includes('Same')) {
      fadeOutAndPlay("metarig|metarig|same");
    } else if (submittedText?.includes('all')) {
      fadeOutAndPlay("metarig|metarig|all");
    } else if (submittedText?.includes('Nice to meet you')) {
      fadeOutAndPlay("metarig|metarig|Nice to meet you");
    } else if (submittedText?.includes('Sorry')) {
      fadeOutAndPlay("Sorry");
    } else {
      // Stop all animations if no matching text is found
      Object.values(actions).forEach(action => action?.stop());
      lastAnimationRef.current = null; // Reset the last animation ref
    }
  }, [submittedText, actions]);
  
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene" >
        <group name="metarig" scale={7}  rotation={[0, Math.PI, 0]} >
          <group name="Body">
            <skinnedMesh
              name="Cylinder001"
              geometry={nodes.Cylinder001.geometry}
              material={materials['Material.001']}
              skeleton={nodes.Cylinder001.skeleton}
            />
            <skinnedMesh
              name="Cylinder001_1"
              geometry={nodes.Cylinder001_1.geometry}
              material={materials.Pant}
              skeleton={nodes.Cylinder001_1.skeleton}
            />
            <skinnedMesh
              name="Cylinder001_2"
              geometry={nodes.Cylinder001_2.geometry}
              material={materials.Gold}
              skeleton={nodes.Cylinder001_2.skeleton}
            />
          </group>
          <primitive object={nodes.spine} />
          <primitive object={nodes.kneeikL} />
          <primitive object={nodes.heelikL} />
          <primitive object={nodes.coreik} />
          <primitive object={nodes.elbowIKL} />
          <primitive object={nodes.handIKL} />
          <primitive object={nodes.headTARGET} />
          <primitive object={nodes.kneeikR} />
          <primitive object={nodes.heelikR} />
          <primitive object={nodes.elbowIKR} />
          <primitive object={nodes.handIKR} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('../assets/Hope.glb')
