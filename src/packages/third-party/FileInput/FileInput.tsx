import { MAX_FILE_UPLOAD_SIZE, MIME_TYPES } from '@/constants'
import { EventButton, Label, Message } from '@/packages/components'
// import { Trash } from '@/packages/icons'
// import {
//     CsvIllustration,
//     DocxIllustration,
//     JpgIllustration,
//     OtherIllustration,
//     PdfIllustration,
//     PngIllustration,
//     XlsxIllustration
// } from '@/packages/illustrations'
import { FileTypes } from '@/types'
import { removeArrayItemByIndex } from '@/utils'
import clsx from 'clsx'
import Image from 'next/image'
import { ForwardRefExoticComponent, MouseEvent, RefAttributes, forwardRef, useCallback, useEffect, useState } from 'react'
import { Accept, DropzoneOptions, ErrorCode, useDropzone } from 'react-dropzone'
import { ControllerRenderProps } from 'react-hook-form'
import { FileInputCircleCheck } from './components/FileInputCircleCheck/FileInputCircleCheck'
import { FileInputCircleUpload } from './components/FileInputCircleUpload/FileInputCircleUpload'
import { FileInputCircleX } from './components/FileInputCircleX/FileInputCircleX'
import { FileInputRequirement } from './components/FileInputRequirement/FileInputRequirement'
import { FILE_ERROR_CODE_MESSAGES } from './constants'
import { formatBytes } from './utils/file'

type FileInputOptions = Omit<DropzoneOptions, 'accept'> & {
    accept?: FileTypes[]
}

type FileInputProps = Pick<ControllerRenderProps, 'onChange' | 'onBlur' | 'value' | 'name'> & {
    message?: string
    options?: FileInputOptions
    label?: string
    required?: boolean
    description?: string
    previewVariant?: 'light' | 'dark'
    requirements?: boolean
    showName?: boolean
    showSize?: boolean
    multiple?: boolean
}
type MimeValueType = (typeof MIME_TYPES)[keyof typeof MIME_TYPES]

// const MIME_ICONS: Record<MimeValueType, ReactElement> = {
//     'application/msword': <DocxIllustration />,
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <DocxIllustration />,
//     'application/pdf': <PdfIllustration />,
//     'image/jpeg': <JpgIllustration />,
//     'image/png': <PngIllustration />,
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <XlsxIllustration />,
//     'text/csv': <CsvIllustration />,
//     'image/svg+xml': <OtherIllustration />
// }

export const FileInput: ForwardRefExoticComponent<FileInputProps & RefAttributes<HTMLDivElement>> = forwardRef<
    HTMLDivElement,
    FileInputProps
