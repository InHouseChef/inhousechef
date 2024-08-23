import { useCompanyAuthorization } from '@/hooks'
import { CompanyUserRole } from '@/types'
import { RequireCompanyRoleComponent } from '../types'
import { isAllowed } from '../utils'

export const RequireCompanyAuthorization: RequireCompanyRoleComponent<CompanyUserRole> = ({
    role,
    fallback,
    children,
    loader,
    some
}) => {
    const {
        result: { AuthorizationReady },
        roles
    } = useCompanyAuthorization()

    const allowed = isAllowed(roles, role, some)

    return <>{AuthorizationReady ? (role && allowed ? children : fallback) : loader || undefined}</>
}
export default RequireCompanyAuthorization
