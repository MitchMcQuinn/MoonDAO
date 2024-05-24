import { answerByFieldId } from './answerByFieldId'

export type CitizenData = {
  firstName: string
  lastName?: string
  email: string
  description?: string
  location?: string
  discord?: string
  twitter?: string
  website?: string
  view: string
  newsletterSub: boolean
  formResponseId: string
}

export default function formatCitizenFormData(
  answers: any[],
  responseId: string
) {
  return {
    firstName: answerByFieldId(answers, 'Zj6QbNhOey3i').text,
    lastName: answerByFieldId(answers, 'D8kNaAAjwBQt')?.text || '',
    email: answerByFieldId(answers, 'ggrOjApkLFMz').email,
    description: answerByFieldId(answers, 'PtIcC6l6F5bl')?.text || '',
    discord: answerByFieldId(answers, 'WzZ35V8MLS4J')?.text || '',
    website: answerByFieldId(answers, 'RXW5Ij2CH5g3')?.url || '',
    twitter: answerByFieldId(answers, 'oHfMqgeSg3sa')?.url || '',
    location: answerByFieldId(answers, 'pP6s24aIwEl7')?.text || '',
    view:
      answerByFieldId(answers, 'vv8LGLkyzIaO').choice.label === 'Yes'
        ? 'public'
        : 'private',
    newsletterSub: answerByFieldId(answers, 'EnRjgahQqOFG')?.boolean,
    formResponseId: responseId,
  } as CitizenData
}
