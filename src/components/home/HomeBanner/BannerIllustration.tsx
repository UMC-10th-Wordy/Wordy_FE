import { motion } from 'framer-motion'
import { EASE_SPRING } from './constants'
import imgVector from '@/assets/images/banner/vector.svg'
import imgEllipse122 from '@/assets/images/banner/ellipse122.svg'
import imgVector1 from '@/assets/images/banner/vector1.svg'
import imgFlower1 from '@/assets/images/banner/flower1.svg'
import imgFlower2 from '@/assets/images/banner/flower2.svg'
import imgCharacter from '@/assets/images/banner/character.svg'
import imgVector3 from '@/assets/images/banner/vector3.svg'
import imgFlowerR1 from '@/assets/images/banner/flower_r1.svg'
import imgFlowerR2 from '@/assets/images/banner/flower_r2.svg'
import imgFlowerR3 from '@/assets/images/banner/flower_r3.svg'
import imgFlowerR4 from '@/assets/images/banner/flower_r4.svg'
import imgFlowerR5 from '@/assets/images/banner/flower_r5.svg'
import imgFlowerR6 from '@/assets/images/banner/flower_r6.svg'

const EASE_SPRING_LINEAR: [typeof EASE_SPRING, 'linear'] = [EASE_SPRING, 'linear']
const EASE_BOUNCE: [number, number, number, number] = [0.07, 0.97, 0.58, 1]

// 피그마 원본 캔버스
const W = 1172
const H = 339

// inset % (top, right, bottom, left) → SVG x/y/width/height
function inset(t: number, r: number, b: number, l: number) {
  const x = (l / 100) * W
  const y = (t / 100) * H
  return {
    x,
    y,
    width: W * (1 - l / 100 - r / 100),
    height: H * (1 - t / 100 - b / 100),
  }
}

// 각 요소의 중심 좌표 (transformOrigin용)
function cx(t: number, r: number, b: number, l: number) {
  const { x, y, width, height } = inset(t, r, b, l)
  return { cx: x + width / 2, cy: y + height / 2 }
}

