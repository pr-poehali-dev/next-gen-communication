import { useEffect, useState } from "react"
import { Warp } from "@paper-design/shaders-react"

export function LiquidMetalBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="absolute inset-0 -z-10 bg-[#08010f]" />
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Warp
        style={{ width: "100%", height: "100%" }}
        color1="hsla(270, 100%, 4%, 1)"
        color2="hsla(275, 80%, 22%, 1)"
        color3="hsla(290, 70%, 40%, 1)"
        scale={0.6}
        rotation={0}
        speed={0.12}
        proportion={0.3}
        softness={1}
        distortion={0.25}
        swirl={0.8}
        swirlIterations={10}
        shapeScale={0.08}
        shape={0}
      />
    </div>
  )
}