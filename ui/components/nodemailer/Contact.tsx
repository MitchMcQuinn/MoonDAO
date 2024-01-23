import Link from 'next/link'
import { useState } from 'react'
import ReCaptcha from 'react-google-recaptcha'
import toast from 'react-hot-toast'

export function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const [verified, setVerified] = useState(false)

  function resetContactForm() {
    setName('')
    setEmail('')
    setMessage('')
    setVerified(false)
  }

  async function submitContactForm() {
    if (!email.includes('@') || message.trim() === '' || phone.trim() === '')
      return toast.error('Please fill out all required fields.')
    if (!verified) return toast.error("Please verify you're not a robot.")
    else {
      try {
        const res = await fetch('/api/nodemailer/zero-g-contact', {
          method: 'POST',
          body: JSON.stringify({
            name,
            email,
            phone,
            message,
          }),
        })
        console.log(res)
        toast.success('Message sent!')
        resetContactForm()
      } catch (e: any) {
        toast.error('Message failed to send.')
        console.error(e)
      }
    }
  }

  return (
    <div className="text-black dark:text-white">
      <h1 className="mt-4 font-bold text-2xl text-center">{'Contact:'}</h1>
      <div className="mt-2 p-4 w-full flex flex-col items-center gap-2 duration-300 h-full bg-[#1d1d1d50] rounded-md">
        <div className="w-full">
          <label className="font-semibold">Name :</label>
          <input
            className="w-full rounded-md px-2 dark:bg-[#ffffff25]"
            onChange={({ target }) => setName(target.value)}
            value={name}
          />
        </div>
        <div className="w-full">
          <label className="font-semibold">
            Email<span className="text-[tomato]">*</span> :
          </label>
          <input
            className="w-full rounded-md px-2 dark:bg-[#ffffff25]"
            onChange={({ target }) => setEmail(target.value)}
            value={email}
          />
        </div>
        <div className="w-full">
          <label className="font-semibold">
            Phone<span className="text-[tomato]">*</span> :
          </label>
          <input
            className="w-full rounded-md px-2 dark:bg-[#ffffff25]"
            onChange={({ target }) => setPhone(target.value)}
            value={phone}
          />
        </div>
        <div className="w-full">
          <label className="font-semibold">
            Message<span className="text-[tomato]">*</span> :
          </label>
          <textarea
            className="w-full h-32 rounded-md px-2 dark:bg-[#ffffff25]"
            onChange={({ target }) => setMessage(target.value)}
            style={{ resize: 'none' }}
            value={message}
          ></textarea>
        </div>
        {email.includes('@') && message.trim() !== '' && (
          <ReCaptcha
            sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}
            onChange={(e: any) => console.log('Recaptcha res :', e)}
          />
        )}
        <button
          className={`mt-4 py-3 text-white bg-moon-orange font-RobotoMono w-full duration-[0.6s] ease-in-ease-out text-1xl hover:scale-105`}
          onClick={submitContactForm}
        >
          Submit
        </button>

        <Link
          className="mt-2"
          href="https://publish.obsidian.md/moondao/MoonDAO/docs/Legal/Website+Privacy+Policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  )
}
