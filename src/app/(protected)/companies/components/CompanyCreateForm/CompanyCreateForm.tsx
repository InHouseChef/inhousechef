'use client'

import { CreateCompanyRequest, useCreateCompany } from '@/api/companies'
import { Header } from '@/components'
import { Button, Form } from '@/packages/components'
import { ColorInput, Input } from '@/packages/components/Form/components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { createCompanySchema } from '../../schemas'

interface CreateCompanyFormData extends CreateCompanyRequest {}

export const CompanyCreateForm = () => {
    const router = useRouter()
    const { mutate: createCompany } = useCreateCompany()
    const {
        control,
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<CreateCompanyFormData>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver: yupResolver(createCompanySchema)
    })

    const onSubmit: SubmitHandler<CreateCompanyRequest> = formData => {
        createCompany(
            { path: {}, body: formData },
            {
                // onSuccess: data => {
                //     router.push(`/companies/${data.id}`)
                // }
            }
        )
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className='h-full'>
            <Header heading='Create Company' />
            <div className='grid grid-cols-12'>
                <div className='col-span-6'>
                    <div className='grid grid-cols-12 gap-3'>
                        <div className='col-span-6'>
                            <Input
                                {...register('name')}
                                message={errors.name?.message}
                                label='Company Name'
                                placeholder='Kristal Ketering'
                            />
                        </div>
                        <div className='col-span-12'>
                            <div className='flex items-center gap-4'>
                                <Input
                                    {...register('address.street')}
                                    message={errors.address?.street?.message}
                                    label='Street'
                                    placeholder='Save Kovačevića 1'
                                />
                                <Input
                                    {...register('address.city')}
                                    message={errors.address?.city?.message}
                                    label='City'
                                    placeholder='Novi Sad'
                                />
                            </div>
                        </div>
                        <div className='col-span-6'>
                            <Input
                                {...register('telephone')}
                                message={errors.telephone?.message}
                                label='Telephone'
                                placeholder='123-456-7890'
                            />
                        </div>
                    </div>
                </div>
                <div className='col-span-6'>
                    <h2 className='text-center text-3xl text-white'>Logo</h2>
                </div>
            </div>
            <h2 className='mt-16 text-center text-3xl font-semibold text-white'>Branding</h2>
            <div className='mt-2 flex items-center justify-between'>
                <div className='flex items-center gap-8'>
                    <div>
                        <Controller
                            control={control}
                            name='branding.primaryColor'
                            render={({ field }) => (
                                <ColorInput
                                    label='Primary Color'
                                    required
                                    {...field}
                                    message={errors.branding?.primaryColor?.message}
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name='branding.secondaryColor'
                            render={({ field }) => (
                                <ColorInput
                                    label='Secondary Color'
                                    required
                                    {...field}
                                    message={errors.branding?.secondaryColor?.message}
                                />
                            )}
                        />
                    </div>
                </div>
                {/* <div>
                    <Controller
                        control={control}
                        name='branding.logoUrl'
                        render={({ field }) => (
                            <FileInput
                                label='Logo'
                                {...field}
                                options={{ accept: LOGO_ACCEPTED_FILE_TYPES }}
                                requirements
                                showSize={false}
                                showName={false}
                                message={errors.branding?.logoUrl?.message}
                            />
                        )}
                    />
                </div> */}
            </div>
            <div className='mt-4'></div>
            <div className='mt-8 flex items-center justify-end'>
                <Button>Create Company</Button>
            </div>
        </Form>
    )
}
