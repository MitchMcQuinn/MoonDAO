import html2canvas from 'html2canvas'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

export function ImageGenerator({ setImage, nextStage, stage }: any) {
  const pfpRef = useRef<any>()
  const [scriptLoaded, setScriptLoaded] = useState(false)

  function submitImage() {
    if (!pfpRef?.current) return console.error('pfpRef is not defined')
    html2canvas(pfpRef?.current).then((canvas) => {
      const img = canvas.toDataURL('image/png')

      //Convert from base64 to file
      const byteString = atob(img.split(',')[1])
      const mimeString = img.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: mimeString })
      const file = new File([blob], 'pfp.png', { type: mimeString })

      setImage(file)

      nextStage()
    })
  }

  useEffect(() => {
    if (!scriptLoaded) {
      window.passBlurValue = 3
      fetch('/image-generator/init.js')
        .then((response) => response.text())
        .then((script) => {
          const existingForm = document.getElementById('params')
          if (existingForm) existingForm.remove()

          const runScript = new Function(script)
          runScript()
          setScriptLoaded(true)
        })
    }
  }, [])

  return (
    <>
      <Head>
        <link href="/image-generator/celestial.css" rel="stylesheet" />
        <link href="/image-generator/pfp-style.css" rel="stylesheet" />
      </Head>

      {/* <Script strategy="afterInteractive" src="/image-generator/init.js" /> */}

      <div id="html-container" className="pl-[15%] md:pl-0">
        <div id="pfp" ref={pfpRef}>
          <div id="celestial-map"></div>
          <div id="canvas-container"></div>
          <img
            alt="default-img"
            id="process-image"
            src="/image-generator/images/test-00.jpg"
          />
        </div>
      </div>

      <button
        className="absolute bottom-48 px-4 py-2 bg-moon-orange"
        onClick={submitImage}
      >
        Submit Image
      </button>
    </>
  )
}
