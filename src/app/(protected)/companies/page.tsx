import { Header } from '@/components'
import { Button } from '@/packages/components'
import { CompanyList } from './components/CompanyList/CompanyList'

export default function Companies() {
    return (
        <>
            <Header heading='Companies'>
                <Button>Create Company</Button>
            </Header>
            <CompanyList />
        </>
    )
}
