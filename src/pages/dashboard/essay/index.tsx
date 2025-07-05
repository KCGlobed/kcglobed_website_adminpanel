import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";

import { changeStatusById, getEssayById, getEssays, removeEssay, setPage } from "../../../store/slices/essaySlice";
import Modal from "../../../components/Modal";
import MultiStepForm from "../../../components/MultiStepForm";
import MetaComponent from "../../../components/MetaComponent";
import Exhibit from "../../../components/Exhibit";
import EditEssayQuestion from "../../../components/EditEssayQuestion";
import PreviewEssayEdit from "../../../components/PreviewEssayEdit";
import type { Essay, StepProps } from "../../../utils/types";
import { getCourseStructure } from "../../../store/slices/courseDataSlice";
import { resetMeta, setSimulationId, updateMeta } from "../../../store/slices/metaSlice";
import { resetQuestions, updateCompleteQuestions } from "../../../store/slices/questionSlice";
import { createOrUpdateEssayQuestions, deleteEssayType } from "../../../services/essayService";
import { resetExhibit, setExhibits } from "../../../store/slices/exhibitSlice";
import { useAlert } from "../../../context/AlertContext";
import DynamicServerTable, { type ColumnDefinition } from "../../../components/Table/Table";
import Toggle from "../../../components/Toggle";
import { FiEdit, FiTrash } from "react-icons/fi";
import GlassButton from "../../../components/Button/Button";

