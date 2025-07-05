import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type { QuestionState } from '../../utils/types';

const initialState: QuestionState = {
  description: '',
  exhibits: [],
  subQuestions: [],
};

const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    addSubQuestion: (state) => {
      state.subQuestions.push({ id: nanoid(), question: '', answer: '' });
    },
    removeSubQuestion: (state, action: PayloadAction<string>) => {
      state.subQuestions = state.subQuestions.filter((sub) => sub.id !== action.payload);
    },
    updateSubQuestion: (
      state,
      action: PayloadAction<{ id: string; question?: string; answer?: string }>
    ) => {
      const { id, question, answer } = action.payload;
      const sub = state.subQuestions.find((s) => s.id === id);
      if (sub) {
        if (question !== undefined) sub.question = question;
        if (answer !== undefined) sub.answer = answer;
      }
    },
    updateCompleteQuestions: (state, action: PayloadAction<Partial<QuestionState>>) => {
          return { ...state, ...action.payload };
    },
    resetQuestions: () => initialState
  }
});

export const {
  setDescription,
  addSubQuestion,
  removeSubQuestion,
  updateSubQuestion,
  resetQuestions,
  updateCompleteQuestions
} = questionSlice.actions;

export default questionSlice.reducer;
