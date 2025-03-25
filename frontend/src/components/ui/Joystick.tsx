import { useState, useRef, useEffect } from "react";

/**
 * JOYSTICK COMPONENT
 */

const Joystick = () => {
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const joystickRef = useRef<HTMLDivElement>(null);

  // Add useEffect for camera movement
  useEffect(() => {
    const moveCamera = () => {
      if (!window.threeJsCamera) return;

      if (active) {
        window.threeJsCamera.position.x += position.x * 0.1;
        window.threeJsCamera.position.z += position.y * 0.1;
      }

      requestAnimationFrame(moveCamera);
    };

    moveCamera();
  }, [active, position]);

  // joystick movement logic
  const handleMove = (
    e: React.MouseEvent<HTMLDivElement> | { clientX: number; clientY: number }
  ) => {
    if (!active || !joystickRef.current) return;

    // calculate joystick position relative to center of canvas
    const rect = joystickRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    // Negate y since browser +y is down but WebGL +y is up
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // limit joystick movement to a circle of radius 1
    const length = Math.sqrt(x * x + y * y);
    const normalizedX = length > 1 ? x / length : x;
    const normalizedY = length > 1 ? y / length : y;

    setPosition({ x: normalizedX, y: normalizedY });
  };

  return (
    <div
      ref={joystickRef}
      className="fixed bottom-8 left-8 w-24 h-24 rounded-full bg-black/30 backdrop-blur-sm z-50"
      onMouseDown={() => setActive(true)} // Start tracking when mouse pressed
      onMouseUp={() => setActive(false)} // Stop tracking when mouse released
      onMouseLeave={() => setActive(false)} // Stop if mouse leaves joystick
      onMouseMove={handleMove} // Track mouse position while active
      // Touch events for mobile support
      onTouchStart={() => setActive(true)} // Start on touch
      onTouchEnd={() => setActive(false)} // End on touch release
      onTouchMove={(e) => {
        // Convert touch position to mouse-like coordinates
        handleMove({
          clientX: e.touches[0].clientX, // X position of first touch
          clientY: e.touches[0].clientY, // Y position of first touch
        });
      }}
    >
      <div
        className="absolute w-12 h-12 rounded-full bg-white/80"
        style={{
          transform: `translate(${position.x * 30}px, ${position.y * 30}px)`,
          left: `calc(50% - 24px)`, // Centers the joystick knob horizontally by offsetting half its width (24px)
          top: `calc(50% - 24px)`, // Centers the joystick knob vertically by offsetting half its height (24px)
          transition: active ? `none` : `transform 0.2s ease-out`,
        }}
      />
    </div>
  );
};

export default Joystick;
