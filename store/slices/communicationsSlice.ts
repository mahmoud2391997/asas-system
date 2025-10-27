import { WhatsappLog } from '../../types';
import { createGenericSlice } from '../sliceFactory';

const communicationsSlice = createGenericSlice<WhatsappLog>('communications', 'communications');

export const { fetchAll: fetchCommunications, addNew: addCommunication, updateOne: updateCommunication, deleteOne: deleteCommunication } = communicationsSlice.actions;
export const communicationsSelectors = communicationsSlice.selectors;
export default communicationsSlice.reducer;