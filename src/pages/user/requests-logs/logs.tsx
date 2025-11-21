import React, { useEffect, useState } from 'react';
import { Clock, FileText, LoaderCircle, RefreshCcw } from 'lucide-react';
import Button from '../../../components/button';
import Span from '../../../components/Span';
import Accordion from '../../../components/accordion';
import AccordionRoot from '../../../components/accordion-root';
import AccordionTitle from '../../../components/accordion-title';
import { AccordionContext } from 'react-base-components';
import { useQuery } from 'react-toolkit';
import { logService, IAppFileLog, AppFileActionType } from '../../../services/log-service';
import InputRoot from '../../../components/input-root';
import InputText from '../../../components/input-text';
import Div from '../../../components/div';

function Logs() {
  const [logs, setLogs] = useState<IAppFileLog[]>([]);
  const [allRequestsResolved, setQuery] = useQuery(false);
  const [filter, setFilter] = useState<string>("")

  function handleFilter(e: any) {
    setFilter(e.target.value)
  }

  function handleGetLogs() {
    return logService.getAll({ page: 1, pageSize: 100 }).then(response => {
      setLogs(response.data);
    });
  }

  function getActionTypeLabel(actionType: AppFileActionType): string {
    switch (actionType) {
      case AppFileActionType.InsertFile:
        return 'File Inserted';
      case AppFileActionType.UpdateFile:
        return 'File Updated';
      case AppFileActionType.DeleteFile:
        return 'File Deleted';
      case AppFileActionType.DeleteStoredFile:
        return 'Stored File Deleted';
      case AppFileActionType.DownloadFile:
        return 'File Downloaded';
      case AppFileActionType.RequestSync:
        return 'Sync Requested';
      case AppFileActionType.SingleSync:
        return 'Single Sync';
      case AppFileActionType.StreamAssigned:
        return 'Stream Assigned';
      case AppFileActionType.ProcessingCompleted:
        return 'Processing Completed';
      case AppFileActionType.ProcessingFailed:
        return 'Processing Failed';
      default:
        return 'Unknown Action';
    }
  }

  function getActionTypeColor(actionType: AppFileActionType): string {
    switch (actionType) {
      case AppFileActionType.InsertFile:
      case AppFileActionType.UpdateFile:
      case AppFileActionType.ProcessingCompleted:
        return 'text-green-400';
      case AppFileActionType.DeleteFile:
      case AppFileActionType.DeleteStoredFile:
      case AppFileActionType.ProcessingFailed:
        return 'text-red-400';
      case AppFileActionType.DownloadFile:
      case AppFileActionType.RequestSync:
      case AppFileActionType.SingleSync:
        return 'text-blue-400';
      case AppFileActionType.StreamAssigned:
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
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
    setQuery(() => handleGetLogs());
  }, []);

  return (
    <Div variation='in-start' className=' bg-zinc-900 bg-opacity-50 '>
      <div className='flex gap-3 items-center '>
        <InputText onChange={handleFilter} type="text" placeholder='Search saves' variation='ultra-rounded' />
        <div className='flex-1 justify-end flex'>
          <Button onClick={handleGetLogs} >Verify</Button>
        </div>
      </div>
      {logs?.length === 0 ? (
        <div className='h-full w-full items-center justify-center flex text-white'>
          {allRequestsResolved ? (
            <div className='text-center'>
              <FileText className='h-16 w-16 mx-auto mb-4 text-gray-500' />
              <Span>No logs found</Span>
            </div>
          ) : (
            <LoaderCircle className='animate-spin h-8 w-8' />
          )}
        </div>
      ) : (
        <div className='space-y-3'>
          {logs.filter(e =>
            e.recordName?.includes(filter) ||
            e.actionMessage?.includes(filter) ||
            e.path?.includes(filter) ||
            e.userId?.includes(filter)
          ).map((log, index) => (
            <div key={log.id} className='pt-3 rounded flex flex-col relative gap-3'>
              <AccordionContext>
                <AccordionRoot>
                  <Div variation='accordion-title-root'>
                    <AccordionTitle>
                      <div className='py-5 px-6 flex justify-between w-full items-center'>
                        <div className='flex items-center gap-3'>
                          <Clock className='h-4 w-4 text-gray-400' />
                          <span className={`font-semibold ${getActionTypeColor(log.actionType)}`}>
                            {getActionTypeLabel(log.actionType)}
                          </span>
                          {log.recordName && (
                            <span className='text-gray-300'>- {log.recordName}</span>
                          )}
                        </div>
                        <div className='text-xs text-gray-400'>
                          {formatDate(log.createDate)}
                        </div>
                      </div>
                    </AccordionTitle>
                  </Div>
                  <Accordion>
                    <Div variation='accordion-content'>
                      <Div variation='accordion-content-grid'>
                        <div>
                          <span className='text-sm font-semibold text-gray-300'>Action Message:</span>
                          <p className='text-sm text-white mt-1'>{log.actionMessage}</p>
                        </div>
                        <div>
                          <span className='text-sm font-semibold text-gray-300'>Path:</span>
                          <p className='text-sm text-white mt-1 break-all'>{log.path || 'N/A'}</p>
                        </div>
                        {log.appFileId && (
                          <div>
                            <span className='text-sm font-semibold text-gray-300'>App File ID:</span>
                            <p className='text-sm text-white mt-1'>{log.appFileId}</p>
                          </div>
                        )}
                        {log.appStoredFileId && (
                          <div>
                            <span className='text-sm font-semibold text-gray-300'>App Stored File ID:</span>
                            <p className='text-sm text-white mt-1'>{log.appStoredFileId}</p>
                          </div>
                        )}
                        {log.storedFileId && (
                          <div>
                            <span className='text-sm font-semibold text-gray-300'>Stored File ID:</span>
                            <p className='text-sm text-white mt-1'>{log.storedFileId}</p>
                          </div>
                        )}
                        <div>
                          <span className='text-sm font-semibold text-gray-300'>Created:</span>
                          <p className='text-sm text-white mt-1'>{formatDate(log.createDate)}</p>
                        </div>
                        <div>
                          <span className='text-sm font-semibold text-gray-300'>Updated:</span>
                          <p className='text-sm text-white mt-1'>{formatDate(log.updateDate)}</p>
                        </div>
                        <div>
                          <span className='text-sm font-semibold text-gray-300'>User ID:</span>
                          <p className='text-sm text-white mt-1'>{log.userId}</p>
                        </div>
                      </Div>
                    </Div>
                  </Accordion>
                </AccordionRoot>
              </AccordionContext>
            </div>
          ))}
        </div>
      )}
    </Div >
  );
}

export default Logs;
