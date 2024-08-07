'use client'
import { useCreateLogin } from '@/api/logins'
import { Error } from '@/components'
import { useIdentity } from '@/hooks/useIdentity'
import { Button, Form, Input, Password } from '@/packages/components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { createClientCredentialsSchema, CreateClientCredentialsSchema } from './schemas'

export const LoginForm = () => {
    const { setIdentity } = useIdentity()

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver: yupResolver(createClientCredentialsSchema)
    })

    const { mutate, isPending, isError, error } = useCreateLogin()

    const onSubmit: SubmitHandler<CreateClientCredentialsSchema> = formData => {
        mutate(
            {
                path: '',
                body: {
                    ...formData,
                    grantType: 'password_credentials'
                }
            },
            {
                onSuccess: data => {
                    setIdentity(data)

                    router.replace('/dashboard')
                }
            }
        )
    }

    return (
        <>
            <h1>Welcome to Kristal Ketering</h1>

            {isError ? <Error error={error} /> : undefined}
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className='mt-5' />
                <div className='grid gap-5'>
                    <div className='col-span-12'>
                        <Input
                            label='Username'
                            placeholder='John Smith'
                            type='text'
                            autoComplete='username'
                            {...register('username')}
                            message={errors.username?.message}
                            required
                        />
                    </div>
                    <div className='col-span-12'>
                        <Password
                            label='Password'
                            {...register('password')}
                            autoComplete='password'
                            message={errors.password?.message}
                            required
                        />
                        <div className='mt-3' />
                        {/* <div className='flex justify-end'>
                            <Link href='forgot-password'>
                                <span className='text-grey'>Forgot Password?</span>
                            </Link>
                        </div> */}
                    </div>
                    <div className='col-span-12 mt-8'>
                        <Button className='w-full max-w-none justify-center' size='lg' isLoading={isPending}>
                            Login to Kristal Ketering
                        </Button>
                    </div>
                </div>
            </Form>
        </>
    )
}
