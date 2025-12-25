import React, { useEffect, useState } from 'react'
import { LoaderCircle, Key, Copy, Check, RefreshCcw } from 'lucide-react'
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
    <Div variation="in-center">
      <Div variation='in-center-content' className='bg-zinc-900 bg-opacity-50 border border-zinc-700 rounded'>
        {finished ? (
          <>
            <div className="flex flex-col items-center text-center p-6 gap-3">
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-zinc-600 to-zinc-400 flex items-center justify-center shadow-md">
                <Key className="w-12 h-12 text-main-black-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Driver API Key</h2>
                <p className="text-zinc-400 text-sm">Manage authentication for driver access</p>
              </div>
            </div>

            <div className='max-w-xl'>
              <div className="space-y-6">
                <div>
                  <label className='text-sm font-semibold text-gray-300 mb-2 block'>
                    Current API Key
                  </label>
                  <div className='flex items-center gap-2'>
                    <div className='flex-1 bg-zinc-800 rounded p-3 items-center flex border border-zinc-700'>
                      <code className='text-sm text-gray-300 break-all'>
                        {apiKey || 'No API Key configured'}
                      </code>
                    </div>
                    <div className='min-w-11 min-h-11'>
                      {apiKey && (
                        <Button
                          variation='default-full'
                          onClick={handleGenerateApiKey}
                        >
                          <RefreshCcw className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                    <div className='min-w-11 min-h-11'>
                      {apiKey && (
                        <Button
                          variation='default-full'
                          onClick={handleCopyToClipboard}
                        >
                          {copied ? (
                            <Check className='h-4 w-4' />
                          ) : (
                            <Copy className='h-4 w-4' />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className='p-4 bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded'>
                  <p className='text-sm text-yellow-300'>
                    <strong>Important:</strong> After generating a new API Key, you must update the <code className='bg-zinc-900 px-1 rounded'>ApiKey</code> field in the Driver's <code className='bg-zinc-900 px-1 rounded'>appsettings.json</code> file.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center p-20">
            <LoaderCircle className="animate-spin w-8 h-8 text-zinc-400" />
          </div>
        )}
      </Div>
    </Div>
  )
}

export default ApiKey

