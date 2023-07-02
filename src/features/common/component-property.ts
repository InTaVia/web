export interface ComponentProperty {
  type:
    | 'answerlist'
    | 'boolean'
    | 'editable'
    | 'entitiesAndEvents'
    | 'number'
    | 'select'
    | 'text'
    | 'textarea';
  id: string;
  label: string;
  value?: any;
  options?: Array<any>;
  editable: boolean | false;
  sort?: number | 0;
}

export interface QuizAnswer {
  text: string;
  correct: boolean;
}
