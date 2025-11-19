import Spline from '@splinetool/react-spline'

export default function Hero3D() {
  return (
    <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur">
      <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent" />
    </div>
  )
}
