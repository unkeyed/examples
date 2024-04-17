import Link from 'next/link'
import Image from 'next/image'
import { Github } from 'lucide-react'
export default function Landing() {

  const cmd = `npx gstat https://example.com \\
  --method GET \\
  --region iad,fra,hkg,bom
`

  return (
    <>
      <header className="absolute top-2 md:top-6 w-full z-30">
        <div className="px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between h-14 border border-transparent [background:linear-gradient(theme(colors.white),theme(colors.white))_padding-box,linear-gradient(120deg,theme(colors.zinc.300),theme(colors.zinc.100),theme(colors.zinc.300))_border-box] rounded-lg px-3">

              {/* Site branding */}
              <div className="shrink-0 mr-4">
                {/* Logo */}
                <Link className="flex items-center justify-center bg-white w-8 h-8 rounded shadow-sm shadow-zinc-950/20" href="/">
                  <Image src="https://unkey.dev/images/landing/unkey.png" width={24} height={24} alt="Logo" />
                </Link>
              </div>

              {/* Desktop navigation */}
              <nav className="flex grow">

                {/* Desktop sign in links */}
                <ul className="flex grow justify-end flex-wrap items-center">
                  <li>
                    <Link className="text-sm font-medium text-zinc-500 hover:text-zinc-900 px-3 lg:px-5 py-2 flex items-center transition" href="/app">Sign in</Link>
                  </li>
                  <li className="ml-1">
                    <Link className=" text-sm p-1 font-medium inline-flex items-center justify-center border border-transparent rounded-md tracking-normal transition text-zinc-100 bg-zinc-900 hover:bg-zinc-800 w-full shadow" href="https://github.com/unkeyed/examples" target='_blank'><Github /></Link>
                  </li>
                </ul>

              </nav>

            </div>
          </div>
        </div>
      </header>
      <section className="relative before:absolute before:inset-0 before:h-80 before:pointer-events-none before:bg-gradient-to-b before:from-zinc-100 before:-z-10">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          {/* Section content */}
          <div className="px-4 sm:px-6">
            <div className="container mx-auto">
              <h1 className="flex justify-center text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-400 via-zinc-950 to-zinc-400 pb-4"><pre className='text-left'>
                {cmd}
              </pre>
              </h1>
              <p className="text-lg text-zinc-500 mt-16 text-center">
                Check your API performance globally from 20+ locations
              </p>


            </div>
          </div>


        </div>
      </section>
      <footer>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Top area: Blocks */}
          <div className="grid sm:grid-cols-12 gap-8 py-8 md:py-12 border-t border-zinc-200">

            {/* 1st block */}
            <div className="sm:col-span-6 md:col-span-3 lg:col-span-6 max-sm:order-1 flex flex-col">
              <div className="mb-4">
                {/* Logo */}
                <Link className="flex items-center justify-center bg-white w-8 h-8 rounded shadow-sm shadow-zinc-950/20" href="/">
                  <Image src="https://unkey.dev/images/landing/unkey.png" width={24} height={24} alt="Logo" />
                </Link>
              </div>
              <div className="grow text-sm text-zinc-500">&copy; unkey.dev. All rights reserved.</div>
              {/* Social links */}
              <ul className="flex space-x-4 mt-4 mb-1">
                <li>
                  <a className="flex justify-center items-center text-zinc-700 hover:text-zinc-900 transition" href="https://x.com/unkeydev" aria-label="Twitter">
                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                      <path d="m7.063 3 3.495 4.475L14.601 3h2.454l-5.359 5.931L18 17h-4.938l-3.866-4.893L4.771 17H2.316l5.735-6.342L2 3h5.063Zm-.74 1.347H4.866l8.875 11.232h1.36L6.323 4.347Z" />
                    </svg>
                  </a>
                </li>


              </ul>
            </div>





          </div>

        </div>
      </footer>
    </>
  )
}
