import React, { useEffect, useRef, useState } from 'react'
import { ArrowBigDown, Check, FolderDown, LoaderCircle, RefreshCcw, Trash } from 'lucide-react';
import Button from '../../../components/button';
import Form from '../../../components/Form';
import InputRoot from '../../../components/input-root';
import InputText from '../../../components/input-text';
import Span from '../../../components/Span';
import Accordion from '../../../components/Accordion';
import AccordionRoot from '../../../components/accordion-root';
import AccordionTitle from '../../../components/accordion-title';
import AccordionContext from '../../../base-components/accordion-context';
import Checkbox from '../../../components/checkbox';
import Label from '../../../components/label';
import { useQuery } from '../../../utils/hooks/query-hooks';
import ModalContext, { IModalController } from '../../../base-components/modal-context';
import ModalRoot from '../../../components/modal-root';
import ModalClose from '../../../base-components/modal-close';
import { useModal } from '../../../utils/hooks/modal-hooks';
import { IAppFile, IAppStoredFile, IStoredFile, saveService } from '../../../services/save-service';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../../config/routes-config';
import { toast } from 'react-toastify';
import { webSocketService } from '../../../services/web-socket-service';
import Div from '../../../components/div';
import AppFileItem from '../../../containers/app-file-item';

function Home() {
  const [appFiles, setAppFiles] = useState<IAppFile[]>([])
  const [selectedAppFiles, setSelectedAppFiles] = useState<number | null>(null)
  const [storedFiles, setStoredFiles] = useState<IAppStoredFile[]>([])
  const [filter, setFilter] = useState<string>("")
  const [allRequestsResolved, setQuery] = useQuery(false)
  const [currentFileId, setCurrentFileId] = useState<number>(0)
  const { modalRef, openModal, closeModal } = useModal()
  const navigation = useNavigate()

  function handleFilter(e: any) {
    setFilter(e.target.value)
  }

  function handleGetSaves() {
    return saveService.getAll().then(e => {
      setAppFiles(e.data)
    })
  }

  function handleDeleteSave(id: string) {
    return saveService.remove({ id }).then(e => {
      handleGetSaves()
    })
  }

  function handleDeleteStoredFile(id: number) {
    return saveService.removeStoredFile({ id }).then(e => {
      if (selectedAppFiles == null) {
        return
      }

      handleGetStoredFiles(selectedAppFiles)
    })
  }

  function handleUpdate(data: any, id: number) {
    const newList = [...appFiles]
    const index = newList.findIndex(item => item.id === id)
    let newObject = { ...newList[index], ...data }

    if (index >= 0) {
      newList[index] = newObject
    }

    setAppFiles(newList)

    return saveService.update(newObject, id)
  }

  function handleGetStoredFiles(idAppFile: number) {
    setSelectedAppFiles(idAppFile)

    return saveService.getStoredFiles({ idAppFile }).then(e => {
      setStoredFiles(e.data)
      setCurrentFileId(idAppFile)
      openModal()
    })
  }

  function handleSingleSync(idAppFile: number) {
    return saveService.singleSync(idAppFile).then((e: any) => {
      modalRef.current?.close()
    })
  }

  function handleValidateStatus(idAppFile: number) {
    return saveService.validateStatus(idAppFile).then((e: any) => {
      toast.success('Status update request is send.')
    })
  }


  function handleDownload(id: number) {
    const appStoredFile = storedFiles.find(e => e.id === id)

    if (!appStoredFile) {
      return
    }

    saveService.download({ id }, appStoredFile.name)
  }

  useEffect(() => {
    const newsFilesRequestPing = (req: any) => {
      toast.success('A new file in processing.')
      setQuery(() => handleGetSaves())
    }

    webSocketService.on('NewsFilesRequestPing', newsFilesRequestPing)

    const appFileUpdatedPing = (req: any) => {
      toast.success('A new file is processed.')
      setQuery(() => handleGetSaves())
    }

    webSocketService.on('AppFileUpdatedPing', newsFilesRequestPing)

    const appFileStatusUpdatePing = (req: any) => {
      toast.success('Status is updated.')
      setQuery(() => handleGetSaves())
    }

    webSocketService.on('AppFileStatusUpdatePing', newsFilesRequestPing)

    return () => {
      webSocketService.off('NewsFilesRequestPing', newsFilesRequestPing)
      webSocketService.off('AppFileUpdatedPing', appFileUpdatedPing)
      webSocketService.off('AppFileStatusUpdatePing', appFileStatusUpdatePing)
    }
  }, [])

  useEffect(() => {
    setQuery(() => handleGetSaves())
  }, [])

  return (
    <>
      <div className='w-full h-full flex'>
        <div className='p-3 flex-[1] bg-zinc-900 bg-opacity-50 h-full flex flex-col'>
          <div className='flex gap-3 items-center '>
            <InputText onChange={handleFilter} type="text" placeholder='Search saves' variation='ultra-rounded' />
            <div className='flex-1 justify-end flex'>
              <Button onClick={handleGetSaves} >Verify</Button>
            </div>
          </div>
          {
            appFiles?.filter(e => e.name.includes(filter)).length == 0 ?
              <div className='h-full w-full items-center justify-center flex text-white'>
                {
                  allRequestsResolved ? (
                    <Span>Results not found</Span>
                  ) : (
                    <LoaderCircle className='animate-spin' />
                  )
                }
              </div>
              :
              <div>
                {
                  (
                    appFiles?.filter(e => e.name.includes(filter)).map((x, i: any) =>
                      <div key={i} className='pt-6 rounded  flex flex-col relative gap-3'>
                        <AccordionContext>
                          <AccordionRoot>
                            <Div variation='accordion-title-root'>
                              <AccordionTitle>
                                <Div variation='accordion-content'>
                                  <AppFileItem
                                    name={x.name}
                                    createDate={x.createDate}
                                    updateDate={x.updateDate}
                                    processing={false}
                                    message={x.synced ? "Synced" : "Unsynced"}
                                    status={x.synced ? "success" : "error"}
                                  />
                                </Div>
                              </AccordionTitle>
                              <Span variation='default-accordion-button' onClick={() => handleDeleteSave(x.id.toString())}>
                                <Trash className='h-5 w-5 text-zinc-500 hover:text-red-500 transition-all' />
                              </Span>
                            </Div>
                            <Accordion>
                              <Div variation='accordion-content'>
                                <div className='flex gap-3'>
                                  <InputRoot>
                                    <Label>Name</Label>
                                    <InputText
                                      variation='default-full'
                                      value={x.name}
                                      onChange={(e) => handleUpdate({ name: e.target.value }, x.id)}
                                      type="text" placeholder='Save path' />
                                  </InputRoot>
                                  <InputRoot>
                                    <Label>Path</Label>
                                    <InputText
                                      variation='default-full'
                                      value={x.path}
                                      onChange={(e) => handleUpdate({ path: e.target.value }, x.id)}
                                      type="text" placeholder='Save path' />
                                  </InputRoot>
                                </div>
                                <div className='flex gap-3'>
                                  <InputRoot variation='checkbox'>
                                    <Checkbox
                                      onChange={() => handleUpdate({ versionControl: !x.versionControl }, x.id)}
                                      checked={x.versionControl}
                                      value={x.versionControl ?? "false"}
                                      data="true"
                                    >
                                      <Check />
                                    </Checkbox><Label>Versions</Label>
                                  </InputRoot>
                                  <InputRoot variation='checkbox'>
                                    <Checkbox
                                      onChange={() => handleUpdate({ observer: !x.observer }, x.id)}
                                      checked={x.observer}
                                      value={x.observer ?? "false"}
                                      data="true"
                                    >
                                      <Check />
                                    </Checkbox><Label>Observer</Label>
                                  </InputRoot>
                                  <InputRoot variation='checkbox'>
                                    <Checkbox
                                      onChange={() => handleUpdate({ autoValidateSync: !x.autoValidateSync }, x.id)}
                                      checked={x.autoValidateSync}
                                      value={x.autoValidateSync ?? "false"}
                                      data="true"
                                    >
                                      <Check />
                                    </Checkbox><Label>Auto Check Status</Label>
                                  </InputRoot>
                                </div>
                                <div className="flex-1 flex items-end w-full gap-3">
                                  <div className='w-fit'>
                                    <Button onClick={() => handleGetStoredFiles(x.id)} variation='modal'>Saves</Button>
                                  </div>
                                  <div className='w-fit'>
                                    <Button onClick={() => handleValidateStatus(x.id)} variation='modal'>Check status</Button>
                                  </div>
                                </div>
                              </Div>
                            </Accordion>
                          </AccordionRoot>
                        </AccordionContext>
                      </div>
                    )
                  )
                }
              </div>
          }
        </div>
      </div>

      <ModalContext ref={modalRef}>
        <ModalRoot>
          <div className='shadow-lg  bg-main-black-800  flex flex-col gap-3 rounded text-white'>
            <div className='flex flex-col gap-3 h-96 p-6 overflow-y-auto'>
              {
                storedFiles
                  .sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime())
                  .map((x, i) => (
                    <AccordionContext>
                      <AccordionRoot>
                        <Div variation='accordion-title-root'>
                          <AccordionTitle >
                            <Div variation='accordion-content'>
                              <div className='flex flex-col'>
                                <div className='flex gap-3'>
                                  <p className='font-bold'>Version:</p>
                                  <p>
                                    {
                                      i == 0 ? "Latest" : i.toString()
                                    }
                                  </p>
                                </div>
                                <div className='flex gap-3'>
                                  <p className='font-bold'>Date:</p>
                                  <p>{new Date(x.updateDate).toLocaleString('pt-BR').replace(",", " - ")}</p>
                                </div>
                                <div className='flex gap-3'>
                                  <p className='font-bold'>Size:</p>
                                  <p>{x.sizeInBytes}</p>
                                </div>
                              </div>
                            </Div>
                          </AccordionTitle>
                        </Div>
                        <Accordion>
                          <Div variation='accordion-content'>
                            <div onClick={() => handleDownload(x.id)} className='z-50 text-zinc-400 hover:text-green-500  flex justify-center items-center relative cursor-pointer'>
                              <div className='flex gap-3 w-full px-3 py-1'>
                                <FolderDown className='h-5 w-5 transition-all' />
                                <p className='font-semibold'>Download</p>
                              </div>
                            </div>
                            <div onClick={() => handleDeleteStoredFile(x.id)} className='z-50 text-zinc-400 hover:text-red-500  flex justify-center items-center relative cursor-pointer'>
                              <div className='flex gap-3 w-full px-3 py-1'>
                                <Trash className='h-5 w-5 transition-all' />
                                <p className='font-semibold'>Remove</p>
                              </div>
                            </div>
                          </Div>
                        </Accordion>
                      </AccordionRoot>
                    </AccordionContext>
                  ))
              }
            </div>
            <div className='flex justify-between w-full mt-6 gap-3 p-6'>
              <Button variation='default-full' onClick={() => handleSingleSync(currentFileId)}>Sync</Button>
              <ModalClose className='flex justify-between w-full'>
                <Button variation='red'>Close</Button>
              </ModalClose>
            </div>
          </div>
        </ModalRoot>
      </ModalContext>
    </>
  )
}

export default Home