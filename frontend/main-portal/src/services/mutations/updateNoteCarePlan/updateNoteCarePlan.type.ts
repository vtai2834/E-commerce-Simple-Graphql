export interface IUpdateNoteCarePlanInput {
  carePlanFriendlyId: number;
  newNote: string;
}

export interface IUpdateNoteCarePlanParsed {
  carePlanId: string | null;
  isSuccess: boolean;
}

export interface IUpdateNoteCarePlanResponse {
  updateCarePlanNote: IUpdateNoteCarePlanParsed;
}


