import { CompanyUserCreateForm } from "./CompanyUserCreateForm/CompanyUserCreateForm";


export default function CreateUserPage({ params }: { params: { companyCode: string } }) {

    return <CompanyUserCreateForm params={params} />
}
