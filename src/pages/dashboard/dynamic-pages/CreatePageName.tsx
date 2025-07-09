import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import Button from '../../../components/TextEditor/ui/Button'

// Error display component
const FormError = ({ error }: { error?: string }) =>
    error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null

// Form data type
interface PageFormData {
    page_type: string
    section_type: string
}

function CreatePageName() {
    const { id } = useParams()
    const location = useLocation()
    const isEditMode = Boolean(id)
    const { loading } = useAppSelector(state => state.pages)
    const dispatch = useAppDispatch()

    // Options for page_type select
    const pageTypeOptions = Array.isArray(location.state) ? location.state : []

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

    // Pre-fill logic for edit mode (optional, can be customized)
    useEffect(() => {
        if (isEditMode && id) {
            // dispatch(getPageById(id)).then((action) => {
            //   if (action.payload) {
            //     setValueSelect('page_type', action.payload.page_type)
            //     setValueSelect('section_type', action.payload.section_type)
            //     setValueText('page_type', action.payload.page_type)
            //     setValueText('section_type', action.payload.section_type)
            //   }
            // })
        }
    }, [id, isEditMode, dispatch, setValueSelect, setValueText])

    // Submit handler for select-based form
    const onSubmitSelect = (data: PageFormData) => {
        if (isEditMode && id) {
            // dispatch(updatePage({ id, data }))
        } else {
            // dispatch(createPage(data))
        }
        // Optionally reset form or show success
    }

    // Submit handler for text-input-based form
    const onSubmitText = (data: PageFormData) => {
        if (isEditMode && id) {
            // dispatch(updatePage({ id, data }))
        } else {
            // dispatch(createPage(data))
        }
        // Optionally reset form or show success
    }

    return (
        <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">
                {isEditMode ? 'Edit Page' : 'Create New Page'}
            </h2>
            <div className="flex flex-wrap gap-4 w-full">
                {/* Form 1: Select-based page_type */}
                <form onSubmit={handleSubmitSelect(onSubmitSelect)} className="flex-1 bg-gray-50 rounded p-6">
                    <div className="mb-4">
                        <label htmlFor="page_type_select" className="block text-sm font-medium text-gray-700 mb-1">
                            Page Type (Select)
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
                            {isEditMode ? 'Update Page (Select)' : 'Create Page (Select)'}
                        </Button>
                    </div>
                </form>
                {/* Form 2: Text-input-based page_type */}
                <form onSubmit={handleSubmitText(onSubmitText)} className="flex-1 bg-gray-50 rounded p-6">
                    <div className="mb-4">
                        <label htmlFor="page_type_text" className="block text-sm font-medium text-gray-700 mb-1">
                            Page Type (Text)
                        </label>
                        <input
                            id="page_type_text"
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorsText.page_type ? 'border-red-500' : 'border-gray-300'}`}
                            {...registerText('page_type', { required: 'Page type is required' })}
                        />
                        <FormError error={errorsText.page_type?.message} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="section_type_text" className="block text-sm font-medium text-gray-700 mb-1">
                            Section Type
                        </label>
                        <input
                            id="section_type_text"
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorsText.section_type ? 'border-red-500' : 'border-gray-300'}`}
                            {...registerText('section_type', { required: 'Section type is required' })}
                        />
                        <FormError error={errorsText.section_type?.message} />
                    </div>
                    <div className="mt-6">
                        <Button onClick={() => { }} disabled={loading}>
                            {isEditMode ? 'Update Page (Text)' : 'Create Page (Text)'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePageName