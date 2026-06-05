export interface Provider {
    id: string;
    name: string;
    role: 'Psychologist' | 'Psychiatrist';
    specialties: string[];
    location: string;
    coordinates: [number, number]; // [lat, lng]
    price: number | 'Consultar';
    isVerified: boolean;
    status: 'pending' | 'verified' | 'rejected'; // New field for admin flow
    isFoundingMember: boolean;
    rating: number;
    reviewCount: number;
    image: string;
    bio: string;
    insurance: string[];
    whatsapp: string;
}

export const MOCK_PROVIDERS: Provider[] = [
    // --- GOLD STANDARD (5) ---
    {
        id: '1',
        name: 'Dra. Ana Pérez',
        role: 'Psychologist',
        specialties: ['Ansiedad', 'Terapia de Pareja'],
        location: 'Naco, Santo Domingo',
        coordinates: [18.4714, -69.9296],
        price: 3500,
        isVerified: true,
        status: 'verified',
        isFoundingMember: true,
        rating: 5.0,
        reviewCount: 42,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80',
        bio: 'Más de 15 años de experiencia ayudando a parejas a reencontrarse. Enfoque cognitivo-conductual.',
        insurance: ['Humano', 'Universal'],
        whatsapp: '8095550101'
    },
    {
        id: '2',
        name: 'Dr. Jorge Subero',
        role: 'Psychiatrist',
        specialties: ['Depresión Clínica', 'Trastornos del Sueño'],
        location: 'Piantini, Santo Domingo',
        coordinates: [18.4735, -69.9350],
        price: 4000,
        isVerified: true,
        status: 'verified',
        isFoundingMember: true,
        rating: 4.9,
        reviewCount: 28,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80',
        bio: 'Especialista en psicofarmacología con un enfoque humano y empático. Egresado de UNIBE.',
        insurance: ['Palic', 'Senasa Premium'],
        whatsapp: '8095550102'
    },
    {
        id: '3',
        name: 'Lic. María Castillo',
        role: 'Psychologist',
        specialties: ['Terapia Infantil', 'Autismo'],
        location: 'Gazcue, Santo Domingo',
        coordinates: [18.4680, -69.9050],
        price: 3000,
        isVerified: true,
        status: 'verified',
        isFoundingMember: true,
        rating: 5.0,
        reviewCount: 56,
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
        bio: 'Pasión por el desarrollo infantil. Certificada en intervención temprana y manejo conductual.',
        insurance: ['Humano', 'Universal', 'Senasa'],
        whatsapp: '8095550103'
    },
    {
        id: '4',
        name: 'Dr. Roberto Lora',
        role: 'Psychiatrist',
        specialties: ['Adicciones', 'Manejo de Ira'],
        location: 'Bella Vista, Santo Domingo',
        coordinates: [18.4550, -69.9450],
        price: 4500,
        isVerified: true,
        status: 'verified',
        isFoundingMember: true,
        rating: 4.8,
        reviewCount: 19,
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80',
        bio: 'Director de la unidad de desintoxicación del Centro Médico Real. Confidencialidad absoluta.',
        insurance: ['Internacional', 'Humano'],
        whatsapp: '8095550104'
    },
    {
        id: '5',
        name: 'Lic. Carmen Rodriguez',
        role: 'Psychologist',
        specialties: ['Duelo', 'Trauma'],
        location: 'Evaristo Morales, Santo Domingo',
        coordinates: [18.4760, -69.9400],
        price: 3200,
        isVerified: true,
        status: 'verified',
        isFoundingMember: true,
        rating: 4.9,
        reviewCount: 34,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80',
        bio: 'Acompañamiento en procesos de pérdida. Terapia EMDR certificada.',
        insurance: ['Senasa', 'Universal'],
        whatsapp: '8095550105'
    },
    // --- ACCESSIBLE (5) ---
    {
        id: '6',
        name: 'Lic. Pedro Jimenez',
        role: 'Psychologist',
        specialties: ['Estrés Laboral', 'Orientación Vocacional'],
        location: 'Zona Universitaria, Santo Domingo',
        coordinates: [18.4620, -69.9150],
        price: 1500,
        isVerified: true,
        status: 'verified',
        isFoundingMember: false,
        rating: 4.5,
        reviewCount: 12,
        image: '',
        bio: 'Psicología general enfocada en estudiantes y jóvenes profesionales.',
        insurance: ['Senasa'],
        whatsapp: '8095550106'
    },
    {
        id: '7',
        name: 'Dra. Laura Mendez',
        role: 'Psychologist',
        specialties: ['Autoestima', 'Desarrollo Personal'],
        location: 'Santo Domingo Este',
        coordinates: [18.4800, -69.8500],
        price: 1800,
        isVerified: true,
        status: 'verified',
        isFoundingMember: false,
        rating: 4.6,
        reviewCount: 8,
        image: '',
        bio: 'Consultas virtuales y presenciales a precios accesibles.',
        insurance: [],
        whatsapp: '8095550107'
    },
    {
        id: '8',
        name: 'Lic. Carlos Sanchez',
        role: 'Psychologist',
        specialties: ['Terapia Familiar'],
        location: 'Los Prados, Santo Domingo',
        coordinates: [18.4780, -69.9500],
        price: 2000,
        isVerified: true,
        status: 'verified',
        isFoundingMember: false,
        rating: 4.3,
        reviewCount: 5,
        image: '',
        bio: 'Especialista en dinámicas familiares conflictivas.',
        insurance: ['Humano'],
        whatsapp: '8095550108'
    },
    {
        id: '9',
        name: 'Lic. Elena Vargas',
        role: 'Psychologist',
        specialties: ['Ansiedad'],
        location: 'Herrera, Santo Domingo Oeste',
        coordinates: [18.4700, -69.9800],
        price: 1200,
        isVerified: true,
        status: 'verified',
        isFoundingMember: false,
        rating: 4.7,
        reviewCount: 15,
        image: '',
        bio: 'Atención psicológica comunitaria.',
        insurance: ['Senasa Subsidiado'],
        whatsapp: '8095550109'
    },
    {
        id: '10',
        name: 'Dr. Manuel Diaz',
        role: 'Psychiatrist',
        specialties: ['General'],
        location: 'Villa Mella, SDN',
        coordinates: [18.5500, -69.9000],
        price: 2000,
        isVerified: true,
        status: 'verified',
        isFoundingMember: false,
        rating: 4.2,
        reviewCount: 3,
        image: '',
        bio: 'Psiquiatría general para adultos.',
        insurance: [],
        whatsapp: '8095550110'
    },
    // --- UNVERIFIED / PLACEHOLDERS (5) ---
    {
        id: '11',
        name: 'Centro de Terapia Integral',
        role: 'Psychologist',
        specialties: ['Varios'],
        location: 'Arroyo Hondo',
        coordinates: [18.4900, -69.9400],
        price: 'Consultar',
        isVerified: false,
        status: 'pending',
        isFoundingMember: false,
        rating: 0,
        reviewCount: 0,
        image: '',
        bio: 'Perfil no verificado.',
        insurance: [],
        whatsapp: ''
    },
    {
        id: '12',
        name: 'Consultorio Psicológico RD',
        role: 'Psychologist',
        specialties: ['General'],
        location: 'Los Rios',
        coordinates: [18.5000, -69.9600],
        price: 'Consultar',
        isVerified: false,
        status: 'pending',
        isFoundingMember: false,
        rating: 0,
        reviewCount: 0,
        image: '',
        bio: 'Perfil no verificado.',
        insurance: [],
        whatsapp: ''
    },
    {
        id: '13',
        name: 'Lic. Fernanda Gomez',
        role: 'Psychologist',
        specialties: [],
        location: 'Ensanche Quisqueya',
        coordinates: [18.4650, -69.9350],
        price: 'Consultar',
        isVerified: false,
        status: 'pending',
        isFoundingMember: false,
        rating: 0,
        reviewCount: 0,
        image: '',
        bio: '',
        insurance: [],
        whatsapp: ''
    },
    {
        id: '14',
        name: 'Dr. Alberto Ruiz',
        role: 'Psychiatrist',
        specialties: [],
        location: 'Mirador Norte',
        coordinates: [18.4580, -69.9400],
        price: 'Consultar',
        isVerified: false,
        status: 'pending',
        isFoundingMember: false,
        rating: 0,
        reviewCount: 0,
        image: '',
        bio: '',
        insurance: [],
        whatsapp: ''
    },
    {
        id: '15',
        name: 'Unidad de Salud Mental Las Caobas',
        role: 'Psychologist',
        specialties: [],
        location: 'Las Caobas',
        coordinates: [18.4600, -70.0000],
        price: 'Consultar',
        isVerified: false,
        status: 'pending',
        isFoundingMember: false,
        rating: 0,
        reviewCount: 0,
        image: '',
        bio: '',
        insurance: [],
        whatsapp: ''
    }
];

