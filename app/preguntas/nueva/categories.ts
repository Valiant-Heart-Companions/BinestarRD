// Plain module (not a Server Action file) so the constant can be imported by
// both the server action and the client form without being mangled.
export const ASK_CATEGORIES = [
  'Ansiedad',
  'Depresión',
  'Estrés',
  'Relaciones y pareja',
  'Duelo y pérdida',
  'Autoestima',
  'Sueño',
  'Otro',
] as const;
