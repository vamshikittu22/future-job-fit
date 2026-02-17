export type TemplateMeta = {
  id: string;
  name: string;
  tags: string[]; // e.g. minimal, colorful, content-driven, student, fresh-grad, experienced
};

export const TEMPLATE_REGISTRY: TemplateMeta[] = [
  { id: 'minimal', name: 'Minimal', tags: ['minimal', 'content-driven'] },
  { id: 'colorful', name: 'Colorful', tags: ['colorful'] },
  { id: 'experienced', name: 'Experienced', tags: ['experienced', 'corporate'] },
  { id: 'student', name: 'Student', tags: ['student', 'fresh-grad'] },
  { id: 'creative', name: 'Creative', tags: ['creative'] },
  { id: 'modern', name: 'Modern', tags: ['modern'] },
  { id: 'corporate', name: 'Corporate', tags: ['corporate'] },
  { id: 'compact', name: 'Compact', tags: ['compact'] },
  { id: 'elegant', name: 'Elegant', tags: ['elegant'] },
  { id: 'bold', name: 'Bold', tags: ['colorful', 'modern'] },
];

export const getDefaultTemplate = () => TEMPLATE_REGISTRY[0];

export default TEMPLATE_REGISTRY;
