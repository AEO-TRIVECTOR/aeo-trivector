'use client'

import { useEffect, useRef } from 'react'

interface GravitationalLensingShaderProps {
  horizonY: number // Y position of event horizon (0-1, where 1 is bottom)
  horizonRadius: number // Radius of event horizon in viewport units
  strength?: number // Distortion strength multiplier (default 1.0)
  mouseX?: number // Mouse X position (0-1)
  mouseY?: number // Mouse Y position (0-1)
}

/**
 * Gravitational Lensing Shader
 * 
 * Applies a fragment shader that distorts the entire scene based on proximity
 * to the event horizon. Creates the visual effect of spacetime curvature.
 * 
 * Based on ChatGPT's recommendation:
 * "Make spacetime bend. Not metaphorically. Literally."
 * 
 * Shader applies distortion = 1 / distance_to_horizon to UV coordinates,
 * creating gravitational lensing effect where everything bends toward the singularity.
 */
export default function GravitationalLensingShader({
  horizonY,
  horizonRadius,
  strength = 1.0,
  mouseX = 0.5,
  mouseY = 0.5,
}: GravitationalLensingShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Initialize WebGL
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
    if (!gl) {
      console.error('WebGL not supported')
      return
    }
    glRef.current = gl

    // Vertex shader (simple passthrough)
    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    // Fragment shader (gravitational lensing distortion)
    const fragmentShaderSource = `
      precision highp float;
      
      varying vec2 v_uv;
      uniform vec2 u_horizonCenter; // Event horizon center (x, y)
      uniform float u_horizonRadius; // Event horizon radius
      uniform float u_strength; // Distortion strength
      uniform vec2 u_mouse; // Mouse position (for interactive distortion)
      uniform float u_time; // Time for subtle animation
      
      void main() {
        vec2 uv = v_uv;
        
        // Calculate distance from current pixel to event horizon center
        vec2 toHorizon = uv - u_horizonCenter;
        float dist = length(toHorizon);
        
        // Gravitational distortion: inverse square law
        // Stronger distortion closer to horizon
        float distortion = 0.0;
        
        if (dist < u_horizonRadius * 2.0) {
          // Inside gravitational influence zone
          float normalizedDist = dist / (u_horizonRadius * 2.0);
          
          // Inverse square distortion (gravity-like)
          distortion = u_strength * (1.0 / (normalizedDist * normalizedDist + 0.1) - 1.0);
          
          // Clamp to prevent extreme distortion
          distortion = clamp(distortion, 0.0, 2.0);
        }
        
        // Apply distortion: pull UV coordinates toward horizon
        vec2 distortedUV = uv - normalize(toHorizon) * distortion * 0.02;
        
        // Chromatic aberration near horizon (RGB channel separation)
        float chromaticStrength = distortion * 0.003;
        
        // Output distortion as color (will be used as displacement map)
        // R = distorted X offset
        // G = distorted Y offset  
        // B = chromatic aberration strength
        // A = overall distortion intensity
        
        vec2 offset = distortedUV - uv;
        
        gl_FragColor = vec4(
          offset.x * 10.0 + 0.5, // R: X displacement
          offset.y * 10.0 + 0.5, // G: Y displacement
          chromaticStrength * 100.0, // B: chromatic aberration
          distortion * 0.5 // A: intensity
        );
      }
    `

    // Compile shaders
    function compileShader(source: string, type: number): WebGLShader | null {
      const shader = gl.createShader(type)
      if (!shader) return null
      
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      
      return shader
    }

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER)
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER)
    
    if (!vertexShader || !fragmentShader) return

    // Link program
    const program = gl.createProgram()
    if (!program) return
    
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program))
      return
    }
    
    programRef.current = program
    gl.useProgram(program)

    // Create fullscreen quad
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ])
    
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
    
    const positionLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Get uniform locations
    const horizonCenterLocation = gl.getUniformLocation(program, 'u_horizonCenter')
    const horizonRadiusLocation = gl.getUniformLocation(program, 'u_horizonRadius')
    const strengthLocation = gl.getUniformLocation(program, 'u_strength')
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse')
    const timeLocation = gl.getUniformLocation(program, 'u_time')

    // Render loop
    let startTime = Date.now()
    
    function render() {
      if (!gl || !program) return
      
      const time = (Date.now() - startTime) / 1000
      
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      
      // Update uniforms
      gl.uniform2f(horizonCenterLocation, 0.5, horizonY)
      gl.uniform1f(horizonRadiusLocation, horizonRadius)
      gl.uniform1f(strengthLocation, strength)
      gl.uniform2f(mouseLocation, mouseX, mouseY)
      gl.uniform1f(timeLocation, time)
      
      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      
      animationFrameRef.current = requestAnimationFrame(render)
    }
    
    render()

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [horizonY, horizonRadius, strength, mouseX, mouseY])

  // Resize canvas to match window
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
        mixBlendMode: 'overlay', // Blend with scene below
        opacity: 0.6, // Subtle effect
      }}
    />
  )
}
