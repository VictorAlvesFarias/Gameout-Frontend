import React, { useEffect, useState, useRef } from 'react'
import { LoaderCircle, Clock, FileText, RefreshCcw, AlertCircle, RotateCcw, Trash2, CheckCircle } from 'lucide-react'
import Span from '../../../components/Span'
import Button from '../../../components/button'
import InputText from '../../../components/input-text'
import Accordion from '../../../components/accordion'
import AccordionRoot from '../../../components/accordion-root'
import { AccordionTitleContainer } from "react-base-components"
import { AccordionContext } from "react-base-components"
import { useQuery } from "react-toolkit"
import { IAppStoredFile, saveService } from '../../../services/save-service'
import { toast } from 'react-toastify'
import { webSocketService } from '../../../services/web-socket-service'
import AppFileItem from '../../../containers/app-file-item'
import Div from '../../../components/div'

interface WebSocketRequest {
  Event: string
  Body: any
}

function InProcessing() {
  const [storedFiles, setStoredFiles] = useState<IAppStoredFile[]>([])
  const [allRequestsResolved, setQuery] = useQuery(false)
  const [filter, setFilter] = useState<string>("")
  const wsRef = useRef<WebSocket | null>(null)

  function handleFilter(e: any) {
    setFilter(e.target.value)
  }

  function handleGetSaves() {
    return saveService.getStoredFiles({ processing: true }).then(e => {
      setStoredFiles(e.data)
    })
  }

  function handleReprocessFile(appStoredFileId: number) {
    saveService.reprocessFile(appStoredFileId)
      .then(() => {
        toast.success('File marked for reprocessing')
        handleGetSaves()
      })
      .catch(() => {
        toast.error('Failed to reprocess file')
      })
  }

  function handleDeleteFileWithError(appStoredFileId: number) {
    saveService.deleteFileWithError(appStoredFileId)
      .then(() => {
        toast.success('File deleted successfully')
        handleGetSaves()
      })
      .catch(() => {
        toast.error('Failed to delete file')
      })
  }

  function handleCheckProcessingStatus(appStoredFileId: number) {
    saveService.checkProcessingStatus(appStoredFileId)
      .then((response) => {
        toast.info('Status check initiated...')
      })
      .catch(() => {
        toast.error('Failed to check processing status')
      })
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  useEffect(() => {
    setQuery(() => handleGetSaves())
  }, [])

  useEffect(() => {
    console.log("Setting up websocket listeners")

    const newsFilesRequestPing = (req: any) => {
      toast.success('A new file in processing.')
      setQuery(() => handleGetSaves())
    }

    const appFileUpdatedPing = (req: any) => {
      toast.success('A new file is processed.')
      setQuery(() => handleGetSaves())
    }

    const appFileErrorPing = (req: any) => {
      toast.error('A file processing error occurred.')
      setQuery(() => handleGetSaves())
    }

    const appFileStatusUpdatePing = (req: any) => {
      toast.success(`Status verified successfully`)
      setQuery(() => handleGetSaves())
    }

    webSocketService.on('NewsFilesRequestPing', newsFilesRequestPing)
    webSocketService.on('AppFileUpdatedPing', appFileUpdatedPing)
    webSocketService.on('AppFileErrorPing', appFileErrorPing)
    webSocketService.on('AppFileStatusUpdatePing', appFileStatusUpdatePing)

    return () => {
      webSocketService.off('NewsFilesRequestPing', newsFilesRequestPing)
      webSocketService.off('AppFileUpdatedPing', appFileUpdatedPing)
      webSocketService.off('AppFileErrorPing', appFileErrorPing)
      webSocketService.off('AppFileStatusUpdatePing', appFileStatusUpdatePing)
    }
  }, [])


  return (
    <Div variation='in-start' className=' bg-zinc-900 bg-opacity-50 '>
      <div className='flex gap-3 items-center mb-4'>
        <InputText onChange={handleFilter} type="text" placeholder='Search files in processing' variation='ultra-rounded' />
        <div className='flex-1 justify-end flex'>
          <Button onClick={handleGetSaves} variation='default'>
            Verify
          </Button>
        </div>
      </div>

      {storedFiles.length === 0 ? (
        <div className='h-full w-full flex justify-center items-center text-white'>
          {allRequestsResolved ? (
            <div className='text-center'>
              <Span>No files in processing</Span>
            </div>
          ) : (
            <LoaderCircle className='animate-spin h-8 w-8' />
          )}
        </div>
      ) : (
        <div className='space-y-3'>
          {storedFiles.filter(e =>
            e.name?.toLowerCase().includes(filter.toLowerCase()) ||
            e.path?.toLowerCase().includes(filter.toLowerCase()) ||
            e.id.toString().includes(filter) ||
            e.appFileId.toString().includes(filter) ||
            (e.storedFileId && e.storedFileId.toString().includes(filter)) ||
            (e as any).error?.toLowerCase().includes(filter.toLowerCase())
          ).map((x, i) => (
            <div key={i} className='pt-3 rounded flex flex-col relative gap-3'>
              <AccordionContext>
                <AccordionRoot>
                  <div className='rounded flex justify-between items-center hover:bg-zinc-800 border border-zinc-700'>
                    <AccordionTitleContainer className="w-full h-full flex items-center cursor-pointer text-sm text-white">
                      <Div variation='accordion-content'>
                        <AppFileItem
                          name={x.name}
                          createDate={x.createDate}
                          updateDate={x.updateDate}
                          processing={x.processing}
                          message={x.error ? `Error: ${x.message || 'Unknown error'}` : !x.processing ? "Completed" : "Processing"}
                          status={x.error ? "error" : !x.processing ? "success" : "warning"}
                        />
                      </Div>
                    </AccordionTitleContainer>
                  </div>
                  <Accordion variation='default'>
                    <Div variation='accordion-content'>
                      <Div variation='accordion-content-grid'>
                        <div>
                          <span className='text-sm font-semibold text-gray-300'>File Path:</span>
                          <p className='text-sm text-white mt-1 break-all'>{x.path || 'N/A'}</p>
                        </div>
                        <div>
                          <span className='text-sm font-semibold text-gray-300'>File Name:</span>
                          <p className='text-sm text-white mt-1'>{x.name}</p>
                        </div>
                        <div>
                          <span className='text-sm font-semibold text-gray-300'>App File ID:</span>
                          <p className='text-sm text-white mt-1'>{x.appFileId}</p>
                        </div>
                        <div>
                          <span className='text-sm font-semibold text-gray-300'>App Stored File ID:</span>
                          <p className='text-sm text-white mt-1'>{x.id}</p>
                        </div>
                        <div>
                          <span className='text-sm font-semibold text-gray-300'>Created:</span>
                          <p className='text-sm text-white mt-1'>{formatDate(x.createDate)}</p>
                        </div>
                        <div>
                          <span className='text-sm font-semibold text-gray-300'>Updated:</span>
                          <p className='text-sm text-white mt-1'>{formatDate(x.updateDate)}</p>
                        </div>
                        <div>
                          <span className='text-sm font-semibold text-gray-300'>Stored File ID:</span>
                          <p className='text-sm text-white mt-1'>{x.storedFileId || 'Not assigned'}</p>
                        </div>
                      </Div>

                      {(x.error) && (
                        <div>
                          <span className='text-sm font-semibold text-red-400 flex items-center gap-2'>
                            <AlertCircle className='h-4 w-4' />
                            Error Message: {x.message}
                          </span>
                          <p className='text-sm text-red-300 mt-1 bg-red-900 bg-opacity-20 p-2 rounded'>
                            {x.error}
                          </p>
                        </div>
                      )}

                      <div className='flex gap-3 flex-wrap'>
                        <Button onClick={() => handleCheckProcessingStatus(x.id)} variation='modal'>
                          Check Status
                        </Button>

                        {x.error && (
                          <>
                            <Button variation='modal' onClick={() => handleReprocessFile(x.id)}>
                              Reprocess
                            </Button>
                            <div className='w-fit'>
                              <Button variation='red' onClick={() => handleDeleteFileWithError(x.id)}>
                                Cancel
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </Div>
                  </Accordion>
                </AccordionRoot>
              </AccordionContext>
            </div>
          ))}
        </div>
      )}
    </Div>
  )
}

export default InProcessing
