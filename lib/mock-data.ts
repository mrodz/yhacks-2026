import { Document, Clause, ChatMessage } from './types';

export const mockClauses: Clause[] = [
  {
    id: '1',
    title: 'Arbitration Clause',
    originalText: 'Any dispute arising out of or relating to this Agreement shall be resolved by binding arbitration in accordance with the rules of the American Arbitration Association.',
    translatedText: 'Cualquier disputa que surja de este Acuerdo se resolverá mediante arbitraje vinculante de acuerdo con las reglas de la Asociación Americana de Arbitraje.',
    plainLanguage: 'If you have a problem with this agreement, you cannot go to court. Instead, a private judge (arbitrator) will decide. This decision is final and you cannot appeal.',
    riskLevel: 'high',
    whyMatters: 'By agreeing to arbitration, you give up your right to a jury trial and the ability to participate in class action lawsuits. Arbitration tends to favor companies over individuals.',
    dependsOnLocalLaw: true,
    localLawNote: 'Some states like California have restrictions on mandatory arbitration clauses in certain contracts.',
    questionsToAsk: [
      'Can we remove the arbitration clause?',
      'What are the costs of arbitration?',
      'Where would arbitration take place?'
    ],
    confidenceNote: 'High confidence - this is a standard arbitration clause.',
    pageNumber: 3,
    position: { x: 10, y: 20, width: 80, height: 15 }
  },
  {
    id: '2',
    title: 'Auto-Renewal Clause',
    originalText: 'This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of termination at least 60 days prior to the end of the current term.',
    translatedText: 'Este Acuerdo se renovará automáticamente por períodos sucesivos de un año a menos que cualquiera de las partes proporcione un aviso por escrito de terminación al menos 60 días antes del final del término actual.',
    plainLanguage: 'Your contract will automatically renew every year. You must give 60 days notice to cancel, or you will be locked in for another year.',
    riskLevel: 'medium',
    whyMatters: 'If you forget to cancel in time, you could be committed to another full year. Mark your calendar 60+ days before renewal.',
    dependsOnLocalLaw: true,
    localLawNote: 'Some states require companies to send renewal reminders.',
    questionsToAsk: [
      'Can we change the notice period to 30 days?',
      'Will you send a reminder before auto-renewal?'
    ],
    confidenceNote: 'High confidence - standard auto-renewal language.',
    pageNumber: 5,
    position: { x: 10, y: 45, width: 80, height: 12 }
  },
  {
    id: '3',
    title: 'Liability Waiver',
    originalText: 'Tenant hereby waives any and all claims against Landlord for personal injury, property damage, or any other loss arising from or related to the use of the premises.',
    translatedText: 'El inquilino renuncia a todas las reclamaciones contra el propietario por lesiones personales, daños a la propiedad o cualquier otra pérdida relacionada con el uso de las instalaciones.',
    plainLanguage: 'You are giving up your right to sue the landlord even if they are negligent. If you get hurt on the property due to their fault, you may not be able to recover damages.',
    riskLevel: 'high',
    whyMatters: 'This is a broad liability waiver that could leave you without legal recourse if the landlord is negligent. Many courts do not enforce such broad waivers.',
    dependsOnLocalLaw: true,
    localLawNote: 'In California, broad liability waivers in residential leases are generally unenforceable.',
    questionsToAsk: [
      'Can we limit this waiver to specific situations?',
      'Does this comply with local tenant protection laws?'
    ],
    confidenceNote: 'Medium confidence - enforcement varies significantly by jurisdiction.',
    pageNumber: 4,
    position: { x: 10, y: 60, width: 80, height: 10 }
  },
  {
    id: '4',
    title: 'Security Deposit Terms',
    originalText: 'A security deposit equal to two months rent is required upon signing. The deposit may be used to cover unpaid rent, damages beyond normal wear and tear, and cleaning costs.',
    translatedText: 'Se requiere un depósito de seguridad equivalente a dos meses de alquiler al firmar. El depósito puede utilizarse para cubrir alquiler impago, daños más allá del desgaste normal y costos de limpieza.',
    plainLanguage: 'You must pay 2 months of rent as a deposit when you sign. The landlord can keep some or all of this money if you owe rent, damage the property, or leave it dirty.',
    riskLevel: 'info',
    whyMatters: 'Security deposits are standard but the amount and terms vary. Make sure you document the condition of the property when you move in.',
    dependsOnLocalLaw: true,
    localLawNote: 'California limits security deposits to 1 month for unfurnished units and 2 months for furnished units.',
    questionsToAsk: [
      'Can we do a move-in walkthrough?',
      'How long do you have to return the deposit after move-out?'
    ],
    confidenceNote: 'High confidence - standard security deposit clause.',
    pageNumber: 2,
    position: { x: 10, y: 30, width: 80, height: 12 }
  },
  {
    id: '5',
    title: 'Lease Duration',
    originalText: 'The initial term of this lease shall be twelve (12) months, commencing on [DATE] and ending on [DATE].',
    translatedText: 'El plazo inicial de este arrendamiento será de doce (12) meses, comenzando el [FECHA] y terminando el [FECHA].',
    plainLanguage: 'This lease is for 1 year. You are committed to paying rent for the full year.',
    riskLevel: 'safe',
    whyMatters: 'This is a standard lease term. Make sure you can commit to staying for the full year before signing.',
    dependsOnLocalLaw: false,
    questionsToAsk: [
      'What happens if I need to break the lease early?',
      'Is subletting allowed?'
    ],
    confidenceNote: 'High confidence - basic lease term.',
    pageNumber: 1,
    position: { x: 10, y: 10, width: 80, height: 8 }
  },
  {
    id: '6',
    title: 'Late Payment Fee',
    originalText: 'A late fee of $50 or 5% of the monthly rent, whichever is greater, shall be assessed for any rent payment received more than 5 days after the due date.',
    translatedText: 'Se cobrará un cargo por pago tardío de $50 o el 5% del alquiler mensual, lo que sea mayor, por cualquier pago de alquiler recibido más de 5 días después de la fecha de vencimiento.',
    plainLanguage: 'If you pay rent more than 5 days late, you will be charged an extra fee. The fee is either $50 or 5% of your rent (whichever is more).',
    riskLevel: 'low',
    whyMatters: 'Late fees are common. Set up automatic payments or reminders to avoid them.',
    dependsOnLocalLaw: true,
    localLawNote: 'Some states cap late fees as a percentage of rent.',
    questionsToAsk: [
      'Is there a grace period before late fees apply?',
      'Can the late fee be waived for the first occurrence?'
    ],
    confidenceNote: 'High confidence - standard late fee clause.',
    pageNumber: 2,
    position: { x: 10, y: 45, width: 80, height: 10 }
  }
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Apartment Lease Agreement',
    type: 'lease',
    uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'needs-review',
    languagePair: { from: 'en', to: 'es' },
    riskCount: { high: 2, medium: 1, low: 1 },
    clauses: mockClauses,
    pages: 8,
    thumbnailUrl: '/document-thumb.png'
  },
  {
    id: '2',
    title: 'Employment Contract',
    type: 'employment',
    uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'signed',
    languagePair: { from: 'en', to: 'es' },
    riskCount: { high: 1, medium: 2, low: 0 },
    clauses: [],
    pages: 12,
  },
  {
    id: '3',
    title: 'Medical Consent Form',
    type: 'medical',
    uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    status: 'reviewed',
    languagePair: { from: 'en', to: 'es' },
    riskCount: { high: 0, medium: 1, low: 2 },
    clauses: [],
    pages: 4,
  }
];

