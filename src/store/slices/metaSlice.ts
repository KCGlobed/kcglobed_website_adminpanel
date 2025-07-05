import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MetaState } from '../../utils/types';

const initialState: MetaState = {
  courseId: 3,
  difficulty_level: 'low',
};

const metaSlice = createSlice({
  name: 'meta',
  initialState,
  reducers: {
    updateMeta: (state, action: PayloadAction<Partial<MetaState>>) => {
      return { ...state, ...action.payload };
    },
    setSimulationId: (state, action: PayloadAction<string>) => {
      state.simulationId = action.payload;
    },
    resetMeta: () => initialState,
  },
});

export const { updateMeta, resetMeta, setSimulationId } = metaSlice.actions;
export default metaSlice.reducer;
