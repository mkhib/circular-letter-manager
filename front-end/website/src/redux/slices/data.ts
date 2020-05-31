import { createSlice } from '@reduxjs/toolkit';

export type userType = {
  _id: string;
  firstName: string;
  lastName: string;
  personelNumber: string;
  identificationNumber: string;
  phoneNumber: string;
};

export type fileStatusType = {
  status: boolean;
  link: string;
  name: string;
  loading: boolean;
};

interface InitialStateProps {
  title: string;
  number: string;
  date: string;
  sender: string;
  innerWidth: number;
  importNumber: string;
  exportNumber: string;
  refrenceCircularID: string;
  numberOfFiles: number;
  errors: Array<string>;
  files: Array<string>;
  tags: Array<string>;
  requestedLetter: string;
  graphqlError: {
    graphQLErrors: [],
    networkError: {},
    message: string;
  };
  type: 'imported' | 'exported';
  toCategory: string;
  subjectedTo: string;
  uploadFilesStatus: Array<fileStatusType>;
  fromDate: string;
  toDate: string;
  searchInDate: boolean;
  fromDateFull: any;
  toDateFull: any;
  listOfSubjects: Array<
    {
      name: string;
      id: string;
    }>;
  listOfCategories: Array<{
    name: string;
    id: string;
  }>;
  filesName: Array<string>;
  pendingUsers: Array<userType>;
  allUsers: Array<userType>;
  newUsername: string;
  newUserLastName: string;
  newUserIdentificationCode: string;
  newUserPersonelNumber: string;
  newUserPhoneNumber: string;
}



