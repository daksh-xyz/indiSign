import React, {
    useEffect,
    useImperativeHandle,
    useRef,
    forwardRef,
  } from 'react';
  import { useGLTF, useAnimations } from '@react-three/drei/native';
  import { useFrame } from '@react-three/fiber/native';
  import * as THREE from 'three';
  import * as Alphabet from '@/Animations/alphabets'; // Adjust path as needed
  import defaultPose from '@/Animations/defaultPose';
  
  export type BoneAnimation = [
    string,
    'rotation' | 'position',
    'x' | 'y' | 'z',
    number,
    '+' | '-'
  ];
  
  export type ModelHandle = {
    bones: Record<string, THREE.Bone>;
    pushAnimation: (anim: BoneAnimation[]) => void;
  };
  
  type ModelProps = {
    submittedText: string;
  };
  
  export const Model2 = forwardRef<ModelHandle, ModelProps>(
    ({ submittedText, ...props }, ref) => {
      const group = useRef<THREE.Group>(null);
      // Adjust GLTF loading as needed (or use expo-asset)
      const { nodes, materials, animations } = useGLTF(
        require('../assets/xbot.glb')
      ) as any;
      const { actions } = useAnimations(animations, group);
  
      // Store bones in a ref so they persist across renders.
      const bones = useRef<Record<string, THREE.Bone>>({});
      // Animation queue stored in a ref to avoid re-renders.
      const animationsQueue = useRef<BoneAnimation[][]>([]);
      // A flag can be added if you need to temporarily pause processing.
      const pending = useRef<boolean>(false);
  
      // Define a speed value (adjust as needed).
      const speed = 0.025;

      const isLetter = (c: string) => {
        return c.toLowerCase() !== c.toUpperCase();
      }
  
      // Extract bones from the loaded scene.
      useEffect(() => {
        if (!group.current) return;
        group.current.traverse((obj) => {
          if (obj.type === 'Bone') {
            bones.current[obj.name] = obj as THREE.Bone;
          }
        });
      }, []);
  
      // Process submittedText: if empty, execute defaultPose; else run alphabet animations.
      useEffect(() => {
        if (Object.keys(bones.current).length === 0) return;
  
        if (!submittedText || submittedText.length === 0) {
          defaultPose({
            bones: bones.current,
            animations: animationsQueue.current,
            pending: pending.current,
            animate: () => {},
          });
          return;
        }
  
        let index = 0;
        const runNext = () => {
          if (index >= submittedText.length) return;
          const char = submittedText[index].toUpperCase();
          if (isLetter(char)){
            const animateFunc = Alphabet[char];
            if (typeof animateFunc === 'function') {
              animateFunc({
                bones: bones.current,
                animations: animationsQueue.current,
                pending: pending.current,
                animate: () => {},
              });
            }
          }
          index++;
          setTimeout(runNext, isLetter(char) ? 800: 0); // 1 sec delay between letters
          
        };
        runNext();
      }, [submittedText]);
  
      // useFrame processes the animation queue on each frame.
      useFrame(() => {
        if (animationsQueue.current.length === 0) return;
  
        // Get the current animation set.
        const currentAnim = animationsQueue.current[0];
        if (!currentAnim.length) return;
  
        // Process each transformation instruction.
        // This code mimics your web version logic:
        for (let i = 0; i < currentAnim.length; ) {
          const [boneName, action, axis, limit, sign] = currentAnim[i];
          const bone = bones.current[boneName];
          if (!bone) {
            // Remove the instruction if the bone isn't found.
            currentAnim.splice(i, 1);
            continue;
          }
          // Get the current value.
          const currentVal = bone[action][axis];
          if (sign === '+' && currentVal < limit) {
            bone[action][axis] += speed;
            bone[action][axis] = Math.min(bone[action][axis], limit);
            i++;
          } else if (sign === '-' && currentVal > limit) {
            bone[action][axis] -= speed;
            bone[action][axis] = Math.max(bone[action][axis], limit);
            i++;
          } else {
            // When the transformation reaches the limit, remove the instruction.
            currentAnim.splice(i, 1);
          }
        }
  
        // If the current animation set is empty, remove it from the queue.
        if (currentAnim.length === 0) {
          animationsQueue.current.shift();
        }
      });
  
      // Expose bones and a method to push animations.
      useImperativeHandle(ref, () => ({
        bones: bones.current,
        pushAnimation: (anim: BoneAnimation[]) => {
          animationsQueue.current.push(anim);
        },
      }));
  
      return (
        <group ref={group} dispose={null}>
          <group name="Scene">
            <group
              name="Armature"
              rotation={[Math.PI / 2, 0, 0]}
              position={[0,-8,0]}
              scale={0.06}
            >
              <skinnedMesh
                geometry={nodes.Alpha_Joints.geometry}
                material={materials.Alpha_Joints_MAT}
                skeleton={nodes.Alpha_Joints.skeleton}
              />
              <skinnedMesh
                geometry={nodes.Alpha_Surface.geometry}
                material={materials.Alpha_Body_MAT}
                skeleton={nodes.Alpha_Surface.skeleton}
              />
              <primitive object={nodes.mixamorigHips} />
            </group>
          </group>
        </group>
      );
    }
  );
  
  useGLTF.preload('../assets/xbot.glb');
  