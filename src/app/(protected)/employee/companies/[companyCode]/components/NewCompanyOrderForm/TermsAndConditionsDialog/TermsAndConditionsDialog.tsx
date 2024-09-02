import { useUpdateTermsAccept } from '@/api/users'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useLogout, usePathParams } from '@/hooks'
import { CompanyPath } from '@/types'
import { useState } from 'react'

interface TermsAndConditionsDialogProps {
    acceptedTerms?: boolean
}

export const TermsAndConditionsDialog = ({ acceptedTerms }: TermsAndConditionsDialogProps) => {
    const [isOpen, setIsOpen] = useState(!acceptedTerms)

    const path = usePathParams<CompanyPath>()
    const { mutate, isPending } = useUpdateTermsAccept()
    const logout = useLogout()

    const handleAcceptTerms = () =>
        mutate(
            { path, body: {} },
            {
                onSuccess: () => {
                    setIsOpen(false)
                }
            }
        )

    return (
        <Dialog open={isOpen}>
            <DialogContent className='max-w-sm sm:max-w-sm lg:max-w-lg' hideCloseButton>
                <DialogHeader>
                    <DialogTitle>Uslovi korišćenja</DialogTitle>
                    <DialogDescription>
                        Molimo vas da prihvatite uslove korišćenja kako biste nastavili sa korišćenjem aplikacije.
                        <div className='mt-2 max-h-[20vh] overflow-y-auto rounded-lg border p-2'>
                            <p className='mb-4'>
                                Please read these terms and conditions carefully before using our service.
                            </p>
                            <p className='mb-4'>
                                By accessing or using the service, you agree to be bound by these terms. If you disagree with
                                any part of the terms, then you may not access the service.
                            </p>
                            <p className='mb-4'>
                                The terms and conditions are subject to change without notice, and your continued use of the
                                service constitutes your acceptance of such changes. You should review the terms periodically
                                to ensure you understand the terms and conditions that apply to your use of the service.
                            </p>
                            <p className='mb-4'>
                                The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not
                                warrant that the service will be uninterrupted or error-free, and we disclaim all warranties,
                                express or implied, including but not limited to, warranties of merchantability and fitness
                                for a particular purpose.
                            </p>
                            <p className='mb-4'>
                                Your use of the service is at your sole risk. We will not be liable for any damages of any
                                kind arising from the use of this service, including but not limited to, direct, indirect,
                                incidental, punitive, and consequential damages.
                            </p>
                            <p className='mb-4'>
                                These terms and conditions are governed by and construed in accordance with the laws of [Your
                                Jurisdiction], and you agree to submit to the exclusive jurisdiction of the courts located
                                within [Your Jurisdiction].
                            </p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='flex-row justify-end gap-2'>
                    <Button loading={isPending} onClick={handleAcceptTerms}>
                        Prihvatam
                    </Button>
                    <Button variant='outline' onClick={logout}>
                        Ne prihvatam
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
