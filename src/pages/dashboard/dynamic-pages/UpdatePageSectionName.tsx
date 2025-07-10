import React from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../../components/TextEditor/ui/Button'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { updatePageNameData, updateSectionNameData, getAllPageNames, getAllSection } from '../../../store/slices/pagesSlice'
import { useAlert } from '../../../context/AlertContext'

const FormError = ({ error }: { error?: string }) =>
    error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null

interface PageFormData {
    page_type: string
}

interface SectionFormData {
    section_type: string
    page_type: string
}

interface UpdatePageSectionNameProps {
    type: 'page' | 'section'
    editingItem: any
    onSuccess: () => void
    onClose: () => void
}

const UpdatePageSectionName: React.FC<UpdatePageSectionNameProps> = ({ type, editingItem, onSuccess, onClose }) => {
    const dispatch = useAppDispatch()
    const { showAlert } = useAlert()
    const { data, loading } = useAppSelector(state => state.pages)

    // Page form
    const {
        register: registerPage,
        handleSubmit: handleSubmitPage,
        setValue: setValuePage,
        formState: { errors: errorsPage }
    } = useForm<PageFormData>({ defaultValues: { page_type: editingItem?.page_type || '' } })

    // Section form
    const {
        register: registerSection,
        handleSubmit: handleSubmitSection,
        setValue: setValueSection,
        formState: { errors: errorsSection }
    } = useForm<SectionFormData>({
        defaultValues: {
            section_type: editingItem?.section_type || '',
            page_type: editingItem?.page_info?.id || ''
        }
    })

    React.useEffect(() => {
        if (type === 'page' && editingItem) {
            setValuePage('page_type', editingItem.page_type)
        } else if (type === 'section' && editingItem) {
            setValueSection('section_type', editingItem.section_type)
            setValueSection('page_type', editingItem.page_info?.id || '')
        }
    }, [editingItem, setValuePage, setValueSection, type])

    const onSubmitPage = async (formData: PageFormData) => {
        try {
            await dispatch(updatePageNameData({ id: editingItem.id, payload: formData }))
            showAlert('Page updated successfully', 'success')
            dispatch(getAllPageNames())
            onSuccess()
        } catch (error) {
            showAlert('Failed to update page', 'error')
        }
    }

    const onSubmitSection = async (formData: SectionFormData) => {
        try {
            await dispatch(updateSectionNameData({ id: editingItem.id, payload: { ...formData, page_id: formData.page_type } }))
            showAlert('Section updated successfully', 'success')
            dispatch(getAllSection())
            onSuccess()
        } catch (error) {
            showAlert('Failed to update section', 'error')
        }
    }

    if (type === 'page') {
        return (
            <div className="space-y-4">
                <div>
                    <label htmlFor="page_type" className="block text-sm font-medium text-gray-700 mb-1">
                        Page Type
                    </label>
                    <input
                        id="page_type"
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorsPage.page_type ? 'border-red-500' : 'border-gray-300'}`}
                        {...registerPage('page_type', { required: 'Page type is required' })}
                    />
                    <FormError error={errorsPage.page_type?.message} />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={handleSubmitPage(onSubmitPage)}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? 'Updating...' : 'Update Page'}
                    </Button>
                </div>
            </div>
        )
    }

    // Section form
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="page_type_select" className="block text-sm font-medium text-gray-700 mb-1">
                    Page Type
                </label>
                <select
                    id="page_type_select"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorsSection.page_type ? 'border-red-500' : 'border-gray-300'}`}
                    {...registerSection('page_type', { required: 'Page type is required' })}
                >
                    <option value="">Select an option</option>
                    {data?.map((item: any) => (
                        <option key={item.id} value={item.id}>{item.page_type}</option>
                    ))}
                </select>
                <FormError error={errorsSection.page_type?.message} />
            </div>
            <div>
                <label htmlFor="section_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Section Type
                </label>
                <input
                    id="section_type"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorsSection.section_type ? 'border-red-500' : 'border-gray-300'}`}
                    {...registerSection('section_type', { required: 'Section type is required' })}
                />
                <FormError error={errorsSection.section_type?.message} />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                >
                    Cancel
                </button>
                <Button
                    onClick={handleSubmitSection(onSubmitSection)}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {loading ? 'Updating...' : 'Update Section'}
                </Button>
            </div>
        </div>
    )
}

export default UpdatePageSectionName