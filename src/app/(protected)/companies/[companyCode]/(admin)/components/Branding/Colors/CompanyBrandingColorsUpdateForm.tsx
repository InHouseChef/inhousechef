'use client'

import { Company, useReadCompany, updateCompanyBrandingColors } from "@/api/companies";
import { updateCompanyBrandingColorsSchema } from "@/app/(protected)/companies/schemas";
import { Header } from "@/components";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CompanyUpdateFormProps {
    companyCode: string
}

type CompanyBrandingColorsUpdateFormData = z.infer<typeof updateCompanyBrandingColorsSchema>

export const CompanyBrandingColorsUpdateForm = ({ companyCode }: CompanyUpdateFormProps) => {
    const { data: company, isLoading } = useReadCompany({ path: { companyCode } })

    const form = useForm<CompanyBrandingColorsUpdateFormData>({
        resolver: zodResolver(updateCompanyBrandingColorsSchema),
        defaultValues: {
            primaryColor: company?.branding?.primaryColor || '',
            secondaryColor: company?.branding?.secondaryColor || ''
        }
    })

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors }
    } = form

    useEffect(() => {
        if (company) {
            reset({
                primaryColor: company.branding?.primaryColor,
                secondaryColor: company.branding?.secondaryColor
            });
        }
    }, [company, reset])

    if (isLoading) {
        return <Loader />
    }

    const onSubmit = async (formData: CompanyBrandingColorsUpdateFormData) => {
        const updateResult = await updateCompanyBrandingColors({
            path: { companyCode },
            body: formData
        });

        reset({
            primaryColor: updateResult.branding?.primaryColor,
            secondaryColor: updateResult.branding?.secondaryColor
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='h-full'>
                <Header heading='Branding' />
                <div className='grid grid-cols-2'>
                    <div className='col-span-2'>
                        <div className='grid grid-cols-2 gap-3'>
                            <div className='col-span-1'>
                                <FormField
                                    control={control}
                                    name="primaryColor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Primary</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value} required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-1'>
                                <FormField
                                    control={control}
                                    name='secondaryColor'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Secondary</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value} required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-4'></div>
                <div className='mt-8 flex items-center justify-end'>
                    <div className='flex items-center gap-2'>
                        <Button>Save</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
