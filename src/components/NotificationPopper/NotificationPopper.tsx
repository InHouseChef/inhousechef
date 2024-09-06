import { useCartStore } from '@/app/(protected)/newstate'
import { useEffect } from 'react'
import { toast, Toaster } from 'sonner'

export const NotificationPopper = () => {
    const { message, messageType, setMessage } = useCartStore()

    useEffect(() => {
        if (!message || !message.text) return

        const { text, description } = message

        if (messageType === 'success') {
            toast.success(text, { description, duration: 5000 })
        }

        if (messageType === 'error') {
            toast.error(text, { description, duration: 5000 })
        }

        const timer = setTimeout(() => {
            setMessage(undefined, undefined)
        }, 5000)

        return () => clearTimeout(timer)
    }, [message, messageType, setMessage])

    return <Toaster richColors position='top-right' />
}
