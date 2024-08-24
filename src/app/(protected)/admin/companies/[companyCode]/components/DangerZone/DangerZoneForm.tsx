'use client'

import { useDeleteCompany, useReadCompany } from '@/api/companies'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Header, Loader } from '@/components'
import { useRouter } from 'next/navigation'

interface DangerZoneProps {
    companyCode: string
}

export const DangerZone = ({ companyCode }: DangerZoneProps) => {
    const { data: company, isLoading } = useReadCompany({ path: { companyCode } })
    const { mutate: deleteCompany } = useDeleteCompany()
    const router = useRouter()

    const handleDeleteCompany = () => {
        deleteCompany({ path: { companyCode } }, {
            onSuccess: () => {
                router.push('/companies') // Redirect after deletion
            }
        })
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="bg-red-100 border text-red-700 px-4 py-3">
            <Header heading="Danger Zone"/>
            <p className="mt-2">
                Deleting a company is a permanent action and cannot be undone. This will permanently delete the company 
                and all related data. Please be certain before proceeding.
            </p>
            <div className="mt-4">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive">
                            Delete Company
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete {company?.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the company and all related data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteCompany}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
