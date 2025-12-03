import React, { useEffect, useState } from 'react'
import { LoaderCircle, Key, Copy, Check } from 'lucide-react'
import Button from '../../../components/button'
import Div from '../../../components/div'
import Span from '../../../components/Span'
import { apiKeyService } from '../../../services/api-key-service'
import { useQuery } from 'react-toolkit'
import { toast } from 'react-toastify'

function ApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [finished, setQuery] = useQuery(false)

  function handleGenerateApiKey() {
    setQuery(() => apiKeyService.generateApiKey().then((response) => {
      if (response.data) {
        setApiKey(response.data)
        toast.info('Please update the Driver appsettings.json with this API Key')
      }
    }))
  }

  function handleGetCurrentApiKey() {
    return apiKeyService.getCurrentApiKey().then((response) => {
      if (response.data) {
        setApiKey(response.data)
      }
    })
  }

  function handleCopyToClipboard() {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      setCopied(true)
      toast.success('API Key copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  useEffect(() => {
    setQuery(() => handleGetCurrentApiKey())
  }, [])

  return (
    <Div variation='in-start' className='bg-zinc-900 bg-opacity-50'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-white mb-2 flex items-center gap-2'>
            <Key className='h-6 w-6' />
            Driver API Key Management
          </h1>
          <p className='text-gray-400 text-sm'>
            Generate and manage the API Key for driver authentication. This key must be configured in the Driver appsettings.json file.
          </p>
        </div>

        <div className='bg-zinc-800 rounded-lg p-6 border border-zinc-700'>
          <div className='mb-4'>
            <label className='text-sm font-semibold text-gray-300 mb-2 block'>
              API Key
            </label>
            {finished ? (
              <div className='flex items-center gap-2'>
                <div className='flex-1 bg-zinc-900 rounded px-4 py-3 border border-zinc-700'>
                  <code className='text-sm text-gray-300 break-all'>
                    {apiKey || 'No API Key configured'}
                  </code>
                </div>
                {apiKey && (
                  <Button
                    variation='default'
                    onClick={handleCopyToClipboard}
                  >
                    {copied ? (
                      <>
                        <Check className='h-4 w-4' />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className='h-4 w-4' />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </div>
            ) : (
              <div className='flex items-center justify-center py-8'>
                <LoaderCircle className='animate-spin h-6 w-6 text-gray-400' />
              </div>
            )}
          </div>

          <div className='flex gap-3 mt-6'>
            <Button
              variation='default'
              onClick={handleGenerateApiKey}
              loading={!finished}
              loadingComponent={<LoaderCircle className='animate-spin h-4 w-4' />}
            >
              Generate New API Key
            </Button>
            <Button
              variation='modal'
              onClick={() => setQuery(() => handleGetCurrentApiKey())}
              loading={!finished}
              loadingComponent={<LoaderCircle className='animate-spin h-4 w-4' />}
            >
              Refresh
            </Button>
          </div>

          <div className='mt-6 p-4 bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded'>
            <p className='text-sm text-yellow-300'>
              <strong>Important:</strong> After generating a new API Key, you must update the <code className='bg-zinc-900 px-1 rounded'>DriverApiKey</code> field in the Driver's <code className='bg-zinc-900 px-1 rounded'>appsettings.json</code> file with the generated key.
            </p>
          </div>
        </div>
      </div>
    </Div>
  )
}

export default ApiKey

