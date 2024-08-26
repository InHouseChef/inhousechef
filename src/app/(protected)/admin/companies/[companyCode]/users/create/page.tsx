import { UserCreateForm } from './UserCreateForm/UserCreateForm'

export default function CreateUserPage({ params }: { params: { companyCode: string } }) {
    return <UserCreateForm params={params} />
}
