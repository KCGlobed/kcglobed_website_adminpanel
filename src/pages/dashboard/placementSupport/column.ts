import type { ColumnDefinition } from "../../../components/Table/Table";
import type { PlacementSupport } from "../../../utils/types";

export const Columns: ColumnDefinition<PlacementSupport>[] = [
    { key: 'first_name', title: 'First Name', align: 'center' },
    { key: 'last_name', title: 'Last Name', align: 'center' },
    { key: 'email', title: 'Email', align: 'center' },
    { key: 'phone', title: 'Phone', align: 'center' },
    { key: 'career', title: 'Career', align: 'center' },
    { key: 'qualification', title: 'Qualification', align: 'center' },
    { key: 'experience', title: 'Experience', align: 'center' },
    { key: 'current_compay', title: 'Current Company', align: 'center' },
    { key: 'address', title: 'Address', align: 'left' },
    { key: 'state', title: 'State', align: 'center' },
    { key: 'city', title: 'City', align: 'center' },
    { key: 'country', title: 'Country', align: 'center' },
    { key: 'pincode', title: 'Pincode', align: 'center' },
    { key: 'message', title: 'Message', align: 'left' },
    { key: 'created_at', title: 'Date', align: 'center' }
]