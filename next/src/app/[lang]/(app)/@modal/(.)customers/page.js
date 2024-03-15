import { Modal } from './modal';
import CustomersTable from '@/app/[lang]/ui/customers';

// Intercepting Routes can be used together with Parallel Routes to create modals.
// Intercepting routes - (.) to match segments on the same level
// By separating the <Modal> functionality from the modal content (<CustomersTable>),
// you can ensure any content inside the modal, e.g. forms, are Server Components.

export default function Page() {
    return (
        <Modal>
            <CustomersTable />
        </Modal>
    )
}
