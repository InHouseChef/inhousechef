import { RefObject } from 'react'

import { useEventListener } from './useEventListener'

type useOnClickOutsideProps<T extends HTMLElement = HTMLElement> = {
    ref: RefObject<T>
    onEvent: (event: MouseEvent | Event) => void
    mouseEvent?: 'mousedown' | 'mouseup'
    exceptions?: RefObject<T>[]
}

export const useOnClickOutside = ({
    ref,
    onEvent,
    mouseEvent = 'mousedown',
    exceptions = []
}: useOnClickOutsideProps): void => {
    useEventListener(mouseEvent, event => {
        const el = ref?.current

        if (!el || el.contains(event.target as Node)) return

        for (const exception of exceptions) {
            if (exception.current?.contains(event.target as Node)) return
        }

        onEvent(event)
    })
}
