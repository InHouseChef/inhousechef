import { DailyMenuMeal } from '@/api/daily-menus'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import clsx from 'clsx'
import Image from 'next/image'

interface MealCardProps extends DailyMenuMeal {
    isOrdered: boolean
    onOrder: () => void
}

export const MealCard = ({ name, description, price, imageUrl, isOrdered, onOrder }: MealCardProps) => {
    const formattedDescription = description.split('\n').map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ))

    return (
        <Card className='flex w-full items-center justify-between gap-4'>
            <Image src={imageUrl || ''} alt={name} className='h-16 w-16 rounded-lg object-cover' />
            <CardContent className='flex flex-col justify-end gap-1'>
                <CardHeader>
                    <CardTitle className='text- font-semibold'>{name}</CardTitle>
                    <CardDescription className='text-sm text-gray-600'>{formattedDescription}</CardDescription>
                </CardHeader>
                <p className='text-lg font-bold'>{price} RSD</p>
                <Button
                    className={clsx('rounded-full', {
                        'bg-emerald-600 text-white': isOrdered,
                        'bg-primary text-white': !isOrdered
                    })}
                    onClick={onOrder}>
                    {isOrdered ? 'Poručeno' : 'Poruči'}
                </Button>
            </CardContent>
        </Card>
    )
}

export default MealCard
