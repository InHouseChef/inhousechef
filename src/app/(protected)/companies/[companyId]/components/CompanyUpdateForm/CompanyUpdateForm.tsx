'use client'

import { updateCompany, UpdateCompanyRequest, useDeleteCompany, useReadCompany } from '@/api/companies'
import { Header, Loader } from '@/components'
import { LOGO_ACCEPTED_FILE_TYPES } from '@/constants'
import { Button, Form, Input } from '@/packages/components'
import { ColorInput } from '@/packages/components/Form/components'
import { FileInput } from '@/packages/third-party/FileInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { createCompanySchema } from '../../../schemas'

interface CompanyUpdateFormProps {
    companyId: string
}

export const CompanyUpdateForm = ({ companyId }: CompanyUpdateFormProps) => {
    const { data: company, isLoading } = useReadCompany({ path: { companyId } })
    const { mutate: deleteCompany } = useDeleteCompany()

    const {
        control,
        reset,
        handleSubmit,
        register,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver: yupResolver(createCompanySchema)
    })

    useEffect(() => {
        if (!company) return
        reset(company)
    }, [company])

    if (isLoading) {
        return <Loader />
    }

    const onSubmit: SubmitHandler<UpdateCompanyRequest> = formData => {
        updateCompany({ path: { companyId }, body: formData })
    }

    // TODO: add confirmation modal
    const handleDeleteCompany = () => deleteCompany({ path: { companyId } })

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className='h-full'>
            <Header heading='Company Information' />
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
            <div className='mt-8 flex items-center justify-between'>
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
                <div>
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
                </div>
            </div>
            <div className='mt-4'></div>
            <div className='mt-8 flex items-center justify-end'>
                <div className='flex items-center gap-2'>
                    <Button type='button' variant='outline' onClick={handleDeleteCompany}>
                        Delete Company
                    </Button>
                    <Button>Update Company</Button>
                </div>
            </div>
        </Form>
    )
}
