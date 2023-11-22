export interface FormDataType {
  formName: string;
  createdUserID: string;
  creationDate: Date;
  questions: QuestionDetails[];
  userQnsAns: UserQnsAnsType[];
}

export interface QuestionDetails {
  qnsID: string;
  questionNumber: number;
  question: string;
  questionType: string;
  createdAt: Date;
  updatedAt: Date | null;
  formID: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  qnsOptionID: string;
  option: string;
  qnsID: string;
}

export interface UserQnsAnsType {
  userQnsAnsID: string;
  userID: string;
  qnsID: string;
  formID: string;
  answer: string | null;
  public_id: string | null;
  qnsOptionID: string | null;
  qnsOptionIDs: string[];
  dateTimeAns: Date | null;
  lastUpdated: Date | null;
}
