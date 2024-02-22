import { Widget } from '@typeform/embed-react'
import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'

function StageContainer({ children }: any) {
  return (
    <div className="w-[336px] sm:w-[400px] lg:w-full font-RobotoMono">
      {children}
    </div>
  )
}

function Button({ onClick, children, isDisabled }: any) {
  return (
    <button
      className={'w-[300px] border-2'}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  )
}

export function CreateCitizen({ address, wallets, selectedWallet }: any) {
  const [stage, setStage] = useState<number>(0)

  const [userImage, setUserImage] = useState<any>()
  const [safeAddress, setSafeAddress] = useState<string>()

  const [citizenName, setCitizenName] = useState<string>()
  const [formResponseId, setFormResponseId] = useState<string>()

  return (
    <div className="flex flex-col">
      {/* Typeform form */}
      {stage === 0 && (
        <StageContainer>
          <div className="w-full md:w-3/4">
            <Widget
              id="iE1aaGrT"
              onSubmit={async (formResponse) => {
                //get response from form
                const { formId, responseId } = formResponse
                const responseRes = await fetch(
                  `/api/typeform/response?formId=${formId}&responseId=${responseId}`
                )
                const data = await responseRes.json()

                setFormResponseId(responseId)
                setCitizenName(data.answers[3].text)

                setStage(1)
              }}
              height={700}
            />
          </div>
        </StageContainer>
      )}
      {/* Upload & Create Image */}
      {stage === 1 && (
        <StageContainer>
          {userImage ? (
            <Image
              src={URL.createObjectURL(userImage)}
              width={300}
              height={300}
              alt=""
            />
          ) : (
            <div className="w-[300px] h-[300px] bg-[#ffffff50]"></div>
          )}
          <input
            onChange={(e: any) => setUserImage(e.target.files[0])}
            type="file"
            accept="image/png, image/jpeg"
          />
          <Button
            onClick={() => {
              if (!userImage) return toast.error('No file selected')

              const fileType = userImage.type
              if (fileType !== 'image/png' && fileType !== 'image/jpeg') {
                return toast.error('File type must be .png or .jpeg')
              }
              setStage(2)
            }}
          >
            Submit Image
          </Button>
        </StageContainer>
      )}
      {/* Pin Image and Metadata to IPFS, Mint NFT to Gnosis Safe */}
      {stage === 2 && (
        <StageContainer>
          <Button
            onClick={async () => {
              //get signer
              const provider = await wallets[selectedWallet].getEthersProvider()
              const signer = provider?.getSigner()
              //sign message
              const message = 'Please sign to pin this entity to IPFS'
              const signature = await signer?.signMessage(message)

              //get pinata jwt
              const jwtRes = await fetch('/api/ipfs/upload', {
                method: 'POST',
                headers: {
                  signature,
                },
                body: JSON.stringify({ address, message }),
              })

              const JWT = await jwtRes.text()

              //pin image to IPFS
              const imageFormData = new FormData()

              imageFormData.append('file', userImage)
              imageFormData.append(
                'pinataMetadata',
                JSON.stringify({ name: safeAddress + ' Image' })
              )
              imageFormData.append(
                'pinataOptions',
                JSON.stringify({ cidVersion: 0 })
              )

              const imageRes = await fetch(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                {
                  method: 'POST',
                  body: imageFormData,
                  headers: {
                    Authorization: `Bearer ${JWT}`,
                  },
                }
              )

              const { IpfsHash: newImageIpfsHash } = await imageRes.json()

              if (!newImageIpfsHash) {
                return toast.error('Error pinning image to IPFS')
              }

              //get the next token id of the nft collection
              const nextTokenId = 0

              //pin metadata to IPFS
              const metadata = {
                name: `Entity #${nextTokenId}`,
                description: `MoonDAO Entity : ${citizenName}`,
                image: `ipfs://${newImageIpfsHash}`,
                formResponseId,
              }

              const metadataFormData: any = new FormData()
              metadataFormData.append(
                'pinataMetadata',
                JSON.stringify({ name: safeAddress + ' Metadata.json' })
              )
              metadataFormData.append(
                'pinataOptions',
                JSON.stringify({ cidVersion: 0 })
              )
              metadataFormData.append(
                'file',
                new Blob([JSON.stringify(metadata)], {
                  type: 'application/json',
                })
              )

              const metadataRes = await fetch(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                {
                  method: 'POST',
                  body: metadataFormData,
                  headers: {
                    Authorization: `Bearer ${JWT}`,
                  },
                }
              )

              const { IpfsHash: newMetadataIpfsHash } = await metadataRes.json()
              //mint NFT to safe
            }}
          >
            Pin to IPFS and Mint Nft
          </Button>
        </StageContainer>
      )}

      {/* Dev Buttons */}
      <div>
        <button onClick={() => setStage((prev) => prev - 1)}>back</button>
        <button onClick={() => setStage((prev) => prev + 1)}>next</button>
      </div>
    </div>
  )
}
