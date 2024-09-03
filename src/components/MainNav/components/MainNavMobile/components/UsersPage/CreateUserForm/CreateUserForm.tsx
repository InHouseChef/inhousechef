import { createUser, RolesEnum } from '@/api/users'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/packages/components'
import { nameSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { boolean, object, string, z } from 'zod'

const createUserSchema = object({
    fullName: nameSchema.max(100, 'Ime ne može biti duže od 100 karaktera.'),
    username: string().min(1, 'Korisničko ime je obavezno.'),
    password: string()
        .min(8, 'Lozinka je obavezna.')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            'Lozinka mora imati bar 8 karaktera, sadržati barem jedno veliko slovo, jedno malo slovo i jedan broj.'
        ),
    confirmPassword: string()
        .min(8, 'Lozinka je obavezna.')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            'Potvrda lozinke se mora podudarati sa lozinkom.'
        ),
    aLaCardPermission: boolean(),
    role: z.enum([RolesEnum.CompanyManager, RolesEnum.Employee])
})

type CreateUserFormData = {
    fullName: string
    username: string
    password: string
    confirmPassword: string
    role: RolesEnum
    aLaCardPermission: boolean
}

export type CreateUserFormProps = {
    companyCode: string
    onSubmit: () => void
    onClose: () => void
}

export const CreateUserForm = ({ companyCode, onSubmit, onClose }: CreateUserFormProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null) // Error state

    const form = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            fullName: '',
            username: '',
            password: '',
            confirmPassword: '',
            role: RolesEnum.Employee,
            aLaCardPermission: false
        }
    })

    const { control, handleSubmit } = form

    const handleOnClose = () => {
        onClose()
    }

    const submit = async (formData: CreateUserFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            await createUser({
                path: {
                    companyCode
                }, 
                body: {
                    fullName: formData.fullName,
                    username: formData.username,
                    password: formData.password,
                    role: formData.role,
                    aLaCardPermission: formData.aLaCardPermission
                }
            })
            onSubmit()
        } catch (error) {
            setError(`Dodavanje korisnika je neuspešno.`) // Set error message
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(submit)} className='space-y-8'>
                <div className='grid grid-cols-12 gap-4 p-4'>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='fullName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ime i prezime</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Korisničko ime</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lozinka</FormLabel>
                                    <FormControl>
                                        <Input {...field} type='password' value={field.value || ''} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='confirmPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Potvrda lozinke</FormLabel>
                                    <FormControl>
                                        <Input {...field} type='password' value={field.value || ''} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='role'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pozicija</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select role' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={RolesEnum.CompanyManager}>Menadžer</SelectItem>
                                                <SelectItem value={RolesEnum.Employee}>Radnik</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='aLaCardPermission'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>A la carte dozvola</FormLabel>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value} // Bind checked state to form value
                                            onChange={checked => field.onChange(checked)} // Handle change
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Display the error message if exists */}
                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className='py-6 flex items-center justify-center gap-4'>
                    <Button variant="outline" onClick={handleOnClose}>Otkaži</Button>
                    <Button variant="default" type="submit" loading={isLoading}>
                        Dodaj
                    </Button>
                </div>
            </form>
        </Form>
    )
}
