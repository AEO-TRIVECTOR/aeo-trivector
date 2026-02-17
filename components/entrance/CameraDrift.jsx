'use client'

import { useFrame, useThree } from '@react-three/fiber'

/**
 * CameraDrift Component
 * 
 * Metric-synchronized camera worldline drift.
 * Subtle parallax motion without jarring the user.
 */
export function CameraDrift({ metricState }) {
  const { camera } = useThree()

  useFrame(() => {
    if (!metricState?.current) return

    const metric = metricState.current
    
    // Apply subtle camera offset (observer worldline drift)
    camera.position.x = metric.cameraOffset.x
    camera.position.y = metric.cameraOffset.y
    
    // Look at origin (black hole center)
    camera.lookAt(0, 0, 0)
  })

  return null
}
