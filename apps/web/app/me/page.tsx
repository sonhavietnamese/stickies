'use client'
import { DUMMY_IMAGE } from '@/constants'
import { createMask, loadImage } from '@/lib/utils'
import { useEffect, useState } from 'react'
import Draggable from 'react-draggable'

export default function Page() {
  const [mask, setMask] = useState<string | null>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    const handle = async () => {
      const image = await loadImage(`data:image/jpeg;base64,${DUMMY_IMAGE}`)
      setImage(image)

      const mask = createMask(image, 20).toDataURL()
      setMask(mask)
    }

    handle()
  }, [])

  return (
    <main className={'min-h-screen bg-pink-300'}>
      {mask && image && (
        <Draggable scale={0.25}>
          <div
            style={{
              width: `${image.width + 21 * 2}px`,
              height: `${image.height + 21 * 2}px`,
              userSelect: 'none',

              scale: '0.25',
            }}>
            <div
              className={'relative h-full w-full'}
              style={{
                maskSize: 'cover',
                maskImage: `url(${mask})`,
                maskMode: 'alpha',
              }}>
              <div className={'gradient h-full w-full'} style={{}} />
              <img
                draggable={false}
                src={image.src}
                className={'absolute select-none'}
                style={{
                  top: '19px',
                  left: '19px',
                  // left: 'calc(50% - (image.width / 2) + 19px)',
                }}
                alt={''}
              />
            </div>
          </div>
        </Draggable>
      )}
    </main>
  )
}