export interface Answer {
    id: string;
    providerId: string;
    text: string;
    upvotes: number;
    createdAt: string;
}

export interface Question {
    id: string;
    title: string;
    body: string;
    category: string;
    upvotes: number;
    status: 'pending' | 'published' | 'flagged'; // New field
    answers: Answer[];
    createdAt: string;
    slug: string;
}

export const MOCK_QUESTIONS: Question[] = [
    {
        id: 'q1',
        title: '¿Es normal sentir ansiedad después de una ruptura amorosa?',
        slug: 'ansiedad-ruptura-amorosa',
        category: 'Ansiedad',
        body: 'Hace dos meses terminé con mi pareja de 5 años y siento que no puedo respirar a veces. ¿Necesito medicación?',
        upvotes: 45,
        status: 'published',
        createdAt: '2023-10-01',
        answers: [
            {
                id: 'a1',
                providerId: '1',
                text: 'Es completamente normal experimentar síntomas físicos de ansiedad durante el duelo. No necesariamente indica que necesites medicación. La terapia puede ayudarte a procesar estas emociones.',
                upvotes: 89,
                createdAt: '2023-10-02'
            }
        ]
    },
    {
        id: 'q2',
        title: 'Mi hijo de 5 años no quiere hablar en el colegio',
        slug: 'hijo-no-habla-colegio',
        category: 'Infantil',
        body: 'En casa habla normal, pero la profesora dice que no emite palabra en clase. ¿Es autismo?',
        upvotes: 22,
        status: 'published',
        createdAt: '2023-10-05',
        answers: [
            {
                id: 'a3',
                providerId: '3',
                text: 'Lo que describes suena a Mutismo Selectivo, que está relacionado con la ansiedad social, no necesariamente autismo. Una evaluación temprana es clave.',
                upvotes: 50,
                createdAt: '2023-10-06'
            }
        ]
    },
    {
        id: 'q3',
        title: 'Insomnio crónico: ¿Melatonina o Psiquiatra?',
        slug: 'insomnio-cronico-melatonina',
        category: 'Sueño',
        body: 'Llevo 3 años durmiendo 4 horas. He probado tés y melatonina y nada funciona.',
        upvotes: 30,
        status: 'published',
        createdAt: '2023-10-10',
        answers: [
            {
                id: 'a4',
                providerId: '2',
                text: 'El insomnio crónico de 3 años requiere valoración médica. La automedicación puede ocultar causas subyacentes como apnea o depresión.',
                upvotes: 35,
                createdAt: '2023-10-11'
            }
        ]
    },
    {
        id: 'q4',
        title: '¿Cómo controlo los celos en mi relación?',
        slug: 'controlar-celos-relacion',
        category: 'Pareja',
        body: 'Siento celos injustificados de los compañeros de trabajo de mi esposo. Esto está afectando nuestra relación.',
        upvotes: 18,
        status: 'published',
        createdAt: '2023-10-12',
        answers: [
            { id: 'a5', providerId: '1', text: 'Los celos suelen raíz en inseguridades propias. Trabajar en tu autoestima es el primer paso.', upvotes: 20, createdAt: '2023-10-13' }
        ]
    },
    {
        id: 'q5',
        title: 'Ataques de pánico en el trabajo',
        slug: 'ataques-panico-trabajo',
        category: 'Ansiedad',
        body: 'He tenido dos episodios de taquicardia y miedo intenso antes de reuniones. ¿Me van a despedir si lo digo?',
        upvotes: 40,
        status: 'published',
        createdAt: '2023-10-14',
        answers: [
            { id: 'a6', providerId: '6', text: 'El estrés laboral es muy común. No temas buscar ayuda; tu salud mental es prioridad.', upvotes: 15, createdAt: '2023-10-14' }
        ]
    },
    {
        id: 'q6',
        title: 'Mi padre no acepta que tengo depresión',
        slug: 'padre-no-acepta-depresion',
        category: 'Familia',
        body: 'Dice que es "cosa de gente ociosa". Me siento muy sola.',
        upvotes: 55,
        status: 'published',
        createdAt: '2023-10-15',
        answers: [
            { id: 'a7', providerId: '5', text: 'La brecha generacional a veces dificulta la comprensión. Busca apoyo en otros grupos o familiares mientras trabajas tus límites.', upvotes: 42, createdAt: '2023-10-16' }
        ]
    },
    {
        id: 'q7',
        title: '¿Puedo superar una infidelidad?',
        slug: 'superar-infidelidad',
        category: 'Pareja',
        body: 'Mi esposa me fue infiel hace un año y no logro perdonarla aunque quiero seguir.',
        upvotes: 28,
        status: 'published',
        createdAt: '2023-10-17',
        answers: [
            { id: 'a8', providerId: '8', text: 'La confianza rota toma tiempo y trabajo activo de ambas partes para reconstruirse. La terapia de pareja es muy efectiva aquí.', upvotes: 30, createdAt: '2023-10-18' }
        ]
    },
    {
        id: 'q8',
        title: 'Miedo a conducir después de un accidente',
        slug: 'miedo-conducir-post-accidente',
        category: 'Trauma',
        body: 'Choqué hace 6 meses y ahora sudo frío solo de pensar en manejar.',
        upvotes: 12,
        status: 'published',
        createdAt: '2023-10-19',
        answers: [
            { id: 'a9', providerId: '5', text: 'Es un síntoma clásico de estrés postraumático. La terapia de exposición gradual puede ayudarte a retomar el volante.', upvotes: 18, createdAt: '2023-10-20' }
        ]
    },
    {
        id: 'q9',
        title: 'Adicción a las redes sociales',
        slug: 'adiccion-redes-sociales',
        category: 'Adicciones',
        body: 'Paso 6 horas al día en TikTok y me siento miserable viendo la vida de otros.',
        upvotes: 60,
        status: 'published',
        createdAt: '2023-10-21',
        answers: [
            { id: 'a10', providerId: '4', text: 'Las redes están diseñadas para ser adictivas. Intenta "detox" digitales cortos y busca hobbies fuera de pantalla.', upvotes: 50, createdAt: '2023-10-22' }
        ]
    },
    {
        id: 'q10',
        title: '¿La medicación psiquiátrica engorda?',
        slug: 'medicacion-psiquiatrica-engorda',
        category: 'Psiquiatría',
        body: 'Me recetaron antidepresivos pero tengo miedo de subir de peso.',
        upvotes: 33,
        status: 'published',
        createdAt: '2023-10-23',
        answers: [
            { id: 'a11', providerId: '2', text: 'Algunos medicamentos pueden afectar el peso, pero no todos. Habla con tu médico sobre tus preocupaciones para buscar alternativas neutras.', upvotes: 40, createdAt: '2023-10-23' }
        ]
    },
    {
        id: 'q11',
        title: 'Duelo por pérdida de mascota',
        slug: 'duelo-mascota',
        category: 'Duelo',
        body: 'Mi perro murió y me siento devastada, pero mis amigos dicen que "era solo un perro".',
        upvotes: 25,
        status: 'published',
        createdAt: '2023-10-24',
        answers: [
            { id: 'a12', providerId: '5', text: 'El vínculo con una mascota es profundo y real. Tu dolor es válido. Rodéate de quienes entiendan ese amor.', upvotes: 55, createdAt: '2023-10-25' }
        ]
    },
    {
        id: 'q12',
        title: 'Burnout en médicos',
        slug: 'burnout-medicos',
        category: 'Laboral',
        body: 'Soy residente y pienso en dejar la medicina. Lloro todos los días antes de ir al hospital.',
        upvotes: 70,
        status: 'published',
        createdAt: '2023-10-26',
        answers: [
            { id: 'a13', providerId: '6', text: 'Es una señal de alerta grave. Necesitas reposo y evaluación inmediata. No eres débil, estás agotado.', upvotes: 65, createdAt: '2023-10-27' }
        ]
    },
    {
        id: 'q13',
        title: 'TDAH en adultos',
        slug: 'tdah-adultos-diagnostico',
        category: 'Neurodesarrollo',
        body: 'Siempre pierdo las llaves y no puedo concentrarme en reuniones. ¿Tengo déficit de atención?',
        upvotes: 45,
        status: 'published',
        createdAt: '2023-10-28',
        answers: [
            { id: 'a14', providerId: '3', text: 'El TDAH adulto suele infradiagnosticarse. Una evaluación neuropsicológica puede confirmarlo.', upvotes: 38, createdAt: '2023-10-29' }
        ]
    },
    {
        id: 'q14',
        title: 'Mi novia es muy explosiva',
        slug: 'novia-explosiva-ira',
        category: 'Pareja',
        body: 'Rompe cosas cuando discutimos. Dice que es mi culpa por provocarla.',
        upvotes: 19,
        status: 'flagged', // FLAGGED for moderation testing
        createdAt: '2023-10-30',
        answers: [
            { id: 'a15', providerId: '4', text: 'La violencia física o destrucción de propiedad nunca es justificable. Es importante evaluar la seguridad de la relación.', upvotes: 25, createdAt: '2023-10-31' }
        ]
    },
    {
        id: 'q15',
        title: 'Miedo a hablar en público',
        slug: 'miedo-hablar-publico',
        category: 'Fobia Social',
        body: 'Tengo que presentar mi tesis y me paralizo.',
        upvotes: 14,
        status: 'published',
        createdAt: '2023-11-01',
        answers: [
            { id: 'a16', providerId: '1', text: 'Técnicas de respiración y práctica gradual pueden ayudar. A veces, un beta-bloqueante recetado puntualmente ayuda con los síntomas físicos.', upvotes: 20, createdAt: '2023-11-02' }
        ]
    },
    {
        id: 'q16',
        title: '¿Cómo ayudar a alguien con pensamientos suicidas?',
        slug: 'ayudar-pensamientos-suicidas',
        category: 'Crisis',
        body: 'Mi hermano hizo comentarios preocupantes.',
        upvotes: 100,
        status: 'published',
        createdAt: '2023-11-03',
        answers: [
            { id: 'a17', providerId: '4', text: 'No lo dejes solo. Llama a la Línea de Vida (809-200-1202) o llévalo a emergencias psiquiátricas. Tomalo en serio.', upvotes: 150, createdAt: '2023-11-03' }
        ]
    },
    {
        id: 'q17',
        title: 'Bipolaridad: ¿Se cura?',
        slug: 'bipolaridad-cura',
        category: 'Psiquiatría',
        body: 'Me diagnosticaron trastorno bipolar II.',
        upvotes: 22,
        status: 'published',
        createdAt: '2023-11-04',
        answers: [
            { id: 'a18', providerId: '2', text: 'Es una condición crónica, como la diabetes, pero perfectamente manejable con tratamiento constante. Se puede llevar una vida plena.', upvotes: 40, createdAt: '2023-11-05' }
        ]
    },
    {
        id: 'q18',
        title: 'Toc de limpieza',
        slug: 'toc-limpieza-manos',
        category: 'TOC',
        body: 'Me lavo las manos 50 veces al día hasta que sangran.',
        upvotes: 30,
        status: 'published',
        createdAt: '2023-11-06',
        answers: [
            { id: 'a19', providerId: '2', text: 'El TOC responde muy bien a medicación y terapia cognitivo-conductual. Hay alivio posible.', upvotes: 28, createdAt: '2023-11-07' }
        ]
    },
    {
        id: 'q19',
        title: 'Baja autoestima por acné',
        slug: 'baja-autoestima-acne',
        category: 'Autoestima',
        body: 'No quiero salir de casa porque me siento feo.',
        upvotes: 15,
        status: 'published',
        createdAt: '2023-11-08',
        answers: [
            { id: 'a20', providerId: '7', text: 'Tu valor no reside en tu piel. Trabajar la autoaceptación es vital, paralelo al tratamiento dermatológico.', upvotes: 22, createdAt: '2023-11-09' }
        ]
    },
    {
        id: 'q20',
        title: 'Síndrome del impostor',
        slug: 'sindrome-impostor-trabajo',
        category: 'Laboral',
        body: 'Me ascendieron pero siento que soy un fraude y se darán cuenta.',
        upvotes: 50,
        status: 'published',
        createdAt: '2023-11-10',
        answers: [
            { id: 'a21', providerId: '6', text: 'Muy común en personas exitosas. Reconoce tus logros como hechos objetivos, no como suerte.', upvotes: 60, createdAt: '2023-11-11' }
        ]
    }
];
