// src/redux/slices/exhibitSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Exhibit } from '../../utils/types';

interface ExhibitState {
  exhibits: Exhibit[];
}

const initialState: ExhibitState = {
  exhibits: [],
};

const exhibitSlice = createSlice({
  name: 'exhibit',
  initialState,
  reducers: {
    setExhibits(state, action: PayloadAction<Exhibit[]>) {
      state.exhibits = action.payload;
    },
    addExhibit(state, action: PayloadAction<Exhibit>) {
      state.exhibits.push(action.payload);
    },
    removeExhibit(state, action: PayloadAction<number>) {
      state.exhibits = state.exhibits.filter((e) => e.id !== action.payload);
    },
    resetExhibit: () => initialState,
  },
});

export const { setExhibits, addExhibit, removeExhibit, resetExhibit } = exhibitSlice.actions;
export default exhibitSlice.reducer;
