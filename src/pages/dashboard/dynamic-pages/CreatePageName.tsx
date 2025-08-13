import { useForm } from 'react-hook-form'
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
    section_type?: string
    meta_title?: string
    meta_description?: string
    meta_keyword?: string
    canonical_url?: string
    schema_markup?: string
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
            meta_title: '',
            meta_description: '',
            meta_keyword: '',
            canonical_url: '',
            schema_markup: ''
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
                <form noValidate onSubmit={handleSubmitText(onSubmitText)} className="flex-1 bg-gray-50 rounded p-6">
                    <h2 className="text-2xl font-bold mb-4">Create New Page</h2>

                    {/* Common Tailwind class for input fields */}
                    {/** You could even move this into a utility if reused elsewhere **/}
                    {/** Or just repeat inline like here **/}

                    {/* Page Type */}
                    <div className="mb-4">
                        <label htmlFor="page_type_text" className="block text-sm font-medium text-gray-700 mb-1">Page Type</label>
                        <input
                            id="page_type_text"
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorsText.page_type ? 'border-red-500' : 'border-gray-300'}`}
                            {...registerText('page_type', { required: 'Page type is required' })}
                        />
                    </div>

                    {/* Meta Title */}
                    <div className="mb-4">
                        <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                        <input
                            id="meta_title"
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorsText.meta_title ? 'border-red-500' : 'border-gray-300'}`}
                            {...registerText('meta_title')}
                        />
                    </div>

                    {/* Meta Description */}
                    <div className="mb-4">
                        <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                        <textarea
                            id="meta_description"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorsText.meta_description ? 'border-red-500' : 'border-gray-300'}`}
                            {...registerText('meta_description')}
                        />
                    </div>

                    {/* Meta Keywords */}
                    <div className="mb-4">
                        <label htmlFor="meta_keyword" className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords (comma-separated)</label>
                        <input
                            id="meta_keyword"
                            type="text"
                            placeholder="e.g., blog,react,seo"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300`}
                            {...registerText('meta_keyword')}
                        />
                    </div>

                    {/* Canonical URL */}
                    <div className="mb-4">
                        <label htmlFor="canonical_url" className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                        <input
                            id="canonical_url"
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorsText.canonical_url ? 'border-red-500' : 'border-gray-300'}`}
                            {...registerText('canonical_url')}
                        />
                    </div>

                    {/* Schema Markup */}
                    <div className="mb-4">
                        <label htmlFor="schema_markup" className="block text-sm font-medium text-gray-700 mb-1">Schema Markup</label>
                        <textarea
                            id="schema_markup"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorsText.schema_markup ? 'border-red-500' : 'border-gray-300'}`}
                            {...registerText('schema_markup')}
                        />
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