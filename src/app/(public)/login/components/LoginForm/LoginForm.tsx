'use client'

import { createLogin } from '@/api/logins'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useBaseUrl } from '@/hooks'
import { useIdentity } from '@/hooks/useIdentity'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createClientCredentialsSchema } from './schemas'

export const LoginForm = () => {
    const { setIdentity } = useIdentity()
    const [isPending, setIsPending] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null) // State for custom error message
    const router = useRouter()
    const { adminUrl, employeeUrl } = useBaseUrl()

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

    const onSubmit = async (formData: z.infer<typeof createClientCredentialsSchema>) => {
        setIsPending(true)
        createLogin({
            path: {},
            body: { username: formData.username, password: formData.password, grantType: 'password_credentials' }
        })
            .then(data => {
                setIdentity(data)
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        setErrorMessage('Korisničko ime ili lozinka nije ispravna.')
                    } else {
                        setErrorMessage(
                            'Došlo je do greške. Molimo pokušajte ponovo kasnije. U slučaju da se greška ponovi, kontaktirajte podršku.'
                        )
                    }
                } else if (error.request) {
                    setErrorMessage('Nema odgovora sa servera. Molimo proverite Vašu konekciju.')
                } else {
                    setErrorMessage(
                        'Došlo je do neočekivane greške. Molimo pokušajte ponovo. U slučaju da se greška ponovi, kontaktirajte podršku.'
                    )
                }
            })
            .finally(() => {
                setIsPending(false)
            })
    }

    return (
        <div className='relative mx-8 w-full max-w-md rounded-xl bg-white p-8 shadow-lg'>
            <h2 className='mb-2 text-center text-3xl font-bold'>Prijavite se</h2>
            <p className='mb-8 text-center text-sm text-gray-500'>Prijavite se na Vaš postojeći nalog</p>
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
                    {errorMessage && (
                        <div className='rounded border-red-400 bg-red-100 p-3 text-center text-red-700'>
                            <p className='text-sm'>{errorMessage}</p>
                        </div>
                    )}
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
