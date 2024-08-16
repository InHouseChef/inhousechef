'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import AuthHeader from './auth-wrapper'

interface CardWrapperProps {
    label: string
    title: string
    backButtonHref?: string
    backButtonLabel?: string
    children: React.ReactNode
}

const CardWrapper = ({ label, title, backButtonHref, backButtonLabel, children }: CardWrapperProps) => {
    return (
        <Card className='shadow-md md:w-1/2 xl:w-1/4'>
            <CardHeader>
                <AuthHeader label={label} title={title} />
            </CardHeader>
            <CardContent>{children}</CardContent>
            {/* <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref} />
            </CardFooter> */}
        </Card>
    )
}

export default CardWrapper
