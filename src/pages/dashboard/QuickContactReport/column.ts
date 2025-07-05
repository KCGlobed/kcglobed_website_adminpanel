import type { ColumnDefinition } from "../../../components/Table/Table";
import type { QuickContact } from "../../../utils/types";

export const Columns: ColumnDefinition<QuickContact>[] = [
    { key: 'first_name', title: 'First Name', align: 'center' },
    { key: 'last_name', title: 'Last Name', align: 'center' },
    { key: 'email', title: 'Email', align: 'center' },
    { key: 'phone', title: 'Phone', align: 'center' },
    {
        key: 'course_info',
        title: 'Course Name',
        align: 'center',
        render: (_, row) => row.course_info?.full_name || '-'
    },
    { key: 'state', title: 'State', align: 'center' },
    { key: 'city', title: 'City', align: 'center' },
    { key: 'country', title: 'Country', align: 'center' },
    { key: 'message', title: 'Message', align: 'left' },
    { key: 'created_at', title: 'Date', align: 'center' }
]