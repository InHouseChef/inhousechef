import { ErrorCode } from 'react-dropzone'

export const FILE_ERROR_CODE_MESSAGES: Record<ErrorCode, string> = {
    'file-invalid-type': 'Unsupported File Type.',
    'file-too-large': 'File is too large.',
    'file-too-small': 'File is too small.',
    'too-many-files': 'Too many files.'
}