>(
    (
        {
            onChange,
            options,
            message,
            value,
            label,
            required,
            description,
            previewVariant,
            requirements,
            showName = true,
            showSize = true,
            multiple
        },
        ref
    ) => {
        const [files, setFiles] = useState<File[]>()
        const [previewUrl, setPreviewUrl] = useState<string>()
        const [fileErrorMessage, setFileErrorMessage] = useState<string>()
        const [dropzoneOptions, setDropzoneOptions] = useState<DropzoneOptions>()

        const updatePreview = useCallback((file?: File) => {
            if (file && file?.type?.startsWith('image/')) {
                const url = URL.createObjectURL(file)
                setPreviewUrl(url)
                return () => URL.revokeObjectURL(url)
            } else setPreviewUrl(undefined)
        }, [])

        useEffect(() => {
            if (!value) return
            setFiles(Array.isArray(value) ? value : [])
            updatePreview(value[0])
        }, [value])

        const handleDrop = (files: File[]) => {
            setFiles(files)
            onChange(files)
            updatePreview(files?.[0])
        }

        useEffect(() => {
            if (!options) return
            const { accept, ...restOptions } = options
            let dropZoneAccept: Accept | undefined
            for (const type of options?.accept || []) {
                if (!dropZoneAccept) dropZoneAccept = {}
                dropZoneAccept[MIME_TYPES[type]] = [`.${type}`]
            }
            const dzOptions: DropzoneOptions = {
                maxSize: MAX_FILE_UPLOAD_SIZE,
                ...restOptions,
                accept: dropZoneAccept,
                multiple,
                onDrop: handleDrop
            }
            setDropzoneOptions(dzOptions)
        }, [options])

        const { getRootProps, getInputProps, isDragAccept, isDragReject, fileRejections, isDragActive } =
            useDropzone(dropzoneOptions)

        useEffect(() => {
            const errorCode = fileRejections[0] ? fileRejections[0].errors[0].code : undefined
            if (!errorCode) return setFileErrorMessage(undefined)
            setFileErrorMessage(FILE_ERROR_CODE_MESSAGES[errorCode as ErrorCode])
        }, [fileRejections])

        const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            setFiles([])
            onChange([])
        }

        const handleRemoveFile = (index: number) => {
            if (!files) return
            const newArray = removeArrayItemByIndex(files, index)
            setFiles(newArray)
            onChange(newArray)
        }

        const fileInputDescription = multiple ? (
            <>
                Drop your files here or <span>Browse Files</span>
            </>
        ) : (
            <>
                Drop your file here or <span>Browse Files</span>
            </>
        )
        const root = (
            <div className='flex flex-1 items-center gap-4 p-4' {...getRootProps()}>
                <input {...getInputProps()} />
                <div>
                    <FileInputCircleUpload />
                </div>
                <div className='flex flex-col gap-1'>
                    <p className='text-sm leading-6'>
                        <span className='text-primary'>{fileInputDescription}</span>
                    </p>
                    <FileInputRequirement
                        description={description}
                        accept={options?.accept}
                        maxSize={dropzoneOptions?.maxSize}
                    />
                </div>
            </div>
        )
        const content = files?.length ? (
            <div className='flex items-center gap-4 p-4' {...getRootProps()}>
                <input {...getInputProps()} />
                <div>
                    {previewUrl && !multiple ? (
                        <Image
                            className={clsx(
                                'max-h-20 max-w-[130px] rounded-lg border p-3',
                                previewVariant === 'dark' ? 'border-grey500 bg-grey500' : 'border-grey300 bg-white'
                            )}
                            width={130}
                            height={130}
                            src={previewUrl}
                            alt='Preview'
                        />
                    ) : (
                        <FileInputCircleCheck />
                    )}
                </div>
                <div>
                    {showName && !multiple ? (
                        <div className='flex items-center gap-2'>
                            {/* <Excerpt ch={25} text={files[0]?.name} /> */}
                            <p>{files[0]?.name}</p>
                            <button
                                type='button'
                                className='h-5 w-5 border-0 bg-transparent p-0 text-grey500 transition-colors hover:text-red500'
                                onClick={handleRemove}>
                                <FileInputCircleX />
                            </button>
                        </div>
                    ) : undefined}
                    <div className='flex'>
                        {showSize && !multiple ? (
                            <p className='text-grey'>File size: {formatBytes(files[0]?.size)}</p>
                        ) : undefined}
                        {dropzoneOptions?.maxSize ? (
                            <p className='text-grey500'>Maximum file size {formatBytes(dropzoneOptions?.maxSize)}</p>
                        ) : undefined}
                    </div>
                    {requirements && options?.accept ? (
                        <p className='text-grey'>
                            {description} We support {options?.accept.join(', ')}
                        </p>
                    ) : undefined}
                </div>
            </div>
        ) : undefined

        const multipleUploadedFiles = (
            <>
                <div className='mt-6 flex flex-col gap-4'>
                    <Label>Uploaded Files</Label>
                    <div className='flex flex-col gap-3'>
                        {files?.map(({ name, size, type }, index) => (
                            <div key={index} className='flex items-center justify-between rounded-lg bg-grey100 p-1'>
                                <div className='flex items-center gap-2'>
                                    <div className='flex items-center justify-center rounded-lg border border-grey300 bg-white p-1.5'>
                                        {/* {MIME_ICONS[type]}
                                         */}
                                    </div>
                                    <div className='flex flex-col gap-0'>
                                        <p>{name}</p>
                                        <p className='text-grey'>{formatBytes(size)}</p>
                                    </div>
                                </div>
                                <EventButton style={{ paddingRight: '8px' }} onClick={() => handleRemoveFile(index)}>
                                    {/* <Trash /> */}
                                </EventButton>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
        return (
            <div className={clsx('rounded-2xl border p-6', multiple && 'gap-5 border-grey300 bg-white')}>
                <div
                    className={clsx('flex flex-col', {
                        'gap-4': multiple,
                        'gap-0': !multiple
                    })}>
                    {label ? <Label required={required}>{label}</Label> : undefined}
                    <div
                        ref={ref}
                        className={clsx(
                            'relative flex min-h-[104px] w-full cursor-pointer rounded-2xl border-dashed bg-white bg-auto bg-right bg-no-repeat transition-colors',
                            isDragActive ? 'border-primary bg-[rgba(0,0,0,0.025)]' : 'border-primary400',
                            (isDragReject || message) && 'border-red'
                        )}
                        style={{ backgroundImage: "url('/images/file-upload.svg')" }}>
                        {files?.length && !multiple ? content : root}
                        {message || fileErrorMessage ? <Message>{fileErrorMessage || message}</Message> : undefined}
                    </div>
                </div>
                {multiple && files?.length ? multipleUploadedFiles : undefined}
            </div>
        )
    }
)

FileInput.displayName = 'FileInput'
export default FileInput
