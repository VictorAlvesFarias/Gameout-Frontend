import React, { useEffect, useState, useRef } from 'react'
import { ArrowBigDown, Check, RefreshCcw, Trash } from 'lucide-react';
import Button from '../../../components/button';
import InputRoot from '../../../components/input-root';
import InputText from '../../../components/input-text';
import Span from '../../../components/Span';
import Accordion from "../../../components/accordion";
import AccordionRoot from '../../../components/accordion-root';
import AccordionTitle from '../../../components/accordion-title';
import { AccordionContext, ModalContext, ModalClose, If } from "react-base-components";
import ModalRoot from '../../../components/modal-root';
import Checkbox from '../../../components/checkbox';
import Label from '../../../components/label';
import { useQuery } from "react-toolkit";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { webSocketService } from '../../../services/web-socket-service';
import Div from '../../../components/div';
import AppFileItem from '../../../containers/app-file-item';
import { saveService } from '../../../services/save-service';
import { IAppFileRequest } from '../../../interfaces/IAppFileRequest';
import { IAppFileResponse } from '../../../interfaces/IAppFileResponse';
import { usePageContext } from '../../../contexts/page-context';
import { USER_ROUTES } from '../../../config/routes-config';

function Home() {
  const pageContext = usePageContext();
  const navigate = useNavigate();
  const [appFiles, setAppFiles] = useState<IAppFileResponse[]>([])
  const [filter, setFilter] = useState<string>("")
  const [allRequestsResolved, setQuery] = useQuery(false)
  const modalRefs = useRef<{ [key: number]: any }>({});

  function handleFilter(e: any) {
    setFilter(e.target.value)
  }

  function handleAppFileFilter() {
    return appFiles?.filter(e => e.name.includes(filter)) ?? []
  }

  function handleGetSaves() {
    return saveService.getAll().then(e => {
      setAppFiles(e.data)
    })
  }

  function handleDeleteSave(id: number) {
    return saveService.remove({ id }).then(e => {
      handleGetSaves()
    })
  }

  function handleUpdate(data: any, id: number) {
    let updatedItem: IAppFileResponse | undefined;

    setAppFiles(prev => {
      const newArray = [...prev]
      const index = newArray.findIndex(item => item.id === id)
      const newObject = { ...newArray[index], ...data }

      if (index >= 0) {
        newArray[index] = newObject
        updatedItem = newObject
      }

      return newArray
    })

    if (!updatedItem) {
      return Promise.resolve()
    }

    const updateRequest: IAppFileRequest = {
      name: updatedItem.name,
      path: updatedItem.path,
      versionControl: updatedItem.versionControl,
      observer: updatedItem.observer,
      autoValidateSync: updatedItem.autoValidateSync
    }

    return saveService.update(updateRequest, id)
  }

  function handleNavigateToVersions(idAppFile: number) {
    navigate(`/versions/${idAppFile}`)
  }

  function handleSingleSync(idAppFile: number) {
    return saveService.singleSync({ idAppFile }).then(() => {
      toast.success('Sync started successfully');
      handleGetSaves();
    })
  }

  function handleValidateStatus(appFileId: number) {
    return saveService.checkAppFileStatus({ appFileId })
  }

  useEffect(() => {
    function newsFilesRequestPing(req: any) {
      toast.success('A new file in processing.')
      setQuery(() => handleGetSaves())
    }

    webSocketService.on('NewsFilesRequestPing', newsFilesRequestPing)

    function appFileUpdatedPing(req: any) {
      toast.success('A new file is processed.')
      setQuery(() => handleGetSaves())
    }

    webSocketService.on('AppFileUpdatedPing', appFileUpdatedPing)

    function appFileStatusUpdatePing(req: any) {
      toast.success('Status is updated.')
      setQuery(() => handleGetSaves())
    }

    webSocketService.on('AppFileStatusUpdatePing', appFileStatusUpdatePing)

    return () => {
      webSocketService.off('NewsFilesRequestPing', newsFilesRequestPing)
      webSocketService.off('AppFileUpdatedPing', appFileUpdatedPing)
      webSocketService.off('AppFileStatusUpdatePing', appFileStatusUpdatePing)
    }
  }, [])

  useEffect(() => {
    pageContext.setContextPage({ pageTitle: 'Home' });
  }, [pageContext.setContextPage]);

  useEffect(() => {
    setQuery(() => handleGetSaves())
  }, [])

  return (
    <Div variation='in-start' className='bg-zinc-900 bg-opacity-50'>
      <div className='flex gap-3 items-center '>
        <InputText onChange={handleFilter} type="text" placeholder='Search saves' variation='ultra-rounded' />
        <div className='flex-1 justify-end flex'>
          <div className='w-11 h-11'>
            <Button onClick={handleGetSaves} variation='default-full'>
              <RefreshCcw className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
      <If conditional={handleAppFileFilter().length === 0 && allRequestsResolved}>
        <div className='h-full w-full items-center justify-center flex text-white'>
          <Span>Results not found</Span>
        </div>
      </If>
      <If conditional={handleAppFileFilter().length > 0 && allRequestsResolved}>
        {
          handleAppFileFilter().map((x, i: any) =>
            <div key={x.id} className='pt-6 rounded  flex flex-col relative gap-3'>
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
                          message={x.statusMessage}
                          status={x.status}
                        />
                      </Div>
                    </AccordionTitle>
                    <Span variation='default-accordion-button' onClick={() => modalRefs.current[x.id]?.open()}>
                      <Trash className='h-5 w-5 text-zinc-500 hover:text-red-500 transition-all' />
                    </Span>
                  </Div>
                  <ModalContext ref={(el) => (modalRefs.current[x.id] = el)}>
                    <ModalRoot>
                      <div className='shadow-lg p-6 bg-main-black-800 flex flex-col gap-3 rounded text-white'>
                        <h3 className='text-lg font-semibold'>Confirm Deletion</h3>
                        <p className='text-sm text-gray-300'>
                          Are you sure you want to delete this file? This action cannot be undone.
                        </p>
                        <div className='flex justify-between w-full mt-6 gap-3'>
                          <ModalClose callback={() => handleDeleteSave(x.id)} className='flex justify-between flex-1'>
                            <Button variation="red">Yes, Delete</Button>
                          </ModalClose>
                          <ModalClose className='flex justify-between flex-1'>
                            <Button variation='default-full'>Cancel</Button>
                          </ModalClose>
                        </div>
                      </div>
                    </ModalRoot>
                  </ModalContext>
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
                          <Button onClick={() => handleValidateStatus(x.id)} variation='modal'>Check status</Button>
                        </div>
                        <div className='w-fit'>
                          <Button onClick={() => handleNavigateToVersions(x.id)} variation='modal'>Versions</Button>
                        </div>
                        <div className='w-fit'>
                          <Button onClick={() => handleSingleSync(x.id)} variation='modal'>
                            Sync
                          </Button>
                        </div>
                      </div>
                    </Div>
                  </Accordion>
                </AccordionRoot>
              </AccordionContext>
            </div>
          )
        }
      </If>
    </Div>
  )
}

export default Home