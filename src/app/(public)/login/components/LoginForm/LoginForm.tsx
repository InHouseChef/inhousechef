'use client'

import { useCreateLogin } from '@/api/logins'
import { Error } from '@/components'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useBaseUrl } from '@/hooks'
import { useIdentity } from '@/hooks/useIdentity'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createClientCredentialsSchema } from './schemas'

export const LoginForm = () => {
    const { setIdentity } = useIdentity()
    // const [isPending, setIsPending] = useState<boolean>(false)
    const router = useRouter()
    const { adminUrl, employeeUrl } = useBaseUrl()
    const { mutate, isPending, isError, error } = useCreateLogin()

    useEffect(() => {
        router.prefetch(`${adminUrl}/companies/`)
        router.prefetch(`${employeeUrl}/companies/`)
    }, [router, adminUrl, employeeUrl])

    const form = useForm<z.infer<typeof createClientCredentialsSchema>>({
        resolver: zodResolver(createClientCredentialsSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    })

    const { control, handleSubmit } = form

    const onSubmit = (formData: z.infer<typeof createClientCredentialsSchema>) => {
        mutate(
            {
                path: {},
                body: { ...formData, grantType: 'password_credentials' }
            },
            {
                onSuccess: data => {
                    setIdentity(data)
                }
            }
        )
    }

    useEffect(() => {
        console.log(error, isError)
    }, [error, isError])

    return (
        <div className='relative mx-8 w-full max-w-md rounded-xl bg-white p-8 shadow-lg'>
            <h2 className='mb-2 text-center text-3xl font-bold'>Dobro došli</h2>
            <p className='mb-8 text-center text-sm text-gray-500'>Prijavite se na Vaš postojeći nalog</p>
            {isError ? <Error error={error} /> : undefined}
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <FormField
                        control={control}
                        name='username'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Korisničko ime</FormLabel>
                                <FormControl>
                                    <Input {...field} required autoComplete='username' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lozinka</FormLabel>
                                <FormControl>
                                    <Input {...field} type='password' required autoComplete='current-password' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Display error message */}
                    {/* {errorMessage && (
                        <div className='rounded border-red-400 bg-red-100 p-3 text-center text-red-700'>
                            <p className='text-sm'>{errorMessage}</p>
                        </div>
                    )} */}
                    <Button
                        loading={isPending}
                        type='submit'
                        className='w-full rounded-md bg-primary py-2 text-white'
                        disabled={isPending}>
                        Prijavi se
                    </Button>
                </form>
            </Form>
        </div>
    )
}
