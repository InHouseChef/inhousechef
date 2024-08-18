'use client'

import { Company, useReadCompany, updateCompanyBrandingLogo } from "@/api/companies";
import { updateCompanyBrandingLogoSchema } from "@/app/(protected)/companies/schemas";
import { Header } from "@/components";
import { FileUploader } from "@/components/FileUploader";
import { FileUploaderContent, FileInput, FileUploaderItem, FileSvgDraw } from "@/components/FileUploader/FileUploader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Paperclip } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CompanyUpdateFormProps {
    companyCode: string
}

type CompanyBrandingLogoUpdateFormData = z.infer<typeof updateCompanyBrandingLogoSchema>

export const CompanyBrandingLogoUpdateForm = ({ companyCode }: CompanyUpdateFormProps) => {
    const [files, setFiles] = useState<File[] | null>(null);
    const [imageURL, setImageURL] = useState<string | null | undefined>(null); // State to hold image URL
    const { data: company, isLoading } = useReadCompany({ path: { companyCode } })


    // Update imageURL when a new file is uploaded
    const handleFileChange = (newFiles: File[] | null) => {
        setFiles(newFiles);
        if (newFiles && newFiles.length > 0) {
            // Assuming the first file is the image to display
            const file = newFiles[0];
            setImageURL(URL.createObjectURL(file)); // Create a URL for the image file
        }
    };

    const form = useForm<CompanyBrandingLogoUpdateFormData>({
        resolver: zodResolver(updateCompanyBrandingLogoSchema)
    })

    const { handleSubmit } = form

    useEffect(() => {
        if (company) {
            setImageURL(company.branding?.logoUrl)
        }
    }, [company])

    if (isLoading) {
        return <Loader />
    }

    const onSubmit = () => {
        const body = new FormData();

        if (files && files.length > 0)
            body.append('logo', files[0])

        updateCompanyBrandingLogo({
            path: { companyCode },
            // @ts-ignore
            body: body
        });

        setFiles([]);
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='h-full'>
                <Header heading='Company Logo' />
                <div className='mt-4'>
                    {imageURL && (
                        <div className="mt-4">
                            <img src={imageURL} width={150} height={150} alt="Uploaded Image" className="rounded-lg" />
                        </div>
                    )}
                </div>
                <div className='mt-8 flex items-center justify-between'>
                    <div className='flex items-center gap-8'>
                    <FormField
                            control={form.control}
                            name='logo'
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem>
                                    <FormControl>
                                        <FileUploader
                                            {...fieldProps}
                                            value={files}
                                            onValueChange={handleFileChange}
                                            className="relative bg-background rounded-lg p-2"
                                            >
                                            <FileInput className="outline-dashed outline-1 outline-white">
                                                <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                                                <FileSvgDraw />
                                                </div>
                                            </FileInput>
                                            <FileUploaderContent>
                                                {files &&
                                                files.length > 0 &&
                                                files.map((file, i) => (
                                                    <FileUploaderItem key={i} index={i}>
                                                    <Paperclip className="h-4 w-4 stroke-current" />
                                                    <span>{file.name}</span>
                                                    </FileUploaderItem>
                                                ))}
                                            </FileUploaderContent>
                                            </FileUploader>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className='mt-8 flex items-center justify-end'>
                    <div className='flex items-center gap-2'>
                        <Button>Update Logo</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
