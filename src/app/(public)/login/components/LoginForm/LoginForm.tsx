'use client'

import { createLogin } from '@/api/logins'
import { Loader } from '@/components'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useIdentity } from '@/hooks/useIdentity'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createClientCredentialsSchema } from './schemas'
import { AxiosError } from 'axios'
import { useState } from 'react'

export const LoginForm = () => {
    const { setIdentity } = useIdentity()
    const [isPending, setIsPending] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)  // State for custom error message

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
        createLogin({ body: {username: formData.username, password: formData.password, grantType: 'password_credentials'} })
            .then(data => {
                console.log('setting identity to', data)
                setIdentity(data)
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        setErrorMessage('Korisničko ime ili lozinka nije ispravna.')
                    } else {
                        setErrorMessage('Došlo je do greške. Molimo pokušajte ponovo kasnije. U slučaju da se greška ponovi, kontaktirajte podršku.')
                    }
                } else if (error.request) {
                    setErrorMessage('Nema odgovora sa servera. Molimo proverite Vašu konekciju.')
                } else {
                    setErrorMessage('Došlo je do neočekivane greške. Molimo pokušajte ponovo. U slučaju da se greška ponovi, kontaktirajte podršku.')
                }
            })
            .finally(() => setIsPending(false))
    }

    return (
        <div className="w-full relative max-w-md mx-8 p-8 bg-white rounded-xl shadow-lg">
            {isPending && <Loader className='rounded-xl' />}
            <h2 className="text-3xl font-bold text-center mb-2">Prijavite se</h2>
            <p className="text-center text-sm text-gray-500 mb-8">Prijavite se na Vaš postojeći nalog</p>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Korisničko ime</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="example@gmail.com" required autoComplete="username" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lozinka</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" required autoComplete="current-password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Display error message */}
                    {errorMessage && (
                        <div className='border-red-400 bg-red-100 text-red-700 rounded p-3 text-center'>
                            <p className='text-sm'>{errorMessage}</p>
                        </div>
                    )}
                    <Button type="submit" className="w-full bg-primary text-white py-2 rounded-md" disabled={isPending}>
                        {!isPending ? 'PRIJAVI SE' : 'Učitavanje...'}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
