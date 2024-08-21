import { ShiftCreateForm } from "./ShiftCreateForm/ShiftCreateForm";

export default function CreateShiftPage({ params }: { params: { companyCode: string } }) {

    return <ShiftCreateForm params={params} />
}