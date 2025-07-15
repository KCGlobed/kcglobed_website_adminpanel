import { useForm } from 'react-hook-form'
import { useLocation, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import Button from '../../../components/TextEditor/ui/Button'
import { createNewPageName, createNewSectionName, getAllPageNames } from '../../../store/slices/pagesSlice'
import { useAlert } from '../../../context/AlertContext'
import { useEffect } from 'react'

// Error display component
const FormError = ({ error }: { error?: string }) =>
    error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null

// Form data type
interface PageFormData {
    page_type: string
    section_type: string
}

function CreatePageName() {
    const { loading, data } = useAppSelector(state => state.pages)
    const dispatch = useAppDispatch()
    const { showAlert } = useAlert()
    const pageTypeOptions = data ? data : []

    // Form 1: Select-based page_type
    const {
        register: registerSelect,
        handleSubmit: handleSubmitSelect,
        setValue: setValueSelect,
        formState: { errors: errorsSelect }
    } = useForm<PageFormData>({
        defaultValues: {
            page_type: '',
            section_type: ''
        }
    })

    // Form 2: Text-input-based page_type
    const {
        register: registerText,
        handleSubmit: handleSubmitText,
        setValue: setValueText,
        formState: { errors: errorsText }
    } = useForm<PageFormData>({
        defaultValues: {
            page_type: '',
            section_type: ''
        }
    })
    // Submit handler for select-based form
    const onSubmitSelect = async (data: PageFormData) => {
        await dispatch(createNewSectionName({ page_id: data.page_type, section_type: data.section_type } as any))
        showAlert("Section name created successfully")
    }

    // Submit handler for text-input-based form
    const onSubmitText = async (data: PageFormData) => {
        await dispatch(createNewPageName(data as any))
        showAlert("Page name created successfully")
        dispatch(getAllPageNames())
    }
    useEffect(() => {
        dispatch(getAllPageNames())
    }, [dispatch])

    return (
        <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-4 w-full">
                {/* Form 1: Select-based page_type */}
                <form onSubmit={handleSubmitSelect(onSubmitSelect)} className="flex-1 bg-gray-50 rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">
                        Create New Section
                    </h2>
                    <div className="mb-4">
                        <label htmlFor="page_type_select" className="block text-sm font-medium text-gray-700 mb-1">
                            Section Type
                        </label>
                        <select
                            id="page_type_select"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorsSelect.page_type ? 'border-red-500' : 'border-gray-300'}`}
                            {...registerSelect('page_type', { required: 'Page type is required' })}
                        >
                            <option value="">Select an option</option>
                            {pageTypeOptions.map((item: any) => (
                                <option key={item.id} value={item.id}>{item.page_type}</option>
                            ))}
                        </select>
                        <FormError error={errorsSelect.page_type?.message} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="section_type_select" className="block text-sm font-medium text-gray-700 mb-1">
                            Section Type
                        </label>
                        <input
                            id="section_type_select"
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorsSelect.section_type ? 'border-red-500' : 'border-gray-300'}`}
                            {...registerSelect('section_type', { required: 'Section type is required' })}
                        />
                        <FormError error={errorsSelect.section_type?.message} />
                    </div>
                    <div className="mt-6">
                        <Button onClick={() => { }} disabled={loading}>
                            Create Section
                        </Button>
                    </div>
                </form>
                {/* Form 2: Text-input-based page_type */}
                <form onSubmit={handleSubmitText(onSubmitText)} className="flex-1 bg-gray-50 rounded p-6">
                    <h2 className="text-2xl font-bold mb-4">
                        Create New Page
                    </h2>
                    <div className="mb-4">
                        <label htmlFor="page_type_text" className="block text-sm font-medium text-gray-700 mb-1">
                            Page Type
                        </label>
                        <input
                            id="page_type_text"
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorsText.page_type ? 'border-red-500' : 'border-gray-300'}`}
                            {...registerText('page_type', { required: 'Page type is required' })}
                        />
                        <FormError error={errorsText.page_type?.message} />
                    </div>
                    <div className="mt-6">
                        <Button onClick={() => { }} disabled={loading}>
                            Create Page
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePageName