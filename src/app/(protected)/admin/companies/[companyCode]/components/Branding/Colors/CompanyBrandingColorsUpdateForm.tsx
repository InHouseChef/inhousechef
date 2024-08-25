'use client'

import { readCompany, updateCompanyBrandingColors } from '@/api/companies'
import { updateCompanyBrandingColorsSchema } from '@/app/(protected)/admin/companies/schemas'
import { Header } from '@/components'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { RgbaColorPicker } from 'react-colorful'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface CompanyUpdateFormProps {
    companyCode: string
}

type CompanyBrandingColorsUpdateFormData = z.infer<typeof updateCompanyBrandingColorsSchema>

const defaultColor = '#ffffffff'

export const CompanyBrandingColorsUpdateForm = ({ companyCode }: CompanyUpdateFormProps) => {
    const [company, setCompany] = useState<any>(null) // State to store company data
    const [isLoading, setIsLoading] = useState(true)
    const [initialPrimaryColor, setInitialPrimaryColor] = useState(defaultColor)
    const [initialSecondaryColor, setInitialSecondaryColor] = useState(defaultColor)
    const [primaryColor, setPrimaryColor] = useState(defaultColor)
    const [secondaryColor, setSecondaryColor] = useState(defaultColor)
    const [hasChanges, setHasChanges] = useState(false)

    const form = useForm<CompanyBrandingColorsUpdateFormData>({
        resolver: zodResolver(updateCompanyBrandingColorsSchema),
        defaultValues: {
            primaryColor: '',
            secondaryColor: ''
        }
    })

    const { reset, handleSubmit } = form

    useEffect(() => {
        const fetchCompanyData = async () => {
            setIsLoading(true)
            try {
                const result = await readCompany({ path: { companyCode }, query: {} })
                setCompany(result)

                const initialPrimary = result.branding?.primaryColor || defaultColor
                const initialSecondary = result.branding?.secondaryColor || defaultColor

                setInitialPrimaryColor(initialPrimary)
                setInitialSecondaryColor(initialSecondary)
                setPrimaryColor(initialPrimary)
                setSecondaryColor(initialSecondary)

                reset({
                    primaryColor: initialPrimary,
                    secondaryColor: initialSecondary
                })
            } catch (error) {
                console.error('Failed to fetch company data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCompanyData()
    }, [companyCode, reset])

    useEffect(() => {
        // Check if the colors have changed from the initial values
        setHasChanges(primaryColor !== initialPrimaryColor || secondaryColor !== initialSecondaryColor)
    }, [primaryColor, secondaryColor, initialPrimaryColor, initialSecondaryColor])

    if (isLoading) {
        return <Loader />
    }

    const hexToRgba = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        const a = parseInt(hex.slice(7, 9), 16) / 255
        return { r, g, b, a }
    }

    const rgbaToHex = ({ r, g, b, a }: { r: number; g: number; b: number; a: number }) =>
        `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${Math.round(
            a * 255
        )
            .toString(16)
            .padStart(2, '0')}`

    const onSubmit = async (formData: CompanyBrandingColorsUpdateFormData) => {
        const data = {
            primaryColor,
            secondaryColor
        }

        try {
            const updateResult = await updateCompanyBrandingColors({
                path: { companyCode },
                body: data
            })

            const updatedPrimary = updateResult.branding?.primaryColor || defaultColor
            const updatedSecondary = updateResult.branding?.secondaryColor || defaultColor

            setInitialPrimaryColor(updatedPrimary)
            setInitialSecondaryColor(updatedSecondary)
            setPrimaryColor(updatedPrimary)
            setSecondaryColor(updatedSecondary)

            reset({
                primaryColor: updatedPrimary,
                secondaryColor: updatedSecondary
            })

            setHasChanges(false) // Reset the change state after saving
        } catch (error) {
            console.error('Failed to update branding colors:', error)
        }
    }

    const handleReset = () => {
        // Reset the colors to the initial values
        setPrimaryColor(initialPrimaryColor)
        setSecondaryColor(initialSecondaryColor)
        setHasChanges(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='h-full space-y-6'>
                <Header heading='Branding' />
                <div className='flex'>
                    <div className='flex flex-row gap-8'>
                        <FormField
                            control={form.control}
                            name='primaryColor'
                            render={() => (
                                <FormItem>
                                    <FormLabel>Primary Color</FormLabel>
                                    <FormControl>
                                        <RgbaColorPicker
                                            color={hexToRgba(primaryColor)}
                                            onChange={color => setPrimaryColor(rgbaToHex(color))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='secondaryColor'
                            render={() => (
                                <FormItem>
                                    <FormLabel>Secondary Color</FormLabel>
                                    <FormControl>
                                        <RgbaColorPicker
                                            color={hexToRgba(secondaryColor)}
                                            onChange={color => setSecondaryColor(rgbaToHex(color))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='w-1/2'></div>
                </div>
                <div className='mt-8 flex items-center justify-end gap-4'>
                    <Button variant='outline' type='button' onClick={handleReset} disabled={!hasChanges}>
                        Reset
                    </Button>
                    <Button type='submit' disabled={!hasChanges}>
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}