export default function EssayPage() {
  const dispatch = useAppDispatch();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const { data: essays, count, page, loading } = useAppSelector((state) => state.essays);
  const { data: courseData } = useAppSelector((state) => state.course);
  const { description, subQuestions } = useAppSelector((state) => state.question);
  const { selectedEssay } = useAppSelector((state) => state.essays);
  const [selectedSubject, setSelectedSubject] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const { showConfirm, showAlert } = useAlert();

  const metaData = useAppSelector((state) => state.meta);

  const steps = [
    {
      title: "Meta",
      content: (props: StepProps) => <MetaComponent {...props} />,
    },
    {
      title: "Questions",
      content: (props: StepProps) => <EditEssayQuestion {...props} />,
    },
    {
      title: "Exhibit",
      content: (props: StepProps) => <Exhibit {...props} onDemandQuestionSave={onDemandSave} />,
    },
    {
      title: "Preview",
      content: (props: StepProps) => <PreviewEssayEdit {...props} />,
    },
  ];

  useEffect(() => {
    dispatch(getCourseStructure());
  }, [dispatch]);

  useEffect(() => {
    if (courseData) {
      setSelectedSubject(courseData[0].subjects[0].id);
    }
  }, [courseData])

  useEffect(() => {
    if (selectedEssay) {
      const metaData = {
        questionId: selectedEssay.idnumber,
        courseId: selectedEssay.course.id,
        subjectId: selectedEssay.subject.id,
        chapterId: selectedEssay.chapter.id,
        simulationId: selectedEssay.id,
        difficulty_level: selectedEssay.level,
        pass_percentage: selectedEssay.pass_percentage
      }
      const questionObj = selectedEssay?.question_json?.section;
      dispatch(updateMeta(metaData));
      dispatch(updateCompleteQuestions(questionObj));
      dispatch(setExhibits(selectedEssay.exhibits));
    }
  }, [selectedEssay]);

  const onTableRowEdit = (id: string) => {
    dispatch(getEssayById(id));
    setModalOpen(true);
  }

  const closeModal = () => {
    dispatch(resetMeta());
    dispatch(resetQuestions());
    dispatch(resetExhibit());
    setModalOpen(false);
  };

  const handleSubmit = () => {
    saveQuestionData();
  };

  const saveQuestionData = async (dissmissModal: boolean = true) => {
    const finalData = {
      simulation_id: metaData.simulationId,
      course_id: metaData.courseId,
      subject_id: metaData.subjectId,
      level: metaData.difficulty_level,
      solution_description: description,
      pass_percentage: metaData.pass_percentage,
      question_number: metaData.questionId,
      chapter_id: metaData.chapterId,
      question: {
        simType: 'essayBased',
        section: {
          description,
          subQuestions,
          // exhibits
        }
      },
      answer: subQuestions.map(({ answer }) => answer),
    }
    try {
      const res = await createOrUpdateEssayQuestions(finalData);
      if (res?.message || res?.data) {
        showAlert(
          metaData.simulationId ?
            "Essay Updated Successfully..." :
            "Essay Created Successfully...", "success");
        if (dissmissModal) closeModal();

        if (!metaData.simulationId) {
          dispatch(setSimulationId(res.data.id));
          return res.data.id;
        }
      } else {
        showAlert("Something Went Wrong", "error");
      }

    } catch (e) {
      showAlert("Something Went Wrong", "error")
    }
  }

  const onDemandSave = async () => {
    return await saveQuestionData(false);
  }

  const handleButtonClick = () => {
    setModalOpen(true);
  }

  const getSubjects = useCallback(() => {
    if (!courseData) return <option value="">-- Loading --</option>
    const courses = courseData?.find((val: any) => val.id == 3).subjects;
    return (
      courses.map((subj: any) => (
        <option key={subj.id} value={subj.id} selected={selectedSubject == subj.id}>
          {subj.name}
        </option>
      ))
    )
  }, [courseData])

  const handleSubjectChange = (e: any) => {
    const subjectId = e.target.value;
    if (subjectId) {
      setSelectedSubject(subjectId);
      dispatch(setPage(1));
    }
  }

  const onTableRowDelete = async (id: string) => {
    showConfirm({
      message: "Are you sure you want to delete?",
      onConfirm: async () => {

        try {
          await deleteEssayType(id);
          dispatch(removeEssay(id));
          showAlert("Essay Deleted Successfully...", "success");
        } catch (e: any) {
          showAlert("Something Went Wrong...", "error");
        }

      },
      onCancel: () => showAlert("Cancelled", "info"),
    });

  }

  useEffect(() => {
    if (selectedSubject) {
      dispatch(getEssays({ subjectId: selectedSubject, page }));
    }
  }, [dispatch, selectedSubject, page]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    dispatch(setPage(newPage));
  };

  const onToggle = (id: string, status: number) => {
    let payload = { status: !status ? 1 : 0 }
    dispatch(changeStatusById({ id, payload }))
  }

  const columns: ColumnDefinition<Essay>[] = useMemo(() => [
    { key: 'id', title: 'Essay ID', width: '120px', align: 'left', },
    { key: 'idnumber', title: 'Question ID', align: 'left', },
    {
      key: "subject",
      title: "Subject Name",
      render: (value: any) => value.name
    },
    {
      key: 'chapter',
      title: 'Chapter',
      align: 'left',
      render: (value: any) => value.name
    },
    {
      key: 'visible',
      title: 'Visible',
      align: 'left',
      render: (_, row: any) => (
        <div className="flex items-center" onClick={() => onToggle?.(row.id, row.visible)}>
          <Toggle enabled={row.visible} label="" />
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'left',
      render: (_, row: any) => (
        <div className="flex space-x-2">
          <GlassButton
            onClick={() => onTableRowEdit(row.id)}
            icon={<FiEdit className="text-base" />}
            color="green"
            title="Edit"
          />
          <GlassButton
            onClick={() => onTableRowDelete(row.id)}
            icon={<FiTrash className="text-base" />}
            color="red"
            title="Delete"
          />
        </div>
      )
    }
  ], []);


  return (
    <div className="">
      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <select
            onChange={handleSubjectChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">-- Select Subject --</option>
            {getSubjects()}
          </select>
        </div>
        <button
          onClick={handleButtonClick} // replace with your handler
          className="ml-4 cursor-pointer px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          Add Essay Type
        </button>
      </div>
      <div className="">
        <DynamicServerTable<Essay>
          data={essays}
          columns={columns}
          currentPage={currentPage}
          pageSize={20}
          totalCount={count}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} disableOutsideClick={false}>
        <MultiStepForm steps={steps} onSubmit={handleSubmit} showNextPrevButtons={true} />
      </Modal>
    </div>
  );
}
