import { useAddress, useContract } from '@thirdweb-dev/react'
import { useValidVP } from '../../lib/tokens/hooks/useValidVP'
import Head from '../../components/layout/Head'
import PurchasePortal from '../../components/zero-g/PurchasePortal'
import VotingEscrowABI from '../../const/abis/VotingEscrow.json'
import { VMOONEY_ADDRESSES } from '../../const/config'

export default function ZeroG() {
  const address = useAddress()

  const { contract: L1vMooneyContract }: any = useContract(
    VMOONEY_ADDRESSES['ethereum'],
    VotingEscrowABI.abi
  )

  const { contract: L2vMooneyContract }: any = useContract(
    VMOONEY_ADDRESSES['polygon'],
    VotingEscrowABI.abi
  )

  const validVP = useValidVP(address)

  return (
    <main className="animate-fadeIn">
      <Head title="Zero-G Flight" />

      <div className="mt-3 px-5 lg:px-7 xl:px-10 py-12 lg:py-14 page-border-and-color w-[336px] sm:w-[400px] lg:mt-10 lg:w-full lg:max-w-[800px]">
        <h2 className="page-title">Zero-G Flight</h2>

        <div className="mt-3 lg:mt-4 font-RobotoMono">
          {/*Subtitle */}
          <div className="mt-6 lg:mt-2 text-center lg:text-left text-black dark:text-white lg:text-lg">
            <p className="">
              {`In partnership with `}
              <br className="lg:hidden" />
              <a
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block cursor-pointer text-moon-orange hover:scale-[1.025] ease-in-ease-out duration-300"
                onClick={() => window.open('https://spaceforabetterworld.com/')}
              >
                {'Space for a Better World'}
              </a>
            </p>
          </div>

          <p className="mt-6 font-mono text-base xl:text-lg lg:text-left text-center leading-8 text-[#071732] dark:text-white text-opacity-70 dark:text-opacity-60">
            {`The team’s Boeing 727 flies in parabolic arcs to create a weightless environment, allowing you to float, flip, and soar as if you were in space. Start training for a journey to the Moon and experience the adventure of a lifetime with our Zero-G flight!`}
          </p>

          <a
            className="mt-6 lg:mt-7 text-moon-orange font-RobotoMono inline-block text-sm text-center w-full lg:text-left hover:text-orange-600 transition-all duration-105 cursor-pointer"
            target="_blank"
            rel="noreferrer"
            href="https://www.moondao.com/zero-g"
          >
            Event Details →
          </a>
        </div>

        <section className="mt-6 w-full flex flex-col items-center lg:items-start">
          <PurchasePortal validVP={validVP} />
        </section>
      </div>
    </main>
  )
}