let initialState: InitialStateProps = {
  title: '',
  date: '',
  innerWidth: 0,
  number: '',
  files: [],
  tags: [],
  errors: [],
  numberOfFiles: 1,
  fromDate: '',
  toDate: '',
  fromDateFull: '',
  toDateFull: '',
  searchInDate: false,
  type: 'imported',
  sender: '',
  subjectedTo: '',
  toCategory: '',
  exportNumber: '',
  importNumber: '',
  uploadFilesStatus: [{
    link: '',
    status: false,
    name: '',
    loading: false,
  }],
  refrenceCircularID: '',
  requestedLetter: '',
  graphqlError: {
    graphQLErrors: [],
    message: '',
    networkError: {},
  },
  listOfCategories: [],
  listOfSubjects: [],
  filesName: [],
  pendingUsers: [],
  newUsername: '',
  newUserLastName: '',
  newUserIdentificationCode: '',
  newUserPersonelNumber: '',
  newUserPhoneNumber: '',
  allUsers: [],
}

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setAnyThing(state: any, action) {
      state[action.payload.theThing] = action.payload.data;
    },
    setListOfCategories(state, action) {
      state.listOfCategories = [];
      action.payload.forEach((item: { name: string, id: string }) => {
        state.listOfCategories.push(item);
      });
    },
    setListOfSubjects(state, action) {
      state.listOfSubjects = [];
      action.payload.forEach((item: { name: string, id: string }) => {
        state.listOfSubjects.push(item);
      });
    },
    setPendingUsers(state, action) {
      state.pendingUsers = [];
      action.payload.forEach((user: userType) => {
        state.pendingUsers.push(user);
      });
    },
    removeFromPendingUsers(state, action) {
      state.pendingUsers.forEach((user: userType, index: number) => {
        if (user._id === action.payload) {
          state.pendingUsers.splice(index, 1);
          return true;
        } return false;
      });
    },
    setAllUsers(state, action) {
      state.allUsers = [];
      action.payload.forEach((user: userType) => {
        state.allUsers.push(user);
      });
    },
    removeFromAllUsers(state, action) {
      state.allUsers.forEach((user: userType, index: number) => {
        if (user._id === action.payload) {
          state.allUsers.splice(index, 1);
          return true;
        } return false;
      });
    },
    addToListOfCategories(state, action) {
      state.listOfCategories.push(action.payload);
    },
    addToListOfSubjects(state, action) {
      state.listOfSubjects.push(action.payload);
    },
    removeFromListOfCategories(state, action) {
      state.listOfCategories.forEach((category: { name: string, id: string }, index: number) => {
        if (category.id === action.payload) {
          state.listOfCategories.splice(index, 1);
          return true;
        } return false;
      });
    },
    removeFromListOfSubjects(state, action) {
      state.listOfSubjects.forEach((subject: { name: string, id: string }, index: number) => {
        if (subject.id === action.payload) {
          state.listOfSubjects.splice(index, 1);
          return true;
        } return false;
      });
    },
    addTag(state, action) {
      state.tags.push(action.payload);
    },
    changeFromDateFull(state, action) {
      state.fromDateFull = action.payload;
    },
    changeToDateFull(state, action) {
      state.toDateFull = action.payload;
    },
    addFile(state, action) {
      state.files.push(action.payload);
    },
    clearFiles(state) {
      state.files = [];
    },
    removeFile(state, action) {
      const tempFiles: Array<string> = [];
      state.files.forEach((file) => {
        if (file !== action.payload) {
          tempFiles.push(file);
        }
      });
      state.files = [];
      state.files = tempFiles;
    },
    addFilesName(state, action) {
      state.filesName.push(action.payload);
    },
    removeFilesName(state, action) {
      const tempFiles: Array<string> = [];
      state.filesName.forEach((file) => {
        if (file !== action.payload) {
          tempFiles.push(file);
        }
      });
      state.filesName = [];
      state.filesName = tempFiles;
    },
    removeTag(state, action) {
      state.tags.forEach((tag, index) => {
        if (tag === action.payload) {
          state.tags.splice(index, 1);
          return true;
        }
        return false;
      });
    },
    changeSearchInDate(state, action) {
      state.searchInDate = action.payload;
    },
    setFileUpload(state, action) {
      state.uploadFilesStatus[action.payload.index].status = action.payload.status;
      state.uploadFilesStatus[action.payload.index].link = action.payload.link;
      state.uploadFilesStatus[action.payload.index].name = action.payload.name;
      state.uploadFilesStatus[action.payload.index].loading = action.payload.loading;
    },
    setFileLoading(state, action) {
      state.uploadFilesStatus[action.payload.index].loading = action.payload.loading;
    },
    addFileUpload(state, action) {
      state.uploadFilesStatus = [];
      for (let i = 0; i < action.payload; i++) {
        state.uploadFilesStatus.push({
          status: false,
          link: '',
          name: '',
          loading: false,
        });
      }
    },
    increamentFileUpload(state) {
      state.uploadFilesStatus.push({
        status: false,
        link: '',
        name: '',
        loading: false,
      });
    },
    removeFileUploadStatus(state, action) {
      state.uploadFilesStatus.splice(action.payload, 1);
    },
    clearAnyThing(state: any, action) {
      state[action.payload.theThing] = '';
    },
    setWidth(state: any) {
      state.innerWidth = window.innerWidth;
    },
    setGraphqlError(state, action) {
      state.graphqlError = action.payload;
    },
    setErrors(state, action) {
      state.errors = [];
      action.payload.forEach((error: any) => {
        state.errors.push(error.path);
      })
    },
    clearGraphqlError(state) {
      state.graphqlError = {
        graphQLErrors: [],
        message: '',
        networkError: {},
      }
    },
  }
});

const { reducer, actions } = dataSlice;

export const {
  setAnyThing,
  addFile,
  addTag,
  removeTag,
  removeFromAllUsers,
  setAllUsers,
  changeSearchInDate,
  setGraphqlError,
  increamentFileUpload,
  clearAnyThing,
  setErrors,
  addFileUpload,
  setFileUpload,
  setFileLoading,
  removeFilesName,
  setListOfCategories,
  removeFromPendingUsers,
  setPendingUsers,
  setListOfSubjects,
  clearFiles,
  removeFileUploadStatus,
  addToListOfCategories,
  addToListOfSubjects,
  addFilesName,
  removeFromListOfCategories,
  removeFromListOfSubjects,
  changeFromDateFull,
  changeToDateFull,
  clearGraphqlError,
  removeFile,
  setWidth,
} = actions;

export default reducer;