export const suggestedQuestions = [
  'What happens if I cancel?',
  'Can I negotiate this?',
  'What rights am I giving up?',
  'Is this normal for this type of document?',
  'What are the penalties for breaking this agreement?',
  'Are there any hidden fees?'
];

export const glossaryTerms = [
  {
    term: 'Arbitration',
    definition: 'A private process where disputes are resolved by a neutral third party (arbitrator) instead of going to court. The decision is usually final and binding.',
    example: 'Instead of suing in court, you would present your case to an arbitrator who makes the final decision.'
  },
  {
    term: 'Waiver',
    definition: 'Giving up a legal right voluntarily. Once you waive a right, you generally cannot claim it later.',
    example: 'A liability waiver means you agree not to sue even if you get injured.'
  },
  {
    term: 'Indemnity',
    definition: 'An agreement to compensate someone for any losses or damages they might suffer. You promise to cover their costs.',
    example: 'If you agree to indemnify the landlord, you pay for their legal fees if someone sues them because of something you did.'
  },
  {
    term: 'Auto-Renewal',
    definition: 'A contract that automatically extends for another term unless you cancel before a deadline.',
    example: 'A lease with auto-renewal will continue for another year unless you give notice 60 days before it ends.'
  },
  {
    term: 'Governing Law',
    definition: 'The state or country whose laws will be used to interpret the contract and resolve disputes.',
    example: 'If governing law is California, California courts and laws apply even if you live elsewhere.'
  },
  {
    term: 'Force Majeure',
    definition: 'Events beyond anyone\'s control (natural disasters, war, pandemic) that excuse parties from fulfilling contract obligations.',
    example: 'If a hurricane destroys the property, force majeure might excuse both parties from the lease.'
  },
  {
    term: 'Severability',
    definition: 'If one part of the contract is found invalid, the rest still applies.',
    example: 'If a court strikes down the arbitration clause, the rest of your lease still stands.'
  },
  {
    term: 'Joint and Several Liability',
    definition: 'All signers are individually responsible for the full amount, not just their share.',
    example: 'If your roommate stops paying rent, you are responsible for the full rent amount.'
  }
];

