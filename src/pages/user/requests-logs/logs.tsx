import React, { useEffect, useState } from 'react';
import { Clock, FileText, LoaderCircle } from 'lucide-react';
import Button from '../../../components/button';
import Span from '../../../components/Span';
import Accordion from '../../../components/accordion';
import AccordionRoot from '../../../components/accordion-root';
import AccordionTitle from '../../../components/accordion-title';
import { AccordionContext } from 'react-base-components';
import { useQuery } from 'react-toolkit';
import InputText from '../../../components/input-text';
import Div from '../../../components/div';
import { applicationLogService, } from '../../../services/application-log-service';

function Logs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [allRequestsResolved, setQuery] = useQuery(false);
  const [filter, setFilter] = useState<string>("");

  function handleFilter(e: any) {
    setFilter(e.target.value);
  }

  function handleGetLogs() {
    return applicationLogService.getAllTraces().then(response => {
      setLogs(response.data);
    });
  }

  function getActionTypeColor(type: string): string {
    switch (type) {
      case "Success":
        return 'text-green-400';
      case "Error":
        return 'text-red-400';
      case "Info":
        return 'text-blue-400';
      case "Warning":
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
        <InputText onChange={handleFilter} type="text" placeholder='Search traces' variation='ultra-rounded' />
        <div className='flex-1 justify-end flex'>
          <Button onClick={handleGetLogs}>Verify</Button>
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
          {logs
            .filter(e =>
              e.message?.includes(filter) ||
              e.type?.includes(filter) ||
              e.traceId.toString()?.includes(filter) ||
              e.userId?.includes(filter)
            )
            .map(log => (
              <div key={log.id} className='pt-3 rounded flex flex-col relative gap-3'>
                <AccordionContext>
                  <AccordionRoot>
                    <Div variation='accordion-title-root'>
                      <AccordionTitle>
                        <div className='py-5 px-6 flex justify-between w-full items-center'>
                          <div className='flex items-center gap-3'>
                            <Clock className='h-4 w-4 text-gray-400' />
                            <span className={`font-semibold ${getActionTypeColor(log.action)}`}>
                              {log.message}
                            </span>
                            {log.action && (
                              <span className='text-gray-300'>- {log.action}</span>
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
                            <span className='text-sm font-semibold text-gray-300'>Message:</span>
                            <p className='text-sm text-white mt-1'>{log.message}</p>
                          </div>

                          <div>
                            <span className='text-sm font-semibold text-gray-300'>Trace ID:</span>
                            <p className='text-sm text-white mt-1'>{log.traceId}</p>
                          </div>

                          <div>
                            <span className='text-sm font-semibold text-gray-300'>Action:</span>
                            <p className='text-sm text-white mt-1 break-all'>{log.action}</p>
                          </div>

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
    </Div>
  );
}

export default Logs;
