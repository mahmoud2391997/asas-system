import { CreditNote } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const creditNotesSlice = createGenericSlice<CreditNote>('creditNotes', 'creditnotes');

export const { fetchAll: fetchCreditNotes, addNew: addCreditNote, updateOne: updateCreditNote, deleteOne: deleteCreditNote } = creditNotesSlice.actions;
export const creditNotesSelectors = creditNotesSlice.selectors;
export default creditNotesSlice.reducer;