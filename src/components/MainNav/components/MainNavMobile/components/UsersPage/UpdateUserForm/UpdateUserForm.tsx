import { ReadUserResponse, RolesEnum, useUpdateUserProfile } from '@/apis/users'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { nameSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { object, z } from 'zod'

const updateUserProfileSchema = object({
    fullName: nameSchema.max(100, 'Name cannot be longer than 100 characters.'),
    role: z.enum([RolesEnum.CompanyManager, RolesEnum.Employee, RolesEnum.RestaurantWorker])
})

type UpdateUserProfileData = {
    fullName: string
    role: RolesEnum
}

export type UpdateUserFormProps = {
    companyCode: string
    user: ReadUserResponse
    onSubmit: () => void
    onClose: () => void
}

export const UpdateUserForm = ({ companyCode, user, onSubmit, onClose }: UpdateUserFormProps) => {
    const { mutate: updateUserProfile } = useUpdateUserProfile()
    const form = useForm<UpdateUserProfileData>({
        resolver: zodResolver(updateUserProfileSchema),
        defaultValues: {
            fullName: user.fullName,
            role: user.role
        }
    })

    const { control, handleSubmit } = form

    const handleOnClose = () => {
        onClose()
    }

    const submit = (formDate: UpdateUserProfileData) => {
        updateUserProfile({
            path: { companyCode, userId: user.id },
            body: {
                fullName: formDate.fullName,
                role: formDate.role
            }
        })
        onSubmit()
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
                </div>
                <div className='py-6 flex items-center justify-center gap-4'>
                    <Button variant="outline" onClick={handleOnClose}>Otkaži</Button>
                    <Button variant="default" type="submit">Sačuvaj</Button>
                </div>
            </form>
        </Form>
    )
}
