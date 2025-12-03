import { Clock } from 'lucide-react';
import React from 'react'

function AppStoredFileItem(x: {
    name: string;
    createDate: string;
    updateDate: string;
    processing: boolean;
    status?: number;
    message?: string;
    version?: string;
}) {
        console.log(x)

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

    function getProcessingStatusColor(status?: number): string {
        console.log(x.name)

        if (status == 2) {
            return 'text-red-400';
        }

        if (status == 1) {
            return 'text-yellow-400';
        }

        if (status == 3) {
            return 'text-green-400';
        }

        return ""
    }

    return (
        <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-3'>
                {x.processing &&
                    <Clock className='h-4 w-4 text-gray-400' />
                }
                <p className='font-semibold'>{x.name}</p>
                {x.message &&
                    <span className={`text-xs py-1 rounded ${getProcessingStatusColor(x.status)} bg-opacity-20`}>
                        {x.message}
                    </span>
                }
            </div>
            <div className='flex gap-4 text-xs text-gray-400'>
                <span>Created: {formatDate(x.createDate)}</span>
                <span>Updated: {formatDate(x.updateDate)}</span>
            </div>
        </div>
    )
}

export default AppStoredFileItem