export function BannerIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMaxYMax meet"
      className={className}
      style={{ width: `${W}px`, height: `${H}px` }}
    >
      {/* ── Vector: 배경 짙은 언덕 (y: 0→22) ── */}
      {(() => {
        const r = inset(19.47, 0, 8.26, 53.5)
        return (
          <motion.image
            href={imgVector}
            {...r}
            initial={{ y: 0 }}
            animate={{ y: [0, 22, 22] }}
            transition={{
              duration: 2,
              times: [0, 0.3959, 1],
              ease: EASE_SPRING_LINEAR,
            }}
          />
        )
      })()}

      {/* ── Group 30: 좌측 언덕+꽃 (x: 0→-21) ── */}
      {/* 모든 자식이 캔버스 기준 절대좌표이므로 motion.g로 x이동만 */}
      <motion.g
        initial={{ x: 0 }}
        animate={{ x: [0, -21, -21] }}
        transition={{ duration: 2, times: [0, 0.3959, 1], ease: EASE_SPRING_LINEAR }}
      >
        {/* Ellipse122: 절대 px (피그마 코드: h-[144px] left-0 top-[196px] w-[718.265px]) */}
        <image href={imgEllipse122} x={0} y={196} width={718.265} height={144} />

        {/* Vector_2: inset [72.42% 57.61% 15.21% 17.15%] 캔버스 기준 */}
        <image href={imgVector1} {...inset(72.42, 57.61, 15.21, 17.15)} />

        {/* 꽃1 (1778:42177): inset [80.24% 84.4% 7.59% 11.94%] 캔버스 기준, rotate -21→3→-5→0 */}
        {(() => {
          const r = inset(80.24, 84.4, 7.59, 11.94)
          const { cx: ox, cy: oy } = cx(80.24, 84.4, 7.59, 11.94)
          return (
            <motion.g
              style={{ transformOrigin: `${ox}px ${oy}px` }}
              initial={{ rotate: -21 }}
              animate={{ rotate: [-21, -21, 3, -5, -5, 0, 0] }}
              transition={{
                duration: 2,
                times: [0, 0.1436, 0.2342, 0.2795, 0.2807, 0.326, 1],
                ease: 'linear',
              }}
            >
              <image href={imgFlower1} {...r} />
            </motion.g>
          )
        })()}

        {/* 꽃2 (1778:42198): inset [80.24% 71.61% -6.99% 20.56%] 캔버스 기준, rotate -44→-14→-24→-18 */}
        {(() => {
          const r = inset(80.24, 71.61, -6.99, 20.56)
          const { cx: ox, cy: oy } = cx(80.24, 71.61, -6.99, 20.56)
          return (
            <motion.g
              style={{ transformOrigin: `${ox}px ${oy}px` }}
              initial={{ rotate: -44 }}
              animate={{ rotate: [-44, -44, -14, -24, -18, -18] }}
              transition={{
                duration: 2,
                times: [0, 0.1156, 0.207, 0.2527, 0.2983, 1],
                ease: 'linear',
              }}
            >
              <image href={imgFlower2} {...r} />
            </motion.g>
          )
        })()}
      </motion.g>

      {/* ── Group 29: 캐릭터 (opacity+rotate+scale+y) ── */}
      {(() => {
        const r = inset(27.14, 11.83, 12.68, 65.19)
        const { cx: ox, cy: oy } = cx(27.14, 11.83, 12.68, 65.19)
        return (
          <motion.g
            style={{ transformOrigin: `${ox}px ${oy}px` }}
            initial={{ opacity: 0, rotate: -90, scale: 0.8, y: 116 }}
            animate={{
              opacity: [0, 0, 1, 1],
              rotate: [-90, -90, 0, 0],
              scale: [0.8, 0.8, 1, 1],
              y: [116, 116, 0, 0],
            }}
            transition={{
              opacity: {
                duration: 2,
                times: [0, 0.1156, 0.1436, 1],
                ease: ['linear', [0.5, 0, 0.5, 1] as never, 'linear'],
              },
              rotate: {
                duration: 2,
                times: [0, 0.1156, 0.3959, 1],
                ease: ['linear', EASE_BOUNCE as never, 'linear'],
              },
              scale: {
                duration: 2,
                times: [0, 0.1156, 0.3959, 1],
                ease: ['linear', EASE_BOUNCE as never, 'linear'],
              },
              y: {
                duration: 2,
                times: [0, 0.1156, 0.3959, 1],
                ease: ['linear', EASE_BOUNCE as never, 'linear'],
              },
            }}
          >
            <image href={imgCharacter} {...r} />
          </motion.g>
        )
      })()}

      {/* ── Group 31: 우측 언덕+꽃 (x: 0→+30.01) ── */}
      {/* 자식들도 캔버스 기준 절대좌표 */}
      <motion.g
        initial={{ x: 0 }}
        animate={{ x: [0, 30.01, 30.01] }}
        transition={{ duration: 2, times: [0, 0.3959, 1], ease: EASE_SPRING_LINEAR }}
      >
        {/* 우측 언덕 배경: inset [20.11% 0 0 53.5%] */}
        <image href={imgVector3} {...inset(20.11, 0, 0, 53.5)} />

        {/* 꽃 R1 (1778:42259): inset [46.61% 2.06% 29.8% 91.72%] */}
        {(() => {
          const r = inset(46.61, 2.06, 29.8, 91.72)
          const { cx: ox, cy: oy } = cx(46.61, 2.06, 29.8, 91.72)
          return (
            <motion.g
              style={{ transformOrigin: `${ox}px ${oy}px` }}
              initial={{ rotate: 24 }}
              animate={{ rotate: [24, 24, -6, 6, 0, 0] }}
              transition={{
                duration: 2,
                times: [0, 0.1447, 0.2346, 0.2795, 0.3245, 1],
                ease: 'linear',
              }}
            >
              <image href={imgFlowerR1} {...r} />
            </motion.g>
          )
        })()}

        {/* 꽃 R2 (1778:42280): inset [80.06% 36.81% 4.97% 58.69%] */}
        {(() => {
          const r = inset(80.06, 36.81, 4.97, 58.69)
          const { cx: ox, cy: oy } = cx(80.06, 36.81, 4.97, 58.69)
          return (
            <motion.g
              style={{ transformOrigin: `${ox}px ${oy}px` }}
              initial={{ rotate: 21 }}
              animate={{ rotate: [21, 21, -4, -4, 6, 6, 0, 0] }}
              transition={{
                duration: 2,
                times: [0, 0.1008, 0.1908, 0.1919, 0.2368, 0.238, 0.2829, 1],
                ease: 'linear',
              }}
            >
              <image href={imgFlowerR2} {...r} />
            </motion.g>
          )
        })()}

        {/* 꽃 R3 (1778:42301): inset [84.66% 26.32% 3.16% 69.97%] */}
        {(() => {
          const r = inset(84.66, 26.32, 3.16, 69.97)
          const { cx: ox, cy: oy } = cx(84.66, 26.32, 3.16, 69.97)
          return (
            <motion.g
              style={{ transformOrigin: `${ox}px ${oy}px` }}
              initial={{ rotate: 21 }}
              animate={{ rotate: [21, 21, 20.781, 9.461, 1.595, 2.038, 0, 0] }}
              transition={{
                duration: 2,
                times: [0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 1],
                ease: 'linear',
              }}
            >
              <image href={imgFlowerR3} {...r} />
            </motion.g>
          )
        })()}

        {/* 꽃 R4 (1778:42319): inset [24.48% 0.48% 63% 95.82%] */}
        {(() => {
          const r = inset(24.48, 0.48, 63, 95.82)
          const { cx: ox, cy: oy } = cx(24.48, 0.48, 63, 95.82)
          return (
            <motion.g
              style={{ transformOrigin: `${ox}px ${oy}px` }}
              initial={{ rotate: 21 }}
              animate={{ rotate: [21, 21, 16.739, -0.232, 5.955, 0, 0] }}
              transition={{ duration: 2, times: [0, 0.1, 0.15, 0.2, 0.25, 0.3, 1], ease: 'linear' }}
            >
              <image href={imgFlowerR4} {...r} />
            </motion.g>
          )
        })()}

        {/* 꽃 R5 (1778:42337): inset [65.06% 14.5% 23.56% 82.1%] */}
        {(() => {
          const r = inset(65.06, 14.5, 23.56, 82.1)
          const { cx: ox, cy: oy } = cx(65.06, 14.5, 23.56, 82.1)
          return (
            <motion.g
              style={{ transformOrigin: `${ox}px ${oy}px` }}
              initial={{ rotate: 21 }}
              animate={{ rotate: [21, 21, 17.303, 0.802, 5.816, 0.003, 0, 0] }}
              transition={{
                duration: 2,
                times: [0, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 1],
                ease: 'linear',
              }}
            >
              <image href={imgFlowerR5} {...r} />
            </motion.g>
          )
        })()}

        {/* 꽃 R6 (1778:42358): inset [80.97% 6.57% 7.64% 90.03%] */}
        {(() => {
          const r = inset(80.97, 6.57, 7.64, 90.03)
          const { cx: ox, cy: oy } = cx(80.97, 6.57, 7.64, 90.03)
          return (
            <motion.g
              style={{ transformOrigin: `${ox}px ${oy}px` }}
              initial={{ rotate: 21 }}
              animate={{ rotate: [21, 21, 20.947, 10.564, 0.681, 2.541, 0, 0] }}
              transition={{
                duration: 2,
                times: [0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 1],
                ease: 'linear',
              }}
            >
              <image href={imgFlowerR6} {...r} />
            </motion.g>
          )
        })()}
      </motion.g>
    </svg>
  )
}
