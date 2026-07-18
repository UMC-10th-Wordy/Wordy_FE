import { motion } from 'framer-motion'

import armImage from '@/assets/images/performance-converting/arm.svg'
import bodyImage from '@/assets/images/performance-converting/body.svg'
import bookImage from '@/assets/images/performance-converting/book.svg'
import cupImage from '@/assets/images/performance-converting/cup.svg'
import deskImage from '@/assets/images/performance-converting/desk.svg'
import faceEyeLeftImage from '@/assets/images/performance-converting/face-eye-left.svg'
import faceEyeRightImage from '@/assets/images/performance-converting/face-eye-right.svg'
import faceMouthImage from '@/assets/images/performance-converting/face-mouth.svg'
import laptopImage from '@/assets/images/performance-converting/laptop.svg'
import pencilCupContentsImage from '@/assets/images/performance-converting/pencil-cup-contents.svg'
import pencilCupImage from '@/assets/images/performance-converting/pencil-cup.svg'
import plantImage from '@/assets/images/performance-converting/plant.svg'
import sparkle1Image from '@/assets/images/performance-converting/sparkle-1.svg'
import sparkle2Image from '@/assets/images/performance-converting/sparkle-2.svg'
import sparkle3Image from '@/assets/images/performance-converting/sparkle-3.svg'
import sparkle4Image from '@/assets/images/performance-converting/sparkle-4.svg'

const MOTION_DURATION = 2

const LOOP_TRANSITION = {
  duration: MOTION_DURATION,
  repeat: Infinity,
  repeatType: 'loop' as const,
}

interface AnimatedSparkleProps {
  src: string
  className: string
  times: number[]
}

const AnimatedSparkle = ({ src, className, times }: AnimatedSparkleProps) => {
  return (
    <motion.img
      src={src}
      alt=""
      className={`absolute ${className}`}
      initial={{
        opacity: 0,
        scale: 0,
        y: 20,
        rotate: 60,
      }}
      animate={{
        opacity: [0, 0, 1, 1, 0, 0],
        scale: [0, 0, 1, 1, 0.6, 0.6],
        y: [20, 20, 0, 0, 0, 0],
        rotate: [60, 60, 0, 0, 0, 0],
      }}
      transition={{
        ...LOOP_TRANSITION,
        times,
        ease: 'easeInOut',
      }}
      style={{
        transformOrigin: 'center',
      }}
    />
  )
}

export const PerformanceConvertingMotion = () => {
  return (
    <div aria-hidden className="relative h-[150px] w-[300px] shrink-0 overflow-hidden">
      {/* 몸통 */}
      <motion.img
        src={bodyImage}
        alt=""
        className="absolute left-[113.05px] top-[8.74px]"
        animate={{
          x: [0, 0, -0.28, -0.28, 0, 0],
          y: [0, 0, 3.8, 3.8, 0, 0],
          rotate: [0, 0, -3, -3, 0, 0],
        }}
        transition={{
          ...LOOP_TRANSITION,
          times: [0, 0.125, 0.4, 0.8, 0.9, 1],
          ease: 'easeInOut',
        }}
        style={{
          transformOrigin: 'center',
        }}
      />

      {/* 책상 */}
      <img src={deskImage} alt="" className="absolute left-0 top-[78.71px]" />

      {/* 식물 */}
      <img src={plantImage} alt="" className="absolute left-[40.1px] top-[33.4px]" />

      {/* 컵 */}
      <img src={cupImage} alt="" className="absolute left-[21.42px] top-[79.86px]" />

      {/* 노트북 */}
      <img src={laptopImage} alt="" className="absolute left-[66.28px] top-[50.86px]" />

      {/* 표정 전체 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, 0, -2.64, -2.64, 0, 0],
          y: [0, 0, -2.58, -2.58, 0, 0],
        }}
        transition={{
          ...LOOP_TRANSITION,
          times: [0, 0.125, 0.4, 0.8, 0.9, 1],
          ease: 'easeInOut',
        }}
      >
        {/* 왼쪽 눈 */}
        <motion.img
          src={faceEyeLeftImage}
          alt=""
          className="absolute left-[141.48px] top-[48.43px]"
          animate={{
            scaleY: [1, 1, 0.79, 0.79, 1, 1],
          }}
          transition={{
            ...LOOP_TRANSITION,
            times: [0, 0.125, 0.4, 0.8, 0.9, 1],
            ease: 'easeInOut',
          }}
          style={{
            transformOrigin: 'center',
          }}
        />

        {/* 오른쪽 눈 */}
        <img src={faceEyeRightImage} alt="" className="absolute left-[176.39px] top-[52.6px]" />

        {/* 입 */}
        <img src={faceMouthImage} alt="" className="absolute left-[151.66px] top-[62.08px]" />
      </motion.div>

      {/* 팔 */}
      <motion.img
        src={armImage}
        alt=""
        className="absolute left-[166.77px] top-[72.98px]"
        animate={{
          x: [0, -11, -12.11, -11, -12.11, -11, -12.11, -11, -12.11, 0],
          y: [0, -8, -3.14, -8, -3.14, -8, -3.14, -8, -3.14, 0],
          rotate: [0, 17.78, 5, 17.78, 5, 17.78, 5, 17.78, 5, 0],
        }}
        transition={{
          ...LOOP_TRANSITION,
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
          ease: [0.5, 0, 0.5, 1],
        }}
        style={{
          transformOrigin: 'center',
        }}
      />

      {/* 책 */}
      <img src={bookImage} alt="" className="absolute left-[220.27px] top-[80.73px]" />

      {/* 연필꽂이 */}
      <img src={pencilCupImage} alt="" className="absolute left-[198.39px] top-[86.44px]" />

      {/* 연필꽂이 내부 */}
      <img src={pencilCupContentsImage} alt="" className="absolute left-0 top-0" />

      {/* 별 3: 가장 먼저 등장하고 가장 먼저 퇴장 */}
      <AnimatedSparkle
        src={sparkle3Image}
        className="left-[95.37px] top-[29.46px]"
        times={[0, 0, 0.15, 0.594, 0.763, 1]}
      />

      {/* 별 2: 두 번째 등장하고 두 번째 퇴장 */}
      <AnimatedSparkle
        src={sparkle2Image}
        className="left-[68.42px] top-[7.22px]"
        times={[0, 0.06, 0.21, 0.663, 0.832, 1]}
      />

      {/* 별 1: 별 4와 동시에 등장하고 세 번째로 퇴장 */}
      <AnimatedSparkle
        src={sparkle1Image}
        className="left-[99.98px] top-0"
        times={[0, 0.176, 0.326, 0.763, 0.932, 1]}
      />

      {/* 별 4: 별 1과 동시에 등장하고 가장 마지막에 퇴장 */}
      <AnimatedSparkle
        src={sparkle4Image}
        className="left-[251.27px] top-[24.03px]"
        times={[0, 0.176, 0.326, 0.807, 0.976, 1]}
      />
    </div>
  )
}