export const educationalCards = [
  {
    id: '1',
    title: 'What is arbitration?',
    description: 'Learn about arbitration clauses and how they affect your rights',
    icon: 'Scale'
  },
  {
    id: '2', 
    title: 'Before signing a lease',
    description: 'Key things to check in your rental agreement',
    icon: 'Home'
  },
  {
    id: '3',
    title: 'Employment contracts',
    description: 'Common clauses in job offers you should understand',
    icon: 'Briefcase'
  },
  {
    id: '4',
    title: 'Medical consent forms',
    description: 'What you are agreeing to when you sign medical paperwork',
    icon: 'Heart'
  }
];

export const mockChatResponse = (question: string): ChatMessage => {
  const responses: Record<string, { content: string; references: { clauseId: string; pageNumber: number }[] }> = {
    'What happens if I cancel?': {
      content: 'Based on this lease agreement, if you cancel early, you may be responsible for:\n\n1. **Rent until a new tenant is found** - The landlord must make reasonable efforts to find a replacement.\n\n2. **Early termination fee** - This lease does not specify an early termination fee, which is good.\n\n3. **Forfeiture of security deposit** - Your $3,000 deposit may be used to cover unpaid rent.\n\nThe arbitration clause (page 3) means any disputes about early termination would go to arbitration, not court.',
      references: [{ clauseId: '1', pageNumber: 3 }, { clauseId: '4', pageNumber: 2 }]
    },
    'default': {
      content: 'I found relevant information in this document. Let me analyze the specific clauses that relate to your question and provide a clear explanation.',
      references: [{ clauseId: '1', pageNumber: 3 }]
    }
  };
  
  const response = responses[question] || responses['default'];
  
  return {
    id: Date.now().toString(),
    type: 'assistant',
    content: response.content,
    clauseReferences: response.references,
    timestamp: new Date()
  };
};
