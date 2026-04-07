export type CellType = 'pronoun' | 'verb' | 'noun' | 'adjective' | 'adverb' | 'preposition' | 'folder' | 'navigation' | 'phrase';

export interface GridCell {
    id: string;
    pos: number; // 0-44
    label: string;
    type: CellType;
    pictogramId?: number;
    action?: 'speak' | 'navigate' | 'back' | 'clear';
    folderTarget?: string;
    bgColor?: string;
}

export const AAC_PAGES = {
    'root': [
        // Row 1
        { id: 'r1-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'r1-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'r1-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'r1-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'r1-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'r1-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'r1-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'r1-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'r1-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2
        { id: 'r1-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'r1-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'r1-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'r1-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'r1-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'r1-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'r1-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'r1-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'r1-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3
        { id: 'r1-18', pos: 18, label: "Personas", type: "folder", folderTarget: "personas", pictogramId: 34560 },
        { id: 'r1-19', pos: 19, label: "esto", type: "pronoun", action: "speak", pictogramId: 7095 },
        { id: 'r1-20', pos: 20, label: "parar", type: "verb", action: "speak", pictogramId: 7196 },
        { id: 'r1-21', pos: 21, label: "ir", type: "verb", action: "speak", pictogramId: 8142 },
        { id: 'r1-22', pos: 22, label: "venir", type: "verb", action: "speak", pictogramId: 32669 },
        { id: 'r1-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 },
        { id: 'r1-24', pos: 24, label: "en", type: "preposition", action: "speak", pictogramId: 7034 },
        { id: 'r1-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'r1-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Row 4
        { id: 'r1-27', pos: 27, label: "Cosas", type: "folder", folderTarget: "cosas", pictogramId: 35993 },
        { id: 'r1-28', pos: 28, label: "Diversión", type: "folder", folderTarget: "ocio" },
        { id: 'r1-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 },
        { id: 'r1-30', pos: 30, label: "ayudar", type: "verb", action: "speak", pictogramId: 32648 },
        { id: 'r1-31', pos: 31, label: "mirar", type: "verb", action: "speak", pictogramId: 6564 },
        { id: 'r1-32', pos: 32, label: "con", type: "preposition", action: "speak", pictogramId: 7064 },
        { id: 'r1-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'r1-34', pos: 34, label: "Palabritas", type: "folder", folderTarget: "palabras_inicio" },
        { id: 'r1-35', pos: 35, label: "Tiempo", type: "folder", folderTarget: "tiempo", pictogramId: 7223 },

        // Row 5
        { id: 'r1-36', pos: 36, label: "Comida", type: "folder", folderTarget: "comida", pictogramId: 4610 },
        { id: 'r1-37', pos: 37, label: "Lugares", type: "folder", folderTarget: "lugares", pictogramId: 9819 },
        { id: 'r1-38', pos: 38, label: "Acciones", type: "folder", folderTarget: "acciones", pictogramId: 7297 },
        { id: 'r1-39', pos: 39, label: "Describir", type: "folder", folderTarget: "describir" },
        { id: 'r1-40', pos: 40, label: "Estados", type: "folder", folderTarget: "estados", pictogramId: 39091 },
        { id: 'r1-41', pos: 41, label: "Conversación", type: "folder", folderTarget: "conversacion", pictogramId: 23402 },
        { id: 'r1-42', pos: 42, label: "Ayuda", type: "folder", folderTarget: "ayuda", pictogramId: 12252 }, // Necesidades/Ayuda
        { id: 'r1-43', pos: 43, label: "Preguntas", type: "folder", folderTarget: "preguntas", pictogramId: 7217 },
        { id: 'r1-44', pos: 44, label: "Másd", type: "navigation", action: "navigate", folderTarget: "root_2" },
    ] as GridCell[],

    'root_2': [
        // Row 1
        { id: 'r2-0', pos: 0, label: "Pistas", type: "folder", folderTarget: "pistas", pictogramId: 5087 }, // Lupa/Pistas (2605 approx)
        { id: 'r2-1', pos: 1, label: "Dónde", type: "folder", folderTarget: "donde_cat", pictogramId: 7764 }, // Ubicacion (2826 approx)
        { id: 'r2-2', pos: 2, label: "Cuál", type: "folder", folderTarget: "cual_cat", pictogramId: 26022 }, // Pregunta/Cual
        { id: 'r2-3', pos: 3, label: "Conjunciones", type: "folder", folderTarget: "conjunciones", pictogramId: 28359 }, // Enlace/Conjuncion
        { id: 'r2-4', pos: 4, label: "Números", type: "folder", folderTarget: "numeros", pictogramId: 2879 }, // Numeros (12345)
        { id: 'r2-5', pos: 5, label: "Escuela", type: "folder", folderTarget: "escolares", pictogramId: 32446 }, // Escuela building
        { id: 'r2-6', pos: 6, label: "Religión", type: "folder", folderTarget: "religion", pictogramId: 24471 }, // Religion
        { id: 'r2-7', pos: 7, label: "Actividades", type: "folder", folderTarget: "actividades_de_ejemplo", pictogramId: 8008 }, // Similar a acciones
        { id: 'r2-8', pos: 8, label: "Cosas de la casa", type: "folder", folderTarget: "hogar", pictogramId: 36465 }, // Casa

        // Row 2
        { id: 'r2-9', pos: 9, label: "Mes CAA", type: "folder", folderTarget: "mes_caa", pictogramId: 7161 }, // Placeholder

        // Navigation Back Button at the end (Pos 44)
        { id: 'r2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root", pictogramId: 37086 } // Flecha atras
    ] as GridCell[],

    'personas': [
        // Row 1 (Core Vocabulary - Mostly Fixed)
        { id: 'p-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'p-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'p-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'p-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'p-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'p-5', pos: 5, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 }, // Contextual change: qué -> quién
        { id: 'p-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'p-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'p-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2
        { id: 'p-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'p-10', pos: 10, label: "nombre", type: "noun", action: "speak", pictogramId: 27357 }, // Name tag
        { id: 'p-11', pos: 11, label: "hombre", type: "noun", action: "speak", pictogramId: 4665 },
        { id: 'p-12', pos: 12, label: "mujer", type: "noun", action: "speak", pictogramId: 24621 },
        { id: 'p-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 }, // Kept from root
        { id: 'p-14', pos: 14, label: "niño", type: "noun", action: "speak", pictogramId: 7176 },
        { id: 'p-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'p-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'p-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Mix of nouns and core)
        { id: 'p-18', pos: 18, label: "él", type: "pronoun", action: "speak", pictogramId: 6480 },
        { id: 'p-19', pos: 19, label: "niña", type: "noun", action: "speak", pictogramId: 27509 },
        { id: 'p-20', pos: 20, label: "bebé", type: "noun", action: "speak", pictogramId: 6060 },
        { id: 'p-21', pos: 21, label: "joven", type: "noun", action: "speak", pictogramId: 26146 }, // Male
        { id: 'p-22', pos: 22, label: "joven", type: "noun", action: "speak", pictogramId: 26146 }, // Female
        { id: 'p-23', pos: 23, label: "¿Quién es?", type: "folder", folderTarget: "quien_es", pictogramId: 9853 }, // Question group
        { id: 'p-24', pos: 24, label: "para", type: "preposition", action: "speak", pictogramId: 7194 },
        { id: 'p-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'p-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Row 4 (Categories)
        { id: 'p-27', pos: 27, label: "ella", type: "pronoun", action: "speak", pictogramId: 7029 },
        { id: 'p-28', pos: 28, label: "Familia", type: "folder", folderTarget: "familia", pictogramId: 38351 },
        { id: 'p-29', pos: 29, label: "Amigos", type: "folder", folderTarget: "amigos", pictogramId: 25790 },
        { id: 'p-30', pos: 30, label: "Maestros", type: "folder", folderTarget: "maestros", pictogramId: 6556 },
        { id: 'p-31', pos: 31, label: "Terapeutas", type: "folder", folderTarget: "terapeutas" },
        { id: 'p-32', pos: 32, label: "Contactos", type: "folder", folderTarget: "contactos" }, // Agenda/Contactos
        { id: 'p-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'p-34', pos: 34, label: "Empleos", type: "folder", folderTarget: "empleos", pictogramId: 11457 }, // Professions
        { id: 'p-35', pos: 35, label: "¿Quién eres?", type: "folder", folderTarget: "quien_eres", pictogramId: 7803 },

        // Row 5
        { id: 'p-36', pos: 36, label: "Personas famosas", type: "folder", folderTarget: "famosos", pictogramId: 33974 },
        { id: 'p-37', pos: 37, label: "Personajes", type: "folder", folderTarget: "personajes_folder", pictogramId: 5405 },
        { id: 'p-38', pos: 38, label: "Pronombres", type: "folder", folderTarget: "pronombres", pictogramId: 6480 },
        { id: 'p-39', pos: 39, label: "Atención médica", type: "folder", folderTarget: "medicos", pictogramId: 34609 },
        { id: 'p-40', pos: 40, label: "Noticias", type: "folder", folderTarget: "noticias", pictogramId: 7784 },
        { id: 'p-41', pos: 41, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'p-42', pos: 42, label: "mío", type: "pronoun", action: "speak", pictogramId: 12264 },
        { id: 'p-43', pos: 43, label: "mi", type: "pronoun", action: "speak", pictogramId: 12264 },
        { id: 'p-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "personas_2", pictogramId: 3220 }
    ] as GridCell[],

    'personas_2': [
        // Row 1 (Core & Overflow)
        { id: 'p2-0', pos: 0, label: "su", type: "pronoun", action: "speak", pictogramId: 12272 }, // Moved from p-44
        { id: 'p2-1', pos: 1, label: "todos", type: "pronoun", action: "speak", pictogramId: 5596 },
        { id: 'p2-2', pos: 2, label: "visita", type: "noun", action: "speak", pictogramId: 27126 },
        { id: 'p2-3', pos: 3, label: "niña", type: "noun", action: "speak", pictogramId: 27509 }, // Wheelchair
        { id: 'p2-4', pos: 4, label: "personas", type: "noun", action: "speak", pictogramId: 34560 }, // Group
        { id: 'p2-5', pos: 5, label: "señor", type: "noun", action: "speak", pictogramId: 4744 },
        { id: 'p2-6', pos: 6, label: "abuelo", type: "noun", action: "speak", pictogramId: 23718 },

        { id: 'p2-7', pos: 7, label: "amigos", type: "folder", action: "navigate", folderTarget: "amigos", pictogramId: 25790 },

        // Navigation Back Button
        { id: 'p2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "personas", pictogramId: 37086 }
    ] as GridCell[],

    'familia': [
        // Row 1 (Core - Inherited from Personas)
        { id: 'f-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'f-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'f-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'f-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'f-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'f-5', pos: 5, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'f-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'f-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'f-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2
        { id: 'f-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'f-10', pos: 10, label: "ustedes", type: "pronoun", action: "speak" }, // Visual 'tú' plural
        { id: 'f-11', pos: 11, label: "amar", type: "verb", action: "speak", pictogramId: 6898 },
        { id: 'f-12', pos: 12, label: "odiar", type: "verb", action: "speak", pictogramId: 38936 },
        { id: 'f-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 }, // Fixed
        { id: 'f-14', pos: 14, label: "familia", type: "noun", action: "speak", pictogramId: 38351 },
        { id: 'f-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'f-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'f-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3
        { id: 'f-18', pos: 18, label: "él", type: "pronoun", action: "speak", pictogramId: 6480 },
        { id: 'f-19', pos: 19, label: "hermano", type: "noun", action: "speak", pictogramId: 2423 }, // Check ID
        { id: 'f-20', pos: 20, label: "hermana", type: "noun", action: "speak", pictogramId: 2422 }, // Check ID
        { id: 'f-21', pos: 21, label: "papá", type: "noun", action: "speak", pictogramId: 31146 },
        { id: 'f-22', pos: 22, label: "mamá", type: "noun", action: "speak", pictogramId: 2458 },
        { id: 'f-23', pos: 23, label: "abuela", type: "noun", action: "speak", pictogramId: 23710 },
        { id: 'f-24', pos: 24, label: "para", type: "preposition", action: "speak", pictogramId: 7194 },
        { id: 'f-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'f-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Row 4
        { id: 'f-27', pos: 27, label: "ella", type: "pronoun", action: "speak", pictogramId: 7029 },
        { id: 'f-28', pos: 28, label: "abuelo", type: "noun", action: "speak", pictogramId: 23718 },
        { id: 'f-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },

        // Row 5
        { id: 'f-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "familia_2", pictogramId: 3220 }
    ] as GridCell[],

    'familia_2': [
        // Row 1
        { id: 'f2-0', pos: 0, label: "tía", type: "noun", action: "speak", pictogramId: 30271 },
        { id: 'f2-1', pos: 1, label: "tío", type: "noun", action: "speak", pictogramId: 30255 },
        { id: 'f2-2', pos: 2, label: "primo", type: "noun", action: "speak", pictogramId: 30340 }, // Cousins group usually or male
        { id: 'f2-3', pos: 3, label: "hija", type: "noun", action: "speak", pictogramId: 9885 }, // Girl/Daughter
        { id: 'f2-4', pos: 4, label: "hijo", type: "noun", action: "speak", pictogramId: 9887 }, // Boy/Son
        { id: 'f2-5', pos: 5, label: "nieta", type: "noun", action: "speak", pictogramId: 10342 },
        { id: 'f2-6', pos: 6, label: "nieto", type: "noun", action: "speak", pictogramId: 10343 },
        { id: 'f2-7', pos: 7, label: "hermanastro", type: "noun", action: "speak" },
        { id: 'f2-8', pos: 8, label: "hermanastra", type: "noun", action: "speak" },

        // Row 2
        { id: 'f2-9', pos: 9, label: "padrastro", type: "noun", action: "speak", pictogramId: 39008 }, // Stepdad (often same as dad or specific)
        { id: 'f2-10', pos: 10, label: "madrastra", type: "noun", action: "speak" }, // Stepmom
        { id: 'f2-11', pos: 11, label: "esposo", type: "noun", action: "speak", pictogramId: 8111 },
        { id: 'f2-12', pos: 12, label: "esposa", type: "noun", action: "speak", pictogramId: 8110 },

        // Navigation Back Button
        { id: 'f2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "familia", pictogramId: 37086 }
    ] as GridCell[],

    'amigos': [
        // Row 1 (Core - Inherited)
        { id: 'am-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'am-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'am-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'am-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'am-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'am-5', pos: 5, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'am-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'am-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'am-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2
        { id: 'am-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'am-10', pos: 10, label: "amar", type: "verb", action: "speak", pictogramId: 6898 },
        { id: 'am-11', pos: 11, label: "odiar", type: "verb", action: "speak", pictogramId: 38936 },
        { id: 'am-12', pos: 12, label: "amigo", type: "noun", action: "speak", pictogramId: 25790 }, // Check ID
        { id: 'am-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 }, // Fixed
        { id: 'am-14', pos: 14, label: "amiga", type: "noun", action: "speak", pictogramId: 8486 }, // Check ID
        { id: 'am-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'am-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'am-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3
        { id: 'am-18', pos: 18, label: "él", type: "pronoun", action: "speak", pictogramId: 6480 },
        { id: 'am-19', pos: 19, label: "mejor amigo", type: "noun", action: "speak", pictogramId: 38942 },
        { id: 'am-20', pos: 20, label: "novio", type: "noun", action: "speak", pictogramId: 8641 },
        { id: 'am-21', pos: 21, label: "novia", type: "noun", action: "speak", pictogramId: 8640 },
        { id: 'am-22', pos: 22, label: "vecino", type: "noun", action: "speak", pictogramId: 26529 },
        { id: 'am-23', pos: 23, label: "vecina", type: "noun", action: "speak", pictogramId: 26529 },
        { id: 'am-24', pos: 24, label: "para", type: "preposition", action: "speak", pictogramId: 7194 },
        { id: 'am-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'am-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Row 4
        { id: 'am-27', pos: 27, label: "ella", type: "pronoun", action: "speak", pictogramId: 7029 },
        // Custom folders omitted or placeholders
        { id: 'am-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },

        // Row 5 (None shown on image, adding back button if needed, but image shows empty except for statics? No, image cuts off.)
        // Actually image shows row 5 completely empty. But we need a way back if not using hardware button.
        // Assuming Standard Back button at 44.
        { id: 'am-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "personas", pictogramId: 37086 }
    ] as GridCell[],

    'contactos': [
        // Row 1 (Core - Inherited)
        { id: 'ct-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'ct-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'ct-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'ct-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'ct-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'ct-5', pos: 5, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'ct-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'ct-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'ct-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2
        { id: 'ct-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'ct-10', pos: 10, label: "escribir", type: "verb", action: "speak", pictogramId: 2380 },
        { id: 'ct-11', pos: 11, label: "llamar", type: "verb", action: "speak", pictogramId: 32669 },
        { id: 'ct-12', pos: 12, label: "cuaderno", type: "noun", action: "speak", pictogramId: 2359 },
        { id: 'ct-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'ct-14', pos: 14, label: "email", type: "noun", action: "speak", pictogramId: 27355 },
        { id: 'ct-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'ct-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'ct-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3
        { id: 'ct-18', pos: 18, label: "él", type: "pronoun", action: "speak", pictogramId: 6480 },
        { id: 'ct-19', pos: 19, label: "texto", type: "noun", action: "speak", pictogramId: 37340 }, // SMS
        { id: 'ct-20', pos: 20, label: "Email mamá", type: "phrase", action: "speak", pictogramId: 37412 }, // Generic
        { id: 'ct-21', pos: 21, label: "Email papá", type: "phrase", action: "speak", pictogramId: 27361 },
        { id: 'ct-22', pos: 22, label: "Llamar a alguien", type: "phrase", action: "speak", pictogramId: 29167 },
        { id: 'ct-23', pos: 23, label: "Mi dirección", type: "phrase", action: "speak", pictogramId: 27351 },
        { id: 'ct-24', pos: 24, label: "para", type: "preposition", action: "speak", pictogramId: 7194 },
        { id: 'ct-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'ct-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Row 4
        { id: 'ct-27', pos: 27, label: "ella", type: "pronoun", action: "speak", pictogramId: 7029 },
        { id: 'ct-28', pos: 28, label: "Mi email", type: "phrase", action: "speak", pictogramId: 27351 },
        { id: 'ct-29', pos: 29, label: "Mi teléfono", type: "phrase", action: "speak", pictogramId: 3258 },
        { id: 'ct-30', pos: 30, label: "Teléfono mamá", type: "phrase", action: "speak", pictogramId: 3258 },
        { id: 'ct-31', pos: 31, label: "Teléfono papá", type: "phrase", action: "speak", pictogramId: 3258 },
        { id: 'ct-32', pos: 32, label: "¿Tu dirección?", type: "phrase", action: "speak", pictogramId: 31484 },
        { id: 'ct-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'ct-34', pos: 34, label: "¿Tu email?", type: "phrase", action: "speak", pictogramId: 38573 },
        { id: 'ct-35', pos: 35, label: "¿Tu teléfono?", type: "phrase", action: "speak", pictogramId: 27327 },

        // Row 5
        { id: 'ct-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "personas", pictogramId: 37086 }
    ] as GridCell[],

    'empleos': [
        // Row 1 (Core - Inherited)
        { id: 'em-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'em-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'em-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'em-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'em-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'em-5', pos: 5, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'em-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'em-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'em-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2
        { id: 'em-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'em-10', pos: 10, label: "trabajo", type: "noun", action: "speak", pictogramId: 16087 }, // General work
        { id: 'em-11', pos: 11, label: "actor", type: "noun", action: "speak", pictogramId: 36075 },
        { id: 'em-12', pos: 12, label: "agricultor", type: "noun", action: "speak", pictogramId: 2982 },
        { id: 'em-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'em-14', pos: 14, label: "atleta", type: "noun", action: "speak", pictogramId: 3179 }, // Sport/Athlete
        { id: 'em-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'em-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'em-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3
        { id: 'em-18', pos: 18, label: "él", type: "pronoun", action: "speak", pictogramId: 6480 },
        { id: 'em-19', pos: 19, label: "bibliotecario", type: "noun", action: "speak", pictogramId: 27499 },
        { id: 'em-20', pos: 20, label: "bombero", type: "noun", action: "speak", pictogramId: 6066 },
        { id: 'em-21', pos: 21, label: "cantante", type: "noun", action: "speak", pictogramId: 4585 },
        { id: 'em-22', pos: 22, label: "cartero", type: "noun", action: "speak", pictogramId: 2690 },
        { id: 'em-23', pos: 23, label: "chef", type: "noun", action: "speak", pictogramId: 10348 }, // Cook
        { id: 'em-24', pos: 24, label: "para", type: "preposition", action: "speak", pictogramId: 7194 },
        { id: 'em-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'em-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Row 4
        { id: 'em-27', pos: 27, label: "ella", type: "pronoun", action: "speak", pictogramId: 7029 },
        { id: 'em-28', pos: 28, label: "chofer", type: "noun", action: "speak", pictogramId: 3019 }, // Driver
        { id: 'em-29', pos: 29, label: "custodio", type: "noun", action: "speak" }, // Janitor/Guard
        { id: 'em-30', pos: 30, label: "entrenador", type: "noun", action: "speak", pictogramId: 5991 }, // Coach
        { id: 'em-31', pos: 31, label: "guardia", type: "noun", action: "speak", pictogramId: 5547 }, // Police/Guard
        { id: 'em-32', pos: 32, label: "mesero", type: "noun", action: "speak", pictogramId: 2681 }, // Waiter
        { id: 'em-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'em-34', pos: 34, label: "niñera", type: "noun", action: "speak" }, // Babysitter
        { id: 'em-35', pos: 35, label: "policía", type: "noun", action: "speak", pictogramId: 37367 },

        // Row 5 (Filling the bottom static row with content as per image)
        { id: 'em-36', pos: 36, label: "secretaria", type: "noun", action: "speak", pictogramId: 4742 },
        { id: 'em-37', pos: 37, label: "vaquero", type: "noun", action: "speak", pictogramId: 5602 }, // Cowboy
        { id: 'em-38', pos: 38, label: "minero", type: "noun", action: "speak", pictogramId: 8631 },
        { id: 'em-39', pos: 39, label: "cajero", type: "noun", action: "speak", pictogramId: 6069 },
        { id: 'em-40', pos: 40, label: "camarero", type: "noun", action: "speak", pictogramId: 2681 },
        { id: 'em-41', pos: 41, label: "bailarín", type: "noun", action: "speak", pictogramId: 11186 },
        { id: 'em-42', pos: 42, label: "DJ", type: "noun", action: "speak", pictogramId: 9193 },
        { id: 'em-43', pos: 43, label: "agente", type: "noun", action: "speak", pictogramId: 35133 },
        { id: 'em-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "empleos_2", pictogramId: 3220 }
    ] as GridCell[],

    'empleos_2': [
        // Row 1
        { id: 'em2-0', pos: 0, label: "abogado", type: "noun", action: "speak", pictogramId: 2636 },
        { id: 'em2-1', pos: 1, label: "artista", type: "noun", action: "speak", pictogramId: 34767 },
        { id: 'em2-2', pos: 2, label: "astronauta", type: "noun", action: "speak", pictogramId: 4569 },
        { id: 'em2-3', pos: 3, label: "bailarina", type: "noun", action: "speak", pictogramId: 2653 },
        { id: 'em2-4', pos: 4, label: "basurero", type: "noun", action: "speak", pictogramId: 2993 },
        { id: 'em2-5', pos: 5, label: "caballero", type: "noun", action: "speak", pictogramId: 5406 },
        { id: 'em2-6', pos: 6, label: "carpintero", type: "noun", action: "speak", pictogramId: 2687 },
        { id: 'em2-7', pos: 7, label: "científico", type: "noun", action: "speak", pictogramId: 8076 },
        { id: 'em2-8', pos: 8, label: "comediante", type: "noun", action: "speak" },

        // Row 2
        { id: 'em2-9', pos: 9, label: "electricista", type: "noun", action: "speak", pictogramId: 2740 },
        { id: 'em2-10', pos: 10, label: "farmaceuta", type: "noun", action: "speak" },
        { id: 'em2-11', pos: 11, label: "fotógrafo", type: "noun", action: "speak", pictogramId: 11267 },
        { id: 'em2-12', pos: 12, label: "juez", type: "noun", action: "speak", pictogramId: 11291 },
        { id: 'em2-13', pos: 13, label: "luchador", type: "noun", action: "speak" },
        { id: 'em2-14', pos: 14, label: "mago", type: "noun", action: "speak", pictogramId: 2932 },
        { id: 'em2-15', pos: 15, label: "marino", type: "noun", action: "speak", pictogramId: 5507 },
        { id: 'em2-16', pos: 16, label: "mecánico", type: "noun", action: "speak", pictogramId: 2921 },
        { id: 'em2-17', pos: 17, label: "modelo", type: "noun", action: "speak" },

        // Row 3 (Sample)
        { id: 'em2-18', pos: 18, label: "peluquero", type: "noun", action: "speak", pictogramId: 6588 },
        { id: 'em2-19', pos: 19, label: "piloto", type: "noun", action: "speak", pictogramId: 3370 },
        { id: 'em2-20', pos: 20, label: "plomero", type: "noun", action: "speak", pictogramId: 3321 },
        { id: 'em2-21', pos: 21, label: "presidente", type: "noun", action: "speak", pictogramId: 15326 },
        { id: 'em2-22', pos: 22, label: "princesa", type: "noun", action: "speak", pictogramId: 5554 },
        { id: 'em2-23', pos: 23, label: "rey", type: "noun", action: "speak", pictogramId: 5563 },
        { id: 'em2-24', pos: 24, label: "soldado", type: "noun", action: "speak", pictogramId: 2797 },
        { id: 'em2-25', pos: 25, label: "veterinario", type: "noun", action: "speak", pictogramId: 11392 },
        { id: 'em2-26', pos: 26, label: "informático", type: "noun", action: "speak", pictogramId: 2969 }, // Computing

        // Navigation Back
        { id: 'em2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "empleos", pictogramId: 37086 }
    ] as GridCell[],

    'famosos': [
        // Row 1 (Core - Inherited)
        { id: 'fam-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'fam-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'fam-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'fam-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'fam-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'fam-5', pos: 5, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'fam-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'fam-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'fam-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2
        { id: 'fam-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'fam-10', pos: 10, label: "Artistas de cine y TV", type: "folder", folderTarget: "artistas_tv", pictogramId: 6170 }, // Placeholder ID
        { id: 'fam-11', pos: 11, label: "Deportistas", type: "folder", folderTarget: "deportistas", pictogramId: 39276 },
        { id: 'fam-12', pos: 12, label: "Músicos", type: "folder", folderTarget: "musicos", pictogramId: 2890 },
        { id: 'fam-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'fam-14', pos: 14, label: "Personajes", type: "folder", folderTarget: "personajes_folder", pictogramId: 5405 },
        { id: 'fam-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'fam-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'fam-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3
        { id: 'fam-18', pos: 18, label: "él", type: "pronoun", action: "speak", pictogramId: 6480 },
        { id: 'fam-19', pos: 19, label: "Noticias", type: "folder", folderTarget: "noticias_cat", pictogramId: 7784 },
        { id: 'fam-20', pos: 20, label: "Escritores", type: "folder", folderTarget: "escritores", pictogramId: 11258 }, // Placeholder
        { id: 'fam-21', pos: 21, label: "Personajes históricos", type: "folder", folderTarget: "personajes_hist", pictogramId: 38259 },
        // Empty 22, 23
        { id: 'fam-24', pos: 24, label: "para", type: "preposition", action: "speak", pictogramId: 7194 },
        { id: 'fam-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'fam-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Row 4
        { id: 'fam-27', pos: 27, label: "ella", type: "pronoun", action: "speak", pictogramId: 7029 },
        // Empty 28-32
        { id: 'fam-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },
        // Empty 34, 35

        // Row 5 (Navigation)
        { id: 'fam-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "personas", pictogramId: 37086 }
    ] as GridCell[],

    'artistas_tv': [
        // Row 1 (Core - Inherited)
        { id: 'art-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'art-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'art-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'art-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'art-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'art-5', pos: 5, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'art-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'art-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'art-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Specific Verbs & Content)
        { id: 'art-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'art-10', pos: 10, label: "amar", type: "verb", action: "speak", pictogramId: 6898 }, // Love/Heart
        { id: 'art-11', pos: 11, label: "odiar", type: "verb", action: "speak", pictogramId: 38936 }, // Hate/Angry face
        { id: 'art-12', pos: 12, label: "actuar", type: "verb", action: "speak", pictogramId: 35709 }, // Actor/Act
        { id: 'art-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 }, // Standard
        { id: 'art-14', pos: 14, label: "George Clooney", type: "noun", action: "speak" }, // Placeholder actor pic
        { id: 'art-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'art-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'art-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3
        { id: 'art-18', pos: 18, label: "él", type: "pronoun", action: "speak", pictogramId: 6480 },
        // Empty 19-23
        { id: 'art-24', pos: 24, label: "para", type: "preposition", action: "speak", pictogramId: 7194 },
        { id: 'art-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'art-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Row 4
        { id: 'art-27', pos: 27, label: "ella", type: "pronoun", action: "speak", pictogramId: 7029 },
        // Empty 28-32
        { id: 'art-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 }, // Implicit from col 7 rule
        // Empty 34, 35

        // Row 5 (Navigation)
        { id: 'art-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "famosos", pictogramId: 37086 }
    ] as GridCell[],

    'deportistas': [
        // Row 1 (Core - Inherited)
        { id: 'dep-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'dep-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'dep-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'dep-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'dep-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'dep-5', pos: 5, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'dep-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'dep-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'dep-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Specific Verbs)
        { id: 'dep-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'dep-10', pos: 10, label: "amar", type: "verb", action: "speak", pictogramId: 6898 },
        { id: 'dep-11', pos: 11, label: "odiar", type: "verb", action: "speak", pictogramId: 38936 },
        { id: 'dep-12', pos: 12, label: "jugar", type: "verb", action: "speak", pictogramId: 23392 }, // Contextual: Play (sport) -> need correct ID, using generic
        { id: 'dep-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        // Empty 14 (Sample nouns would go here)
        { id: 'dep-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'dep-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'dep-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3
        { id: 'dep-18', pos: 18, label: "él", type: "pronoun", action: "speak", pictogramId: 6480 },
        // Empty 19-23
        { id: 'dep-24', pos: 24, label: "para", type: "preposition", action: "speak", pictogramId: 7194 },
        { id: 'dep-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'dep-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Row 4
        { id: 'dep-27', pos: 27, label: "ella", type: "pronoun", action: "speak", pictogramId: 7029 },
        // Empty 28-32
        { id: 'dep-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },
        // Empty 34, 35

        // Row 5 (Navigation)
        { id: 'dep-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "famosos", pictogramId: 37086 }
    ] as GridCell[],

    'musicos': [
        // Row 1 (Core - Inherited)
        { id: 'mus-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'mus-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'mus-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'mus-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'mus-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'mus-5', pos: 5, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'mus-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'mus-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'mus-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Specific Verbs)
        { id: 'mus-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'mus-10', pos: 10, label: "amar", type: "verb", action: "speak", pictogramId: 6898 },
        { id: 'mus-11', pos: 11, label: "odiar", type: "verb", action: "speak", pictogramId: 38936 },
        { id: 'mus-12', pos: 12, label: "tocar", type: "verb", action: "speak", pictogramId: 3293 }, // Play instrument
        { id: 'mus-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'mus-14', pos: 14, label: "cantar", type: "verb", action: "speak", pictogramId: 6960 },
        { id: 'mus-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'mus-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'mus-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Artists A-C)
        { id: 'mus-18', pos: 18, label: "él", type: "pronoun", action: "speak", pictogramId: 6480 },
        { id: 'mus-19', pos: 19, label: "Adele", type: "noun", action: "speak" },
        { id: 'mus-20', pos: 20, label: "Beyonce Knowles", type: "noun", action: "speak" },
        { id: 'mus-21', pos: 21, label: "Bono", type: "noun", action: "speak", pictogramId: 6872 },
        { id: 'mus-22', pos: 22, label: "Bruno Mars", type: "noun", action: "speak" },
        { id: 'mus-23', pos: 23, label: "Chris Martin", type: "noun", action: "speak" },
        { id: 'mus-24', pos: 24, label: "para", type: "preposition", action: "speak", pictogramId: 7194 },
        { id: 'mus-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'mus-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Row 4 (Artists C-J)
        { id: 'mus-27', pos: 27, label: "ella", type: "pronoun", action: "speak", pictogramId: 7029 },
        { id: 'mus-28', pos: 28, label: "Coldplay", type: "noun", action: "speak" },
        { id: 'mus-29', pos: 29, label: "George Harrison", type: "noun", action: "speak" },
        { id: 'mus-30', pos: 30, label: "Geri Halliwell", type: "noun", action: "speak" },
        { id: 'mus-31', pos: 31, label: "Harry Styles", type: "noun", action: "speak" },
        { id: 'mus-32', pos: 32, label: "John Lennon", type: "noun", action: "speak" },
        { id: 'mus-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'mus-34', pos: 34, label: "Justin Bieber", type: "noun", action: "speak" }, // Warning: Occupies "Prep space" but per visual
        { id: 'mus-35', pos: 35, label: "Kelly Clarkson", type: "noun", action: "speak" },

        // Row 5 (Artists O-T & Navigation)
        { id: 'mus-36', pos: 36, label: "One Direction", type: "noun", action: "speak" },
        { id: 'mus-37', pos: 37, label: "Paul McCartney", type: "noun", action: "speak" },
        { id: 'mus-38', pos: 38, label: "The Beatles", type: "noun", action: "speak" },
        { id: 'mus-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "famosos", pictogramId: 37086 }
    ] as GridCell[],

    'personajes_folder': [
        // Row 1 (Core - Inherited)
        { id: 'per-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'per-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'per-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'per-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'per-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'per-5', pos: 5, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'per-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'per-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'per-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Mixed Verbs & Nouns)
        { id: 'per-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'per-10', pos: 10, label: "amar", type: "verb", action: "speak", pictogramId: 6898 },
        { id: 'per-11', pos: 11, label: "odiar", type: "verb", action: "speak", pictogramId: 38936 },
        { id: 'per-12', pos: 12, label: "bruja", type: "noun", action: "speak", pictogramId: 5404 }, // Mixed type
        { id: 'per-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'per-14', pos: 14, label: "dragón", type: "noun", action: "speak", pictogramId: 5572 }, // Mixed type
        { id: 'per-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'per-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'per-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Characters)
        { id: 'per-18', pos: 18, label: "él", type: "pronoun", action: "speak", pictogramId: 6480 },
        { id: 'per-19', pos: 19, label: "elfo", type: "noun", action: "speak", pictogramId: 36388 },
        { id: 'per-20', pos: 20, label: "extraterrestre", type: "noun", action: "speak", pictogramId: 7154 },
        { id: 'per-21', pos: 21, label: "fantasma", type: "noun", action: "speak", pictogramId: 5469 },
        { id: 'per-22', pos: 22, label: "Genie", type: "noun", action: "speak", pictogramId: 2968 },
        { id: 'per-23', pos: 23, label: "hada", type: "noun", action: "speak", pictogramId: 5482 },
        { id: 'per-24', pos: 24, label: "para", type: "preposition", action: "speak", pictogramId: 7194 },
        { id: 'per-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'per-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Row 4 (Characters)
        { id: 'per-27', pos: 27, label: "ella", type: "pronoun", action: "speak", pictogramId: 7029 },
        { id: 'per-28', pos: 28, label: "héroe", type: "noun", action: "speak", pictogramId: 36728 },
        { id: 'per-29', pos: 29, label: "unicornio", type: "noun", action: "speak", pictogramId: 6237 },
        { id: 'per-30', pos: 30, label: "sirena", type: "noun", action: "speak", pictogramId: 5589 },
        { id: 'per-31', pos: 31, label: "Grug", type: "noun", action: "speak" },
        { id: 'per-32', pos: 32, label: "Rayo McQueen", type: "noun", action: "speak", pictogramId: 34545 },
        { id: 'per-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'per-34', pos: 34, label: "Aayla", type: "noun", action: "speak" },
        { id: 'per-35', pos: 35, label: "troll", type: "noun", action: "speak" },

        // Row 5 (Characters & Overflow Navigation)
        { id: 'per-36', pos: 36, label: "superhéroe", type: "noun", action: "speak" },
        { id: 'per-37', pos: 37, label: "monstruo", type: "noun", action: "speak", pictogramId: 11306 },
        { id: 'per-38', pos: 38, label: "Mickey Mouse", type: "noun", action: "speak" },
        { id: 'per-39', pos: 39, label: "Bart Simpson", type: "noun", action: "speak" },
        { id: 'per-40', pos: 40, label: "Batman", type: "noun", action: "speak", pictogramId: 8039 },
        { id: 'per-41', pos: 41, label: "Spiderman", type: "noun", action: "speak", pictogramId: 8224 },
        { id: 'per-42', pos: 42, label: "momia", type: "noun", action: "speak", pictogramId: 26427 },
        // Empty 43 (or standard navigation usually at 44? 44 is reserved for folder/nav)
        // Note: Image shows "Más... 2" at bottom right. This occupies the standard Back button slot if not careful. 
        // PROLOQUO behavior: Back is usually bottom left or handled by crumbs. But here the image shows 44 as "Más 2".
        // AND "Famosos" Back button is NOT visible in the image.
        // HOWEVER, to keep our app consistent, we might need a way BACK. 
        // But let's follow the image: Slot 44 is "Más...".
        // We will assume "Atrás" is handled strictly by the "Breadcrumb" or hardware back in this specific deep view, 
        // OR, we put "Más" in 43 and "Atrás" in 44? The image shows "Más" clearly at the end.
        // Let's implement Slot 44 as "Más" and rely on top-bar navigation for "Back" to Famosos, OR assume the user wants the Reference experience.
        // Let's put "Más" at 44 for fidelity to image.
        { id: 'per-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "personajes_2", pictogramId: 3220 }
    ] as GridCell[],

    'personajes_2': [
        // Page 2 - Based on Image 2, it is empty except for the overflow item and Back button.
        // It does NOT repeat the Core words (Row 1 is empty in the image).

        // Row 1
        { id: 'per2-0', pos: 0, label: "vampiro", type: "noun", action: "speak", pictogramId: 6239 },

        // Navigation Back (Image shows "Atrás" at bottom right, labeled "1" or arrow left)
        // Position 44
        { id: 'per2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "personajes_folder", pictogramId: 37086 }
    ] as GridCell[],

    'noticias_cat': [
        // Row 1 (Inherited Core)
        { id: 'not-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'not-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'not-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'not-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'not-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'not-5', pos: 5, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'not-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'not-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'not-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2
        { id: 'not-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'not-10', pos: 10, label: "amar", type: "verb", action: "speak", pictogramId: 6898 },
        { id: 'not-11', pos: 11, label: "odiar", type: "verb", action: "speak", pictogramId: 38936 },
        { id: 'not-12', pos: 12, label: "Barack Obama", type: "noun", action: "speak" }, // Contextual noun in verb slot
        { id: 'not-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'not-14', pos: 14, label: "noticias", type: "noun", action: "speak", pictogramId: 7784 }, // TV/News
        { id: 'not-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'not-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'not-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3-4 (Empty in reference, so we leave standard framework)
        { id: 'not-18', pos: 18, label: "él", type: "pronoun", action: "speak", pictogramId: 6480 },
        { id: 'not-24', pos: 24, label: "para", type: "preposition", action: "speak", pictogramId: 7194 },
        { id: 'not-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'not-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },
        { id: 'not-27', pos: 27, label: "ella", type: "pronoun", action: "speak", pictogramId: 7029 },
        { id: 'not-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },

        // Navigation
        { id: 'not-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "famosos", pictogramId: 37086 }
    ] as GridCell[],

    'escritores': [
        // Row 1 (Inherited)
        { id: 'esc-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'esc-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'esc-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'esc-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'esc-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'esc-5', pos: 5, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'esc-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'esc-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'esc-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Specific Verbs: Leer, Escribir)
        { id: 'esc-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'esc-10', pos: 10, label: "amar", type: "verb", action: "speak", pictogramId: 6898 },
        { id: 'esc-11', pos: 11, label: "odiar", type: "verb", action: "speak", pictogramId: 38936 },
        { id: 'esc-12', pos: 12, label: "leer", type: "verb", action: "speak", pictogramId: 7141 }, // Book/Read
        { id: 'esc-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'esc-14', pos: 14, label: "escribir", type: "verb", action: "speak", pictogramId: 2380 }, // Writing
        { id: 'esc-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'esc-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'esc-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Standard + 'de' override seen in image)
        { id: 'esc-18', pos: 18, label: "él", type: "pronoun", action: "speak", pictogramId: 6480 },
        { id: 'esc-19', pos: 19, label: "de", type: "preposition", action: "speak", pictogramId: 7074 }, // Specific override in image at F3-C2
        { id: 'esc-24', pos: 24, label: "para", type: "preposition", action: "speak", pictogramId: 7194 },
        { id: 'esc-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'esc-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Row 4
        { id: 'esc-27', pos: 27, label: "ella", type: "pronoun", action: "speak", pictogramId: 7029 },
        // Empty nouns
        { id: 'esc-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },

        // Navigation
        { id: 'esc-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "famosos", pictogramId: 37086 }
    ] as GridCell[],

    'personajes_hist': [
        // Row 1 (Inherited)
        { id: 'his-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'his-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'his-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'his-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'his-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'his-5', pos: 5, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'his-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'his-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'his-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Crowded layout)
        { id: 'his-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'his-10', pos: 10, label: "amar", type: "verb", action: "speak", pictogramId: 6898 },
        { id: 'his-11', pos: 11, label: "odiar", type: "verb", action: "speak", pictogramId: 38936 },
        { id: 'his-12', pos: 12, label: "Abraham Lincoln", type: "noun", action: "speak" }, // Takes verb slot
        { id: 'his-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'his-14', pos: 14, label: "Benjamin Franklin", type: "noun", action: "speak" }, // Takes verb slot
        { id: 'his-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'his-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'his-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3
        { id: 'his-18', pos: 18, label: "él", type: "pronoun", action: "speak", pictogramId: 6480 },
        { id: 'his-19', pos: 19, label: "Betsy Ross", type: "noun", action: "speak" },
        { id: 'his-20', pos: 20, label: "Booker Washington", type: "noun", action: "speak" },
        { id: 'his-21', pos: 21, label: "Cesar Chávez", type: "noun", action: "speak", pictogramId: 24978 },
        { id: 'his-22', pos: 22, label: "Cristóbal Colón", type: "noun", action: "speak", pictogramId: 37932 },
        { id: 'his-23', pos: 23, label: "Eleanor Roosevelt", type: "noun", action: "speak" },
        { id: 'his-24', pos: 24, label: "para", type: "preposition", action: "speak", pictogramId: 7194 },
        { id: 'his-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'his-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Row 4
        { id: 'his-27', pos: 27, label: "ella", type: "pronoun", action: "speak", pictogramId: 7029 },
        { id: 'his-28', pos: 28, label: "Franklin D. Roosevelt", type: "noun", action: "speak", pictogramId: 3025 },
        { id: 'his-29', pos: 29, label: "Gandhi", type: "noun", action: "speak" },
        { id: 'his-30', pos: 30, label: "George Washington", type: "noun", action: "speak" },
        { id: 'his-31', pos: 31, label: "Harriet Tubman", type: "noun", action: "speak" },
        { id: 'his-32', pos: 32, label: "John F. Kennedy", type: "noun", action: "speak", pictogramId: 3027 },
        { id: 'his-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'his-34', pos: 34, label: "Martin Luther King", type: "noun", action: "speak" },
        { id: 'his-35', pos: 35, label: "Thomas Jefferson", type: "noun", action: "speak" },

        // Row 5
        { id: 'his-36', pos: 36, label: "egipcio", type: "noun", action: "speak" },
        { id: 'his-37', pos: 37, label: "José de San Martín", type: "noun", action: "speak", pictogramId: 5565 },
        // Navigation
        { id: 'his-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "famosos", pictogramId: 37086 }
    ] as GridCell[],

    'medicos': [
        // Row 1 (Core - Inherited)
        { id: 'md-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'md-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'md-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'md-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'md-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'md-5', pos: 5, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'md-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'md-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'md-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Mixed)
        { id: 'md-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'md-10', pos: 10, label: "ayudar", type: "verb", action: "speak", pictogramId: 32648 },
        { id: 'md-11', pos: 11, label: "dentista", type: "noun", action: "speak", pictogramId: 2733 }, // Check ID
        { id: 'md-12', pos: 12, label: "doctor", type: "noun", action: "speak", pictogramId: 6561 },
        { id: 'md-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'md-14', pos: 14, label: "enfermera", type: "noun", action: "speak", pictogramId: 6050 },
        { id: 'md-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'md-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'md-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Therapists)
        { id: 'md-18', pos: 18, label: "él", type: "pronoun", action: "speak", pictogramId: 6480 },
        { id: 'md-19', pos: 19, label: "fisioterapeuta", type: "noun", action: "speak", pictogramId: 26094 },
        { id: 'md-20', pos: 20, label: "logopeda", type: "noun", action: "speak", pictogramId: 2454 },
        { id: 'md-21', pos: 21, label: "psicólogo", type: "noun", action: "speak", pictogramId: 3377 },
        { id: 'md-22', pos: 22, label: "terapeuta ocupacional", type: "noun", action: "speak", pictogramId: 16082 },
        // Empty 23
        { id: 'md-24', pos: 24, label: "para", type: "preposition", action: "speak", pictogramId: 7194 },
        { id: 'md-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'md-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Row 4
        { id: 'md-27', pos: 27, label: "ella", type: "pronoun", action: "speak", pictogramId: 7029 },
        // Empty content row 4
        { id: 'md-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },

        // Row 5
        { id: 'md-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "medicos_2", pictogramId: 3220 }
    ] as GridCell[],

    'medicos_2': [
        // Row 1 (Page 2 Content)
        { id: 'md2-0', pos: 0, label: "audiólogo", type: "noun", action: "speak" },
        { id: 'md2-1', pos: 1, label: "higienista dental", type: "noun", action: "speak", pictogramId: 9144 },
        { id: 'md2-2', pos: 2, label: "oftalmólogo", type: "noun", action: "speak", pictogramId: 16367 },
        { id: 'md2-3', pos: 3, label: "optometrista", type: "noun", action: "speak", pictogramId: 2877 },
        { id: 'md2-4', pos: 4, label: "ortodoncista", type: "noun", action: "speak" },
        { id: 'md2-5', pos: 5, label: "T.U.M", type: "noun", action: "speak", pictogramId: 36769 }, // Emergency Med Tech

        // Navigation
        { id: 'md2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "medicos", pictogramId: 37086 }
    ] as GridCell[],

    'cosas': [
        // Row 1 (Abstract & High Priority Folders - NO CORE INHERITANCE)
        { id: 'cos-0', pos: 0, label: "algo", type: "noun", action: "speak", pictogramId: 38768 }, // Placeholder
        { id: 'cos-1', pos: 1, label: "nada", type: "adverb", action: "speak", pictogramId: 29839 },
        { id: 'cos-2', pos: 2, label: "cosa", type: "noun", action: "speak", pictogramId: 35993 },
        { id: 'cos-3', pos: 3, label: "parte", type: "noun", action: "speak", pictogramId: 11469 },
        { id: 'cos-4', pos: 4, label: "pieza", type: "noun", action: "speak", pictogramId: 15836 },
        { id: 'cos-5', pos: 5, label: "Partes del cuerpo", type: "folder", folderTarget: "cuerpo", pictogramId: 29145 },
        { id: 'cos-6', pos: 6, label: "Ropa", type: "folder", folderTarget: "ropa", pictogramId: 7233 },
        { id: 'cos-7', pos: 7, label: "Cuidado personal", type: "folder", folderTarget: "cuidado", pictogramId: 2353 },
        { id: 'cos-8', pos: 8, label: "Muebles", type: "folder", folderTarget: "muebles", pictogramId: 32594 },

        // Row 2 (Major Categories)
        { id: 'cos-9', pos: 9, label: "Animales", type: "folder", folderTarget: "animales", pictogramId: 8025 },
        { id: 'cos-10', pos: 10, label: "Comida", type: "folder", folderTarget: "comida", pictogramId: 4610 },
        { id: 'cos-11', pos: 11, label: "Artículos de arte", type: "folder", folderTarget: "arte", pictogramId: 38130 },
        { id: 'cos-12', pos: 12, label: "Vehículos", type: "folder", folderTarget: "vehiculos", pictogramId: 34461 },
        { id: 'cos-13', pos: 13, label: "Eventos especiales", type: "folder", folderTarget: "eventos" },
        { id: 'cos-14', pos: 14, label: "Computadora", type: "folder", folderTarget: "computadora", pictogramId: 7190 },
        { id: 'cos-15', pos: 15, label: "Electrónica", type: "folder", folderTarget: "electronica", pictogramId: 36667 },
        { id: 'cos-16', pos: 16, label: "Naturaleza", type: "folder", folderTarget: "naturaleza", pictogramId: 20389 },
        { id: 'cos-17', pos: 17, label: "libro", type: "noun", action: "speak", pictogramId: 25191 },

        // Row 3 (Mixed Content & Navigation)
        { id: 'cos-18', pos: 18, label: "espuma", type: "noun", action: "speak", pictogramId: 37901 },
        { id: 'cos-19', pos: 19, label: "juguete", type: "noun", action: "speak", pictogramId: 9813 },
        { id: 'cos-20', pos: 20, label: "colchoneta", type: "noun", action: "speak", pictogramId: 2346 },
        { id: 'cos-21', pos: 21, label: "comida", type: "noun", action: "speak", pictogramId: 4610 },
        { id: 'cos-22', pos: 22, label: "cuadro", type: "noun", action: "speak", pictogramId: 2360 },
        { id: 'cos-23', pos: 23, label: "ropa", type: "noun", action: "speak", pictogramId: 7233 },
        { id: 'cos-24', pos: 24, label: "reunión", type: "noun", action: "speak", pictogramId: 8207 },
        { id: 'cos-25', pos: 25, label: "maleta", type: "noun", action: "speak", pictogramId: 2931 },
        // ... Empty slots 26-43 ...
        { id: 'cos-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "cosas_2", pictogramId: 3220 }
    ] as GridCell[],

    'cosas_2': [
        // Row 1 (Folders A-M)
        { id: 'cos2-0', pos: 0, label: "Adaptivo", type: "folder", folderTarget: "adaptivo" },
        { id: 'cos2-1', pos: 1, label: "Electrodomés- ticos", type: "folder", folderTarget: "electrodomesticos" },
        { id: 'cos2-2', pos: 2, label: "Limpieza", type: "folder", folderTarget: "limpieza", pictogramId: 22791 },
        { id: 'cos2-3', pos: 3, label: "DVDs", type: "folder", folderTarget: "dvds", pictogramId: 9152 },
        { id: 'cos2-4', pos: 4, label: "Juegos de mesa", type: "folder", folderTarget: "juegos_mesa", pictogramId: 9810 },
        { id: 'cos2-5', pos: 5, label: "Cosas festivas", type: "folder", folderTarget: "festivas" },
        { id: 'cos2-6', pos: 6, label: "Hogar", type: "folder", folderTarget: "hogar", pictogramId: 16031 },
        { id: 'cos2-7', pos: 7, label: "Ocio", type: "folder", folderTarget: "ocio", pictogramId: 11653 },
        { id: 'cos2-8', pos: 8, label: "Médico", type: "folder", folderTarget: "medico_cosas", pictogramId: 6561 },

        // Row 2 (Folders D-J)
        { id: 'cos2-9', pos: 9, label: "Dinero", type: "folder", folderTarget: "dinero", pictogramId: 4630 },
        { id: 'cos2-10', pos: 10, label: "Música", type: "folder", folderTarget: "musica_cosas", pictogramId: 24791 },
        { id: 'cos2-11', pos: 11, label: "Partes de edificios", type: "folder", folderTarget: "edificios", pictogramId: 29145 },   // cerca/fence as representative icon
        { id: 'cos2-12', pos: 12, label: "Lectura", type: "folder", folderTarget: "lectura", pictogramId: 2447 },                 // libro
        { id: 'cos2-13', pos: 13, label: "Útiles escolares", type: "folder", folderTarget: "escolares", pictogramId: 6664 },      // lápiz
        { id: 'cos2-14', pos: 14, label: "Deportes", type: "folder", folderTarget: "deportes_cosas", pictogramId: 7010 },
        { id: 'cos2-15', pos: 15, label: "Pensamientos", type: "folder", folderTarget: "pensamientos", pictogramId: 26310 },
        { id: 'cos2-16', pos: 16, label: "Herramientas",       type: "folder", folderTarget: "herramientas", pictogramId: 7127 }, // martillo
        { id: 'cos2-17', pos: 17, label: "Juguetes",            type: "folder", folderTarget: "juguetes", pictogramId: 9813 }, // juguete

        // Row 3 (Seasons)
        { id: 'cos2-18', pos: 18, label: "Cosas de primavera",  type: "folder", folderTarget: "primavera", pictogramId: 24537 }, // flor
        { id: 'cos2-19', pos: 19, label: "Cosas de verano",     type: "folder", folderTarget: "verano", pictogramId: 2798 }, // vacaciones/playa
        { id: 'cos2-20', pos: 20, label: "Cosas de otoño",      type: "folder", folderTarget: "otono", pictogramId: 5063 }, // hoja otoñal (placeholder)
        { id: 'cos2-21', pos: 21, label: "Cosas de invierno",   type: "folder", folderTarget: "invierno", pictogramId: 5062 }, // nieve (placeholder)

        // Navigation
        { id: 'cos2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cosas", pictogramId: 37086 }
    ] as GridCell[],

    'cuerpo': [
        // Row 1 (Standard Core)
        { id: 'bod-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'bod-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'bod-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'bod-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'bod-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'bod-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'bod-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'bod-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'bod-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Modified Core with Contextual Verbs)
        { id: 'bod-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'bod-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'bod-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'bod-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'bod-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'bod-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 }, // Contextual: Put on
        { id: 'bod-15', pos: 15, label: "doler", type: "verb", action: "speak", pictogramId: 30620 }, // Contextual: Hurt
        { id: 'bod-16', pos: 16, label: "está bien", type: "adjective", action: "speak", pictogramId: 39393 },
        { id: 'bod-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Body Parts A-Z Start)
        { id: 'bod-18', pos: 18, label: "boca", type: "noun", action: "speak", pictogramId: 2663 },
        { id: 'bod-19', pos: 19, label: "brazo", type: "noun", action: "speak", pictogramId: 2669 },
        { id: 'bod-20', pos: 20, label: "cabello", type: "noun", action: "speak", pictogramId: 2851 },
        { id: 'bod-21', pos: 21, label: "cabeza", type: "noun", action: "speak", pictogramId: 2673 },
        { id: 'bod-22', pos: 22, label: "cara", type: "noun", action: "speak", pictogramId: 2684 },
        { id: 'bod-23', pos: 23, label: "cuello", type: "noun", action: "speak", pictogramId: 2727 },
        { id: 'bod-24', pos: 24, label: "cuerpo", type: "noun", action: "speak", pictogramId: 6473 },
        { id: 'bod-25', pos: 25, label: "dedo", type: "noun", action: "speak", pictogramId: 3298 },
        { id: 'bod-26', pos: 26, label: "diente", type: "noun", action: "speak", pictogramId: 10267 },

        // Row 4
        { id: 'bod-27', pos: 27, label: "espalda", type: "noun", action: "speak", pictogramId: 2748 },
        { id: 'bod-28', pos: 28, label: "estómago", type: "noun", action: "speak", pictogramId: 3309 },
        { id: 'bod-29', pos: 29, label: "garganta", type: "noun", action: "speak", pictogramId: 3332 },
        { id: 'bod-30', pos: 30, label: "mano", type: "noun", action: "speak", pictogramId: 2928 },
        { id: 'bod-31', pos: 31, label: "nariz", type: "noun", action: "speak", pictogramId: 2887 },
        { id: 'bod-32', pos: 32, label: "ojo", type: "noun", action: "speak", pictogramId: 6573 },
        { id: 'bod-33', pos: 33, label: "oreja", type: "noun", action: "speak", pictogramId: 2871 },
        { id: 'bod-34', pos: 34, label: "pie", type: "noun", action: "speak", pictogramId: 25327 },
        { id: 'bod-35', pos: 35, label: "pierna", type: "noun", action: "speak", pictogramId: 8666 },

        // Row 5
        { id: 'bod-36', pos: 36, label: "rodilla", type: "noun", action: "speak", pictogramId: 2810 },
        { id: 'bod-37', pos: 37, label: "trasero", type: "noun", action: "speak", pictogramId: 11242 },
        { id: 'bod-38', pos: 38, label: "hueso", type: "noun", action: "speak", pictogramId: 2972 },
        { id: 'bod-39', pos: 39, label: "sangre", type: "noun", action: "speak", pictogramId: 2803 },
        { id: 'bod-40', pos: 40, label: "axila", type: "noun", action: "speak", pictogramId: 2989 },
        { id: 'bod-41', pos: 41, label: "cebello rubio", type: "noun", action: "speak", pictogramId: 8213 },
        { id: 'bod-42', pos: 42, label: "barba", type: "noun", action: "speak", pictogramId: 2657 },
        { id: 'bod-43', pos: 43, label: "menstruación", type: "noun", action: "speak", pictogramId: 32490 },
        { id: 'bod-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "cuerpo_2", pictogramId: 3220 }
    ] as GridCell[],

    'cuerpo_2': [
        // Row 1
        { id: 'bod2-0', pos: 0, label: "barbilla", type: "noun", action: "speak", pictogramId: 2991 },
        { id: 'bod2-1', pos: 1, label: "cadera", type: "noun", action: "speak", pictogramId: 3000 },
        { id: 'bod2-2', pos: 2, label: "ceja", type: "noun", action: "speak", pictogramId: 3011 },
        { id: 'bod2-3', pos: 3, label: "cintura", type: "noun", action: "speak", pictogramId: 10372 },
        { id: 'bod2-4', pos: 4, label: "codo", type: "noun", action: "speak", pictogramId: 2707 },
        { id: 'bod2-5', pos: 5, label: "costado", type: "noun", action: "speak" },
        { id: 'bod2-6', pos: 6, label: "dedo del pie", type: "noun", action: "speak", pictogramId: 37008 },
        { id: 'bod2-7', pos: 7, label: "frente", type: "noun", action: "speak", pictogramId: 3326 },
        { id: 'bod2-8', pos: 8, label: "hombro", type: "noun", action: "speak", pictogramId: 2977 },

        // Row 2
        { id: 'bod2-9', pos: 9, label: "hueso", type: "noun", action: "speak", pictogramId: 2972 },
        { id: 'bod2-10', pos: 10, label: "labios", type: "noun", action: "speak", pictogramId: 2953 },
        { id: 'bod2-11', pos: 11, label: "lengua", type: "noun", action: "speak", pictogramId: 2944 },
        { id: 'bod2-12', pos: 12, label: "mano derecha", type: "noun", action: "speak", pictogramId: 2928 },
        { id: 'bod2-13', pos: 13, label: "mano izquierda", type: "noun", action: "speak", pictogramId: 4672 },
        { id: 'bod2-14', pos: 14, label: "mejillas", type: "noun", action: "speak", pictogramId: 2919 },
        { id: 'bod2-15', pos: 15, label: "muñeca", type: "noun", action: "speak", pictogramId: 26238 },
        { id: 'bod2-16', pos: 16, label: "músculos", type: "noun", action: "speak", pictogramId: 2891 },
        { id: 'bod2-17', pos: 17, label: "parte del cuerpo", type: "noun", action: "speak", pictogramId: 38632 },

        // Row 3
        { id: 'bod2-18', pos: 18, label: "pecho", type: "noun", action: "speak", pictogramId: 2853 },
        { id: 'bod2-19', pos: 19, label: "pie derecho", type: "noun", action: "speak", pictogramId: 4937 },
        { id: 'bod2-20', pos: 20, label: "pie izquierdo", type: "noun", action: "speak", pictogramId: 4937 },
        { id: 'bod2-21', pos: 21, label: "piel", type: "noun", action: "speak", pictogramId: 2840 },
        { id: 'bod2-22', pos: 22, label: "pulgar", type: "noun", action: "speak", pictogramId: 7799 },
        { id: 'bod2-23', pos: 23, label: "talón", type: "noun", action: "speak", pictogramId: 3399 },
        { id: 'bod2-24', pos: 24, label: "tobillo", type: "noun", action: "speak", pictogramId: 3405 },
        { id: 'bod2-25', pos: 25, label: "uña", type: "noun", action: "speak", pictogramId: 2783 },
        { id: 'bod2-26', pos: 26, label: "uña del pie", type: "noun", action: "speak", pictogramId: 37965 },

        // Row 4
        { id: 'bod2-27', pos: 27, label: "voz", type: "noun", action: "speak", pictogramId: 39687 },
        { id: 'bod2-28', pos: 28, label: "oreja", type: "noun", action: "speak", pictogramId: 2871 }, // Repetido en imagen

        // Navigation
        { id: 'bod2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cosas", pictogramId: 37086 }
    ] as GridCell[],

    'ropa': [
        // Row 1 (Core - Standard)
        { id: 'rop-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'rop-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'rop-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'rop-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'rop-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'rop-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 }, // Using 'quién' icon as placeholder if needed, or generic
        { id: 'rop-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'rop-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'rop-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Contextual Verbs)
        { id: 'rop-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'rop-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'rop-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'rop-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'rop-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'rop-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 }, // Put on
        { id: 'rop-15', pos: 15, label: "abotonar", type: "verb", action: "speak", pictogramId: 5357 },
        { id: 'rop-16', pos: 16, label: "cerrar cremallera", type: "verb", action: "speak", pictogramId: 37414 }, // Zip up
        { id: 'rop-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Clothing Nouns)
        { id: 'rop-18', pos: 18, label: "Colores", type: "folder", folderTarget: "colores_ropa", pictogramId: 7075 },
        { id: 'rop-19', pos: 19, label: "abrigo", type: "noun", action: "speak", pictogramId: 8122 },
        { id: 'rop-20', pos: 20, label: "medias", type: "noun", action: "speak", pictogramId: 2466 },
        { id: 'rop-21', pos: 21, label: "camisa", type: "noun", action: "speak", pictogramId: 13640 },
        { id: 'rop-22', pos: 22, label: "camisón", type: "noun", action: "speak", pictogramId: 2311 },
        { id: 'rop-23', pos: 23, label: "casaca", type: "noun", action: "speak" },
        { id: 'rop-24', pos: 24, label: "falda", type: "noun", action: "speak", pictogramId: 2391 },
        { id: 'rop-25', pos: 25, label: "jeans", type: "noun", action: "speak" },
        { id: 'rop-26', pos: 26, label: "pantalones", type: "noun", action: "speak", pictogramId: 2565 },

        // Row 4
        { id: 'rop-27', pos: 27, label: "piyama", type: "noun", action: "speak" },
        { id: 'rop-28', pos: 28, label: "ropa", type: "noun", action: "speak", pictogramId: 7233 },
        { id: 'rop-29', pos: 29, label: "ropa interior", type: "noun", action: "speak", pictogramId: 25680 },
        { id: 'rop-30', pos: 30, label: "polera", type: "noun", action: "speak" },
        { id: 'rop-31', pos: 31, label: "chompa", type: "noun", action: "speak" },
        { id: 'rop-32', pos: 32, label: "vestido", type: "noun", action: "speak", pictogramId: 2613 },
        { id: 'rop-33', pos: 33, label: "Accesorios", type: "folder", folderTarget: "accesorios_ropa" },
        { id: 'rop-34', pos: 34, label: "Calzado", type: "folder", folderTarget: "calzado_ropa", pictogramId: 6953 },
        { id: 'rop-35', pos: 35, label: "abrigar", type: "verb", action: "speak" },

        // Row 5
        { id: 'rop-36', pos: 36, label: "vestir", type: "verb", action: "speak", pictogramId: 6627 },
        { id: 'rop-37', pos: 37, label: "corbata de moño", type: "noun", action: "speak", pictogramId: 26230 },
        { id: 'rop-38', pos: 38, label: "traje", type: "noun", action: "speak", pictogramId: 29931 },
        { id: 'rop-39', pos: 39, label: "sombrero de copa", type: "noun", action: "speak", pictogramId: 6216 },
        // Empty 40-43
        { id: 'rop-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "ropa_2", pictogramId: 3220 }
    ] as GridCell[],

    'ropa_2': [
        // Row 1 (Verbs & Adjectives)
        { id: 'rop2-0', pos: 0, label: "cambiar", type: "verb", action: "speak", pictogramId: 37360 },
        { id: 'rop2-1', pos: 1, label: "desabrochar", type: "verb", action: "speak", pictogramId: 5440 },
        { id: 'rop2-2', pos: 2, label: "abrir cremallera", type: "verb", action: "speak", pictogramId: 16897 },
        { id: 'rop2-3', pos: 3, label: "pequeño", type: "adjective", action: "speak", pictogramId: 4716 },
        { id: 'rop2-4', pos: 4, label: "mediano", type: "adjective", action: "speak", pictogramId: 4693 },
        { id: 'rop2-5', pos: 5, label: "grande", type: "adjective", action: "speak", pictogramId: 4658 },
        { id: 'rop2-6', pos: 6, label: "extra grande", type: "adjective", action: "speak", pictogramId: 4658 },
        { id: 'rop2-7', pos: 7, label: "blusa", type: "noun", action: "speak", pictogramId: 2280 },
        { id: 'rop2-8', pos: 8, label: "botón", type: "noun", action: "speak", pictogramId: 2668 },

        // Row 2 (Nouns)
        { id: 'rop2-9', pos: 9, label: "brasier", type: "noun", action: "speak" },
        { id: 'rop2-10', pos: 10, label: "polo manga larga", type: "noun", action: "speak", pictogramId: 6188 },
        { id: 'rop2-11', pos: 11, label: "polo", type: "noun", action: "speak", pictogramId: 3348 },
        { id: 'rop2-12', pos: 12, label: "cierre", type: "noun", action: "speak", pictogramId: 2723 },
        { id: 'rop2-13', pos: 13, label: "cinturón", type: "noun", action: "speak", pictogramId: 2336 },
        { id: 'rop2-14', pos: 14, label: "delantal", type: "noun", action: "speak", pictogramId: 2366 },
        { id: 'rop2-15', pos: 15, label: "disfraz", type: "noun", action: "speak", pictogramId: 5985 },
        { id: 'rop2-16', pos: 16, label: "gorro", type: "noun", action: "speak", pictogramId: 39395 }, // Cap
        { id: 'rop2-17', pos: 17, label: "guantes", type: "noun", action: "speak", pictogramId: 2415 },

        // Row 3 (Nouns)
        { id: 'rop2-18', pos: 18, label: "impermeable", type: "noun", action: "speak", pictogramId: 4927 },
        { id: 'rop2-19', pos: 19, label: "manoplas", type: "noun", action: "speak", pictogramId: 2927 },
        { id: 'rop2-20', pos: 20, label: "pañoleta", type: "noun", action: "speak" },
        { id: 'rop2-21', pos: 21, label: "pants", type: "noun", action: "speak" },
        { id: 'rop2-22', pos: 22, label: "paraguas", type: "noun", action: "speak", pictogramId: 2500 },
        { id: 'rop2-23', pos: 23, label: "sandalias", type: "noun", action: "speak", pictogramId: 2556 },
        { id: 'rop2-24', pos: 24, label: "shorts", type: "noun", action: "speak" },
        { id: 'rop2-25', pos: 25, label: "traje de baño", type: "noun", action: "speak", pictogramId: 2270 },
        { id: 'rop2-26', pos: 26, label: "gorro", type: "noun", action: "speak", pictogramId: 39395 }, // Beanie

        // Navigation (Back only)
        { id: 'rop2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "ropa", pictogramId: 37086 }
    ] as GridCell[],

    'colores_ropa': [
        // Grid 4x5 Partial Layout (Overlay Logic in Renderer)

        // Row 1
        { id: 'col-0', pos: 0, label: "oscuro", type: "adjective", action: "speak", pictogramId: 26993 },
        { id: 'col-1', pos: 1, label: "claro", type: "adjective", action: "speak", pictogramId: 4604 },
        { id: 'col-2', pos: 2, label: "rojo", type: "adjective", action: "speak", pictogramId: 2808 },
        { id: 'col-3', pos: 3, label: "amarillo", type: "adjective", action: "speak", pictogramId: 2648 },
        { id: 'col-4', pos: 4, label: "azul", type: "adjective", action: "speak", pictogramId: 4869 },

        // Row 2
        { id: 'col-9', pos: 9, label: "verde", type: "adjective", action: "speak", pictogramId: 4887 },
        { id: 'col-10', pos: 10, label: "anaranjado", type: "adjective", action: "speak" },
        { id: 'col-11', pos: 11, label: "rosado", type: "adjective", action: "speak", pictogramId: 27131 },
        { id: 'col-12', pos: 12, label: "morado", type: "adjective", action: "speak", pictogramId: 2907 },
        { id: 'col-13', pos: 13, label: "marrón", type: "adjective", action: "speak", pictogramId: 2923 },

        // Row 3 (Greys & Metals)
        { id: 'col-18', pos: 18, label: "negro", type: "adjective", action: "speak", pictogramId: 2886 },
        { id: 'col-19', pos: 19, label: "blanco", type: "adjective", action: "speak", pictogramId: 8043 },
        { id: 'col-20', pos: 20, label: "gris", type: "adjective", action: "speak", pictogramId: 3340 },
        { id: 'col-21', pos: 21, label: "dorado", type: "adjective", action: "speak", pictogramId: 2739 },
        { id: 'col-22', pos: 22, label: "plateado", type: "adjective", action: "speak", pictogramId: 2827 },

        // Row 4 (Close Button in C1, Extra Color C2)
        // NOTE: Position 27 corresponds to Row 4, Col 1 in a 9-col grid sequence (Row 3 starts at 27 in 0-indexed if full width, but here mapping is specific)
        // IF the partial grid component maps 0-4 as Row 1, 9-13 as Row 2... then we must use consistent ID/Pos logic.
        // Assuming Standard Grid Mapping (Row 4 starts at 27).
        { id: 'col-27', pos: 27, label: "Cerrar", type: "navigation", action: "back", folderTarget: "ropa", pictogramId: 24976 }, // Using "No" or X icon
        { id: 'col-28', pos: 28, label: "celeste", type: "adjective", action: "speak" }
    ] as GridCell[],

    'accesorios_ropa': [
        // Row 1 (Core - Inherited from Ropa)
        { id: 'acc-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'acc-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'acc-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'acc-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'acc-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'acc-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'acc-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'acc-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'acc-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Modified Core + Category Nouns)
        { id: 'acc-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'acc-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'acc-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'acc-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'acc-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'acc-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'acc-15', pos: 15, label: "accesorio", type: "noun", action: "speak" }, // Category Generic
        { id: 'acc-16', pos: 16, label: "mochila", type: "noun", action: "speak", pictogramId: 2475 }, // VIP Item
        { id: 'acc-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Specific Accessories)
        { id: 'acc-18', pos: 18, label: "gorro", type: "noun", action: "speak", pictogramId: 39395 }, // Military/Cap
        { id: 'acc-19', pos: 19, label: "cinturón", type: "noun", action: "speak", pictogramId: 2336 },
        { id: 'acc-20', pos: 20, label: "pulsera", type: "noun", action: "speak", pictogramId: 2537 },
        { id: 'acc-21', pos: 21, label: "aretes", type: "noun", action: "speak", pictogramId: 2515 },
        { id: 'acc-22', pos: 22, label: "pinza de pelo", type: "noun", action: "speak", pictogramId: 37388 },
        { id: 'acc-23', pos: 23, label: "collar", type: "noun", action: "speak", pictogramId: 2347 },
        { id: 'acc-24', pos: 24, label: "bolsa", type: "noun", action: "speak", pictogramId: 21453 },
        { id: 'acc-25', pos: 25, label: "anillo", type: "noun", action: "speak", pictogramId: 6900 },
        { id: 'acc-26', pos: 26, label: "lentes de sol", type: "noun", action: "speak", pictogramId: 3330 },

        // Row 4
        { id: 'acc-27', pos: 27, label: "billetera", type: "noun", action: "speak", pictogramId: 2689 },
        { id: 'acc-28', pos: 28, label: "reloj", type: "noun", action: "speak", pictogramId: 2549 },
        { id: 'acc-29', pos: 29, label: "gorro", type: "noun", action: "speak", pictogramId: 39395 }, // Beanie
        { id: 'acc-30', pos: 30, label: "moño", type: "noun", action: "speak", pictogramId: 26230 },
        { id: 'acc-31', pos: 31, label: "sombrero", type: "noun", action: "speak", pictogramId: 2572 },
        // Empty 32-43

        // Row 5
        { id: 'acc-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "accesorios_ropa_2", pictogramId: 3220 }
    ] as GridCell[],

    'calzado_ropa': [
        // Row 1 (Core - Inherited)
        { id: 'cal-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'cal-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'cal-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'cal-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'cal-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'cal-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'cal-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'cal-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'cal-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Specific Verbs: Amarrar/Desamarrar)
        { id: 'cal-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'cal-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'cal-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'cal-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'cal-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'cal-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'cal-15', pos: 15, label: "amarrar", type: "verb", action: "speak", pictogramId: 5391 }, // Contextual
        { id: 'cal-16', pos: 16, label: "desamarrar", type: "verb", action: "speak" }, // Contextual
        { id: 'cal-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Common Footwear)
        { id: 'cal-18', pos: 18, label: "zapatos", type: "noun", action: "speak", pictogramId: 2775 },
        { id: 'cal-19', pos: 19, label: "botas", type: "noun", action: "speak", pictogramId: 2287 },
        { id: 'cal-20', pos: 20, label: "zapatillas", type: "noun", action: "speak", pictogramId: 2621 },
        { id: 'cal-21', pos: 21, label: "sandalias", type: "noun", action: "speak", pictogramId: 2556 },
        { id: 'cal-22', pos: 22, label: "pantuflas", type: "noun", action: "speak", pictogramId: 24230 },
        { id: 'cal-23', pos: 23, label: "zapatos para correr", type: "noun", action: "speak", pictogramId: 38013 },
        { id: 'cal-24', pos: 24, label: "zapatos de Tap", type: "noun", action: "speak", pictogramId: 37935 },
        // Empty 25-26

        // Row 4 (Empty)
        // Row 5 (Nav)
        { id: 'cal-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "calzado_ropa_2", pictogramId: 3220 }
    ] as GridCell[],

    'calzado_ropa_2': [
        // Row 1 (Specific/Brands)
        { id: 'cal2-0', pos: 0, label: "Nike", type: "noun", action: "speak" }, // Brand
        { id: 'cal2-1', pos: 1, label: "botas de vaquero", type: "noun", action: "speak", pictogramId: 21888 },
        { id: 'cal2-2', pos: 2, label: "zapatos de tacón alto", type: "noun", action: "speak", pictogramId: 37935 },
        { id: 'cal2-3', pos: 3, label: "zapatos de piel", type: "noun", action: "speak", pictogramId: 37935 },
        { id: 'cal2-4', pos: 4, label: "botas impermeables", type: "noun", action: "speak", pictogramId: 21888 },
        { id: 'cal2-5', pos: 5, label: "botas para la nieve", type: "noun", action: "speak", pictogramId: 3131 },
        { id: 'cal2-6', pos: 6, label: "botas de trabajo", type: "noun", action: "speak", pictogramId: 21888 },

        // Navigation Back
        { id: 'cal2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "calzado_ropa", pictogramId: 37086 }
    ] as GridCell[],

    'cuidado': [
        // Row 1 (Core - Inherited)
        { id: 'cui-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'cui-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'cui-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'cui-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'cui-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'cui-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'cui-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'cui-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'cui-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Contextual Overrides: Bath/Teeth)
        { id: 'cui-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'cui-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'cui-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'cui-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'cui-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'cui-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'cui-15', pos: 15, label: "bañar", type: "verb", action: "speak", pictogramId: 6058 }, // Contextual
        { id: 'cui-16', pos: 16, label: "cepillar los dientes", type: "verb", action: "speak", pictogramId: 2326 }, // Contextual
        { id: 'cui-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Routine Sequence)
        { id: 'cui-18', pos: 18, label: "cortar las uñas", type: "verb", action: "speak", pictogramId: 10152 },
        { id: 'cui-19', pos: 19, label: "lavar las manos", type: "verb", action: "speak", pictogramId: 8975 },
        { id: 'cui-20', pos: 20, label: "peinar", type: "verb", action: "speak", pictogramId: 26947 },
        { id: 'cui-21', pos: 21, label: "lavar", type: "verb", action: "speak", pictogramId: 34826 },
        { id: 'cui-22', pos: 22, label: "poner desodorante", type: "verb", action: "speak", pictogramId: 39672 },
        { id: 'cui-23', pos: 23, label: "cepillo de dientes", type: "noun", action: "speak", pictogramId: 2694 },
        { id: 'cui-24', pos: 24, label: "pasta de dientes", type: "noun", action: "speak", pictogramId: 34086 },
        { id: 'cui-25', pos: 25, label: "desodorante", type: "noun", action: "speak", pictogramId: 2735 },
        { id: 'cui-26', pos: 26, label: "jabón", type: "noun", action: "speak", pictogramId: 8094 },

        // Row 4 (Products & Sub-folders)
        { id: 'cui-27', pos: 27, label: "perfume", type: "noun", action: "speak", pictogramId: 35673 },
        { id: 'cui-28', pos: 28, label: "gotas para los ojos", type: "noun", action: "speak", pictogramId: 36333 },
        { id: 'cui-29', pos: 29, label: "hilo dental", type: "noun", action: "speak", pictogramId: 9144 },
        { id: 'cui-30', pos: 30, label: "humectante para labios", type: "noun", action: "speak", pictogramId: 2953 },
        { id: 'cui-31', pos: 31, label: "loción", type: "noun", action: "speak" },
        { id: 'cui-32', pos: 32, label: "pañuelos desechables", type: "noun", action: "speak", pictogramId: 37943 },
        { id: 'cui-33', pos: 33, label: "papel higiénico", type: "noun", action: "speak", pictogramId: 2862 },
        { id: 'cui-34', pos: 34, label: "Cuidado del cabello", type: "folder", folderTarget: "cuidado_cabello", pictogramId: 25618 },
        { id: 'cui-35', pos: 35, label: "Maquillaje", type: "folder", folderTarget: "maquillaje", pictogramId: 8626 },

        // Row 5
        { id: 'cui-36', pos: 36, label: "toalla", type: "noun", action: "speak", pictogramId: 2593 },
        { id: 'cui-37', pos: 37, label: "colonia", type: "noun", action: "speak", pictogramId: 35673 },
        { id: 'cui-38', pos: 38, label: "crema", type: "noun", action: "speak", pictogramId: 3376 },
        { id: 'cui-39', pos: 39, label: "ducha", type: "noun", action: "speak", pictogramId: 32426 },
        { id: 'cui-40', pos: 40, label: "repelente", type: "noun", action: "speak", pictogramId: 37660 },
        { id: 'cui-41', pos: 41, label: "bloqueador solar", type: "noun", action: "speak", pictogramId: 37979 },
        { id: 'cui-42', pos: 42, label: "útiles de aseo", type: "noun", action: "speak", pictogramId: 28213 },
        { id: 'cui-43', pos: 43, label: "champú", type: "noun", action: "speak", pictogramId: 2699 },
        { id: 'cui-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "cuidado_2", pictogramId: 3220 }
    ] as GridCell[],

    'cuidado_2': [
        // Row 1 (Mixed Actions/Tools)
        { id: 'cui2-0', pos: 0, label: "abotonar", type: "verb", action: "speak", pictogramId: 5357 },
        { id: 'cui2-1', pos: 1, label: "desabrochar", type: "verb", action: "speak", pictogramId: 5440 },
        { id: 'cui2-2', pos: 2, label: "afeitar", type: "verb", action: "speak", pictogramId: 5361 },
        { id: 'cui2-3', pos: 3, label: "bolita de algodón", type: "noun", action: "speak", pictogramId: 36507 },
        { id: 'cui2-4', pos: 4, label: "bragapañal", type: "noun", action: "speak" },
        { id: 'cui2-5', pos: 5, label: "cortauñas", type: "noun", action: "speak", pictogramId: 2721 },
        { id: 'cui2-6', pos: 6, label: "peine", type: "noun", action: "speak", pictogramId: 2852 },
        { id: 'cui2-7', pos: 7, label: "hisopo", type: "noun", action: "speak" },
        { id: 'cui2-8', pos: 8, label: "crema de afeitar", type: "noun", action: "speak", pictogramId: 38748 },

        // Row 2
        { id: 'cui2-9', pos: 9, label: "enjuague bucal", type: "noun", action: "speak", pictogramId: 8561 },
        { id: 'cui2-10', pos: 10, label: "espejo de mano", type: "noun", action: "speak", pictogramId: 39684 },
        { id: 'cui2-11', pos: 11, label: "frenos", type: "noun", action: "speak", pictogramId: 6001 },
        { id: 'cui2-12', pos: 12, label: "hilo dental", type: "noun", action: "speak", pictogramId: 9144 }, // Duplicate intentional
        { id: 'cui2-13', pos: 13, label: "jabón para manos", type: "noun", action: "speak", pictogramId: 10384 },
        { id: 'cui2-14', pos: 14, label: "manos sucias", type: "adjective", action: "speak", pictogramId: 10384 },
        { id: 'cui2-15', pos: 15, label: "navaja desechable", type: "noun", action: "speak", pictogramId: 8638 },
        { id: 'cui2-16', pos: 16, label: "pañal", type: "noun", action: "speak", pictogramId: 22017 },
        { id: 'cui2-17', pos: 17, label: "pañal limpio", type: "noun", action: "speak", pictogramId: 29824 },

        // Row 3
        { id: 'cui2-18', pos: 18, label: "pañal mojado", type: "noun", action: "speak", pictogramId: 29824 },
        { id: 'cui2-19', pos: 19, label: "pañal sucio", type: "noun", action: "speak", pictogramId: 35848 },
        { id: 'cui2-20', pos: 20, label: "rasuradora eléctrica", type: "noun", action: "speak", pictogramId: 9121 },
        { id: 'cui2-21', pos: 21, label: "venda", type: "noun", action: "speak", pictogramId: 6243 },
        { id: 'cui2-22', pos: 22, label: "vitaminas", type: "noun", action: "speak", pictogramId: 36504 },
        { id: 'cui2-23', pos: 23, label: "Salud bucal", type: "folder", folderTarget: "salud_bucal", pictogramId: 16033 },

        // Navigation
        { id: 'cui2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cuidado", pictogramId: 37086 }
    ] as GridCell[],

    'cuidado_cabello': [
        // Row 1 (Core - Inherited)
        { id: 'cab-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'cab-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'cab-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'cab-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'cab-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'cab-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'cab-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'cab-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'cab-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Hair Verbs)
        { id: 'cab-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'cab-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'cab-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'cab-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'cab-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'cab-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'cab-15', pos: 15, label: "cepillar", type: "verb", action: "speak", pictogramId: 5425 }, // Contextual
        { id: 'cab-16', pos: 16, label: "lavar", type: "verb", action: "speak", pictogramId: 34826 }, // Contextual (Wash hair)
        { id: 'cab-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Styling Flow)
        { id: 'cab-18', pos: 18, label: "peinar", type: "verb", action: "speak", pictogramId: 26947 },
        { id: 'cab-19', pos: 19, label: "rizar", type: "verb", action: "speak", pictogramId: 8208 },
        { id: 'cab-20', pos: 20, label: "secar", type: "verb", action: "speak", pictogramId: 34715 },
        { id: 'cab-21', pos: 21, label: "acondicionador", type: "noun", action: "speak", pictogramId: 21349 },
        { id: 'cab-22', pos: 22, label: "broche para cabello", type: "noun", action: "speak", pictogramId: 2851 },
        { id: 'cab-23', pos: 23, label: "cabello", type: "noun", action: "speak", pictogramId: 2851 },
        { id: 'cab-24', pos: 24, label: "cepillo", type: "noun", action: "speak", pictogramId: 2694 },
        { id: 'cab-25', pos: 25, label: "champú", type: "noun", action: "speak", pictogramId: 2699 },
        { id: 'cab-26', pos: 26, label: "corte de cabello", type: "noun", action: "speak", pictogramId: 5484 },

        // Row 4 (Tools)
        { id: 'cab-27', pos: 27, label: "liga para el cabello", type: "noun", action: "speak", pictogramId: 2851 },
        { id: 'cab-28', pos: 28, label: "peine", type: "noun", action: "speak", pictogramId: 2852 },
        { id: 'cab-29', pos: 29, label: "peluca", type: "noun", action: "speak", pictogramId: 14258 },
        { id: 'cab-30', pos: 30, label: "plancha", type: "noun", action: "speak", pictogramId: 2528 },
        { id: 'cab-31', pos: 31, label: "secadora", type: "noun", action: "speak", pictogramId: 26431 },
        { id: 'cab-32', pos: 32, label: "tenazas", type: "noun", action: "speak", pictogramId: 2790 },
        { id: 'cab-33', pos: 33, label: "esponja", type: "noun", action: "speak", pictogramId: 2749 },
        { id: 'cab-34', pos: 34, label: "cabello corto", type: "adjective", action: "speak", pictogramId: 13638 },
        { id: 'cab-35', pos: 35, label: "cabello rizado", type: "adjective", action: "speak", pictogramId: 26392 },

        // Row 5
        { id: 'cab-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "cuidado_cabello_2", pictogramId: 3220 }
    ] as GridCell[],

    'cuidado_cabello_2': [
        // Row 1 (Styles & Issues)
        { id: 'cab2-0', pos: 0, label: "cola de caballo", type: "noun", action: "speak", pictogramId: 2709 },
        { id: 'cab2-1', pos: 1, label: "coletas", type: "noun", action: "speak", pictogramId: 5429 },
        { id: 'cab2-2', pos: 2, label: "enredado", type: "adjective", action: "speak" },
        { id: 'cab2-3', pos: 3, label: "fijador de cabello", type: "noun", action: "speak", pictogramId: 2851 },
        { id: 'cab2-4', pos: 4, label: "peineta", type: "noun", action: "speak", pictogramId: 28581 },
        { id: 'cab2-5', pos: 5, label: "trenza", type: "noun", action: "speak", pictogramId: 5599 },

        // Navigation Back
        { id: 'cab2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cuidado_cabello", pictogramId: 37086 }
    ] as GridCell[],

    'maquillaje': [
        // Row 1 (Core - Inherited)
        { id: 'maq-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'maq-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'maq-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'maq-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'maq-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'maq-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'maq-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'maq-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'maq-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Noun Overrides: Enamel/Foundation)
        { id: 'maq-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'maq-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'maq-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'maq-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'maq-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'maq-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'maq-15', pos: 15, label: "esmalte de uñas", type: "noun", action: "speak", pictogramId: 2747 }, // VIP Noun
        { id: 'maq-16', pos: 16, label: "base", type: "noun", action: "speak", pictogramId: 31334 }, // VIP Noun
        { id: 'maq-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3
        { id: 'maq-18', pos: 18, label: "bolita de algodón", type: "noun", action: "speak", pictogramId: 36507 },
        { id: 'maq-19', pos: 19, label: "brillo de labios", type: "noun", action: "speak", pictogramId: 2953 },
        { id: 'maq-20', pos: 20, label: "brocha de maquillaje", type: "noun", action: "speak", pictogramId: 34145 },
        { id: 'maq-21', pos: 21, label: "hisopo", type: "noun", action: "speak" },
        { id: 'maq-22', pos: 22, label: "delineador de ojos", type: "noun", action: "speak", pictogramId: 3388 },
        { id: 'maq-23', pos: 23, label: "espejo", type: "noun", action: "speak", pictogramId: 8573 },
        { id: 'maq-24', pos: 24, label: "lápiz labial", type: "noun", action: "speak", pictogramId: 2992 },
        { id: 'maq-25', pos: 25, label: "loción", type: "noun", action: "speak" },
        { id: 'maq-26', pos: 26, label: "maquillaje", type: "noun", action: "speak", pictogramId: 8626 },

        // Row 4
        { id: 'maq-27', pos: 27, label: "perfume", type: "noun", action: "speak", pictogramId: 35673 },
        { id: 'maq-28', pos: 28, label: "polvo suelto", type: "noun", action: "speak", pictogramId: 4878 },
        { id: 'maq-29', pos: 29, label: "rímel", type: "noun", action: "speak", pictogramId: 14262 },
        { id: 'maq-30', pos: 30, label: "rubor", type: "noun", action: "speak" },
        { id: 'maq-31', pos: 31, label: "sombra de ojos", type: "noun", action: "speak", pictogramId: 3388 },
        { id: 'maq-32', pos: 32, label: "Colores", type: "folder", folderTarget: "colores_maquillaje", pictogramId: 7075 },
        // Empty 33-44
    ] as GridCell[],

    'colores_maquillaje': [
        // Reusing standard colors layout
        // Row 1
        { id: 'pcm-0', pos: 0, label: "oscuro", type: "adjective", action: "speak", pictogramId: 26993 },
        { id: 'pcm-1', pos: 1, label: "claro", type: "adjective", action: "speak", pictogramId: 4604 },
        { id: 'pcm-2', pos: 2, label: "rojo", type: "adjective", action: "speak", pictogramId: 2808 },
        { id: 'pcm-3', pos: 3, label: "amarillo", type: "adjective", action: "speak", pictogramId: 2648 },
        { id: 'pcm-4', pos: 4, label: "azul", type: "adjective", action: "speak", pictogramId: 4869 },

        // Row 2
        { id: 'pcm-9', pos: 9, label: "verde", type: "adjective", action: "speak", pictogramId: 4887 },
        { id: 'pcm-10', pos: 10, label: "anaranjado", type: "adjective", action: "speak" },
        { id: 'pcm-11', pos: 11, label: "rosado", type: "adjective", action: "speak", pictogramId: 27131 },
        { id: 'pcm-12', pos: 12, label: "morado", type: "adjective", action: "speak", pictogramId: 2907 },
        { id: 'pcm-13', pos: 13, label: "marrón", type: "adjective", action: "speak", pictogramId: 2923 },

        // Row 3
        { id: 'pcm-18', pos: 18, label: "negro", type: "adjective", action: "speak", pictogramId: 2886 },
        { id: 'pcm-19', pos: 19, label: "blanco", type: "adjective", action: "speak", pictogramId: 8043 },
        { id: 'pcm-20', pos: 20, label: "gris", type: "adjective", action: "speak", pictogramId: 3340 },
        { id: 'pcm-21', pos: 21, label: "dorado", type: "adjective", action: "speak", pictogramId: 2739 },
        { id: 'pcm-22', pos: 22, label: "plateado", type: "adjective", action: "speak", pictogramId: 2827 },

        // Row 4
        { id: 'pcm-27', pos: 27, label: "Cerrar", type: "navigation", action: "back", folderTarget: "maquillaje", pictogramId: 24976 },
        { id: 'pcm-28', pos: 28, label: "celeste", type: "adjective", action: "speak" }
    ] as GridCell[],

    'salud_bucal': [
        // Row 1 (Core - Inherited)
        { id: 'buc-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'buc-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'buc-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'buc-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'buc-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'buc-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'buc-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'buc-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'buc-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Contextual Overrides: Rinse/Brush)
        { id: 'buc-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'buc-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'buc-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'buc-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'buc-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'buc-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'buc-15', pos: 15, label: "enjuagar", type: "verb", action: "speak", pictogramId: 8560 }, // Contextual
        { id: 'buc-16', pos: 16, label: "cepillar los dientes", type: "verb", action: "speak", pictogramId: 2326 }, // Contextual (Repeat)
        { id: 'buc-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Special Objects)
        { id: 'buc-18', pos: 18, label: "paladar móvil", type: "noun", action: "speak", pictogramId: 31484 },
        { id: 'buc-19', pos: 19, label: "estuche", type: "noun", action: "speak", pictogramId: 8575 },
        { id: 'buc-20', pos: 20, label: "hilo dental", type: "noun", action: "speak", pictogramId: 9144 },
        { id: 'buc-21', pos: 21, label: "cepillo de dientes", type: "noun", action: "speak", pictogramId: 2694 },
        { id: 'buc-22', pos: 22, label: "pasta de dientes", type: "noun", action: "speak", pictogramId: 34086 },
        { id: 'buc-23', pos: 23, label: "enjuague bucal", type: "noun", action: "speak", pictogramId: 8561 },

        // Back nav
        { id: 'buc-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cuidado_2", pictogramId: 37086 }
    ] as GridCell[],

    'muebles': [
        // Row 1 (Core - Inherited)
        { id: 'mue-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'mue-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'mue-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'mue-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'mue-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'mue-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'mue-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'mue-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'mue-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Noun Overrides: Muebles/Alacena)
        { id: 'mue-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'mue-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'mue-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'mue-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'mue-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'mue-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'mue-15', pos: 15, label: "muebles", type: "noun", action: "speak", pictogramId: 32594 }, // Category
        { id: 'mue-16', pos: 16, label: "alacena", type: "noun", action: "speak", pictogramId: 23753 }, // VIP Item
        { id: 'mue-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3
        { id: 'mue-18', pos: 18, label: "armario", type: "noun", action: "speak", pictogramId: 2258 },
        { id: 'mue-19', pos: 19, label: "bañera", type: "noun", action: "speak", pictogramId: 2272 },
        { id: 'mue-20', pos: 20, label: "baño", type: "noun", action: "speak", pictogramId: 6929 },
        { id: 'mue-21', pos: 21, label: "cajón", type: "noun", action: "speak", pictogramId: 6070 },
        { id: 'mue-22', pos: 22, label: "cama", type: "noun", action: "speak", pictogramId: 25900 },
        { id: 'mue-23', pos: 23, label: "ducha", type: "noun", action: "speak", pictogramId: 32426 },
        { id: 'mue-24', pos: 24, label: "escritorio", type: "noun", action: "speak", pictogramId: 26071 },
        { id: 'mue-25', pos: 25, label: "fregadero", type: "noun", action: "speak", pictogramId: 2399 },
        { id: 'mue-26', pos: 26, label: "librero", type: "noun", action: "speak", pictogramId: 16795 },

        // Row 4
        { id: 'mue-27', pos: 27, label: "mesa", type: "noun", action: "speak", pictogramId: 3129 },
        { id: 'mue-28', pos: 28, label: "puerta", type: "noun", action: "speak", pictogramId: 3244 },
        { id: 'mue-29', pos: 29, label: "puf", type: "noun", action: "speak", pictogramId: 36660 },
        { id: 'mue-30', pos: 30, label: "silla", type: "noun", action: "speak", pictogramId: 3155 },
        { id: 'mue-31', pos: 31, label: "sofá", type: "noun", action: "speak", pictogramId: 25479 },
        { id: 'mue-32', pos: 32, label: "cómoda", type: "noun", action: "speak", pictogramId: 16281 },
        { id: 'mue-33', pos: 33, label: "hamaca", type: "noun", action: "speak", pictogramId: 4764 },
        { id: 'mue-34', pos: 34, label: "silla plegable", type: "noun", action: "speak", pictogramId: 38037 },
        { id: 'mue-35', pos: 35, label: "estufa", type: "noun", action: "speak", pictogramId: 2389 },

        // Row 5
        { id: 'mue-36', pos: 36, label: "reloj", type: "noun", action: "speak", pictogramId: 2549 },
        { id: 'mue-37', pos: 37, label: "alfombra", type: "noun", action: "speak", pictogramId: 2249 },
        { id: 'mue-38', pos: 38, label: "ropero", type: "noun", action: "speak", pictogramId: 2258 },
        { id: 'mue-39', pos: 39, label: "horno", type: "noun", action: "speak", pictogramId: 2426 },
        { id: 'mue-40', pos: 40, label: "refrigerador", type: "noun", action: "speak" },
        { id: 'mue-41', pos: 41, label: "lavadora", type: "noun", action: "speak", pictogramId: 2442 },
        // 42-43 Empty
        { id: 'mue-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "muebles_2", pictogramId: 3220 }
    ] as GridCell[],

    'muebles_2': [
        // Row 1
        { id: 'mu2-0', pos: 0, label: "alfombra", type: "noun", action: "speak", pictogramId: 2249 }, // Room carpet
        { id: 'mu2-1', pos: 1, label: "archivo", type: "noun", action: "speak", pictogramId: 16078 },
        { id: 'mu2-2', pos: 2, label: "banca", type: "noun", action: "speak", pictogramId: 16909 },
        { id: 'mu2-3', pos: 3, label: "barra de cocina", type: "noun", action: "speak", pictogramId: 16147 },
        { id: 'mu2-4', pos: 4, label: "buró", type: "noun", action: "speak", pictogramId: 2589 },
        { id: 'mu2-5', pos: 5, label: "cuna", type: "noun", action: "speak", pictogramId: 5980 },
        { id: 'mu2-6', pos: 6, label: "espejo", type: "noun", action: "speak", pictogramId: 8573 },
        { id: 'mu2-7', pos: 7, label: "mecedora", type: "noun", action: "speak", pictogramId: 24169 },
        { id: 'mu2-8', pos: 8, label: "mesa de centro", type: "noun", action: "speak", pictogramId: 37356 },

        // Row 2
        { id: 'mu2-9', pos: 9, label: "urinario", type: "noun", action: "speak", pictogramId: 28159 },
        { id: 'mu2-10', pos: 10, label: "mueble para tv", type: "noun", action: "speak", pictogramId: 8083 },
        { id: 'mu2-11', pos: 11, label: "silla de playa", type: "noun", action: "speak", pictogramId: 11467 },
        { id: 'mu2-12', pos: 12, label: "sillón reclinable", type: "noun", action: "speak", pictogramId: 38860 },

        // Back Nav
        { id: 'mu2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "muebles", pictogramId: 37086 }
    ] as GridCell[],

    'animales': [
        // Row 1 (Core)
        { id: 'ani-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'ani-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'ani-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'ani-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'ani-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'ani-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'ani-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'ani-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'ani-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },
        // Row 2
        { id: 'ani-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'ani-10', pos: 10, label: "animal", type: "noun", action: "speak", pictogramId: 8025 },
        { id: 'ani-11', pos: 11, label: "mascota", type: "noun", action: "speak", pictogramId: 25654 },
        { id: 'ani-12', pos: 12, label: "perro", type: "noun", action: "speak", pictogramId: 7202 },
        { id: 'ani-13', pos: 13, label: "gato", type: "noun", action: "speak", pictogramId: 7114 },
        { id: 'ani-14', pos: 14, label: "pez", type: "noun", action: "speak", pictogramId: 2520 },
        { id: 'ani-15', pos: 15, label: "pájaro", type: "noun", action: "speak", pictogramId: 2490 },
        { id: 'ani-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'ani-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },
        // Nav
        { id: 'ani-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cosas", pictogramId: 37086 }
    ] as GridCell[],

    'comida': [
        // Row 1 (Core - Fixed)
        { id: 'com-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'com-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'com-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'com-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'com-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'com-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'com-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'com-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'com-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Fixed)
        { id: 'com-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'com-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'com-11', pos: 11, label: "probar", type: "verb", action: "speak" }, // Contextual
        { id: 'com-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'com-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'com-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'com-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'com-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'com-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Phrases & Contextual Verbs)
        { id: 'com-18', pos: 18, label: "comida", type: "noun", action: "speak", pictogramId: 4610 },
        { id: 'com-19', pos: 19, label: "Tengo hambre", type: "phrase", action: "speak", pictogramId: 7272 },
        { id: 'com-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Drink
        { id: 'com-21', pos: 21, label: "Tengo sed", type: "phrase", action: "speak", pictogramId: 7273 },
        { id: 'com-22', pos: 22, label: "¿Tienes hambre?", type: "phrase", action: "speak", pictogramId: 7072 },
        { id: 'com-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Take
        { id: 'com-24', pos: 24, label: "¿Qué hay de comer?", type: "phrase", action: "speak", pictogramId: 7075 },
        { id: 'com-25', pos: 25, label: "¿Cuándo comer?", type: "phrase", action: "speak", pictogramId: 22621 },
        { id: 'com-26', pos: 26, label: "algo", type: "noun", action: "speak", pictogramId: 38768 },

        // Row 4 (Folders)
        { id: 'com-27', pos: 27, label: "Bebidas", type: "folder", folderTarget: "bebidas", pictogramId: 4575 },
        { id: 'com-28', pos: 28, label: "Postres", type: "folder", folderTarget: "postres", pictogramId: 7216 },
        { id: 'com-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 },
        { id: 'com-30', pos: 30, label: "Desayuno", type: "folder", folderTarget: "desayuno", pictogramId: 4626 },
        { id: 'com-31', pos: 31, label: "Almuerzo", type: "folder", folderTarget: "almuerzo", pictogramId: 28207 },
        { id: 'com-32', pos: 32, label: "Cena", type: "folder", folderTarget: "cena", pictogramId: 4592 },
        { id: 'com-33', pos: 33, label: "Botanas", type: "folder", folderTarget: "botanas" },
        { id: 'com-34', pos: 34, label: "Frutas", type: "folder", folderTarget: "frutas", pictogramId: 28339 },
        { id: 'com-35', pos: 35, label: "Verduras", type: "folder", folderTarget: "verduras", pictogramId: 29131 },

        // Row 5 (Folders & More)
        { id: 'com-36', pos: 36, label: "Carnes", type: "folder", folderTarget: "carnes", pictogramId: 2316 },
        { id: 'com-37', pos: 37, label: "Guarniciones", type: "folder", folderTarget: "guarniciones" },
        { id: 'com-38', pos: 38, label: "Condimentos", type: "folder", folderTarget: "condimentos", pictogramId: 39605 },
        { id: 'com-39', pos: 39, label: "Utensilios de mesa", type: "folder", folderTarget: "utensilios_mesa", pictogramId: 37356 },
        { id: 'com-40', pos: 40, label: "Utensilios de cocina", type: "folder", folderTarget: "utensilios_cocina", pictogramId: 34631 },
        { id: 'com-41', pos: 41, label: "Ingredientes", type: "folder", folderTarget: "ingredientes", pictogramId: 24119 },
        { id: 'com-42', pos: 42, label: "Caramelos", type: "folder", folderTarget: "caramelos", pictogramId: 2686 },
        { id: 'com-43', pos: 43, label: "turrón", type: "noun", action: "speak", pictogramId: 2784 },
        { id: 'com-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "comida_2", pictogramId: 3220 }
    ] as GridCell[],

    'comida_2': [
        // Row 1
        { id: 'com2-0', pos: 0, label: "compra", type: "noun", action: "speak", pictogramId: 9058 },
        { id: 'com2-1', pos: 1, label: "yogur", type: "noun", action: "speak", pictogramId: 2618 },
        { id: 'com2-2', pos: 2, label: "productos lácteos", type: "noun", action: "speak", pictogramId: 32739 },
        { id: 'com2-3', pos: 3, label: "galleta", type: "noun", action: "speak", pictogramId: 8312 },
        { id: 'com2-4', pos: 4, label: "pizza", type: "noun", action: "speak", pictogramId: 2527 },
        { id: 'com2-5', pos: 5, label: "pan", type: "noun", action: "speak", pictogramId: 2494 },
        { id: 'com2-6', pos: 6, label: "plátano", type: "noun", action: "speak", pictogramId: 2530 },
        { id: 'com2-7', pos: 7, label: "huevo", type: "noun", action: "speak", pictogramId: 2427 },
        { id: 'com2-8', pos: 8, label: "queso", type: "noun", action: "speak", pictogramId: 2541 },

        // Row 2
        { id: 'com2-9', pos: 9, label: "mantequilla", type: "noun", action: "speak", pictogramId: 2461 },
        { id: 'com2-10', pos: 10, label: "arroz", type: "noun", action: "speak", pictogramId: 6911 },
        { id: 'com2-11', pos: 11, label: "helado", type: "noun", action: "speak", pictogramId: 35209 },
        { id: 'com2-12', pos: 12, label: "chifle", type: "noun", action: "speak" },
        { id: 'com2-13', pos: 13, label: "agua", type: "noun", action: "speak", pictogramId: 32464 },
        { id: 'com2-14', pos: 14, label: "papas fritas", type: "noun", action: "speak", pictogramId: 2505 },
        { id: 'com2-15', pos: 15, label: "pollo", type: "noun", action: "speak", pictogramId: 4952 },
        { id: 'com2-16', pos: 16, label: "hamburguesa", type: "noun", action: "speak", pictogramId: 2419 },
        { id: 'com2-17', pos: 17, label: "sed", type: "noun", action: "speak", pictogramId: 7273 },

        // Row 3
        { id: 'com2-18', pos: 18, label: "pan con pollo", type: "noun", action: "speak", pictogramId: 36692 },

        // Navigation Back
        { id: 'com2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "comida", pictogramId: 37086 }
    ] as GridCell[],

    'bebidas': [
        // Row 1 (Core - Fixed)
        { id: 'beb-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'beb-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'beb-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'beb-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'beb-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'beb-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'beb-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'beb-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'beb-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Fixed)
        { id: 'beb-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'beb-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'beb-11', pos: 11, label: "probar", type: "verb", action: "speak" },
        { id: 'beb-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'beb-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'beb-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'beb-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'beb-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'beb-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (High Frequency)
        { id: 'beb-18', pos: 18, label: "bebida", type: "noun", action: "speak", pictogramId: 4575 },
        { id: 'beb-19', pos: 19, label: "agua", type: "noun", action: "speak", pictogramId: 32464 },
        { id: 'beb-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Drink
        { id: 'beb-21', pos: 21, label: "agua helada", type: "noun", action: "speak", pictogramId: 25153 },
        { id: 'beb-22', pos: 22, label: "café", type: "noun", action: "speak", pictogramId: 24479 },
        { id: 'beb-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Take/Grab
        { id: 'beb-24', pos: 24, label: "chocolate", type: "noun", action: "speak", pictogramId: 25940 },
        { id: 'beb-25', pos: 25, label: "coca cola", type: "noun", action: "speak", pictogramId: 38324 },
        { id: 'beb-26', pos: 26, label: "algo", type: "noun", action: "speak", pictogramId: 38768 },

        // Row 4 (Variety)
        { id: 'beb-27', pos: 27, label: "jugo", type: "noun", action: "speak", pictogramId: 11461 },
        { id: 'beb-28', pos: 28, label: "jugo de manzana", type: "noun", action: "speak", pictogramId: 9057 },
        { id: 'beb-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 }, // Cross-context verb
        { id: 'beb-30', pos: 30, label: "jugo de naranja", type: "noun", action: "speak", pictogramId: 2624 },
        { id: 'beb-31', pos: 31, label: "leche", type: "noun", action: "speak", pictogramId: 2445 },
        { id: 'beb-32', pos: 32, label: "leche con chocolate", type: "noun", action: "speak", pictogramId: 4940 },
        { id: 'beb-33', pos: 33, label: "malteada", type: "noun", action: "speak" },
        { id: 'beb-34', pos: 34, label: "chicha", type: "noun", action: "speak" },
        { id: 'beb-35', pos: 35, label: "inka cola", type: "noun", action: "speak", pictogramId: 38324 },

        // Row 5 (Folders & More)
        { id: 'beb-36', pos: 36, label: "alcohol", type: "folder", action: "navigate", folderTarget: "alcohol", pictogramId: 2984 },
        // Empty slots 37-43
        { id: 'beb-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "bebidas_2", pictogramId: 3220 }
    ] as GridCell[],

    'bebidas_2': [
        // Row 1
        { id: 'beb2-0', pos: 0, label: "7up", type: "noun", action: "speak" },
        { id: 'beb2-1', pos: 1, label: "agua mineral", type: "noun", action: "speak", pictogramId: 6183 },
        { id: 'beb2-2', pos: 2, label: "capuchino", type: "noun", action: "speak", pictogramId: 24483 },
        { id: 'beb2-3', pos: 3, label: "cerveza de raíz", type: "noun", action: "speak", pictogramId: 39624 },
        { id: 'beb2-4', pos: 4, label: "crema para café", type: "noun", action: "speak", pictogramId: 38748 },
        { id: 'beb2-5', pos: 5, label: "Diet Coke Plus", type: "noun", action: "speak" },
        { id: 'beb2-6', pos: 6, label: "Dr Pepper", type: "noun", action: "speak" },
        { id: 'beb2-7', pos: 7, label: "Fanta", type: "noun", action: "speak", pictogramId: 2372 },
        { id: 'beb2-8', pos: 8, label: "flotante", type: "noun", action: "speak" },

        // Row 2
        { id: 'beb2-9', pos: 9, label: "Gatorade", type: "noun", action: "speak" },
        { id: 'beb2-10', pos: 10, label: "ginger ale", type: "noun", action: "speak" },
        { id: 'beb2-11', pos: 11, label: "jugo de arándanos", type: "noun", action: "speak", pictogramId: 11463 },
        { id: 'beb2-12', pos: 12, label: "jugo de jitomate", type: "noun", action: "speak", pictogramId: 11463 },
        { id: 'beb2-13', pos: 13, label: "jugo de piña", type: "noun", action: "speak", pictogramId: 2625 },
        { id: 'beb2-14', pos: 14, label: "jugo de toronja", type: "noun", action: "speak", pictogramId: 13352 },
        { id: 'beb2-15', pos: 15, label: "jugo de uva", type: "noun", action: "speak", pictogramId: 11461 },
        { id: 'beb2-16', pos: 16, label: "limonada", type: "noun", action: "speak", pictogramId: 6551 },
        { id: 'beb2-17', pos: 17, label: "Mountain Dew", type: "noun", action: "speak", pictogramId: 3207 },

        // Row 3
        { id: 'beb2-18', pos: 18, label: "Pepsi Light", type: "noun", action: "speak", pictogramId: 3314 },
        { id: 'beb2-19', pos: 19, label: "raspado", type: "noun", action: "speak", pictogramId: 38470 },
        { id: 'beb2-20', pos: 20, label: "refresco", type: "noun", action: "speak", pictogramId: 4732 },
        { id: 'beb2-21', pos: 21, label: "refresco con helado", type: "noun", action: "speak", pictogramId: 4732 },
        { id: 'beb2-22', pos: 22, label: "sidra", type: "noun", action: "speak", pictogramId: 5585 },
        { id: 'beb2-23', pos: 23, label: "smoothie", type: "noun", action: "speak" },
        { id: 'beb2-24', pos: 24, label: "Sprite", type: "noun", action: "speak" },
        { id: 'beb2-25', pos: 25, label: "té", type: "noun", action: "speak", pictogramId: 6625 },
        { id: 'beb2-26', pos: 26, label: "té helado", type: "noun", action: "speak", pictogramId: 37734 },

        // Row 4
        { id: 'beb2-27', pos: 27, label: "gaseosa", type: "noun", action: "speak", pictogramId: 6510 },

        // Back
        { id: 'beb2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "bebidas", pictogramId: 37086 }
    ] as GridCell[],

    'alcohol': [{ id: 'alc-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "bebidas", pictogramId: 37086 }] as GridCell[],
    'postres': [
        // Row 1 (Core - Fixed)
        { id: 'pos-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'pos-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'pos-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'pos-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'pos-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'pos-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'pos-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'pos-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'pos-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Fixed)
        { id: 'pos-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'pos-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'pos-11', pos: 11, label: "probar", type: "verb", action: "speak" },
        { id: 'pos-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'pos-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'pos-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'pos-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'pos-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'pos-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Favorites)
        { id: 'pos-18', pos: 18, label: "postre", type: "noun", action: "speak", pictogramId: 7216 },
        { id: 'pos-19', pos: 19, label: "brownie", type: "noun", action: "speak", pictogramId: 38503 },
        { id: 'pos-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Drink
        { id: 'pos-21', pos: 21, label: "dona", type: "noun", action: "speak", pictogramId: 11625 },
        { id: 'pos-22', pos: 22, label: "galleta", type: "noun", action: "speak", pictogramId: 8312 },
        { id: 'pos-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Take/Grab (Generic)
        { id: 'pos-24', pos: 24, label: "gelatina de fresa", type: "noun", action: "speak", pictogramId: 25742 },
        { id: 'pos-25', pos: 25, label: "helado", type: "noun", action: "speak", pictogramId: 35209 },
        { id: 'pos-26', pos: 26, label: "algo", type: "noun", action: "speak", pictogramId: 38768 },

        // Row 4 (Variety)
        { id: 'pos-27', pos: 27, label: "paleta helada", type: "noun", action: "speak", pictogramId: 37079 },
        { id: 'pos-28', pos: 28, label: "torta", type: "noun", action: "speak", pictogramId: 2502 },
        { id: 'pos-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 }, // Cross-context
        { id: 'pos-30', pos: 30, label: "pay", type: "noun", action: "speak", pictogramId: 2854 },
        { id: 'pos-31', pos: 31, label: "pudín de chocolate", type: "noun", action: "speak", pictogramId: 38738 },
        { id: 'pos-32', pos: 32, label: "sundae", type: "noun", action: "speak" },
        { id: 'pos-33', pos: 33, label: "yogur congelado", type: "noun", action: "speak", pictogramId: 2618 },
        { id: 'pos-34', pos: 34, label: "Sabores", type: "folder", folderTarget: "sabores_helado", pictogramId: 37834 },
        { id: 'pos-35', pos: 35, label: "pastel", type: "noun", action: "speak", pictogramId: 2502 },

        // Row 5 (Mix & Local)
        { id: 'pos-36', pos: 36, label: "cono de helado", type: "noun", action: "speak", pictogramId: 2420 },
        { id: 'pos-37', pos: 37, label: "yogur", type: "noun", action: "speak", pictogramId: 2618 },
        { id: 'pos-38', pos: 38, label: "mazamorra morada", type: "noun", action: "speak", pictogramId: 38530 },
        { id: 'pos-39', pos: 39, label: "flan", type: "noun", action: "speak", pictogramId: 25111 },
        { id: 'pos-40', pos: 40, label: "picarones", type: "noun", action: "speak" },
        { id: 'pos-41', pos: 41, label: "turrón", type: "noun", action: "speak", pictogramId: 2784 },
        { id: 'pos-42', pos: 42, label: "alfajores", type: "noun", action: "speak" },
        // Empty 43
        { id: 'pos-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "postres_2", pictogramId: 3220 }
    ] as GridCell[],

    'postres_2': [
        // Row 1
        { id: 'pos2-0', pos: 0, label: "helado de chocolate", type: "noun", action: "speak", pictogramId: 39483 },
        { id: 'pos2-1', pos: 1, label: "helado de fresa", type: "noun", action: "speak", pictogramId: 2420 },
        { id: 'pos2-2', pos: 2, label: "helado de vainilla", type: "noun", action: "speak", pictogramId: 2420 },
        { id: 'pos2-3', pos: 3, label: "helado de menta", type: "noun", action: "speak", pictogramId: 2420 },
        { id: 'pos2-4', pos: 4, label: "helado de durazno", type: "noun", action: "speak", pictogramId: 11382 },
        { id: 'pos2-5', pos: 5, label: "arroz con leche", type: "noun", action: "speak", pictogramId: 36344 },
        { id: 'pos2-6', pos: 6, label: "barra de Rice Krispies", type: "noun", action: "speak", pictogramId: 37963 },
        { id: 'pos2-7', pos: 7, label: "cobbler", type: "noun", action: "speak" },
        { id: 'pos2-8', pos: 8, label: "cobbler de cerezas", type: "noun", action: "speak", pictogramId: 37592 },

        // Row 2
        { id: 'pos2-9', pos: 9, label: "cono de helado", type: "noun", action: "speak", pictogramId: 2420 },
        { id: 'pos2-10', pos: 10, label: "crema batida", type: "noun", action: "speak", pictogramId: 38748 },
        { id: 'pos2-11', pos: 11, label: "empanada", type: "noun", action: "speak", pictogramId: 8310 },
        { id: 'pos2-12', pos: 12, label: "ensalada de frutas", type: "noun", action: "speak", pictogramId: 8620 },
        { id: 'pos2-13', pos: 13, label: "galleta con chispas de choc...", type: "noun", action: "speak", pictogramId: 39633 }, // Long label
        { id: 'pos2-14', pos: 14, label: "galleta de azúcar", type: "noun", action: "speak", pictogramId: 39633 },
        { id: 'pos2-15', pos: 15, label: "galleta Oreo", type: "noun", action: "speak", pictogramId: 38501 },
        { id: 'pos2-16', pos: 16, label: "galletas de animales", type: "noun", action: "speak", pictogramId: 10228 },
        { id: 'pos2-17', pos: 17, label: "galletas de avena", type: "noun", action: "speak", pictogramId: 38501 },

        // Row 3
        { id: 'pos2-18', pos: 18, label: "gelatina de bayas", type: "noun", action: "speak", pictogramId: 25742 },
        { id: 'pos2-19', pos: 19, label: "gelatina de naranja", type: "noun", action: "speak", pictogramId: 2624 },
        { id: 'pos2-20', pos: 20, label: "glaseado", type: "noun", action: "speak", pictogramId: 38495 },
        { id: 'pos2-21', pos: 21, label: "algodón de azúcar", type: "noun", action: "speak", pictogramId: 11174 },
        { id: 'pos2-22', pos: 22, label: "manzana cubierta de car...", type: "noun", action: "speak", pictogramId: 9057 },
        { id: 'pos2-23', pos: 23, label: "oblea de vainilla", type: "noun", action: "speak", pictogramId: 28679 },
        { id: 'pos2-24', pos: 24, label: "paleta de crema", type: "noun", action: "speak", pictogramId: 2866 },
        { id: 'pos2-25', pos: 25, label: "panquecito", type: "noun", action: "speak" },
        { id: 'pos2-26', pos: 26, label: "pastel de cumpleaños", type: "noun", action: "speak", pictogramId: 29226 },

        // Row 4
        { id: 'pos2-27', pos: 27, label: "pastelillo de fresa", type: "noun", action: "speak", pictogramId: 2400 },
        { id: 'pos2-28', pos: 28, label: "pay de calabaza", type: "noun", action: "speak", pictogramId: 2679 },
        { id: 'pos2-29', pos: 29, label: "pay de chocolate", type: "noun", action: "speak", pictogramId: 21326 },
        { id: 'pos2-30', pos: 30, label: "pay de crema de plátano", type: "noun", action: "speak", pictogramId: 35829 },
        { id: 'pos2-31', pos: 31, label: "pay de limón", type: "noun", action: "speak", pictogramId: 38495 },
        { id: 'pos2-32', pos: 32, label: "pudín de vainilla", type: "noun", action: "speak", pictogramId: 28679 },
        // Skip duplicate or missing
        { id: 'pos2-34', pos: 34, label: "repostería", type: "noun", action: "speak", pictogramId: 39486 },
        { id: 'pos2-35', pos: 35, label: "sándwich de helado", type: "noun", action: "speak", pictogramId: 38504 },

        // Row 5
        { id: 'pos2-36', pos: 36, label: "sándwich de nube con choc...", type: "noun", action: "speak", pictogramId: 3383 },

        // Back
        { id: 'pos2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "postres", pictogramId: 37086 }
    ] as GridCell[],

    'sabores_helado': [{ id: 'sab-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "postres", pictogramId: 37086 }] as GridCell[],
    'desayuno': [
        // Row 1 (Core - Fixed)
        { id: 'des-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'des-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'des-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'des-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'des-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'des-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'des-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'des-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'des-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Fixed)
        { id: 'des-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'des-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'des-11', pos: 11, label: "probar", type: "verb", action: "speak" },
        { id: 'des-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'des-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'des-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'des-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'des-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'des-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Favorites)
        { id: 'des-18', pos: 18, label: "desayuno", type: "noun", action: "speak", pictogramId: 4626 },
        { id: 'des-19', pos: 19, label: "avena", type: "noun", action: "speak", pictogramId: 6921 },
        { id: 'des-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Drink
        { id: 'des-21', pos: 21, label: "cereales", type: "noun", action: "speak", pictogramId: 2328 },
        { id: 'des-22', pos: 22, label: "huevo frito", type: "noun", action: "speak", pictogramId: 2428 },
        { id: 'des-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Take
        { id: 'des-24', pos: 24, label: "huevos revueltos", type: "noun", action: "speak", pictogramId: 38528 },
        { id: 'des-25', pos: 25, label: "pan francés", type: "noun", action: "speak", pictogramId: 38723 },
        { id: 'des-26', pos: 26, label: "algo", type: "noun", action: "speak", pictogramId: 38768 },

        // Row 4 (Variety)
        { id: 'des-27', pos: 27, label: "pan tostado", type: "noun", action: "speak", pictogramId: 38723 },
        { id: 'des-28', pos: 28, label: "panqué", type: "noun", action: "speak" },
        { id: 'des-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 }, // Eat
        { id: 'des-30', pos: 30, label: "panqueques", type: "noun", action: "speak", pictogramId: 34233 },
        { id: 'des-31', pos: 31, label: "papas doradas", type: "noun", action: "speak", pictogramId: 10227 },
        { id: 'des-32', pos: 32, label: "salchicha", type: "noun", action: "speak", pictogramId: 6647 },
        { id: 'des-33', pos: 33, label: "tocino", type: "noun", action: "speak", pictogramId: 24972 },
        { id: 'des-34', pos: 34, label: "waffle", type: "noun", action: "speak" },
        { id: 'des-35', pos: 35, label: "queso", type: "noun", action: "speak", pictogramId: 2541 },

        // Row 5 (Basics)
        { id: 'des-36', pos: 36, label: "leche", type: "noun", action: "speak", pictogramId: 2445 },
        { id: 'des-37', pos: 37, label: "pan", type: "noun", action: "speak", pictogramId: 2494 },
        // Empty 38-43
        { id: 'des-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "desayuno_2", pictogramId: 3220 }
    ] as GridCell[],

    'desayuno_2': [
        // Row 1
        { id: 'des2-0', pos: 0, label: "avena instantánea", type: "noun", action: "speak", pictogramId: 38524 },
        { id: 'des2-1', pos: 1, label: "bagel", type: "noun", action: "speak", pictogramId: 38531 },
        { id: 'des2-2', pos: 2, label: "bollo", type: "noun", action: "speak", pictogramId: 21330 },
        { id: 'des2-3', pos: 3, label: "Cheerios", type: "noun", action: "speak" },
        { id: 'des2-4', pos: 4, label: "Cocoa Pebbles", type: "noun", action: "speak" },
        { id: 'des2-5', pos: 5, label: "cuerno", type: "noun", action: "speak", pictogramId: 5978 },
        { id: 'des2-6', pos: 6, label: "empanada de salchicha", type: "noun", action: "speak", pictogramId: 6647 },
        { id: 'des2-7', pos: 7, label: "granola", type: "noun", action: "speak" },
        { id: 'des2-8', pos: 8, label: "jarabe", type: "noun", action: "speak", pictogramId: 2962 },

        // Row 2
        { id: 'des2-9', pos: 9, label: "mantequilla", type: "noun", action: "speak", pictogramId: 2461 },
        { id: 'des2-10', pos: 10, label: "mermelada", type: "noun", action: "speak", pictogramId: 2470 },
        { id: 'des2-11', pos: 11, label: "pan inglés", type: "noun", action: "speak", pictogramId: 10150 },
        { id: 'des2-12', pos: 12, label: "rollo de canela", type: "noun", action: "speak", pictogramId: 9183 },

        // Back
        { id: 'des2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "desayuno", pictogramId: 37086 }
    ] as GridCell[],
    'almuerzo': [
        // Row 1 (Core - Fixed)
        { id: 'alm-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'alm-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'alm-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'alm-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'alm-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'alm-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'alm-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'alm-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'alm-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Fixed)
        { id: 'alm-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'alm-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'alm-11', pos: 11, label: "probar", type: "verb", action: "speak" },
        { id: 'alm-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'alm-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'alm-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'alm-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'alm-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'alm-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (High Frequency)
        { id: 'alm-18', pos: 18, label: "almuerzo", type: "noun", action: "speak", pictogramId: 28207 },
        { id: 'alm-19', pos: 19, label: "crema de maní y jalea", type: "noun", action: "speak", pictogramId: 8338 },
        { id: 'alm-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Drink
        { id: 'alm-21', pos: 21, label: "hamburguesa", type: "noun", action: "speak", pictogramId: 2419 },
        { id: 'alm-22', pos: 22, label: "hamburguesa con queso", type: "noun", action: "speak", pictogramId: 4881 },
        { id: 'alm-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Take
        { id: 'alm-24', pos: 24, label: "hot dog", type: "noun", action: "speak", pictogramId: 9016 },
        { id: 'alm-25', pos: 25, label: "macarrones con queso", type: "noun", action: "speak", pictogramId: 35763 },
        { id: 'alm-26', pos: 26, label: "algo", type: "noun", action: "speak", pictogramId: 38768 },

        // Row 4 (Variety)
        { id: 'alm-27', pos: 27, label: "mortadela", type: "noun", action: "speak", pictogramId: 8634 },
        { id: 'alm-28', pos: 28, label: "nuggets de pollo", type: "noun", action: "speak", pictogramId: 31378 },
        { id: 'alm-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 }, // Eat
        { id: 'alm-30', pos: 30, label: "palitos de pescado", type: "noun", action: "speak", pictogramId: 36430 },
        { id: 'alm-31', pos: 31, label: "queso asado", type: "noun", action: "speak", pictogramId: 4881 },
        { id: 'alm-32', pos: 32, label: "sándwich", type: "noun", action: "speak", pictogramId: 3383 },
        { id: 'alm-33', pos: 33, label: "sándwich de pescado", type: "noun", action: "speak", pictogramId: 3383 },
        { id: 'alm-34', pos: 34, label: "sopa", type: "noun", action: "speak", pictogramId: 2573 },
        { id: 'alm-35', pos: 35, label: "arroz con pollo", type: "noun", action: "speak", pictogramId: 36692 },

        // Row 5 (Local/Mix)
        { id: 'alm-36', pos: 36, label: "tiras de pollo", type: "noun", action: "speak", pictogramId: 35815 },
        { id: 'alm-37', pos: 37, label: "jamón", type: "noun", action: "speak", pictogramId: 2433 },
        { id: 'alm-38', pos: 38, label: "arroz chaufa", type: "noun", action: "speak", pictogramId: 28923 },
        { id: 'alm-39', pos: 39, label: "salpicón de pollo", type: "noun", action: "speak", pictogramId: 2534 },
        { id: 'alm-40', pos: 40, label: "tallarín rojo", type: "noun", action: "speak", pictogramId: 36223 },
        { id: 'alm-41', pos: 41, label: "salchipapa", type: "noun", action: "speak" },
        // Empty 42-43
        { id: 'alm-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "almuerzo_2", pictogramId: 3220 }
    ] as GridCell[],

    'almuerzo_2': [
        // Row 1
        { id: 'alm2-0', pos: 0, label: "alitas de pollo", type: "noun", action: "speak", pictogramId: 37583 },
        { id: 'alm2-1', pos: 1, label: "banderilla", type: "noun", action: "speak", pictogramId: 16463 },
        { id: 'alm2-2', pos: 2, label: "bratwurst", type: "noun", action: "speak" },
        { id: 'alm2-3', pos: 3, label: "carnes frías", type: "noun", action: "speak", pictogramId: 6961 },
        { id: 'alm2-4', pos: 4, label: "chile con carne", type: "noun", action: "speak", pictogramId: 8071 },
        { id: 'alm2-5', pos: 5, label: "comida rápida", type: "noun", action: "speak", pictogramId: 5306 },
        { id: 'alm2-6', pos: 6, label: "consomé de pollo", type: "noun", action: "speak", pictogramId: 2534 },
        { id: 'alm2-7', pos: 7, label: "ensalada César", type: "noun", action: "speak", pictogramId: 8620 },
        { id: 'alm2-8', pos: 8, label: "frijoles cocinados", type: "noun", action: "speak" },

        // Row 2
        { id: 'alm2-9', pos: 9, label: "gyro", type: "noun", action: "speak" },
        { id: 'alm2-10', pos: 10, label: "hot dog con chile con carne", type: "noun", action: "speak", pictogramId: 38618 }, // Long
        { id: 'alm2-11', pos: 11, label: "pan", type: "noun", action: "speak", pictogramId: 2494 },
        { id: 'alm2-12', pos: 12, label: "pan de hot dog", type: "noun", action: "speak", pictogramId: 10150 },
        { id: 'alm2-13', pos: 13, label: "pan para hamburguesa", type: "noun", action: "speak", pictogramId: 10150 },
        { id: 'alm2-14', pos: 14, label: "queso cottage", type: "noun", action: "speak", pictogramId: 35763 },
        { id: 'alm2-15', pos: 15, label: "rebanada de queso amarillo", type: "noun", action: "speak", pictogramId: 10232 },
        { id: 'alm2-16', pos: 16, label: "sándwich de ensalada de...", type: "noun", action: "speak", pictogramId: 3383 },
        { id: 'alm2-17', pos: 17, label: "sándwich de pollo", type: "noun", action: "speak", pictogramId: 3383 },

        // Row 3
        { id: 'alm2-18', pos: 18, label: "sándwich de rosbif", type: "noun", action: "speak", pictogramId: 3383 },
        { id: 'alm2-19', pos: 19, label: "sándwich de tocino", type: "noun", action: "speak", pictogramId: 2327 },
        { id: 'alm2-20', pos: 20, label: "sopa de chícharos", type: "noun", action: "speak", pictogramId: 16047 },
        { id: 'alm2-21', pos: 21, label: "submarino", type: "noun", action: "speak", pictogramId: 3157 },
        { id: 'alm2-22', pos: 22, label: "yogur", type: "noun", action: "speak", pictogramId: 2618 },
        { id: 'alm2-23', pos: 23, label: "ceviche", type: "noun", action: "speak" },
        { id: 'alm2-24', pos: 24, label: "ceviche mixto", type: "noun", action: "speak", pictogramId: 38504 },
        { id: 'alm2-25', pos: 25, label: "ceviche de conchas", type: "noun", action: "speak", pictogramId: 34625 },

        // Back
        { id: 'alm2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "almuerzo", pictogramId: 37086 }
    ] as GridCell[],
    'cena': [
        // Row 1 (Core - Fixed)
        { id: 'cen-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'cen-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'cen-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'cen-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'cen-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'cen-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'cen-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'cen-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'cen-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Fixed)
        { id: 'cen-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'cen-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'cen-11', pos: 11, label: "probar", type: "verb", action: "speak" },
        { id: 'cen-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'cen-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'cen-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'cen-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'cen-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'cen-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (High Frequency)
        { id: 'cen-18', pos: 18, label: "cena", type: "noun", action: "speak", pictogramId: 4592 },
        { id: 'cen-19', pos: 19, label: "albóndigas", type: "noun", action: "speak", pictogramId: 3249 },
        { id: 'cen-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Drink
        { id: 'cen-21', pos: 21, label: "bistec", type: "noun", action: "speak", pictogramId: 35759 },
        { id: 'cen-22', pos: 22, label: "cacerola", type: "noun", action: "speak", pictogramId: 3231 },
        { id: 'cen-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Take
        { id: 'cen-24', pos: 24, label: "comida congelada", type: "noun", action: "speak", pictogramId: 36251 },
        { id: 'cen-25', pos: 25, label: "costillitas", type: "noun", action: "speak" },
        { id: 'cen-26', pos: 26, label: "algo", type: "noun", action: "speak", pictogramId: 38768 },

        // Row 4 (Variety)
        { id: 'cen-27', pos: 27, label: "espaguetis", type: "noun", action: "speak", pictogramId: 2383 },
        { id: 'cen-28', pos: 28, label: "macarrones", type: "noun", action: "speak", pictogramId: 2455 },
        { id: 'cen-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 }, // Eat
        { id: 'cen-30', pos: 30, label: "pasta", type: "noun", action: "speak", pictogramId: 8652 },
        { id: 'cen-31', pos: 31, label: "pastel de carne", type: "noun", action: "speak", pictogramId: 39743 },
        { id: 'cen-32', pos: 32, label: "pizza", type: "noun", action: "speak", pictogramId: 2527 },
        { id: 'cen-33', pos: 33, label: "quesadilla", type: "noun", action: "speak" },
        { id: 'cen-34', pos: 34, label: "taco", type: "noun", action: "speak", pictogramId: 3390 },
        { id: 'cen-35', pos: 35, label: "pollo con tallarines", type: "noun", action: "speak", pictogramId: 25486 },

        // Row 5 (Local/Mix)
        { id: 'cen-36', pos: 36, label: "tortilla", type: "noun", action: "speak", pictogramId: 4967 },
        { id: 'cen-37', pos: 37, label: "pierna de pollo", type: "noun", action: "speak", pictogramId: 2534 },
        { id: 'cen-38', pos: 38, label: "tamal", type: "noun", action: "speak" },
        // Empty 39-43
        { id: 'cen-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "cena_2", pictogramId: 3220 }
    ] as GridCell[],

    'cena_2': [
        // Row 1
        { id: 'cen2-0', pos: 0, label: "alambres", type: "noun", action: "speak", pictogramId: 7042 },
        { id: 'cen2-1', pos: 1, label: "asado", type: "noun", action: "speak", pictogramId: 5389 },
        { id: 'cen2-2', pos: 2, label: "bolitas de masa", type: "noun", action: "speak", pictogramId: 15347 },
        { id: 'cen2-3', pos: 3, label: "burrito", type: "noun", action: "speak", pictogramId: 10219 },
        { id: 'cen2-4', pos: 4, label: "calzone", type: "noun", action: "speak" },
        { id: 'cen2-5', pos: 5, label: "chuletas de puerco", type: "noun", action: "speak" },
        { id: 'cen2-6', pos: 6, label: "cubeta de pollo frito", type: "noun", action: "speak", pictogramId: 2720 },
        { id: 'cen2-7', pos: 7, label: "enchiladas", type: "noun", action: "speak" },
        { id: 'cen2-8', pos: 8, label: "fajitas de pollo", type: "noun", action: "speak", pictogramId: 2534 },

        // Row 2
        { id: 'cen2-9', pos: 9, label: "fajitas de res", type: "noun", action: "speak" },
        { id: 'cen2-10', pos: 10, label: "fondue", type: "noun", action: "speak", pictogramId: 10226 },
        { id: 'cen2-11', pos: 11, label: "guisado de res", type: "noun", action: "speak" },
        { id: 'cen2-12', pos: 12, label: "lasaña", type: "noun", action: "speak", pictogramId: 9051 },
        { id: 'cen2-13', pos: 13, label: "pescado y papas fritas", type: "noun", action: "speak", pictogramId: 36428 },
        { id: 'cen2-14', pos: 14, label: "plato de pollo", type: "noun", action: "speak", pictogramId: 36692 },
        { id: 'cen2-15', pos: 15, label: "ravioles", type: "noun", action: "speak" },
        { id: 'cen2-16', pos: 16, label: "rebanada de pizza", type: "noun", action: "speak", pictogramId: 9059 },
        { id: 'cen2-17', pos: 17, label: "satay de pollo", type: "noun", action: "speak", pictogramId: 2534 },

        // Row 3
        { id: 'cen2-18', pos: 18, label: "sushi", type: "noun", action: "speak", pictogramId: 38993 },
        { id: 'cen2-19', pos: 19, label: "taquito", type: "noun", action: "speak" },
        { id: 'cen2-20', pos: 20, label: "tortellini", type: "noun", action: "speak" },

        // Back
        { id: 'cen2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cena", pictogramId: 37086 }
    ] as GridCell[],
    'botanas': [
        // Row 1 (Core - Fixed)
        { id: 'bot-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'bot-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'bot-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'bot-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'bot-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'bot-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'bot-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'bot-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'bot-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Fixed)
        { id: 'bot-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'bot-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'bot-11', pos: 11, label: "probar", type: "verb", action: "speak" },
        { id: 'bot-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'bot-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'bot-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'bot-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'bot-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'bot-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (High Frequency)
        { id: 'bot-18', pos: 18, label: "refrigerio", type: "noun", action: "speak" },
        { id: 'bot-19', pos: 19, label: "puré de manzana", type: "noun", action: "speak", pictogramId: 38007 },
        { id: 'bot-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Drink
        { id: 'bot-21', pos: 21, label: "queso", type: "noun", action: "speak", pictogramId: 2541 },
        { id: 'bot-22', pos: 22, label: "Cheetos", type: "noun", action: "speak" },
        { id: 'bot-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Take
        { id: 'bot-24', pos: 24, label: "papas fritas", type: "noun", action: "speak", pictogramId: 2505 },
        { id: 'bot-25', pos: 25, label: "tableta de chocolate", type: "noun", action: "speak", pictogramId: 25940 },
        { id: 'bot-26', pos: 26, label: "algo", type: "noun", action: "speak", pictogramId: 38768 },

        // Row 4 (Variety)
        { id: 'bot-27', pos: 27, label: "chips de maíz", type: "noun", action: "speak", pictogramId: 25606 },
        { id: 'bot-28', pos: 28, label: "rollitos de fruta", type: "noun", action: "speak", pictogramId: 28339 },
        { id: 'bot-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 }, // Eat
        { id: 'bot-30', pos: 30, label: "galletas de queso", type: "noun", action: "speak", pictogramId: 35763 },
        { id: 'bot-31', pos: 31, label: "galleta crujiente", type: "noun", action: "speak", pictogramId: 39633 },
        { id: 'bot-32', pos: 32, label: "barra de granola", type: "noun", action: "speak", pictogramId: 37963 },
        { id: 'bot-33', pos: 33, label: "canchita", type: "noun", action: "speak" }, // Popcorn
        { id: 'bot-34', pos: 34, label: "pretzel", type: "noun", action: "speak", pictogramId: 39058 },
        { id: 'bot-35', pos: 35, label: "pasitas", type: "noun", action: "speak" },

        // Row 5 (Mix)
        { id: 'bot-36', pos: 36, label: "yogur", type: "noun", action: "speak", pictogramId: 2618 },
        { id: 'bot-37', pos: 37, label: "barra de cereal", type: "noun", action: "speak", pictogramId: 6911 },
        { id: 'bot-38', pos: 38, label: "papas", type: "noun", action: "speak", pictogramId: 31146 },
        { id: 'bot-39', pos: 39, label: "chifle", type: "noun", action: "speak" },
        // Empty 40-43
        { id: 'bot-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "botanas_2", pictogramId: 3220 }
    ] as GridCell[],

    'botanas_2': [
        // Row 1
        { id: 'bot2-0', pos: 0, label: "almendra", type: "noun", action: "speak", pictogramId: 8292 },
        { id: 'bot2-1', pos: 1, label: "taza de puré de manzana", type: "noun", action: "speak", pictogramId: 21326 },
        { id: 'bot2-2', pos: 2, label: "palomitas con caramelo", type: "noun", action: "speak", pictogramId: 5534 },
        { id: 'bot2-3', pos: 3, label: "nueces de la India", type: "noun", action: "speak", pictogramId: 10339 },
        { id: 'bot2-4', pos: 4, label: "queso y galletas saladas", type: "noun", action: "speak", pictogramId: 35763 },
        { id: 'bot2-5', pos: 5, label: "galletas de queso", type: "noun", action: "speak", pictogramId: 35763 },
        { id: 'bot2-6', pos: 6, label: "Doritos", type: "noun", action: "speak" },
        { id: 'bot2-7', pos: 7, label: "fruta seca", type: "noun", action: "speak", pictogramId: 34890 },
        { id: 'bot2-8', pos: 8, label: "barrita energética", type: "noun", action: "speak", pictogramId: 35899 },

        // Row 2
        { id: 'bot2-9', pos: 9, label: "Fritos", type: "noun", action: "speak", pictogramId: 15451 },
        { id: 'bot2-10', pos: 10, label: "botanas de fruta", type: "noun", action: "speak", pictogramId: 28339 },
        { id: 'bot2-11', pos: 11, label: "bombón", type: "noun", action: "speak", pictogramId: 8298 },
        { id: 'bot2-12', pos: 12, label: "frutos secos", type: "noun", action: "speak", pictogramId: 20105 },
        { id: 'bot2-13', pos: 13, label: "cacahuetes", type: "noun", action: "speak", pictogramId: 2674 },
        { id: 'bot2-14', pos: 14, label: "nueces", type: "noun", action: "speak", pictogramId: 2880 },
        { id: 'bot2-15', pos: 15, label: "pistaches", type: "noun", action: "speak" },
        { id: 'bot2-16', pos: 16, label: "palito de pretzel", type: "noun", action: "speak", pictogramId: 39058 },
        { id: 'bot2-17', pos: 17, label: "galleta de arroz", type: "noun", action: "speak", pictogramId: 3331 },

        // Row 3
        { id: 'bot2-18', pos: 18, label: "rociador de queso", type: "noun", action: "speak", pictogramId: 35763 },
        { id: 'bot2-19', pos: 19, label: "tira de queso", type: "noun", action: "speak", pictogramId: 36454 },
        { id: 'bot2-20', pos: 20, label: "semillas de girasol", type: "noun", action: "speak", pictogramId: 39192 },
        { id: 'bot2-21', pos: 21, label: "Teddy Grahams", type: "noun", action: "speak" },
        { id: 'bot2-22', pos: 22, label: "nueces y frutos secos", type: "noun", action: "speak", pictogramId: 20105 },

        // Back
        { id: 'bot2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "botanas", pictogramId: 37086 }
    ] as GridCell[],

    'frutas': [
        // Row 1 (Core - Fixed)
        { id: 'fru-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'fru-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'fru-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'fru-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'fru-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'fru-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'fru-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'fru-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'fru-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Fixed)
        { id: 'fru-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'fru-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'fru-11', pos: 11, label: "probar", type: "verb", action: "speak" },
        { id: 'fru-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'fru-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'fru-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'fru-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'fru-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'fru-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (High Frequency)
        { id: 'fru-18', pos: 18, label: "fruta", type: "noun", action: "speak", pictogramId: 28339 },
        { id: 'fru-19', pos: 19, label: "ensalada de frutas", type: "noun", action: "speak", pictogramId: 8620 },
        { id: 'fru-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Drink
        { id: 'fru-21', pos: 21, label: "plátano", type: "noun", action: "speak", pictogramId: 2530 },
        { id: 'fru-22', pos: 22, label: "naranja", type: "noun", action: "speak", pictogramId: 2888 },
        { id: 'fru-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Take
        { id: 'fru-24', pos: 24, label: "manzana", type: "noun", action: "speak", pictogramId: 2462 },
        { id: 'fru-25', pos: 25, label: "fresa", type: "noun", action: "speak", pictogramId: 2400 },
        { id: 'fru-26', pos: 26, label: "algo", type: "noun", action: "speak", pictogramId: 38768 },

        // Row 4 (Variety)
        { id: 'fru-27', pos: 27, label: "mango", type: "noun", action: "speak", pictogramId: 10256 },
        { id: 'fru-28', pos: 28, label: "sandía", type: "noun", action: "speak", pictogramId: 2557 },
        { id: 'fru-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 }, // Eat
        { id: 'fru-30', pos: 30, label: "uvas", type: "noun", action: "speak", pictogramId: 3247 },
        // Empty 31-35

        // Row 5
        { id: 'fru-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "frutas_2", pictogramId: 3220 }
    ] as GridCell[],

    'frutas_2': [
        // Row 1
        { id: 'fru2-0', pos: 0, label: "arándanos", type: "noun", action: "speak", pictogramId: 13034 },
        { id: 'fru2-1', pos: 1, label: "bayas", type: "noun", action: "speak", pictogramId: 35145 },
        { id: 'fru2-2', pos: 2, label: "chabacano", type: "noun", action: "speak" }, // Apricot
        { id: 'fru2-3', pos: 3, label: "ciruela", type: "noun", action: "speak", pictogramId: 8305 },
        { id: 'fru2-4', pos: 4, label: "frambuesa", type: "noun", action: "speak", pictogramId: 36540 },
        { id: 'fru2-5', pos: 5, label: "fruta seca", type: "noun", action: "speak", pictogramId: 34890 },
        { id: 'fru2-6', pos: 6, label: "limón", type: "noun", action: "speak", pictogramId: 3022 },
        { id: 'fru2-7', pos: 7, label: "melón chino", type: "noun", action: "speak", pictogramId: 37526 },
        { id: 'fru2-8', pos: 8, label: "melón verde", type: "noun", action: "speak", pictogramId: 37111 },

        // Row 2
        { id: 'fru2-9', pos: 9, label: "mora", type: "noun", action: "speak", pictogramId: 8360 },
        { id: 'fru2-10', pos: 10, label: "pera", type: "noun", action: "speak", pictogramId: 2561 },
        { id: 'fru2-11', pos: 11, label: "piña", type: "noun", action: "speak", pictogramId: 2525 },
        { id: 'fru2-12', pos: 12, label: "toronja", type: "noun", action: "speak", pictogramId: 13352 },
        { id: 'fru2-13', pos: 13, label: "mango", type: "noun", action: "speak", pictogramId: 10256 },
        { id: 'fru2-14', pos: 14, label: "mandarina", type: "noun", action: "speak", pictogramId: 11298 },
        { id: 'fru2-15', pos: 15, label: "maracuyá", type: "noun", action: "speak", pictogramId: 27776 },
        { id: 'fru2-16', pos: 16, label: "uvas", type: "noun", action: "speak", pictogramId: 3247 },
        { id: 'fru2-17', pos: 17, label: "cereza", type: "noun", action: "speak", pictogramId: 8303 },

        // Row 3
        { id: 'fru2-18', pos: 18, label: "sandía", type: "noun", action: "speak", pictogramId: 2557 },
        { id: 'fru2-19', pos: 19, label: "durazno", type: "noun", action: "speak", pictogramId: 2468 },
        { id: 'fru2-20', pos: 20, label: "papaya", type: "noun", action: "speak", pictogramId: 16829 },
        { id: 'fru2-21', pos: 21, label: "palta", type: "noun", action: "speak", pictogramId: 8009 }, // Avocado
        { id: 'fru2-22', pos: 22, label: "manzana", type: "noun", action: "speak", pictogramId: 2462 },

        // Back
        { id: 'fru2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "frutas", pictogramId: 37086 }
    ] as GridCell[],
    'verduras': [
        // Row 1 (Core - Fixed)
        { id: 'ver-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'ver-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'ver-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'ver-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'ver-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'ver-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'ver-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'ver-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'ver-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Fixed)
        { id: 'ver-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'ver-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'ver-11', pos: 11, label: "probar", type: "verb", action: "speak" },
        { id: 'ver-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'ver-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'ver-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'ver-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'ver-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'ver-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (High Frequency)
        { id: 'ver-18', pos: 18, label: "verduras", type: "noun", action: "speak", pictogramId: 29131 },
        { id: 'ver-19', pos: 19, label: "brócoli", type: "noun", action: "speak", pictogramId: 23853 },
        { id: 'ver-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Drink
        { id: 'ver-21', pos: 21, label: "calabacín", type: "noun", action: "speak", pictogramId: 2678 },
        { id: 'ver-22', pos: 22, label: "alverjas", type: "noun", action: "speak" },
        { id: 'ver-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Take
        { id: 'ver-24', pos: 24, label: "vainitas", type: "noun", action: "speak" },
        { id: 'ver-25', pos: 25, label: "choclo", type: "noun", action: "speak", pictogramId: 4879 }, // Local Corn
        { id: 'ver-26', pos: 26, label: "algo", type: "noun", action: "speak", pictogramId: 38768 },

        // Row 4 (Variety)
        { id: 'ver-27', pos: 27, label: "ensalada", type: "noun", action: "speak", pictogramId: 2377 },
        { id: 'ver-28', pos: 28, label: "espinacas", type: "noun", action: "speak", pictogramId: 5460 },
        { id: 'ver-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 }, // Eat
        { id: 'ver-30', pos: 30, label: "frijoles", type: "noun", action: "speak" },
        { id: 'ver-31', pos: 31, label: "lechuga", type: "noun", action: "speak", pictogramId: 2446 },
        { id: 'ver-32', pos: 32, label: "papa", type: "noun", action: "speak", pictogramId: 31146 },
        { id: 'ver-33', pos: 33, label: "zanahoria", type: "noun", action: "speak", pictogramId: 2619 },
        { id: 'ver-34', pos: 34, label: "zapallo", type: "noun", action: "speak", pictogramId: 2679 }, // Local Pumpkin
        { id: 'ver-35', pos: 35, label: "cebolla china", type: "noun", action: "speak", pictogramId: 10272 }, // Scallions

        // Row 5 (Local)
        { id: 'ver-36', pos: 36, label: "ají", type: "noun", action: "speak", pictogramId: 4661 },
        // Empty 37-43
        { id: 'ver-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "verduras_2", pictogramId: 3220 }
    ] as GridCell[],

    'verduras_2': [
        // Row 1
        { id: 'ver2-0', pos: 0, label: "aceitunas negras", type: "noun", action: "speak", pictogramId: 2875 },
        { id: 'ver2-1', pos: 1, label: "palta", type: "noun", action: "speak", pictogramId: 8009 }, // Avocado
        { id: 'ver2-2', pos: 2, label: "apio", type: "noun", action: "speak", pictogramId: 8492 },
        { id: 'ver2-3', pos: 3, label: "camote", type: "noun", action: "speak" }, // Sweet Potato
        { id: 'ver2-4', pos: 4, label: "berenjena", type: "noun", action: "speak", pictogramId: 2660 },
        { id: 'ver2-5', pos: 5, label: "betarraga", type: "noun", action: "speak" }, // Beet
        { id: 'ver2-6', pos: 6, label: "calabaza", type: "noun", action: "speak", pictogramId: 2679 },
        { id: 'ver2-7', pos: 7, label: "calabaza dulce", type: "noun", action: "speak", pictogramId: 38525 },
        { id: 'ver2-8', pos: 8, label: "calabaza amarilla", type: "noun", action: "speak", pictogramId: 8669 },

        // Row 2
        { id: 'ver2-9', pos: 9, label: "cebolla", type: "noun", action: "speak", pictogramId: 2323 },
        { id: 'ver2-10', pos: 10, label: "cebolla roja", type: "noun", action: "speak", pictogramId: 36197 },
        { id: 'ver2-11', pos: 11, label: "champiñones", type: "noun", action: "speak", pictogramId: 2331 },
        { id: 'ver2-12', pos: 12, label: "col de Bruselas", type: "noun", action: "speak", pictogramId: 23949 },
        { id: 'ver2-13', pos: 13, label: "coliflor", type: "noun", action: "speak", pictogramId: 23953 },
        { id: 'ver2-14', pos: 14, label: "elote", type: "noun", action: "speak" }, // Corn cob
        { id: 'ver2-15', pos: 15, label: "espárragos", type: "noun", action: "speak", pictogramId: 2384 },
        { id: 'ver2-16', pos: 16, label: "frijoles carita", type: "noun", action: "speak" },
        { id: 'ver2-17', pos: 17, label: "garbanzos", type: "noun", action: "speak", pictogramId: 2405 },

        // Row 3
        { id: 'ver2-18', pos: 18, label: "habas", type: "noun", action: "speak", pictogramId: 24099 },
        { id: 'ver2-19', pos: 19, label: "tomate", type: "noun", action: "speak", pictogramId: 2594 },
        { id: 'ver2-20', pos: 20, label: "pepino", type: "noun", action: "speak", pictogramId: 2847 },
        { id: 'ver2-21', pos: 21, label: "pimiento amarillo", type: "noun", action: "speak", pictogramId: 39388 },
        { id: 'ver2-22', pos: 22, label: "pimiento rojo", type: "noun", action: "speak", pictogramId: 2839 },
        { id: 'ver2-23', pos: 23, label: "pimiento verde", type: "noun", action: "speak", pictogramId: 2838 },
        { id: 'ver2-24', pos: 24, label: "col", type: "noun", action: "speak", pictogramId: 2708 },

        // Back
        { id: 'ver2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "verduras", pictogramId: 37086 }
    ] as GridCell[],

    'carnes': [
        // Row 1 (Core - Fixed)
        { id: 'car-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'car-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'car-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'car-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'car-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'car-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'car-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'car-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'car-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Fixed)
        { id: 'car-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'car-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'car-11', pos: 11, label: "probar", type: "verb", action: "speak" },
        { id: 'car-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'car-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'car-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'car-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'car-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'car-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (High Frequency)
        { id: 'car-18', pos: 18, label: "carne", type: "noun", action: "speak", pictogramId: 2316 },
        { id: 'car-19', pos: 19, label: "asado de puerco", type: "noun", action: "speak", pictogramId: 5389 },
        { id: 'car-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Drink
        { id: 'car-21', pos: 21, label: "atún enlatado", type: "noun", action: "speak", pictogramId: 16759 },
        { id: 'car-22', pos: 22, label: "bistec", type: "noun", action: "speak", pictogramId: 35759 },
        { id: 'car-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Take
        { id: 'car-24', pos: 24, label: "carne asada", type: "noun", action: "speak", pictogramId: 2316 },
        { id: 'car-25', pos: 25, label: "carne de res", type: "noun", action: "speak", pictogramId: 2316 },
        { id: 'car-26', pos: 26, label: "algo", type: "noun", action: "speak", pictogramId: 38768 },

        // Row 4 (Variety)
        { id: 'car-27', pos: 27, label: "carne de pollo", type: "noun", action: "speak", pictogramId: 2534 },
        { id: 'car-28', pos: 28, label: "estofado", type: "noun", action: "speak", pictogramId: 5467 },
        { id: 'car-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 }, // Eat
        { id: 'car-30', pos: 30, label: "hamburguesa", type: "noun", action: "speak", pictogramId: 2419 },
        { id: 'car-31', pos: 31, label: "hot dog", type: "noun", action: "speak", pictogramId: 9016 },
        { id: 'car-32', pos: 32, label: "jamón", type: "noun", action: "speak", pictogramId: 2433 },
        { id: 'car-33', pos: 33, label: "pepperoni", type: "noun", action: "speak" },
        { id: 'car-34', pos: 34, label: "pescado", type: "noun", action: "speak", pictogramId: 2519 },
        { id: 'car-35', pos: 35, label: "pollo rostizado entero", type: "noun", action: "speak", pictogramId: 2534 },

        // Row 5 (Mix)
        { id: 'car-36', pos: 36, label: "salchicha", type: "noun", action: "speak", pictogramId: 6647 },
        { id: 'car-37', pos: 37, label: "salmón", type: "noun", action: "speak", pictogramId: 7808 },
        { id: 'car-38', pos: 38, label: "trozos de pechuga de pollo", type: "noun", action: "speak", pictogramId: 2534 },
        // Empty 39-43
        { id: 'car-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "carnes_2", pictogramId: 3220 }
    ] as GridCell[],

    'carnes_2': [
        // Row 1
        { id: 'car2-0', pos: 0, label: "pavo", type: "noun", action: "speak", pictogramId: 2509 },
        { id: 'car2-1', pos: 1, label: "salami", type: "noun", action: "speak" },
        { id: 'car2-2', pos: 2, label: "pechuga de pollo frita", type: "noun", action: "speak", pictogramId: 2720 },

        // Back
        { id: 'car2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "carnes", pictogramId: 37086 }
    ] as GridCell[],
    'guarniciones': [
        // Fila 1
        { id: 'gua-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'gua-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'gua-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'gua-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'gua-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'gua-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'gua-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'gua-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'gua-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2
        { id: 'gua-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'gua-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'gua-11', pos: 11, label: "probar", type: "verb", action: "speak" },
        { id: 'gua-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'gua-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'gua-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'gua-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'gua-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'gua-17', pos: 17, label: "ya terminé", type: "adverb", action: "speak" },

        // Fila 3
        { id: 'gua-18', pos: 18, label: "guarnición", type: "noun", action: "speak" },
        { id: 'gua-19', pos: 19, label: "aros de cebolla", type: "noun", action: "speak", pictogramId: 37600 },
        { id: 'gua-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 },
        { id: 'gua-21', pos: 21, label: "arroz", type: "noun", action: "speak", pictogramId: 6911 },
        { id: 'gua-22', pos: 22, label: "cáscaras de papa", type: "noun", action: "speak", pictogramId: 3150 },
        { id: 'gua-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 },
        { id: 'gua-24', pos: 24, label: "ensalada de col", type: "noun", action: "speak", pictogramId: 8620 },
        { id: 'gua-25', pos: 25, label: "ensalada de papas", type: "noun", action: "speak", pictogramId: 10227 },
        { id: 'gua-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Fila 4
        { id: 'gua-27', pos: 27, label: "nachos", type: "noun", action: "speak", pictogramId: 37070 },
        { id: 'gua-28', pos: 28, label: "pan", type: "noun", action: "speak", pictogramId: 2494 },
        { id: 'gua-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 },
        { id: 'gua-30', pos: 30, label: "papas doradas", type: "noun", action: "speak", pictogramId: 10227 },
        { id: 'gua-31', pos: 31, label: "papas fritas", type: "noun", action: "speak", pictogramId: 2505 },
        { id: 'gua-32', pos: 32, label: "puré de papas", type: "noun", action: "speak", pictogramId: 38007 },
        { id: 'gua-33', pos: 33, label: "yogurt natural", type: "noun", action: "speak", pictogramId: 2666 },
        { id: 'gua-34', pos: 34, label: "camote frito", type: "noun", action: "speak", pictogramId: 2428 },
        { id: 'gua-35', pos: 35, label: "rebanada de pan", type: "noun", action: "speak", pictogramId: 9059 },

        // Navegación
        { id: 'gua-44', pos: 44, label: "Más...", type: "navigation", action: "navigate", folderTarget: "guarniciones_2", pictogramId: 37162 }
    ] as GridCell[],

    'guarniciones_2': [
        // Fila 1
        { id: 'gua2-0', pos: 0, label: "dip de queso", type: "noun", action: "speak", pictogramId: 35763 },
        { id: 'gua2-1', pos: 1, label: "frijoles refritos", type: "noun", action: "speak" },
        { id: 'gua2-2', pos: 2, label: "palitos de pan", type: "noun", action: "speak", pictogramId: 38723 },
        { id: 'gua2-3', pos: 3, label: "pan blanco", type: "noun", action: "speak", pictogramId: 10150 },
        { id: 'gua2-4', pos: 4, label: "pan de maíz", type: "noun", action: "speak", pictogramId: 10150 },
        { id: 'gua2-5', pos: 5, label: "papa con crema agria", type: "noun", action: "speak", pictogramId: 3150 },
        { id: 'gua2-6', pos: 6, label: "papas alemanas", type: "noun", action: "speak", pictogramId: 10227 },
        { id: 'gua2-7', pos: 7, label: "papas fritas cuadradas", type: "noun", action: "speak", pictogramId: 29163 },
        { id: 'gua2-8', pos: 8, label: "rollos de primavera", type: "noun", action: "speak", pictogramId: 24537 },

        // Navegación
        { id: 'gua2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "guarniciones", pictogramId: 37086 }
    ] as GridCell[],

    'condimentos': [
        // Fila 1
        { id: 'con-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'con-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'con-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'con-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'con-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'con-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'con-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'con-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'con-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2
        { id: 'con-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'con-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'con-11', pos: 11, label: "probar", type: "verb", action: "speak" },
        { id: 'con-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'con-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'con-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'con-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'con-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'con-17', pos: 17, label: "ya terminé", type: "adverb", action: "speak" },

        // Fila 3
        { id: 'con-18', pos: 18, label: "aderezo ranch", type: "noun", action: "speak", pictogramId: 34359 },
        { id: 'con-19', pos: 19, label: "ketchup", type: "noun", action: "speak", pictogramId: 6540 },
        { id: 'con-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 },
        { id: 'con-21', pos: 21, label: "crema agria", type: "noun", action: "speak", pictogramId: 38748 },
        { id: 'con-22', pos: 22, label: "crema de cacahuate", type: "noun", action: "speak", pictogramId: 38748 },
        { id: 'con-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 },
        { id: 'con-24', pos: 24, label: "dip", type: "noun", action: "speak", pictogramId: 27724 },
        { id: 'con-25', pos: 25, label: "mayonesa", type: "noun", action: "speak", pictogramId: 5509 },
        { id: 'con-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Fila 4
        { id: 'con-27', pos: 27, label: "pepinillo", type: "noun", action: "speak", pictogramId: 36567 },
        { id: 'con-28', pos: 28, label: "pimienta", type: "noun", action: "speak", pictogramId: 25331 },
        { id: 'con-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 },
        { id: 'con-30', pos: 30, label: "sal", type: "noun", action: "speak", pictogramId: 25576 },
        { id: 'con-31', pos: 31, label: "salsa", type: "noun", action: "speak", pictogramId: 35735 },
        { id: 'con-32', pos: 32, label: "salsa", type: "noun", action: "speak", pictogramId: 35735 },
        { id: 'con-33', pos: 33, label: "salsa barbecue", type: "noun", action: "speak", pictogramId: 6646 },

        // Navegación
        { id: 'con-44', pos: 44, label: "Más...", type: "navigation", action: "navigate", folderTarget: "condimentos_2", pictogramId: 37162 }
    ] as GridCell[],

    'condimentos_2': [
        // Fila 1
        { id: 'con2-0', pos: 0, label: "aderezo césar", type: "noun", action: "speak", pictogramId: 24978 },
        { id: 'con2-1', pos: 1, label: "aderezo italiano", type: "noun", action: "speak", pictogramId: 38094 },
        { id: 'con2-2', pos: 2, label: "guacamole", type: "noun", action: "speak", pictogramId: 39132 },
        { id: 'con2-3', pos: 3, label: "mantequilla", type: "noun", action: "speak", pictogramId: 2461 },
        { id: 'con2-4', pos: 4, label: "mayonesa", type: "noun", action: "speak", pictogramId: 5509 },
        { id: 'con2-5', pos: 5, label: "mostaza", type: "noun", action: "speak", pictogramId: 6565 },
        { id: 'con2-6', pos: 6, label: "pepinillos", type: "noun", action: "speak", pictogramId: 2848 },
        { id: 'con2-7', pos: 7, label: "queso crema", type: "noun", action: "speak", pictogramId: 9089 },
        { id: 'con2-8', pos: 8, label: "queso parmesano", type: "noun", action: "speak", pictogramId: 35763 },

        // Fila 2
        { id: 'con2-9', pos: 9, label: "salsa de arándanos", type: "noun", action: "speak", pictogramId: 6646 },
        { id: 'con2-10', pos: 10, label: "salsa de soya", type: "noun", action: "speak", pictogramId: 6646 },
        { id: 'con2-11', pos: 11, label: "salsa inglesa", type: "noun", action: "speak", pictogramId: 38486 },
        { id: 'con2-12', pos: 12, label: "salsa marinara", type: "noun", action: "speak", pictogramId: 6646 },
        { id: 'con2-13', pos: 13, label: "salsa para pasta", type: "noun", action: "speak", pictogramId: 36430 },
        { id: 'con2-14', pos: 14, label: "salsa picante", type: "noun", action: "speak", pictogramId: 36430 },
        { id: 'con2-15', pos: 15, label: "tabasco", type: "noun", action: "speak" },
        { id: 'con2-16', pos: 16, label: "ketchup", type: "noun", action: "speak", pictogramId: 6540 },

        // Navegación
        { id: 'con2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "condimentos", pictogramId: 37086 }
    ] as GridCell[],

    'utensilios_mesa': [
        // Row 1 (Core - Fixed)
        { id: 'utm-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'utm-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'utm-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'utm-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'utm-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'utm-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'utm-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'utm-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'utm-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Fixed)
        { id: 'utm-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'utm-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'utm-11', pos: 11, label: "probar", type: "verb", action: "speak" },
        { id: 'utm-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'utm-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'utm-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'utm-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'utm-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'utm-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (High Frequency Nouns)
        { id: 'utm-18', pos: 18, label: "utensilios de mesa", type: "noun", action: "speak", pictogramId: 37356 },
        { id: 'utm-19', pos: 19, label: "cuchillo", type: "noun", action: "speak", pictogramId: 4931 },
        { id: 'utm-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Drink
        { id: 'utm-21', pos: 21, label: "tazón", type: "noun", action: "speak", pictogramId: 9091 },
        { id: 'utm-22', pos: 22, label: "plato", type: "noun", action: "speak", pictogramId: 16857 },
        { id: 'utm-23', pos: 23, label: "usar", type: "verb", action: "speak", pictogramId: 15485 }, // Use
        { id: 'utm-24', pos: 24, label: "plato hondo", type: "noun", action: "speak", pictogramId: 16857 },
        { id: 'utm-25', pos: 25, label: "vaso", type: "noun", action: "speak", pictogramId: 2610 },
        { id: 'utm-26', pos: 26, label: "cuchara", type: "noun", action: "speak", pictogramId: 2362 },

        // Row 4 (Variety)
        { id: 'utm-27', pos: 27, label: "tenedor", type: "noun", action: "speak", pictogramId: 2588 },
        { id: 'utm-28', pos: 28, label: "servilleta", type: "noun", action: "speak", pictogramId: 36303 },
        { id: 'utm-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 }, // Eat
        { id: 'utm-30', pos: 30, label: "plato base", type: "noun", action: "speak", pictogramId: 29191 },
        { id: 'utm-31', pos: 31, label: "plato de vajilla", type: "noun", action: "speak", pictogramId: 16067 },
        { id: 'utm-32', pos: 32, label: "copa", type: "noun", action: "speak", pictogramId: 2356 },
        { id: 'utm-33', pos: 33, label: "individual", type: "noun", action: "speak", pictogramId: 36855 },
        { id: 'utm-34', pos: 34, label: "taza termica", type: "noun", action: "speak", pictogramId: 32011 },
        { id: 'utm-35', pos: 35, label: "sorbete", type: "noun", action: "speak", pictogramId: 39484 },

        // Row 5
        { id: 'utm-36', pos: 36, label: "vaso con tapa", type: "noun", action: "speak", pictogramId: 4769 },
        { id: 'utm-37', pos: 37, label: "taza medidora", type: "noun", action: "speak", pictogramId: 21326 },
        { id: 'utm-38', pos: 38, label: "soporte de sorbete", type: "noun", action: "speak", pictogramId: 39485 },
        { id: 'utm-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "utensilios_mesa_2", pictogramId: 3220 }
    ] as GridCell[],

    'utensilios_mesa_2': [
        // Row 1
        { id: 'utm2-0', pos: 0, label: "bote de galletas", type: "noun", action: "speak", pictogramId: 16587 },
        { id: 'utm2-1', pos: 1, label: "caja para llevar", type: "noun", action: "speak", pictogramId: 2676 },
        { id: 'utm2-2', pos: 2, label: "cubiertos", type: "noun", action: "speak", pictogramId: 8545 },
        { id: 'utm2-3', pos: 3, label: "jarra", type: "noun", action: "speak", pictogramId: 2435 },
        { id: 'utm2-4', pos: 4, label: "tarro", type: "noun", action: "speak", pictogramId: 26384 },
        { id: 'utm2-5', pos: 5, label: "vaso desechable", type: "noun", action: "speak", pictogramId: 4769 },
        { id: 'utm2-6', pos: 6, label: "vaso entrenador", type: "noun", action: "speak", pictogramId: 4769 },
        // Back
        { id: 'utm2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "utensilios_mesa", pictogramId: 37086 }
    ] as GridCell[],
    'utensilios_cocina': [
        // Row 1 (Core - Fixed)
        { id: 'utc-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'utc-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'utc-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'utc-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'utc-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'utc-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'utc-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'utc-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'utc-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Adapted)
        { id: 'utc-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'utc-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'utc-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'utc-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'utc-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'utc-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'utc-15', pos: 15, label: "utensilios", type: "noun", action: "speak", pictogramId: 39070 },
        { id: 'utc-16', pos: 16, label: "abrelatas", type: "noun", action: "speak", pictogramId: 17342 },
        { id: 'utc-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Nouns - Alphabetical A-L)
        { id: 'utc-18', pos: 18, label: "agarrador", type: "noun", action: "speak" },
        { id: 'utc-19', pos: 19, label: "batidora eléctrica", type: "noun", action: "speak", pictogramId: 38334 },
        { id: 'utc-20', pos: 20, label: "cuchara de madera", type: "noun", action: "speak", pictogramId: 32468 },
        { id: 'utc-21', pos: 21, label: "cucharas medidoras", type: "noun", action: "speak" },
        { id: 'utc-22', pos: 22, label: "cuchara para helado", type: "noun", action: "speak", pictogramId: 2420 },
        { id: 'utc-23', pos: 23, label: "cuchillo", type: "noun", action: "speak", pictogramId: 4931 },
        { id: 'utc-24', pos: 24, label: "espátula", type: "noun", action: "speak", pictogramId: 7094 },
        { id: 'utc-25', pos: 25, label: "espátula de metal", type: "noun", action: "speak", pictogramId: 6148 },
        { id: 'utc-26', pos: 26, label: "licuadora", type: "noun", action: "speak", pictogramId: 17175 },

        // Row 4 (Nouns - Alphabetical O-T)
        { id: 'utc-27', pos: 27, label: "olla", type: "noun", action: "speak", pictogramId: 9086 },
        { id: 'utc-28', pos: 28, label: "receta", type: "noun", action: "speak", pictogramId: 7805 },
        { id: 'utc-29', pos: 29, label: "sartén", type: "noun", action: "speak", pictogramId: 2558 },
        { id: 'utc-30', pos: 30, label: "tapa", type: "noun", action: "speak", pictogramId: 10221 },
        { id: 'utc-31', pos: 31, label: "taza medidora", type: "noun", action: "speak", pictogramId: 21326 },
        { id: 'utc-32', pos: 32, label: "taza para medir líquidos", type: "noun", action: "speak", pictogramId: 2581 },
        { id: 'utc-33', pos: 33, label: "tazón", type: "noun", action: "speak", pictogramId: 9091 },
        { id: 'utc-34', pos: 34, label: "temporizador", type: "noun", action: "speak", pictogramId: 35127 },
        { id: 'utc-35', pos: 35, label: "tostador", type: "noun", action: "speak" },

        // Row 5 (Nouns & Nav)
        { id: 'utc-36', pos: 36, label: "lata", type: "noun", action: "speak", pictogramId: 6544 },
        { id: 'utc-37', pos: 37, label: "tabla de picar", type: "noun", action: "speak", pictogramId: 2577 },
        { id: 'utc-38', pos: 38, label: "secador", type: "noun", action: "speak", pictogramId: 2560 },
        { id: 'utc-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "utensilios_cocina_2", pictogramId: 3220 }
    ] as GridCell[],

    'utensilios_cocina_2': [
        // Row 1
        { id: 'utc2-0', pos: 0, label: "1 taza", type: "noun", action: "speak", pictogramId: 21326 },
        { id: 'utc2-1', pos: 1, label: "1/2 cucharada", type: "noun", action: "speak", pictogramId: 38084 },
        { id: 'utc2-2', pos: 2, label: "1/2 taza", type: "noun", action: "speak", pictogramId: 21326 },
        { id: 'utc2-3', pos: 3, label: "1/3 de taza", type: "noun", action: "speak", pictogramId: 21326 },
        { id: 'utc2-4', pos: 4, label: "1/4 de cucharada", type: "noun", action: "speak", pictogramId: 38084 },
        { id: 'utc2-5', pos: 5, label: "1/4 de taza", type: "noun", action: "speak", pictogramId: 2581 },
        { id: 'utc2-6', pos: 6, label: "1/8 de cucharada", type: "noun", action: "speak", pictogramId: 39345 },
        { id: 'utc2-7', pos: 7, label: "asador", type: "noun", action: "speak", pictogramId: 35443 },
        { id: 'utc2-8', pos: 8, label: "báscula de cocina", type: "noun", action: "speak", pictogramId: 36618 },

        // Row 2
        { id: 'utc2-9', pos: 9, label: "batidor", type: "noun", action: "speak", pictogramId: 8504 },
        { id: 'utc2-10', pos: 10, label: "bolsa Ziploc", type: "noun", action: "speak", pictogramId: 37388 },
        { id: 'utc2-11', pos: 11, label: "botella", type: "noun", action: "speak", pictogramId: 2288 },
        { id: 'utc2-12', pos: 12, label: "cacerola", type: "noun", action: "speak", pictogramId: 3231 },
        { id: 'utc2-13', pos: 13, label: "cafetera", type: "noun", action: "speak", pictogramId: 2297 },
        { id: 'utc2-14', pos: 14, label: "colador", type: "noun", action: "speak", pictogramId: 2345 },
        { id: 'utc2-15', pos: 15, label: "cortador de pizza", type: "noun", action: "speak", pictogramId: 38808 },
        { id: 'utc2-16', pos: 16, label: "cucharada", type: "noun", action: "speak", pictogramId: 8546 },
        { id: 'utc2-17', pos: 17, label: "cucharadita", type: "noun", action: "speak" },

        // Row 3
        { id: 'utc2-18', pos: 18, label: "cucharón", type: "noun", action: "speak", pictogramId: 2320 },
        { id: 'utc2-19', pos: 19, label: "hervidor", type: "noun", action: "speak", pictogramId: 39004 },
        { id: 'utc2-20', pos: 20, label: "libro de cocina", type: "noun", action: "speak", pictogramId: 9060 },
        { id: 'utc2-21', pos: 21, label: "manopla", type: "noun", action: "speak", pictogramId: 8314 },
        { id: 'utc2-22', pos: 22, label: "molde de papel", type: "noun", action: "speak", pictogramId: 10183 },
        { id: 'utc2-23', pos: 23, label: "molde para bollos", type: "noun", action: "speak", pictogramId: 15459 },
        { id: 'utc2-24', pos: 24, label: "olla eléctrica", type: "noun", action: "speak", pictogramId: 9121 },
        { id: 'utc2-25', pos: 25, label: "palote", type: "noun", action: "speak", pictogramId: 38395 },
        { id: 'utc2-26', pos: 26, label: "papel aluminio", type: "noun", action: "speak", pictogramId: 36431 },

        // Row 4
        { id: 'utc2-27', pos: 27, label: "papel film", type: "noun", action: "speak", pictogramId: 10183 },
        { id: 'utc2-28', pos: 28, label: "pelador", type: "noun", action: "speak", pictogramId: 24250 },
        { id: 'utc2-29', pos: 29, label: "procesador de alimentos", type: "noun", action: "speak", pictogramId: 39517 },
        { id: 'utc2-30', pos: 30, label: "rallador de queso", type: "noun", action: "speak", pictogramId: 9089 },
        { id: 'utc2-31', pos: 31, label: "tetera", type: "noun", action: "speak", pictogramId: 7276 },

        // Row 5
        { id: 'utc2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "utensilios_cocina", pictogramId: 37086 }
    ] as GridCell[],

    'ingredientes': [
        // Row 1 (Core - Fixed)
        { id: 'ing-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'ing-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'ing-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'ing-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'ing-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'ing-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'ing-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'ing-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'ing-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Adapted)
        { id: 'ing-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'ing-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'ing-11', pos: 11, label: "probar", type: "verb", action: "speak" },
        { id: 'ing-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'ing-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'ing-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'ing-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'ing-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'ing-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Nouns with Verbs embedded)
        { id: 'ing-18', pos: 18, label: "ingredientes", type: "noun", action: "speak", pictogramId: 24119 },
        { id: 'ing-19', pos: 19, label: "aceite vegetal", type: "noun", action: "speak", pictogramId: 7819 },
        { id: 'ing-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Beber
        { id: 'ing-21', pos: 21, label: "azúcar", type: "noun", action: "speak", pictogramId: 25560 },
        { id: 'ing-22', pos: 22, label: "azúcar glas", type: "noun", action: "speak", pictogramId: 11174 },
        { id: 'ing-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Agarrar
        { id: 'ing-24', pos: 24, label: "azúcar morena", type: "noun", action: "speak", pictogramId: 8171 },
        { id: 'ing-25', pos: 25, label: "bicarbonato", type: "noun", action: "speak" },
        { id: 'ing-26', pos: 26, label: "algo", type: "noun", action: "speak", pictogramId: 38768 },

        // Row 4
        { id: 'ing-27', pos: 27, label: "especias", type: "noun", action: "speak", pictogramId: 37094 },
        { id: 'ing-28', pos: 28, label: "glaseado", type: "noun", action: "speak", pictogramId: 38495 },
        { id: 'ing-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 }, // Ingerir
        { id: 'ing-30', pos: 30, label: "harina", type: "noun", action: "speak", pictogramId: 8600 },
        { id: 'ing-31', pos: 31, label: "huevo", type: "noun", action: "speak", pictogramId: 2427 },
        { id: 'ing-32', pos: 32, label: "mantequilla", type: "noun", action: "speak", pictogramId: 2461 },
        { id: 'ing-33', pos: 33, label: "masa", type: "noun", action: "speak", pictogramId: 32476 },
        { id: 'ing-34', pos: 34, label: "pasta", type: "noun", action: "speak", pictogramId: 8652 },
        { id: 'ing-35', pos: 35, label: "pimienta", type: "noun", action: "speak", pictogramId: 25331 },

        // Row 5
        { id: 'ing-36', pos: 36, label: "sal", type: "noun", action: "speak", pictogramId: 25576 },
        { id: 'ing-37', pos: 37, label: "polvo de hornear", type: "noun", action: "speak", pictogramId: 4878 },
        { id: 'ing-38', pos: 38, label: "preparado para pastel", type: "noun", action: "speak", pictogramId: 36655 },
        { id: 'ing-39', pos: 39, label: "vainilla", type: "noun", action: "speak", pictogramId: 28679 },
        { id: 'ing-40', pos: 40, label: "ajo", type: "noun", action: "speak", pictogramId: 2641 },
        { id: 'ing-41', pos: 41, label: "maíz morado", type: "noun", action: "speak", pictogramId: 2907 },
        { id: 'ing-42', pos: 42, label: "albahaca", type: "noun", action: "speak", pictogramId: 37722 },
        { id: 'ing-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "ingredientes_2", pictogramId: 3220 }
    ] as GridCell[],

    'ingredientes_2': [
        // Row 1
        { id: 'ing2-0', pos: 0, label: "aceite de oliva", type: "noun", action: "speak", pictogramId: 2246 },
        { id: 'ing2-1', pos: 1, label: "agua hirviendo", type: "noun", action: "speak", pictogramId: 15507 },
        { id: 'ing2-2', pos: 2, label: "azúcar con canela", type: "noun", action: "speak", pictogramId: 21486 },
        { id: 'ing2-3', pos: 3, label: "canela", type: "noun", action: "speak", pictogramId: 21486 },
        { id: 'ing2-4', pos: 4, label: "caramelo", type: "noun", action: "speak", pictogramId: 2686 },
        { id: 'ing2-5', pos: 5, label: "chile en polvo", type: "noun", action: "speak", pictogramId: 4878 },
        { id: 'ing2-6', pos: 6, label: "chiles", type: "noun", action: "speak" },
        { id: 'ing2-7', pos: 7, label: "chispas de chocolate", type: "noun", action: "speak", pictogramId: 21326 },
        { id: 'ing2-8', pos: 8, label: "chocolate de repostería", type: "noun", action: "speak", pictogramId: 21326 },

        // Row 2
        { id: 'ing2-9', pos: 9, label: "clavos de olor", type: "noun", action: "speak", pictogramId: 5569 },
        { id: 'ing2-10', pos: 10, label: "coco rallado", type: "noun", action: "speak", pictogramId: 9023 },
        { id: 'ing2-11', pos: 11, label: "colorante amarillo", type: "noun", action: "speak", pictogramId: 39388 },
        { id: 'ing2-12', pos: 12, label: "colorante azul", type: "noun", action: "speak", pictogramId: 38388 },
        { id: 'ing2-13', pos: 13, label: "colorante rojo", type: "noun", action: "speak", pictogramId: 36223 },
        { id: 'ing2-14', pos: 14, label: "colorante verde", type: "noun", action: "speak", pictogramId: 37111 },
        { id: 'ing2-15', pos: 15, label: "comino", type: "noun", action: "speak" },
        { id: 'ing2-16', pos: 16, label: "crema espesa batida", type: "noun", action: "speak", pictogramId: 38748 },
        { id: 'ing2-17', pos: 17, label: "fideos", type: "noun", action: "speak", pictogramId: 8584 },

        // Row 3
        { id: 'ing2-18', pos: 18, label: "frijoles", type: "noun", action: "speak" },
        { id: 'ing2-19', pos: 19, label: "frijoles negros", type: "noun", action: "speak" },
        { id: 'ing2-20', pos: 20, label: "jarabe de maíz", type: "noun", action: "speak", pictogramId: 25606 },
        { id: 'ing2-21', pos: 21, label: "margarina", type: "noun", action: "speak", pictogramId: 26196 },
        { id: 'ing2-22', pos: 22, label: "masa congelada para pay", type: "noun", action: "speak", pictogramId: 15347 },
        { id: 'ing2-23', pos: 23, label: "masa de pay", type: "noun", action: "speak", pictogramId: 15347 },
        { id: 'ing2-24', pos: 24, label: "masa para cruasán", type: "noun", action: "speak", pictogramId: 32476 },
        { id: 'ing2-25', pos: 25, label: "masa para galletas", type: "noun", action: "speak", pictogramId: 15347 },
        { id: 'ing2-26', pos: 26, label: "nuez moscada", type: "noun", action: "speak", pictogramId: 39640 },

        // Row 4
        { id: 'ing2-27', pos: 27, label: "orégano", type: "noun", action: "speak", pictogramId: 14244 },
        { id: 'ing2-28', pos: 28, label: "pechuga de pollo", type: "noun", action: "speak", pictogramId: 8655 },
        { id: 'ing2-29', pos: 29, label: "pimentón", type: "noun", action: "speak", pictogramId: 39639 },
        { id: 'ing2-30', pos: 30, label: "pimienta de cayena", type: "noun", action: "speak", pictogramId: 39615 },
        { id: 'ing2-31', pos: 31, label: "queso cheddar rallado", type: "noun", action: "speak", pictogramId: 39584 },
        { id: 'ing2-32', pos: 32, label: "queso mozarella", type: "noun", action: "speak", pictogramId: 35763 },
        { id: 'ing2-33', pos: 33, label: "queso parmesano", type: "noun", action: "speak", pictogramId: 35763 },
        { id: 'ing2-34', pos: 34, label: "queso rallado", type: "noun", action: "speak", pictogramId: 9023 },
        { id: 'ing2-35', pos: 35, label: "romero", type: "noun", action: "speak", pictogramId: 14246 },

        // Row 5
        { id: 'ing2-36', pos: 36, label: "salsa para espagueti", type: "noun", action: "speak", pictogramId: 6646 },
        { id: 'ing2-37', pos: 37, label: "sirope de chocolate", type: "noun", action: "speak", pictogramId: 34747 },
        { id: 'ing2-38', pos: 38, label: "tortilla de harina", type: "noun", action: "speak", pictogramId: 30401 },
        { id: 'ing2-39', pos: 39, label: "trocitos de tocino", type: "noun", action: "speak", pictogramId: 2327 },
        { id: 'ing2-40', pos: 40, label: "vinagre", type: "noun", action: "speak", pictogramId: 5605 },
        { id: 'ing2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "ingredientes", pictogramId: 37086 }
    ] as GridCell[],
    'caramelos': [
        // Row 1 (Core - Fixed)
        { id: 'crl-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'crl-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'crl-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'crl-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'crl-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'crl-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'crl-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'crl-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'crl-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Adapted)
        { id: 'crl-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'crl-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'crl-11', pos: 11, label: "probar", type: "verb", action: "speak" },
        { id: 'crl-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'crl-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'crl-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'crl-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'crl-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'crl-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Nouns with Verbs embedded)
        { id: 'crl-18', pos: 18, label: "dulces", type: "noun", action: "speak", pictogramId: 32440 },
        { id: 'crl-19', pos: 19, label: "tableta de chocolate", type: "noun", action: "speak", pictogramId: 25940 },
        { id: 'crl-20', pos: 20, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Beber
        { id: 'crl-21', pos: 21, label: "chicle", type: "noun", action: "speak", pictogramId: 8724 },
        { id: 'crl-22', pos: 22, label: "ositos de goma", type: "noun", action: "speak", pictogramId: 25610 },
        { id: 'crl-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 }, // Agarrar
        { id: 'crl-24', pos: 24, label: "gomitas", type: "noun", action: "speak", pictogramId: 7118 },
        { id: 'crl-25', pos: 25, label: "paletas de dulce", type: "noun", action: "speak", pictogramId: 7763 },
        { id: 'crl-26', pos: 26, label: "algo", type: "noun", action: "speak", pictogramId: 38768 },

        // Row 4
        { id: 'crl-27', pos: 27, label: "lunetas", type: "noun", action: "speak" },
        { id: 'crl-28', pos: 28, label: "paleta", type: "noun", action: "speak", pictogramId: 2866 },
        { id: 'crl-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 }, // Ingerir

        { id: 'crl-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "caramelos_2", pictogramId: 3220 }
    ] as GridCell[],

    'caramelos_2': [
        // Row 1
        { id: 'crl2-0', pos: 0, label: "chocolate Reese's", type: "noun", action: "speak", pictogramId: 21326 },
        { id: 'crl2-1', pos: 1, label: "kiss de Hershey", type: "noun", action: "speak" },
        { id: 'crl2-2', pos: 2, label: "regaliz negro", type: "noun", action: "speak", pictogramId: 24351 },
        { id: 'crl2-3', pos: 3, label: "regaliz rojo", type: "noun", action: "speak", pictogramId: 36223 },
        { id: 'crl2-4', pos: 4, label: "Snickers", type: "noun", action: "speak" },
        { id: 'crl2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "caramelos", pictogramId: 37086 }
    ] as GridCell[],

    'arte': [
        // Row 1 (Core - Genérico)
        { id: 'art-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'art-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'art-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'art-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'art-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'art-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'art-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'art-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'art-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Altamente Alterado)
        { id: 'art-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'art-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'art-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'art-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'art-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'art-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'art-15', pos: 15, label: "Colores", type: "folder", folderTarget: "colores", pictogramId: 7075 },
        { id: 'art-16', pos: 16, label: "Formas", type: "folder", folderTarget: "formas", pictogramId: 4651 },
        { id: 'art-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Fila 3
        { id: 'art-18', pos: 18, label: "lapicero", type: "noun", action: "speak", pictogramId: 2440 },
        { id: 'art-19', pos: 19, label: "borrador", type: "noun", action: "speak", pictogramId: 2409 },
        { id: 'art-20', pos: 20, label: "stickers", type: "noun", action: "speak" },
        { id: 'art-21', pos: 21, label: "cartulina", type: "noun", action: "speak", pictogramId: 17208 },
        { id: 'art-22', pos: 22, label: "cinta adhesiva", type: "noun", action: "speak", pictogramId: 27681 },
        { id: 'art-23', pos: 23, label: "crayola", type: "noun", action: "speak" },
        { id: 'art-24', pos: 24, label: "mandil", type: "noun", action: "speak", pictogramId: 2366 },
        { id: 'art-25', pos: 25, label: "escarcha", type: "noun", action: "speak" },
        { id: 'art-26', pos: 26, label: "engrapadora", type: "noun", action: "speak" },

        // Fila 4
        { id: 'art-27', pos: 27, label: "lápiz", type: "noun", action: "speak", pictogramId: 2440 },
        { id: 'art-28', pos: 28, label: "plumón", type: "noun", action: "speak" },
        { id: 'art-29', pos: 29, label: "papel", type: "noun", action: "speak", pictogramId: 8349 },
        { id: 'art-30', pos: 30, label: "goma", type: "noun", action: "speak", pictogramId: 2409 },
        { id: 'art-31', pos: 31, label: "goma en barra", type: "noun", action: "speak", pictogramId: 38853 },
        { id: 'art-32', pos: 32, label: "perforadora", type: "noun", action: "speak", pictogramId: 24420 },
        { id: 'art-33', pos: 33, label: "pincel", type: "noun", action: "speak", pictogramId: 2523 },
        { id: 'art-34', pos: 34, label: "témpera", type: "noun", action: "speak" },
        { id: 'art-35', pos: 35, label: "plastilina", type: "noun", action: "speak", pictogramId: 2529 },

        // Fila 5
        { id: 'art-36', pos: 36, label: "regla", type: "noun", action: "speak", pictogramId: 32490 },
        { id: 'art-37', pos: 37, label: "tijera", type: "noun", action: "speak", pictogramId: 4964 },
        { id: 'art-38', pos: 38, label: "tajador", type: "noun", action: "speak" },
        { id: 'art-39', pos: 39, label: "cartuchera", type: "noun", action: "speak" },
        { id: 'art-40', pos: 40, label: "cuaderno", type: "noun", action: "speak", pictogramId: 2359 },
        { id: 'art-41', pos: 41, label: "lápices", type: "noun", action: "speak", pictogramId: 2440 },
        { id: 'art-42', pos: 42, label: "pintura", type: "noun", action: "speak", pictogramId: 4870 },
        { id: 'art-43', pos: 43, label: "limpiatipo", type: "noun", action: "speak" },
        { id: 'art-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "arte_2", pictogramId: 3220 }
    ] as GridCell[],

    'arte_2': [
        // Fila 1
        { id: 'art2-0', pos: 0, label: "folder", type: "noun", action: "speak" },
        { id: 'art2-1', pos: 1, label: "lana", type: "noun", action: "speak", pictogramId: 2948 },
        { id: 'art2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "arte", pictogramId: 37086 }
    ] as GridCell[],

    'colores': [
        { id: 'col-0', pos: 0, label: "rojo", type: "adjective", action: "speak", pictogramId: 8159 },
        { id: 'col-1', pos: 1, label: "azul", type: "adjective", action: "speak", pictogramId: 3020 },
        { id: 'col-2', pos: 2, label: "verde", type: "adjective", action: "speak", pictogramId: 8251 },
        { id: 'col-3', pos: 3, label: "amarillo", type: "adjective", action: "speak", pictogramId: 2358 },
        { id: 'col-4', pos: 4, label: "naranja", type: "adjective", action: "speak", pictogramId: 38786 },
        { id: 'col-5', pos: 5, label: "morado", type: "adjective", action: "speak", pictogramId: 7080 },
        { id: 'col-6', pos: 6, label: "blanco", type: "adjective", action: "speak", pictogramId: 32441 },
        { id: 'col-7', pos: 7, label: "negro", type: "adjective", action: "speak", pictogramId: 32442 },
        { id: 'col-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "describir", pictogramId: 37086 }
    ] as GridCell[],

    'formas': [
        { id: 'for-0', pos: 0, label: "círculo", type: "noun", action: "speak", pictogramId: 2470 },
        { id: 'for-1', pos: 1, label: "cuadrado", type: "noun", action: "speak", pictogramId: 2471 },
        { id: 'for-2', pos: 2, label: "triángulo", type: "noun", action: "speak", pictogramId: 2472 },
        { id: 'for-3', pos: 3, label: "estrella", type: "noun", action: "speak", pictogramId: 2752 },
        { id: 'for-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "describir", pictogramId: 37086 }
    ] as GridCell[],

    'vehiculos': [
        // Row 1 (Core - Genérico)
        { id: 'veh-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'veh-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'veh-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'veh-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'veh-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'veh-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'veh-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'veh-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'veh-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Adaptado)
        { id: 'veh-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'veh-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'veh-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'veh-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'veh-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'veh-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'veh-15', pos: 15, label: "ambulancia", type: "noun", action: "speak", pictogramId: 6899 },
        { id: 'veh-16', pos: 16, label: "carro", type: "noun", action: "speak", pictogramId: 2339 },
        { id: 'veh-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Fila 3
        { id: 'veh-18', pos: 18, label: "bus", type: "noun", action: "speak", pictogramId: 27256 },
        { id: 'veh-19', pos: 19, label: "avión", type: "noun", action: "speak", pictogramId: 2264 },
        { id: 'veh-20', pos: 20, label: "barco", type: "noun", action: "speak", pictogramId: 6932 },
        { id: 'veh-21', pos: 21, label: "bicicleta", type: "noun", action: "speak", pictogramId: 6935 },
        { id: 'veh-22', pos: 22, label: "camión", type: "noun", action: "speak", pictogramId: 6956 },
        { id: 'veh-23', pos: 23, label: "camión de bomberos", type: "noun", action: "speak", pictogramId: 4925 },
        { id: 'veh-24', pos: 24, label: "movilidad", type: "noun", action: "speak", pictogramId: 26949 },
        { id: 'veh-25', pos: 25, label: "helicóptero", type: "noun", action: "speak", pictogramId: 7126 },
        { id: 'veh-26', pos: 26, label: "metro", type: "noun", action: "speak", pictogramId: 26925 },

        // Fila 4
        { id: 'veh-27', pos: 27, label: "motocicleta", type: "noun", action: "speak", pictogramId: 7166 },
        { id: 'veh-28', pos: 28, label: "nave espacial", type: "noun", action: "speak", pictogramId: 7191 },
        { id: 'veh-29', pos: 29, label: "patrulla", type: "noun", action: "speak" },
        { id: 'veh-30', pos: 30, label: "submarino", type: "noun", action: "speak", pictogramId: 3157 },
        { id: 'veh-31', pos: 31, label: "camioneta", type: "noun", action: "speak", pictogramId: 39405 },
        { id: 'veh-32', pos: 32, label: "taxi", type: "noun", action: "speak", pictogramId: 2580 },
        { id: 'veh-33', pos: 33, label: "tren", type: "noun", action: "speak", pictogramId: 21399 },
        { id: 'veh-34', pos: 34, label: "velero", type: "noun", action: "speak", pictogramId: 8714 },
        { id: 'veh-35', pos: 35, label: "vehículo", type: "noun", action: "speak", pictogramId: 34461 },

        // Fila 5
        { id: 'veh-36', pos: 36, label: "transporte", type: "noun", action: "speak", pictogramId: 10351 },
        { id: 'veh-37', pos: 37, label: "mapa", type: "noun", action: "speak", pictogramId: 5505 },
        { id: 'veh-38', pos: 38, label: "carreta", type: "noun", action: "speak" },
        { id: 'veh-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "vehiculos_2", pictogramId: 3220 }
    ] as GridCell[],

    'vehiculos_2': [
        // Row 1
        { id: 'veh2-0', pos: 0, label: "asiento de bebe", type: "noun", action: "speak", pictogramId: 14256 },
        { id: 'veh2-1', pos: 1, label: "ATV", type: "noun", action: "speak" },
        { id: 'veh2-2', pos: 2, label: "carro deportivo", type: "noun", action: "speak", pictogramId: 38029 },
        { id: 'veh2-3', pos: 3, label: "autobús escolar", type: "noun", action: "speak", pictogramId: 32370 },
        { id: 'veh2-4', pos: 4, label: "cajuela", type: "noun", action: "speak" },
        { id: 'veh2-5', pos: 5, label: "camión de basura", type: "noun", action: "speak", pictogramId: 2307 },
        { id: 'veh2-6', pos: 6, label: "camión de mudanzas", type: "noun", action: "speak", pictogramId: 38302 },
        { id: 'veh2-7', pos: 7, label: "camión de volteo", type: "noun", action: "speak", pictogramId: 38302 },
        { id: 'veh2-8', pos: 8, label: "camioneta", type: "noun", action: "speak", pictogramId: 39405 },

        // Row 2
        { id: 'veh2-9', pos: 9, label: "camioneta para discapacitados", type: "noun", action: "speak", pictogramId: 25733 },
        { id: 'veh2-10', pos: 10, label: "carreola", type: "noun", action: "speak" },
        { id: 'veh2-11', pos: 11, label: "casa rodante", type: "noun", action: "speak", pictogramId: 3180 },
        { id: 'veh2-12', pos: 12, label: "cinturón de seguridad", type: "noun", action: "speak", pictogramId: 5962 },
        { id: 'veh2-13', pos: 13, label: "claxon de auto", type: "noun", action: "speak", pictogramId: 22139 },
        { id: 'veh2-14', pos: 14, label: "crucero", type: "noun", action: "speak", pictogramId: 21573 },
        { id: 'veh2-15', pos: 15, label: "excavadora", type: "noun", action: "speak", pictogramId: 2390 },
        { id: 'veh2-16', pos: 16, label: "grúa", type: "noun", action: "speak", pictogramId: 3341 },
        { id: 'veh2-17', pos: 17, label: "jeep", type: "noun", action: "speak" },

        // Row 3
        { id: 'veh2-18', pos: 18, label: "limpiaparabrisas", type: "noun", action: "speak", pictogramId: 10331 },
        { id: 'veh2-19', pos: 19, label: "llanta", type: "noun", action: "speak", pictogramId: 19535 },
        { id: 'veh2-20', pos: 20, label: "minibús", type: "noun", action: "speak" },
        { id: 'veh2-21', pos: 21, label: "motonieve", type: "noun", action: "speak" },
        { id: 'veh2-22', pos: 22, label: "motor de auto", type: "noun", action: "speak", pictogramId: 25471 },
        { id: 'veh2-23', pos: 23, label: "puerta del auto", type: "noun", action: "speak", pictogramId: 4687 },
        { id: 'veh2-24', pos: 24, label: "quitanieves", type: "noun", action: "speak", pictogramId: 13362 },
        { id: 'veh2-25', pos: 25, label: "tanque", type: "noun", action: "speak", pictogramId: 3400 },
        { id: 'veh2-26', pos: 26, label: "tractor", type: "noun", action: "speak", pictogramId: 2600 },

        // Row 4
        { id: 'veh2-27', pos: 27, label: "transbordador", type: "noun", action: "speak", pictogramId: 9206 },
        { id: 'veh2-28', pos: 28, label: "tranvía", type: "noun", action: "speak", pictogramId: 2602 },
        { id: 'veh2-29', pos: 29, label: "triciclo", type: "noun", action: "speak", pictogramId: 2605 },
        { id: 'veh2-30', pos: 30, label: "avión", type: "noun", action: "speak", pictogramId: 2264 },

        // Row 5
        { id: 'veh2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "vehiculos", pictogramId: 37086 }
    ] as GridCell[],

    'eventos': [
        // Row 1 (Core - Temporal)
        { id: 'eve-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'eve-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'eve-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'eve-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'eve-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'eve-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'eve-6', pos: 6, label: "cuándo", type: "adverb", action: "speak", pictogramId: 32874 },
        { id: 'eve-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'eve-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Temporal Adaptado)
        { id: 'eve-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'eve-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'eve-11', pos: 11, label: "Días festivos", type: "folder", folderTarget: "dias_festivos" },
        { id: 'eve-12', pos: 12, label: "día festivo", type: "noun", action: "speak" },
        { id: 'eve-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'eve-14', pos: 14, label: "desde", type: "preposition", action: "speak", pictogramId: 7077 },
        { id: 'eve-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'eve-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'eve-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Nouns and Adverbs)
        { id: 'eve-18', pos: 18, label: "día libre", type: "noun", action: "speak", pictogramId: 39207 },
        { id: 'eve-19', pos: 19, label: "excursión", type: "noun", action: "speak", pictogramId: 6532 },
        { id: 'eve-20', pos: 20, label: "fiesta", type: "noun", action: "speak", pictogramId: 16649 },
        { id: 'eve-21', pos: 21, label: "obra", type: "noun", action: "speak", pictogramId: 19537 },
        { id: 'eve-22', pos: 22, label: "película", type: "noun", action: "speak", pictogramId: 34320 },
        { id: 'eve-23', pos: 23, label: "piyamada", type: "noun", action: "speak" },
        { id: 'eve-24', pos: 24, label: "hasta", type: "preposition", action: "speak", pictogramId: 7771 },
        { id: 'eve-25', pos: 25, label: "después", type: "adverb", action: "speak", pictogramId: 32749 },
        { id: 'eve-26', pos: 26, label: "pronto", type: "adverb", action: "speak", pictogramId: 5306 },

        // Row 4
        { id: 'eve-27', pos: 27, label: "programa de televisión", type: "noun", action: "speak", pictogramId: 36530 },
        { id: 'eve-28', pos: 28, label: "sorpresa", type: "noun", action: "speak", pictogramId: 8517 },
        { id: 'eve-29', pos: 29, label: "tarjeta de cumpleaños", type: "noun", action: "speak", pictogramId: 28111 },
        { id: 'eve-30', pos: 30, label: "vacaciones", type: "noun", action: "speak", pictogramId: 39447 },
        { id: 'eve-31', pos: 31, label: "viaje", type: "noun", action: "speak", pictogramId: 32508 },
        { id: 'eve-32', pos: 32, label: "cumpleaños", type: "noun", action: "speak", pictogramId: 37363 },
        { id: 'eve-33', pos: 33, label: "ya", type: "adverb", action: "speak", pictogramId: 25736 },
        { id: 'eve-34', pos: 34, label: "siempre", type: "adverb", action: "speak", pictogramId: 17322 },
        { id: 'eve-35', pos: 35, label: "nunca", type: "adverb", action: "speak", pictogramId: 5527 },

        // Row 5
        { id: 'eve-36', pos: 36, label: "tarjeta de felicitación", type: "noun", action: "speak", pictogramId: 28115 },
        { id: 'eve-37', pos: 37, label: "olimpiadas", type: "noun", action: "speak", pictogramId: 5064 },
        { id: 'eve-38', pos: 38, label: "semana de vacaciones", type: "noun", action: "speak", pictogramId: 39112 },
        { id: 'eve-39', pos: 39, label: "independencia", type: "noun", action: "speak", pictogramId: 11484 },
        { id: 'eve-40', pos: 40, label: "feriado nacional", type: "noun", action: "speak", pictogramId: 5987 },
        { id: 'eve-41', pos: 41, label: "canción criolla", type: "noun", action: "speak", pictogramId: 24795 },
        { id: 'eve-43', pos: 43, label: "otro", type: "noun", action: "speak", pictogramId: 17054 },
        { id: 'eve-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "eventos_2", pictogramId: 3220 }
    ] as GridCell[],

    'eventos_2': [
        // Row 1
        { id: 'eve2-0', pos: 0, label: "aniversario", type: "noun", action: "speak", pictogramId: 37363 },
        { id: 'eve2-1', pos: 1, label: "Bar Mitzvah", type: "noun", action: "speak", pictogramId: 36119 },
        { id: 'eve2-2', pos: 2, label: "barbacoa", type: "noun", action: "speak", pictogramId: 5393 },
        { id: 'eve2-3', pos: 3, label: "Bat Mitzvá", type: "noun", action: "speak", pictogramId: 36121 },
        { id: 'eve2-4', pos: 4, label: "bautizo", type: "noun", action: "speak", pictogramId: 3064 },
        { id: 'eve2-5', pos: 5, label: "boda", type: "noun", action: "speak", pictogramId: 37362 },
        { id: 'eve2-6', pos: 6, label: "celebración", type: "noun", action: "speak", pictogramId: 6969 },
        { id: 'eve2-7', pos: 7, label: "cita", type: "noun", action: "speak", pictogramId: 16165 },
        { id: 'eve2-8', pos: 8, label: "comunión", type: "noun", action: "speak", pictogramId: 3084 },

        // Row 2
        { id: 'eve2-9', pos: 9, label: "concierto", type: "noun", action: "speak", pictogramId: 11586 },
        { id: 'eve2-10', pos: 10, label: "concurso de belleza", type: "noun", action: "speak", pictogramId: 37313 },
        { id: 'eve2-11', pos: 11, label: "confirmación", type: "noun", action: "speak" },
        { id: 'eve2-12', pos: 12, label: "desfile", type: "noun", action: "speak", pictogramId: 36663 },
        { id: 'eve2-13', pos: 13, label: "día de elecciones", type: "noun", action: "speak", pictogramId: 39233 },
        { id: 'eve2-14', pos: 14, label: "elección", type: "noun", action: "speak", pictogramId: 14670 },
        { id: 'eve2-15', pos: 15, label: "espectáculo", type: "noun", action: "speak", pictogramId: 35149 },
        { id: 'eve2-16', pos: 16, label: "festival", type: "noun", action: "speak", pictogramId: 25103 },
        { id: 'eve2-17', pos: 17, label: "graduación", type: "noun", action: "speak", pictogramId: 38043 },

        // Row 3
        { id: 'eve2-18', pos: 18, label: "santo", type: "noun", action: "speak", pictogramId: 24392 },

        // Row 5
        { id: 'eve2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "eventos", pictogramId: 37086 }
    ] as GridCell[],

    'dias_festivos': [
        // Row 1 (Core - Temporal)
        { id: 'dfes-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'dfes-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'dfes-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'dfes-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'dfes-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'dfes-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'dfes-6', pos: 6, label: "cuándo", type: "adverb", action: "speak", pictogramId: 32874 },
        { id: 'dfes-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'dfes-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core - Temporal Adaptado)
        { id: 'dfes-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'dfes-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'dfes-11', pos: 11, label: "Cosas festivas", type: "folder", folderTarget: "festivas" },
        { id: 'dfes-12', pos: 12, label: "día festivo", type: "noun", action: "speak" },
        { id: 'dfes-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'dfes-14', pos: 14, label: "desde", type: "preposition", action: "speak", pictogramId: 7077 },
        { id: 'dfes-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'dfes-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'dfes-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Nouns and Adverbs)
        { id: 'dfes-18', pos: 18, label: "Navidad", type: "noun", action: "speak", pictogramId: 3134 },
        { id: 'dfes-19', pos: 19, label: "Halloween", type: "noun", action: "speak", pictogramId: 6951 },
        { id: 'dfes-20', pos: 20, label: "Canción criolla", type: "noun", action: "speak", pictogramId: 24795 },
        { id: 'dfes-21', pos: 21, label: "Año Nuevo", type: "noun", action: "speak", pictogramId: 5071 },
        { id: 'dfes-22', pos: 22, label: "San Valentín", type: "noun", action: "speak", pictogramId: 19541 },
        { id: 'dfes-23', pos: 23, label: "Semana Santa", type: "noun", action: "speak", pictogramId: 25441 },
        { id: 'dfes-24', pos: 24, label: "hasta", type: "preposition", action: "speak", pictogramId: 7771 },
        { id: 'dfes-25', pos: 25, label: "después", type: "adverb", action: "speak", pictogramId: 32749 },
        { id: 'dfes-26', pos: 26, label: "pronto", type: "adverb", action: "speak", pictogramId: 5306 },

        // Row 4
        { id: 'dfes-27', pos: 27, label: "Día del padre", type: "noun", action: "speak", pictogramId: 3093 },
        { id: 'dfes-28', pos: 28, label: "Día de la madre", type: "noun", action: "speak", pictogramId: 3091 },
        { id: 'dfes-29', pos: 29, label: "día libre", type: "noun", action: "speak", pictogramId: 39207 },
        { id: 'dfes-30', pos: 30, label: "día del campesino", type: "noun", action: "speak", pictogramId: 2982 },
        { id: 'dfes-31', pos: 31, label: "día del maestro", type: "noun", action: "speak", pictogramId: 36267 },
        { id: 'dfes-32', pos: 32, label: "Fiestas Patrias", type: "noun", action: "speak", pictogramId: 2417 },
        { id: 'dfes-33', pos: 33, label: "ya", type: "adverb", action: "speak", pictogramId: 25736 },
        { id: 'dfes-34', pos: 34, label: "siempre", type: "adverb", action: "speak", pictogramId: 17322 },
        { id: 'dfes-35', pos: 35, label: "nunca", type: "adverb", action: "speak", pictogramId: 5527 },

        // Row 5
        { id: 'dfes-36', pos: 36, label: "Señor de los milagros", type: "noun", action: "speak", pictogramId: 4744 },
        { id: 'dfes-37', pos: 37, label: "independencia", type: "noun", action: "speak", pictogramId: 11484 },
        { id: 'dfes-38', pos: 38, label: "Santa Rosa de Lima", type: "noun", action: "speak", pictogramId: 38049 },
        { id: 'dfes-43', pos: 43, label: "otro", type: "noun", action: "speak", pictogramId: 17054 },
        { id: 'dfes-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "dias_festivos_2", pictogramId: 3220 }
    ] as GridCell[],

    'dias_festivos_2': [
        // Row 1
        { id: 'dfes2-0', pos: 0, label: "domingo de Pascua", type: "noun", action: "speak", pictogramId: 37453 },
        { id: 'dfes2-1', pos: 1, label: "martes de carnaval", type: "noun", action: "speak", pictogramId: 6557 },
        { id: 'dfes2-2', pos: 2, label: "Adviento", type: "noun", action: "speak", pictogramId: 37174 },
        { id: 'dfes2-3', pos: 3, label: "día de Anzac", type: "noun", action: "speak" },
        { id: 'dfes2-4', pos: 4, label: "día de los inocentes", type: "noun", action: "speak", pictogramId: 27152 },
        { id: 'dfes2-5', pos: 5, label: "miércoles de ceniza", type: "noun", action: "speak", pictogramId: 6563 },
        { id: 'dfes2-6', pos: 6, label: "día de San Esteban", type: "noun", action: "speak", pictogramId: 5565 },
        { id: 'dfes2-7', pos: 7, label: "día Acción de Gracias canadi...", type: "noun", action: "speak", pictogramId: 8128 },
        { id: 'dfes2-8', pos: 8, label: "Nochebuena", type: "noun", action: "speak", pictogramId: 8260 },

        // Row 2
        { id: 'dfes2-9', pos: 9, label: "Cinco de Mayo", type: "noun", action: "speak", pictogramId: 6559 },
        { id: 'dfes2-10', pos: 10, label: "día de la Raza", type: "noun", action: "speak" },
        { id: 'dfes2-11', pos: 11, label: "día del planeta Tierra", type: "noun", action: "speak", pictogramId: 3160 },
        { id: 'dfes2-12', pos: 12, label: "Viernes Santo", type: "noun", action: "speak", pictogramId: 32950 },
        { id: 'dfes2-13', pos: 13, label: "día de la marmota", type: "noun", action: "speak", pictogramId: 39794 },
        { id: 'dfes2-14', pos: 14, label: "Altos Días Santos", type: "noun", action: "speak", pictogramId: 27152 },
        { id: 'dfes2-15', pos: 15, label: "Semana Santa", type: "noun", action: "speak", pictogramId: 25441 }, // Eucharisty icon
        { id: 'dfes2-16', pos: 16, label: "día del trabajo", type: "noun", action: "speak", pictogramId: 39393 },
        { id: 'dfes2-17', pos: 17, label: "Cuaresma", type: "noun", action: "speak", pictogramId: 14550 },

        // Row 3
        { id: 'dfes2-18', pos: 18, label: "Santa Lucía", type: "noun", action: "speak", pictogramId: 3153 },
        { id: 'dfes2-19', pos: 19, label: "Mardi Gras", type: "noun", action: "speak" },
        { id: 'dfes2-20', pos: 20, label: "día de los caídos", type: "noun", action: "speak" },
        { id: 'dfes2-21', pos: 21, label: "día del patriota", type: "noun", action: "speak" },
        { id: 'dfes2-22', pos: 22, label: "día del presidente", type: "noun", action: "speak", pictogramId: 16377 },
        { id: 'dfes2-23', pos: 23, label: "Simjat Torá", type: "noun", action: "speak", pictogramId: 24463 },
        { id: 'dfes2-24', pos: 24, label: "día de San Patricio", type: "noun", action: "speak", pictogramId: 5565 },
        { id: 'dfes2-25', pos: 25, label: "Sucot", type: "noun", action: "speak", pictogramId: 37848 },
        { id: 'dfes2-26', pos: 26, label: "día de los veteranos", type: "noun", action: "speak" },

        // Row 4
        { id: 'dfes2-27', pos: 27, label: "día de la Reina Victoria", type: "noun", action: "speak", pictogramId: 19531 },
        { id: 'dfes2-28', pos: 28, label: "día de Canadá", type: "noun", action: "speak", pictogramId: 8057 },
        { id: 'dfes2-29', pos: 29, label: "año nuevo chino", type: "noun", action: "speak", pictogramId: 37584 },
        { id: 'dfes2-30', pos: 30, label: "Pascua", type: "noun", action: "speak", pictogramId: 37453 },
        { id: 'dfes2-31', pos: 31, label: "Día de la Bandera", type: "noun", action: "speak", pictogramId: 36981 },

        // Row 5
        { id: 'dfes2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "dias_festivos", pictogramId: 37086 }
    ] as GridCell[],

    'computadora': [
        // Row 1 (Core Fijo)
        { id: 'comp-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'comp-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'comp-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'comp-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'comp-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'comp-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'comp-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'comp-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'comp-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core Adaptado - Verbos de Juego)
        { id: 'comp-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'comp-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'comp-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'comp-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'comp-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'comp-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'comp-15', pos: 15, label: "jugar", type: "verb", action: "speak", pictogramId: 23392 },
        { id: 'comp-16', pos: 16, label: "clic", type: "verb", action: "speak", pictogramId: 9860 },
        { id: 'comp-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Verbos Temáticos Digitales y Hardware)
        { id: 'comp-18', pos: 18, label: "chatear", type: "verb", action: "speak", pictogramId: 8537 },
        { id: 'comp-19', pos: 19, label: "enviar", type: "verb", action: "speak", pictogramId: 21828 },
        { id: 'comp-20', pos: 20, label: "teclear", type: "verb", action: "speak", pictogramId: 21851 },
        { id: 'comp-21', pos: 21, label: "conectar", type: "verb", action: "speak", pictogramId: 23967 },
        { id: 'comp-22', pos: 22, label: "desconectar", type: "verb", action: "speak", pictogramId: 27518 },
        { id: 'comp-23', pos: 23, label: "computadora", type: "noun", action: "speak", pictogramId: 7190 },
        { id: 'comp-24', pos: 24, label: "archivo", type: "noun", action: "speak", pictogramId: 16078 },
        { id: 'comp-25', pos: 25, label: "cable", type: "noun", action: "speak", pictogramId: 6948 },
        { id: 'comp-26', pos: 26, label: "contraseña", type: "noun", action: "speak", pictogramId: 27691 },

        // Row 4 (Entornos y Software)
        { id: 'comp-27', pos: 27, label: "Facebook", type: "noun", action: "speak" },
        { id: 'comp-28', pos: 28, label: "Google", type: "noun", action: "speak" },
        { id: 'comp-29', pos: 29, label: "impresora", type: "noun", action: "speak", pictogramId: 26138 },
        { id: 'comp-30', pos: 30, label: "inalámbrico", type: "noun", action: "speak", pictogramId: 15923 },
        { id: 'comp-31', pos: 31, label: "Internet", type: "noun", action: "speak", pictogramId: 37366 },
        { id: 'comp-32', pos: 32, label: "juego de computadora", type: "noun", action: "speak", pictogramId: 36431 },
        { id: 'comp-33', pos: 33, label: "mouse", type: "noun", action: "speak" },
        { id: 'comp-34', pos: 34, label: "nombre de usuario", type: "noun", action: "speak", pictogramId: 27353 },
        { id: 'comp-35', pos: 35, label: "sitio web", type: "noun", action: "speak", pictogramId: 38380 },

        // Row 5 (Periféricos y Plataformas Adicionales)
        { id: 'comp-36', pos: 36, label: "Skype", type: "noun", action: "speak" },
        { id: 'comp-37', pos: 37, label: "teclado", type: "noun", action: "speak", pictogramId: 2793 },
        { id: 'comp-38', pos: 38, label: "Twitter", type: "noun", action: "speak" },
        { id: 'comp-39', pos: 39, label: "voceros", type: "noun", action: "speak" }, // Altavoces
        { id: 'comp-40', pos: 40, label: "YouTube", type: "noun", action: "speak" },
        { id: 'comp-41', pos: 41, label: "ABC", type: "noun", action: "speak" },
        { id: 'comp-42', pos: 42, label: "cámara web", type: "noun", action: "speak", pictogramId: 2680 },
        { id: 'comp-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "computadora_2", pictogramId: 3220 }
    ] as GridCell[],

    'computadora_2': [
        // Row 1
        { id: 'comp2-0', pos: 0, label: "descargar", type: "verb", action: "speak", pictogramId: 27397 },
        { id: 'comp2-1', pos: 1, label: "tweetear", type: "verb", action: "speak" },
        { id: 'comp2-2', pos: 2, label: "aplicación", type: "noun", action: "speak" },
        { id: 'comp2-3', pos: 3, label: "unidad de disco", type: "noun", action: "speak", pictogramId: 38295 },
        { id: 'comp2-4', pos: 4, label: "iTunes", type: "noun", action: "speak" },
        { id: 'comp2-5', pos: 5, label: "computadora portátil", type: "noun", action: "speak", pictogramId: 7190 },
        { id: 'comp2-6', pos: 6, label: "almohadilla", type: "noun", action: "speak", pictogramId: 5095 },
        { id: 'comp2-7', pos: 7, label: "programa", type: "noun", action: "speak", pictogramId: 8229 },
        { id: 'comp2-8', pos: 8, label: "escáner", type: "noun", action: "speak", pictogramId: 9153 },

        // Row 2
        { id: 'comp2-9', pos: 9, label: "supresor de tensión", type: "noun", action: "speak", pictogramId: 37172 },
        { id: 'comp2-10', pos: 10, label: "pizarrón blanco", type: "noun", action: "speak", pictogramId: 37872 },
        { id: 'comp2-11', pos: 11, label: "Windows", type: "noun", action: "speak" },
        { id: 'comp2-12', pos: 12, label: "carpeta", type: "noun", action: "speak", pictogramId: 3233 },

        // Row 5
        { id: 'comp2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "computadora", pictogramId: 37086 }
    ] as GridCell[],

    'electronica': [
        // Row 1 (Core Genérico Activo)
        { id: 'elec-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'elec-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'elec-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'elec-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'elec-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'elec-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'elec-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'elec-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'elec-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core Adaptado Electromecánico)
        { id: 'elec-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'elec-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'elec-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'elec-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'elec-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'elec-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'elec-15', pos: 15, label: "conectar", type: "verb", action: "speak", pictogramId: 23967 },
        { id: 'elec-16', pos: 16, label: "desconectar", type: "verb", action: "speak", pictogramId: 27518 },
        { id: 'elec-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3
        { id: 'elec-18', pos: 18, label: "audífonos", type: "noun", action: "speak", pictogramId: 5912 },
        { id: 'elec-19', pos: 19, label: "batería", type: "noun", action: "speak", pictogramId: 5923 },
        { id: 'elec-20', pos: 20, label: "cámara", type: "noun", action: "speak", pictogramId: 24925 },
        { id: 'elec-21', pos: 21, label: "computadora", type: "noun", action: "speak", pictogramId: 7190 },
        { id: 'elec-22', pos: 22, label: "control de videojuego", type: "noun", action: "speak", pictogramId: 21945 },
        { id: 'elec-23', pos: 23, label: "Game Boy", type: "noun", action: "speak", pictogramId: 2283 },
        { id: 'elec-24', pos: 24, label: "Nintendo DS", type: "noun", action: "speak" },
        { id: 'elec-25', pos: 25, label: "Nintendo Wii", type: "noun", action: "speak" },
        { id: 'elec-26', pos: 26, label: "PlayStation", type: "noun", action: "speak" },

        // Row 4
        { id: 'elec-27', pos: 27, label: "radio", type: "noun", action: "speak", pictogramId: 26358 },
        { id: 'elec-28', pos: 28, label: "control remoto", type: "noun", action: "speak", pictogramId: 22141 },
        { id: 'elec-29', pos: 29, label: "reproductor de CD", type: "noun", action: "speak", pictogramId: 24509 },
        { id: 'elec-30', pos: 30, label: "reproductor de DVD", type: "noun", action: "speak", pictogramId: 24509 },
        { id: 'elec-31', pos: 31, label: "reproductor de MP3", type: "noun", action: "speak", pictogramId: 24509 },
        { id: 'elec-32', pos: 32, label: "SMS", type: "noun", action: "speak" },
        { id: 'elec-33', pos: 33, label: "tableta", type: "noun", action: "speak", pictogramId: 28099 },
        { id: 'elec-34', pos: 34, label: "teléfono celular", type: "noun", action: "speak", pictogramId: 3258 },
        { id: 'elec-35', pos: 35, label: "teléfono", type: "noun", action: "speak", pictogramId: 26479 },

        // Row 5
        { id: 'elec-36', pos: 36, label: "televisor", type: "noun", action: "speak", pictogramId: 25498 },
        { id: 'elec-37', pos: 37, label: "Proloquo2Go", type: "noun", action: "speak" }, // Considerar app icon handler especial en el futuro
        { id: 'elec-38', pos: 38, label: "mi turno", type: "phrase", action: "speak", pictogramId: 7158 }, // Or noun if phrasing is standard
        { id: 'elec-39', pos: 39, label: "tu turno", type: "phrase", action: "speak", pictogramId: 34713 }, // Or noun if phrasing is standard
        { id: 'elec-40', pos: 40, label: "Mario", type: "noun", action: "speak", pictogramId: 2258 },
        { id: 'elec-41', pos: 41, label: "celular", type: "noun", action: "speak", pictogramId: 2586 },
        { id: 'elec-42', pos: 42, label: "batería recargable", type: "noun", action: "speak", pictogramId: 23819 },
        { id: 'elec-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "electronica_2", pictogramId: 3220 }
    ] as GridCell[],

    'electronica_2': [
        // Row 1
        { id: 'elec2-0', pos: 0, label: "aplicación", type: "noun", action: "speak" },
        { id: 'elec2-1', pos: 1, label: "cable", type: "noun", action: "speak", pictogramId: 6948 },
        { id: 'elec2-2', pos: 2, label: "computadora portátil", type: "noun", action: "speak", pictogramId: 7190 },
        { id: 'elec2-3', pos: 3, label: "control de Nintendo Wii", type: "noun", action: "speak", pictogramId: 22141 },
        { id: 'elec2-4', pos: 4, label: "eLibro", type: "noun", action: "speak" },
        { id: 'elec2-5', pos: 5, label: "estuche de tableta", type: "noun", action: "speak", pictogramId: 38419 },
        { id: 'elec2-6', pos: 6, label: "inalámbrico", type: "noun", action: "speak", pictogramId: 15923 },
        { id: 'elec2-7', pos: 7, label: "lápiz óptico", type: "noun", action: "speak", pictogramId: 15491 },
        { id: 'elec2-8', pos: 8, label: "linterna", type: "noun", action: "speak", pictogramId: 6138 },

        // Row 2
        { id: 'elec2-9', pos: 9, label: "máquina", type: "noun", action: "speak", pictogramId: 25652 },
        { id: 'elec2-10', pos: 10, label: "máquina de pinball", type: "noun", action: "speak", pictogramId: 2926 },
        { id: 'elec2-11', pos: 11, label: "pila AA", type: "noun", action: "speak", pictogramId: 8320 },
        { id: 'elec2-12', pos: 12, label: "pila AAA", type: "noun", action: "speak", pictogramId: 8320 },
        { id: 'elec2-13', pos: 13, label: "pila C", type: "noun", action: "speak", pictogramId: 8320 },
        { id: 'elec2-14', pos: 14, label: "pila D", type: "noun", action: "speak", pictogramId: 8320 },
        { id: 'elec2-15', pos: 15, label: "pila de 9 voltios", type: "noun", action: "speak", pictogramId: 8320 },
        { id: 'elec2-16', pos: 16, label: "pila de botón", type: "noun", action: "speak", pictogramId: 24282 },
        { id: 'elec2-17', pos: 17, label: "redes sociales", type: "noun", action: "speak", pictogramId: 9823 },

        // Row 3
        { id: 'elec2-18', pos: 18, label: "reproductor de mp3", type: "noun", action: "speak", pictogramId: 24509 },
        { id: 'elec2-19', pos: 19, label: "toma de corriente", type: "noun", action: "speak", pictogramId: 36973 },
        { id: 'elec2-20', pos: 20, label: "videocámara", type: "noun", action: "speak", pictogramId: 25524 },
        { id: 'elec2-21', pos: 21, label: "voceros", type: "noun", action: "speak" },
        { id: 'elec2-22', pos: 22, label: "YouTube", type: "noun", action: "speak" },

        // Row 5
        { id: 'elec2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "electronica", pictogramId: 37086 }
    ] as GridCell[],

    'naturaleza': [
        // Row 1 (Core Fijo)
        { id: 'nat-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'nat-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'nat-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'nat-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'nat-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'nat-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'nat-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'nat-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'nat-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core Adaptado Físico)
        { id: 'nat-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'nat-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'nat-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'nat-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'nat-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'nat-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'nat-15', pos: 15, label: "árbol", type: "noun", action: "speak", pictogramId: 3057 },
        { id: 'nat-16', pos: 16, label: "arbusto", type: "noun", action: "speak", pictogramId: 30241 },
        { id: 'nat-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3
        { id: 'nat-18', pos: 18, label: "bosque", type: "noun", action: "speak", pictogramId: 2666 },
        { id: 'nat-19', pos: 19, label: "cielo", type: "noun", action: "speak", pictogramId: 6978 },
        { id: 'nat-20', pos: 20, label: "colina", type: "noun", action: "speak", pictogramId: 38728 },
        { id: 'nat-21', pos: 21, label: "desierto", type: "noun", action: "speak", pictogramId: 2734 },
        { id: 'nat-22', pos: 22, label: "espacio", type: "noun", action: "speak", pictogramId: 25074 },
        { id: 'nat-23', pos: 23, label: "flor", type: "noun", action: "speak", pictogramId: 7104 },
        { id: 'nat-24', pos: 24, label: "hoja", type: "noun", action: "speak", pictogramId: 5077 },
        { id: 'nat-25', pos: 25, label: "jardín", type: "noun", action: "speak", pictogramId: 2434 },
        { id: 'nat-26', pos: 26, label: "lago", type: "noun", action: "speak", pictogramId: 6022 },

        // Row 4
        { id: 'nat-27', pos: 27, label: "montaña", type: "noun", action: "speak", pictogramId: 2909 },
        { id: 'nat-28', pos: 28, label: "océano", type: "noun", action: "speak", pictogramId: 2925 },
        { id: 'nat-29', pos: 29, label: "pasto", type: "noun", action: "speak", pictogramId: 3113 },
        { id: 'nat-30', pos: 30, label: "planta", type: "noun", action: "speak", pictogramId: 3143 },
        { id: 'nat-31', pos: 31, label: "playa", type: "noun", action: "speak", pictogramId: 30518 },
        { id: 'nat-32', pos: 32, label: "río", type: "noun", action: "speak", pictogramId: 2811 },
        { id: 'nat-33', pos: 33, label: "roca", type: "noun", action: "speak", pictogramId: 6594 },
        { id: 'nat-34', pos: 34, label: "selva", type: "noun", action: "speak", pictogramId: 3385 },
        { id: 'nat-35', pos: 35, label: "suelo", type: "noun", action: "speak", pictogramId: 2575 },

        // Row 5
        { id: 'nat-36', pos: 36, label: "tiempo", type: "noun", action: "speak", pictogramId: 7223 }, // Meteorológico
        { id: 'nat-37', pos: 37, label: "sol", type: "noun", action: "speak", pictogramId: 7252 },
        { id: 'nat-38', pos: 38, label: "playa", type: "noun", action: "speak", pictogramId: 30518 }, // Variante de arte
        { id: 'nat-39', pos: 39, label: "flor", type: "noun", action: "speak", pictogramId: 7104 }, // Variante de arte
        { id: 'nat-40', pos: 40, label: "copo de nieve", type: "noun", action: "speak", pictogramId: 38027 },
        { id: 'nat-41', pos: 41, label: "girasol", type: "noun", action: "speak", pictogramId: 11274 },
        { id: 'nat-42', pos: 42, label: "nubarrón", type: "noun", action: "speak" },
        { id: 'nat-43', pos: 43, label: "diamante", type: "noun", action: "speak", pictogramId: 6475 },
        { id: 'nat-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "naturaleza_2", pictogramId: 3220 }
    ] as GridCell[],

    'naturaleza_2': [
        // Row 1
        { id: 'nat2-0', pos: 0, label: "agua", type: "noun", action: "speak", pictogramId: 32464 },
        { id: 'nat2-1', pos: 1, label: "amanecer", type: "noun", action: "speak", pictogramId: 3175 },
        { id: 'nat2-2', pos: 2, label: "arena", type: "noun", action: "speak", pictogramId: 4565 },
        { id: 'nat2-3', pos: 3, label: "atardecer", type: "noun", action: "speak", pictogramId: 3176 },
        { id: 'nat2-4', pos: 4, label: "bosque tropical", type: "noun", action: "speak", pictogramId: 25869 },
        { id: 'nat2-5', pos: 5, label: "cactus", type: "noun", action: "speak", pictogramId: 3070 },
        { id: 'nat2-6', pos: 6, label: "camino", type: "noun", action: "speak", pictogramId: 6955 },
        { id: 'nat2-7', pos: 7, label: "capullo", type: "noun", action: "speak", pictogramId: 11202 },
        { id: 'nat2-8', pos: 8, label: "cascada", type: "noun", action: "speak", pictogramId: 5951 },

        // Row 2
        { id: 'nat2-9', pos: 9, label: "cueva", type: "noun", action: "speak", pictogramId: 2729 },
        { id: 'nat2-10', pos: 10, label: "estanque", type: "noun", action: "speak", pictogramId: 39264 },
        { id: 'nat2-11', pos: 11, label: "hielo", type: "noun", action: "speak", pictogramId: 7128 },
        { id: 'nat2-12', pos: 12, label: "hoyo", type: "noun", action: "speak" },
        { id: 'nat2-13', pos: 13, label: "huerta", type: "noun", action: "speak", pictogramId: 2974 },
        { id: 'nat2-14', pos: 14, label: "lodo", type: "noun", action: "speak", pictogramId: 34310 },
        { id: 'nat2-15', pos: 15, label: "maleza", type: "noun", action: "speak" },
        { id: 'nat2-16', pos: 16, label: "margarita", type: "noun", action: "speak", pictogramId: 3127 },
        { id: 'nat2-17', pos: 17, label: "narciso", type: "noun", action: "speak", pictogramId: 28567 },

        // Row 3
        { id: 'nat2-18', pos: 18, label: "ola", type: "noun", action: "speak", pictogramId: 4706 },
        { id: 'nat2-19', pos: 19, label: "palmera", type: "noun", action: "speak", pictogramId: 3138 },
        { id: 'nat2-20', pos: 20, label: "pantano", type: "noun", action: "speak", pictogramId: 26049 },
        { id: 'nat2-21', pos: 21, label: "Parque Nacional", type: "noun", action: "speak", pictogramId: 32718 },
        { id: 'nat2-22', pos: 22, label: "pino", type: "noun", action: "speak", pictogramId: 3216 },
        { id: 'nat2-23', pos: 23, label: "polen", type: "noun", action: "speak", pictogramId: 37153 },
        { id: 'nat2-24', pos: 24, label: "rosa", type: "noun", action: "speak", pictogramId: 3151 },
        { id: 'nat2-25', pos: 25, label: "terremoto", type: "noun", action: "speak", pictogramId: 4755 },
        { id: 'nat2-26', pos: 26, label: "terreno", type: "noun", action: "speak" },

        // Row 4
        { id: 'nat2-27', pos: 27, label: "tienda de campaña", type: "noun", action: "speak", pictogramId: 4756 },
        { id: 'nat2-28', pos: 28, label: "tierra", type: "noun", action: "speak", pictogramId: 3160 },
        { id: 'nat2-29', pos: 29, label: "volcán", type: "noun", action: "speak", pictogramId: 6247 },
        { id: 'nat2-30', pos: 30, label: "tulipán", type: "noun", action: "speak", pictogramId: 3163 },

        // Row 5 residual items from Naturaleza Fila 5 (from picture 4 logic)
        { id: 'nat2-36', pos: 36, label: "palo", type: "noun", action: "speak", pictogramId: 11322 },
        { id: 'nat2-37', pos: 37, label: "fuego", type: "noun", action: "speak", pictogramId: 4654 },
        { id: 'nat2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "naturaleza", pictogramId: 37086 }
    ] as GridCell[],

    'palabritas': [
        { id: 'pal-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root", pictogramId: 37086 }
    ] as GridCell[],

    'tiempo': [
        { id: 'ti-0', pos: 0, label: "ahora", type: "adverb", action: "speak", pictogramId: 32301 },
        { id: 'ti-1', pos: 1, label: "hoy", type: "adverb", action: "speak", pictogramId: 10468 },
        { id: 'ti-2', pos: 2, label: "mañana", type: "adverb", action: "speak", pictogramId: 11520 },
        { id: 'ti-3', pos: 3, label: "ayer", type: "adverb", action: "speak", pictogramId: 11521 },
        { id: 'ti-4', pos: 4, label: "cuándo", type: "adverb", action: "speak", pictogramId: 22621 },
        { id: 'ti-5', pos: 5, label: "día", type: "noun", action: "speak", pictogramId: 31057 },
        { id: 'ti-6', pos: 6, label: "noche", type: "noun", action: "speak", pictogramId: 31060 },
        { id: 'ti-7', pos: 7, label: "tarde", type: "noun", action: "speak", pictogramId: 31059 },
        { id: 'ti-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        { id: 'ti-9', pos: 9, label: "lunes", type: "noun", action: "speak", pictogramId: 38245 },
        { id: 'ti-10', pos: 10, label: "martes", type: "noun", action: "speak", pictogramId: 38246 },
        { id: 'ti-11', pos: 11, label: "miércoles", type: "noun", action: "speak", pictogramId: 38247 },
        { id: 'ti-12', pos: 12, label: "jueves", type: "noun", action: "speak", pictogramId: 38248 },
        { id: 'ti-13', pos: 13, label: "viernes", type: "noun", action: "speak", pictogramId: 38249 },
        { id: 'ti-14', pos: 14, label: "sábado", type: "noun", action: "speak", pictogramId: 38250 },
        { id: 'ti-15', pos: 15, label: "domingo", type: "noun", action: "speak", pictogramId: 38251 },

        { id: 'ti-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root", pictogramId: 37086 }
    ] as GridCell[],

    'lugares': [
        // Fila 1 (Core)
        { id: 'lug-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'lug-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'lug-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'lug-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'lug-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'lug-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'lug-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'lug-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'lug-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2 (Specific Verbs + Folders)
        { id: 'lug-9',  pos: 9,  label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'lug-10', pos: 10, label: "ir", type: "verb", action: "speak", pictogramId: 8142 },
        { id: 'lug-11', pos: 11, label: "venir", type: "verb", action: "speak", pictogramId: 32669 },
        { id: 'lug-12', pos: 12, label: "buscar", type: "verb", action: "speak", pictogramId: 32662 },
        { id: 'lug-13', pos: 13, label: "Casa", type: "folder", action: "navigate", folderTarget: "hogar", pictogramId: 2299 },
        { id: 'lug-14', pos: 14, label: "Escuela", type: "folder", action: "navigate", folderTarget: "escolares", pictogramId: 2317 },
        { id: 'lug-15', pos: 15, label: "Supermercado", type: "folder", action: "navigate", folderTarget: "supermercado", pictogramId: 3116 },
        { id: 'lug-16', pos: 16, label: "Edificios", type: "folder", action: "navigate", folderTarget: "edificios", pictogramId: 29145 },
        { id: 'lug-17', pos: 17, label: "Naturaleza", type: "folder", action: "navigate", folderTarget: "naturaleza", pictogramId: 31140 },

        // Fila 3 (Places from catalog)
        { id: 'lug-18', pos: 18, label: "hospital", type: "noun", action: "speak", pictogramId: 3082 },
        { id: 'lug-19', pos: 19, label: "parque", type: "noun", action: "speak", pictogramId: 2859 },
        { id: 'lug-20', pos: 20, label: "iglesia", type: "noun", action: "speak", pictogramId: 9116 },
        { id: 'lug-21', pos: 21, label: "restaurante", type: "noun", action: "speak", pictogramId: 3389 },
        { id: 'lug-22', pos: 22, label: "ciudad", type: "noun", action: "speak", pictogramId: 2341 },
        { id: 'lug-23', pos: 23, label: "playa", type: "noun", action: "speak", pictogramId: 32234 },
        { id: 'lug-24', pos: 24, label: "montaña", type: "noun", action: "speak", pictogramId: 6211 },
        { id: 'lug-25', pos: 25, label: "jardín", type: "noun", action: "speak", pictogramId: 2434 },
        { id: 'lug-26', pos: 26, label: "biblioteca", type: "noun", action: "speak", pictogramId: 10283 },

        // Fila 4
        { id: 'lug-27', pos: 27, label: "gimnasio", type: "noun", action: "speak", pictogramId: 2826 },
        { id: 'lug-28', pos: 28, label: "trabajo", type: "noun", action: "speak", pictogramId: 3142 },
        { id: 'lug-29', pos: 29, label: "cine", type: "noun", action: "speak", pictogramId: 31154 },
        { id: 'lug-30', pos: 30, label: "museo", type: "noun", action: "speak", pictogramId: 31157 },

        { id: 'lug-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root", pictogramId: 37086 }
    ] as GridCell[],

    'acciones': [
        // Fila 1 (Core)
        { id: 'acc-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'acc-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'acc-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'acc-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'acc-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'acc-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'acc-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'acc-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'acc-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2 (Actions 1)
        { id: 'acc-9',  pos: 9,  label: "comer", type: "verb", action: "speak", pictogramId: 2432 },
        { id: 'acc-10', pos: 10, label: "beber", type: "verb", action: "speak", pictogramId: 11708 },
        { id: 'acc-11', pos: 11, label: "caminar", type: "verb", action: "speak", pictogramId: 7271 },
        { id: 'acc-12', pos: 12, label: "correr", type: "verb", action: "speak", pictogramId: 5465 },
        { id: 'acc-13', pos: 13, label: "jugar", type: "verb", action: "speak", pictogramId: 5581 },
        { id: 'acc-14', pos: 14, label: "dormir", type: "verb", action: "speak", pictogramId: 11749 },
        { id: 'acc-15', pos: 15, label: "ayudar", type: "verb", action: "speak", pictogramId: 2474 },
        { id: 'acc-16', pos: 16, label: "mirar", type: "verb", action: "speak", pictogramId: 2439 },
        { id: 'acc-17', pos: 17, label: "escuchar", type: "verb", action: "speak", pictogramId: 2599 },

        // Fila 3 (Actions 2)
        { id: 'acc-18', pos: 18, label: "hablar", type: "verb", action: "speak", pictogramId: 2387 },
        { id: 'acc-19', pos: 19, label: "leer", type: "verb", action: "speak", pictogramId: 6457 },
        { id: 'acc-20', pos: 20, label: "escribir", type: "verb", action: "speak", pictogramId: 8109 },
        { id: 'acc-21', pos: 21, label: "cantar", type: "verb", action: "speak", pictogramId: 7195 },
        { id: 'acc-22', pos: 22, label: "bailar", type: "verb", action: "speak", pictogramId: 4570 },
        { id: 'acc-23', pos: 23, label: "nadar", type: "verb", action: "speak", pictogramId: 6946 },
        { id: 'acc-24', pos: 24, label: "saltar", type: "verb", action: "speak", pictogramId: 6469 },
        { id: 'acc-25', pos: 25, label: "abrir", type: "verb", action: "speak", pictogramId: 6634 },
        { id: 'acc-26', pos: 26, label: "cerrar", type: "verb", action: "speak", pictogramId: 24976 },

        // Fila 4 (Hubs)
        { id: 'acc-27', pos: 27, label: "Deportes", type: "folder", action: "navigate", folderTarget: "deportes_cosas", pictogramId: 7010 },

        { id: 'acc-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root", pictogramId: 37086 }
    ] as GridCell[],

    'describir': [
        // Fila 1 (Core)
        { id: 'desc-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'desc-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'desc-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'desc-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'desc-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'desc-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'desc-6', pos: 6, label: "cómo", type: "adverb", action: "speak", pictogramId: 5440 },
        { id: 'desc-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'desc-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2 (Folders)
        { id: 'desc-9',  pos: 9,  label: "Colores", type: "folder", action: "navigate", folderTarget: "colores", pictogramId: 2808 },
        { id: 'desc-10', pos: 10, label: "Formas", type: "folder", action: "navigate", folderTarget: "formas", pictogramId: 26038 },

        { id: 'desc-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root", pictogramId: 37086 }
    ] as GridCell[],

    'estados': [
        // Fila 1 (Core)
        { id: 'est-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'est-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'est-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'est-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'est-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'est-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'est-6', pos: 6, label: "cómo", type: "adverb", action: "speak", pictogramId: 5440 },
        { id: 'est-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'est-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2 (Feelings 1)
        { id: 'est-9',  pos: 9,  label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'est-10', pos: 10, label: "sentir", type: "verb", action: "speak", pictogramId: 35545 },
        { id: 'est-11', pos: 11, label: "feliz", type: "adjective", action: "speak", pictogramId: 2606 },
        { id: 'est-12', pos: 12, label: "triste", type: "adjective", action: "speak", pictogramId: 2374 },
        { id: 'est-13', pos: 13, label: "enojado", type: "adjective", action: "speak", pictogramId: 10261 },
        { id: 'est-14', pos: 14, label: "asustado", type: "adjective", action: "speak", pictogramId: 35565 },
        { id: 'est-15', pos: 15, label: "bien", type: "adjective", action: "speak", pictogramId: 2314 },
        { id: 'est-16', pos: 16, label: "mal", type: "adjective", action: "speak", pictogramId: 2245 },
        { id: 'est-17', pos: 17, label: "emocionado", type: "adjective", action: "speak", pictogramId: 30391 },

        // Fila 3 (Feelings 2)
        { id: 'est-18', pos: 18, label: "sorprendido", type: "adjective", action: "speak", pictogramId: 3245 },
        { id: 'est-19', pos: 19, label: "aburrido", type: "adjective", action: "speak", pictogramId: 3239 },
        { id: 'est-20', pos: 20, label: "nervioso", type: "adjective", action: "speak", pictogramId: 13354 },
        { id: 'est-21', pos: 21, label: "tranquilo", type: "adjective", action: "speak", pictogramId: 11178 },
        { id: 'est-22', pos: 22, label: "amor", type: "noun", action: "speak", pictogramId: 2418 },
        { id: 'est-23', pos: 23, label: "miedo", type: "noun", action: "speak", pictogramId: 38936 },

        { id: 'est-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root", pictogramId: 37086 }
    ] as GridCell[],

    'conversacion': [
        // Fila 1 (Greetings)
        { id: 'conv-0', pos: 0, label: "hola", type: "phrase", action: "speak", pictogramId: 34567 },
        { id: 'conv-1', pos: 1, label: "adiós", type: "phrase", action: "speak", pictogramId: 34568 },
        { id: 'conv-2', pos: 2, label: "buenos días", type: "phrase", action: "speak", pictogramId: 6009 },
        { id: 'conv-3', pos: 3, label: "buenas tardes", type: "phrase", action: "speak", pictogramId: 5896 },
        { id: 'conv-4', pos: 4, label: "buenas noches", type: "phrase", action: "speak", pictogramId: 6944 },
        { id: 'conv-5', pos: 5, label: "hasta luego", type: "phrase", action: "speak", pictogramId: 6943 },
        { id: 'conv-6', pos: 6, label: "cómo estás?", type: "phrase", action: "speak", pictogramId: 6945 },
        { id: 'conv-7', pos: 7, label: "estoy bien", type: "phrase", action: "speak", pictogramId: 2314 },
        { id: 'conv-8', pos: 8, label: "gracias", type: "phrase", action: "speak", pictogramId: 8194 },

        // Fila 2 (Manners)
        { id: 'conv-9',  pos: 9,  label: "por favor", type: "phrase", action: "speak", pictogramId: 6942 },
        { id: 'conv-10', pos: 10, label: "de nada", type: "phrase", action: "speak", pictogramId: 8128 },
        { id: 'conv-11', pos: 11, label: "perdón", type: "phrase", action: "speak", pictogramId: 6936 },
        { id: 'conv-12', pos: 12, label: "sí", type: "phrase", action: "speak", pictogramId: 4576 },
        { id: 'conv-13', pos: 13, label: "no", type: "phrase", action: "speak", pictogramId: 4550 },
        { id: 'conv-14', pos: 14, label: "me gusta", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'conv-15', pos: 15, label: "no me gusta", type: "verb", action: "speak", pictogramId: 5526 },

        { id: 'conv-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root", pictogramId: 37086 }
    ] as GridCell[],

    'ayuda': [
        // Fila 1 (Core)
        { id: 'ayu-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'ayu-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'ayu-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'ayu-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'ayu-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'ayu-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'ayu-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'ayu-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'ayu-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2 (Verbs + Key Needs)
        { id: 'ayu-9',  pos: 9,  label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'ayu-10', pos: 10, label: "ayuda", type: "verb", action: "speak", pictogramId: 39122 },
        { id: 'ayu-11', pos: 11, label: "necesitar", type: "verb", action: "speak", pictogramId: 5596 },
        { id: 'ayu-12', pos: 12, label: "por favor", type: "phrase", action: "speak", pictogramId: 6942 },
        { id: 'ayu-13', pos: 13, label: "Gracias", type: "phrase", action: "speak", pictogramId: 8194 },
        { id: 'ayu-14', pos: 14, label: "baño", type: "noun", action: "speak", pictogramId: 15905 },
        { id: 'ayu-15', pos: 15, label: "agua", type: "noun", action: "speak", pictogramId: 2370 },
        { id: 'ayu-16', pos: 16, label: "hambre", type: "noun", action: "speak", pictogramId: 2349 },
        { id: 'ayu-17', pos: 17, label: "sed", type: "noun", action: "speak", pictogramId: 2276 },

        // Fila 3 (More Needs)
        { id: 'ayu-18', pos: 18, label: "dolor", type: "noun", action: "speak", pictogramId: 2369 },
        { id: 'ayu-19', pos: 19, label: "cansado", type: "adjective", action: "speak", pictogramId: 19524 },
        { id: 'ayu-20', pos: 20, label: "calor", type: "noun", action: "speak", pictogramId: 2367 },
        { id: 'ayu-21', pos: 21, label: "frío", type: "noun", action: "speak", pictogramId: 8163 },
        { id: 'ayu-22', pos: 22, label: "descansar", type: "verb", action: "speak", pictogramId: 3299 },
        { id: 'ayu-23', pos: 23, label: "dormir", type: "verb", action: "speak", pictogramId: 2863 },
        { id: 'ayu-24', pos: 24, label: "medicina", type: "noun", action: "speak", pictogramId: 35559 },

        { id: 'ayu-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root", pictogramId: 37086 }
    ] as GridCell[],

    'preguntas': [
        // Fila 1
        { id: 'pre-0', pos: 0, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'pre-1', pos: 1, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'pre-2', pos: 2, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'pre-3', pos: 3, label: "cuándo", type: "adverb", action: "speak", pictogramId: 22621 },
        { id: 'pre-4', pos: 4, label: "por qué", type: "adverb", action: "speak", pictogramId: 32442 },
        { id: 'pre-5', pos: 5, label: "cómo", type: "adverb", action: "speak", pictogramId: 5440 },
        { id: 'pre-6', pos: 6, label: "cuál", type: "adverb", action: "speak", pictogramId: 26022 },
        { id: 'pre-7', pos: 7, label: "cuánto", type: "adverb", action: "speak", pictogramId: 31742 },

        { id: 'pre-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root", pictogramId: 37086 }
    ] as GridCell[],

    'pistas': [
        { id: 'pis-0', pos: 0, label: "mirar", type: "verb", action: "speak", pictogramId: 2439 },
        { id: 'pis-1', pos: 1, label: "escuchar", type: "verb", action: "speak", pictogramId: 2599 },
        { id: 'pis-2', pos: 2, label: "pensar", type: "verb", action: "speak", pictogramId: 26310 },
        { id: 'pis-3', pos: 3, label: "esperar", type: "verb", action: "speak", pictogramId: 3147 },
        { id: 'pis-4', pos: 4, label: "ayuda", type: "noun", action: "speak", pictogramId: 12252 },
        { id: 'pis-5', pos: 5, label: "silencio", type: "adjective", action: "speak", pictogramId: 5526 },
        { id: 'pis-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root_2", pictogramId: 37086 }
    ] as GridCell[],
    'donde_cat': [
        { id: 'dcat-0', pos: 0, label: "aquí", type: "adverb", action: "speak", pictogramId: 2299 },
        { id: 'dcat-1', pos: 1, label: "allí", type: "adverb", action: "speak", pictogramId: 2341 },
        { id: 'dcat-2', pos: 2, label: "arriba", type: "adverb", action: "speak", pictogramId: 32051 },
        { id: 'dcat-3', pos: 3, label: "abajo", type: "adverb", action: "speak", pictogramId: 32052 },
        { id: 'dcat-4', pos: 4, label: "adentro", type: "adverb", action: "speak", pictogramId: 7034 },
        { id: 'dcat-5', pos: 5, label: "afuera", type: "adverb", action: "speak", pictogramId: 7194 },
        { id: 'dcat-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root_2", pictogramId: 37086 }
    ] as GridCell[],
    'cual_cat': [
        { id: 'ccat-0', pos: 0, label: "este", type: "pronoun", action: "speak", pictogramId: 7095 },
        { id: 'ccat-1', pos: 1, label: "ese", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'ccat-2', pos: 2, label: "aquel", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'ccat-3', pos: 3, label: "otro", type: "pronoun", action: "speak", pictogramId: 17054 },
        { id: 'ccat-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root_2", pictogramId: 37086 }
    ] as GridCell[],
    'conjunciones': [
        { id: 'conj-0', pos: 0, label: "y", type: "preposition", action: "speak", pictogramId: 7064 },
        { id: 'conj-1', pos: 1, label: "o", type: "preposition", action: "speak", pictogramId: 7064 },
        { id: 'conj-2', pos: 2, label: "pero", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'conj-3', pos: 3, label: "porque", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'conj-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root_2", pictogramId: 37086 }
    ] as GridCell[],
    'numeros': [
        // Fila 1
        { id: 'num-0', pos: 0, label: "0", type: "folder", action: "speak", pictogramId: 2626 },
        { id: 'num-1', pos: 1, label: "1", type: "folder", action: "speak", pictogramId: 2627 },
        { id: 'num-2', pos: 2, label: "2", type: "folder", action: "speak", pictogramId: 2628 },
        { id: 'num-3', pos: 3, label: "3", type: "folder", action: "speak", pictogramId: 2629 },
        { id: 'num-4', pos: 4, label: "4", type: "folder", action: "speak", pictogramId: 2630 },
        { id: 'num-5', pos: 5, label: "5", type: "folder", action: "speak", pictogramId: 2631 },
        { id: 'num-6', pos: 6, label: "6", type: "folder", action: "speak", pictogramId: 2632 },
        { id: 'num-7', pos: 7, label: "7", type: "folder", action: "speak", pictogramId: 2633 },
        { id: 'num-8', pos: 8, label: "8", type: "folder", action: "speak", pictogramId: 2634 },

        // Fila 2
        { id: 'num-9', pos: 9, label: "9", type: "verb", action: "speak", pictogramId: 2635 }, // rosa
        { id: 'num-10', pos: 10, label: "espacio", type: "phrase", action: "speak", pictogramId: 25074 },
        { id: 'num-11', pos: 11, label: "Puntuación", type: "folder", action: "navigate", folderTarget: "puntuacion" }, // blanco

        // Navegación
        { id: 'num-43', pos: 43, label: "Puntuación", type: "folder", action: "navigate", folderTarget: "puntuacion", pictogramId: 10174 },
        { id: 'num-44', pos: 44, label: "Más...", type: "navigation", action: "navigate", folderTarget: "numeros_2", pictogramId: 37162 }
    ] as GridCell[],

    'puntuacion': [
        { id: 'pun-0', pos: 0, label: ".", type: "adverb", action: "speak" },
        { id: 'pun-1', pos: 1, label: ",", type: "adverb", action: "speak" },
        { id: 'pun-2', pos: 2, label: "?", type: "adverb", action: "speak" },
        { id: 'pun-3', pos: 3, label: "!", type: "adverb", action: "speak" },
        { id: 'pun-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "numeros", pictogramId: 37086 }
    ] as GridCell[],

    'ropa_de_cama': [{ id: 'rdc-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "hogar", pictogramId: 37086 }] as GridCell[],

    'harry_potter': [{ id: 'hp-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "actividades_de_ejemplo", pictogramId: 37086 }] as GridCell[],

    'a_comer': [{ id: 'ac-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "actividades_de_ejemplo", pictogramId: 37086 }] as GridCell[],

    'hoy_escuela': [{ id: 'he-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "actividades_de_ejemplo", pictogramId: 37086 }] as GridCell[],

    'numeros_2': [
        ...Array.from({ length: 90 }, (_, i) => ({
            id: `num2-${i}`,
            pos: i,
            label: (i + 10).toString(),
            type: "phrase",
            action: "speak"
        }))
    ] as GridCell[],
    'escuela': [{ id: 'escu-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root_2", pictogramId: 37086 }] as GridCell[],
    'religion': [
        { id: 'rel-0', pos: 0, label: "iglesia", type: "noun", action: "speak", pictogramId: 9116 },
        { id: 'rel-1', pos: 1, label: "orar", type: "verb", action: "speak", pictogramId: 30850 },
        { id: 'rel-2', pos: 2, label: "biblia", type: "noun", action: "speak", pictogramId: 18115 },
        { id: 'rel-3', pos: 3, label: "sacerdote", type: "noun", action: "speak", pictogramId: 24392 },
        { id: 'rel-4', pos: 4, label: "Dios", type: "noun", action: "speak", pictogramId: 3210 },
        { id: 'rel-5', pos: 5, label: "Días festivos", type: "folder", action: "navigate", folderTarget: "dias_festivos", pictogramId: 8128 },
        { id: 'rel-6', pos: 6, label: "Navidad", type: "folder", action: "navigate", folderTarget: "festivas", pictogramId: 3134 },
        { id: 'rel-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root_2", pictogramId: 37086 }
    ] as GridCell[],
    'actividades': [{ id: 'acti-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root_2", pictogramId: 37086 }] as GridCell[],
    'casa_cosas': [{ id: 'casa-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root_2", pictogramId: 37086 }] as GridCell[],
    'mes_caa': [{ id: 'mes-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root_2", pictogramId: 37086 }] as GridCell[],

    // Sub-folders of Personas
    'quien_es': [
        { id: 'qes-0', pos: 0, label: "amigo", type: "noun", action: "speak", pictogramId: 2458 },
        { id: 'qes-1', pos: 1, label: "vecino", type: "noun", action: "speak", pictogramId: 34560 },
        { id: 'qes-2', pos: 2, label: "extraño", type: "noun", action: "speak", pictogramId: 37367 },
        { id: 'qes-3', pos: 3, label: "visitante", type: "noun", action: "speak", pictogramId: 27126 },
        { id: 'qes-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "personas", pictogramId: 37086 }
    ] as GridCell[],
    'maestros': [
        { id: 'mae-0', pos: 0, label: "maestra", type: "noun", action: "speak", pictogramId: 4703 },
        { id: 'mae-1', pos: 1, label: "profesor", type: "noun", action: "speak", pictogramId: 2960 },
        { id: 'mae-2', pos: 2, label: "director", type: "noun", action: "speak", pictogramId: 4631 },
        { id: 'mae-3', pos: 3, label: "secretaria", type: "noun", action: "speak", pictogramId: 4742 },
        { id: 'mae-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "personas", pictogramId: 37086 }
    ] as GridCell[],
    'terapeutas': [
        { id: 'tera-0', pos: 0, label: "fisioterapeuta", type: "noun", action: "speak", pictogramId: 26094 },
        { id: 'tera-1', pos: 1, label: "logopeda", type: "noun", action: "speak", pictogramId: 2454 },
        { id: 'tera-2', pos: 2, label: "psicólogo", type: "noun", action: "speak", pictogramId: 3377 },
        { id: 'tera-3', pos: 3, label: "terapeuta ocupacional", type: "noun", action: "speak", pictogramId: 16082 },
        { id: 'tera-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "personas", pictogramId: 37086 }
    ] as GridCell[],
    'quien_eres': [
        { id: 'qer-0', pos: 0, label: "mi nombre es", type: "phrase", action: "speak", pictogramId: 34560 },
        { id: 'qer-1', pos: 1, label: "yo soy", type: "phrase", action: "speak", pictogramId: 6632 },
        { id: 'qer-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "personas", pictogramId: 37086 }
    ] as GridCell[],
    'noticias': [
        { id: 'noti-0', pos: 0, label: "Noticias del día", type: "folder", action: "navigate", folderTarget: "noticias_cat", pictogramId: 7784 },
        { id: 'noti-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "personas", pictogramId: 37086 }
    ] as GridCell[],
    'pronombres': [
        { id: 'pron-0', pos: 0, label: "nosotros", type: "pronoun", action: "speak", pictogramId: 2392 },
        { id: 'pron-1', pos: 1, label: "ellos", type: "pronoun", action: "speak", pictogramId: 7796 },
        { id: 'pron-2', pos: 2, label: "ustedes", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'pron-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "personas", pictogramId: 37086 }
    ] as GridCell[],

    // Sub-folders of Cosas_2
    'adaptivo': [
        // Row 1 (Core Fijo)
        { id: 'ada-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'ada-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'ada-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'ada-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'ada-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'ada-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'ada-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'ada-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'ada-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core Adaptado Físico y Terapéutico)
        { id: 'ada-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'ada-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'ada-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'ada-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'ada-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'ada-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'ada-15', pos: 15, label: "andadera", type: "noun", action: "speak" },
        { id: 'ada-16', pos: 16, label: "audífono", type: "noun", action: "speak", pictogramId: 5912 },
        { id: 'ada-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3 (Asistencia Motriz y Visual)
        { id: 'ada-18', pos: 18, label: "bandeja de regazo", type: "noun", action: "speak", pictogramId: 32510 },
        { id: 'ada-19', pos: 19, label: "bipedestador", type: "noun", action: "speak", pictogramId: 11192 },
        { id: 'ada-20', pos: 20, label: "bota de soporte", type: "noun", action: "speak", pictogramId: 36502 },
        { id: 'ada-21', pos: 21, label: "carpeta de comunicación", type: "noun", action: "speak", pictogramId: 16182 },
        { id: 'ada-22', pos: 22, label: "dispositivo de comunicación", type: "noun", action: "speak", pictogramId: 37193 },
        { id: 'ada-23', pos: 23, label: "interruptor", type: "noun", action: "speak", pictogramId: 2431 },
        { id: 'ada-24', pos: 24, label: "lentes", type: "noun", action: "speak", pictogramId: 3329 },
        { id: 'ada-25', pos: 25, label: "pantalla táctil", type: "noun", action: "speak", pictogramId: 9160 },
        { id: 'ada-26', pos: 26, label: "programa con dibujos", type: "noun", action: "speak", pictogramId: 10369 },

        // Row 4 (Movilidad y CAA puro)
        { id: 'ada-27', pos: 27, label: "Proloquo2Go", type: "noun", action: "speak" },
        { id: 'ada-28', pos: 28, label: "silla de ruedas", type: "noun", action: "speak", pictogramId: 25471 },
        { id: 'ada-29', pos: 29, label: "silla de ruedas motorizada", type: "noun", action: "speak", pictogramId: 25471 },
        { id: 'ada-30', pos: 30, label: "tablilla", type: "noun", action: "speak" },
        { id: 'ada-31', pos: 31, label: "trackball", type: "noun", action: "speak", pictogramId: 36470 },
        { id: 'ada-32', pos: 32, label: "moto", type: "noun", action: "speak", pictogramId: 7166 },
        { id: 'ada-33', pos: 33, label: "Tubo Chewy", type: "noun", action: "speak", pictogramId: 9186 },

        // Row 5
        { id: 'ada-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "adaptivo_2", pictogramId: 3220 }
    ] as GridCell[],

    'adaptivo_2': [
        // Dummy target pending physical screenshot, ensures navigation integrity
        { id: 'ada2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "adaptivo", pictogramId: 37086 }
    ] as GridCell[],
    'electrodomesticos': [{ id: 'elec2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cosas_2", pictogramId: 37086 }] as GridCell[],
    'limpieza': [
        { id: 'lim-43', pos: 43, label: "Más", type: "navigation", action: "navigate", folderTarget: "limpieza_2", pictogramId: 3220 },
        { id: 'lim-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cosas_2", pictogramId: 37086 }
    ] as GridCell[],

    'limpieza_2': [
        // Fila 1
        { id: 'lim2-0', pos: 0, label: "blanqueador", type: "noun", action: "speak" },
        { id: 'lim2-1', pos: 1, label: "canasta de ropa sucia", type: "noun", action: "speak", pictogramId: 39768 },
        { id: 'lim2-2', pos: 2, label: "cubeta", type: "noun", action: "speak" },
        { id: 'lim2-3', pos: 3, label: "destapacaños", type: "noun", action: "speak" },
        { id: 'lim2-4', pos: 4, label: "detergente", type: "noun", action: "speak", pictogramId: 7021 },
        { id: 'lim2-5', pos: 5, label: "espray", type: "noun", action: "speak", pictogramId: 26571 },
        { id: 'lim2-6', pos: 6, label: "estropajo", type: "noun", action: "speak", pictogramId: 7098 },
        { id: 'lim2-7', pos: 7, label: "fregadero", type: "noun", action: "speak", pictogramId: 2399 },
        { id: 'lim2-8', pos: 8, label: "mancha", type: "noun", action: "speak", pictogramId: 7151 },

        // Fila 2
        { id: 'lim2-9', pos: 9, label: "recogedor", type: "noun", action: "speak", pictogramId: 2818 },
        { id: 'lim2-10', pos: 10, label: "tabla de planchar", type: "noun", action: "speak", pictogramId: 2577 },

        // Navegación
        { id: 'lim2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "limpieza", pictogramId: 37086 }
    ] as GridCell[],

    'dvds': [
        // Fila 1
        { id: 'dvd-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'dvd-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'dvd-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'dvd-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'dvd-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'dvd-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'dvd-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'dvd-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'dvd-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2
        { id: 'dvd-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'dvd-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'dvd-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'dvd-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'dvd-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'dvd-14', pos: 14, label: "pausar", type: "verb", action: "speak", pictogramId: 38213 },
        { id: 'dvd-15', pos: 15, label: "retroceder", type: "verb", action: "speak", pictogramId: 39494 },
        { id: 'dvd-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'dvd-17', pos: 17, label: "ya terminé", type: "adverb", action: "speak" },

        // Fila 3
        { id: 'dvd-18', pos: 18, label: "avanzar", type: "verb", action: "speak", pictogramId: 21395 },
        { id: 'dvd-19', pos: 19, label: "esto", type: "pronoun", action: "speak", pictogramId: 7095 },
        { id: 'dvd-20', pos: 20, label: "detener", type: "verb", action: "speak", pictogramId: 7196 },
        { id: 'dvd-21', pos: 21, label: "expulsar", type: "verb", action: "speak", pictogramId: 8997 },
        { id: 'dvd-22', pos: 22, label: "DVD", type: "noun", action: "speak", pictogramId: 9152 },
        { id: 'dvd-23', pos: 23, label: "remoto", type: "noun", action: "speak" },
        { id: 'dvd-24', pos: 24, label: "videocinta", type: "noun", action: "speak" },
        { id: 'dvd-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'dvd-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Navegación
        { id: 'dvd-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cosas_2", pictogramId: 37086 }
    ] as GridCell[],

    'juegos_mesa': [
        // Fila 1
        { id: 'jue-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'jue-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'jue-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'jue-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'jue-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'jue-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'jue-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'jue-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'jue-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2
        { id: 'jue-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'jue-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'jue-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'jue-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'jue-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'jue-14', pos: 14, label: "acorazado", type: "noun", action: "speak" },
        { id: 'jue-15', pos: 15, label: "ajedrez", type: "noun", action: "speak", pictogramId: 3054 },
        { id: 'jue-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'jue-17', pos: 17, label: "ya terminé", type: "adverb", action: "speak" },

        // Fila 3
        { id: 'jue-18', pos: 18, label: "crucigrama", type: "noun", action: "speak", pictogramId: 5698 },
        { id: 'jue-19', pos: 19, label: "esto", type: "pronoun", action: "speak", pictogramId: 7095 },
        { id: 'jue-20', pos: 20, label: "damas", type: "noun", action: "speak", pictogramId: 3192 },
        { id: 'jue-21', pos: 21, label: "damas chinas", type: "noun", action: "speak", pictogramId: 3192 },
        { id: 'jue-22', pos: 22, label: "hockey de aire", type: "noun", action: "speak", pictogramId: 5080 },
        { id: 'jue-23', pos: 23, label: "juegos de mesa", type: "noun", action: "speak", pictogramId: 9810 },
        { id: 'jue-24', pos: 24, label: "laberinto", type: "noun", action: "speak", pictogramId: 29626 },
        { id: 'jue-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'jue-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Fila 4
        { id: 'jue-27', pos: 27, label: "Monopoly", type: "noun", action: "speak" },
        { id: 'jue-28', pos: 28, label: "serpientes y escaleras", type: "noun", action: "speak", pictogramId: 2795 },
        { id: 'jue-29', pos: 29, label: "Sorry", type: "noun", action: "speak" },
        { id: 'jue-30', pos: 30, label: "Sudoku", type: "noun", action: "speak" },
        { id: 'jue-31', pos: 31, label: "Uno", type: "noun", action: "speak", pictogramId: 2627 },
        { id: 'jue-32', pos: 32, label: "¿Adivina quién?", type: "noun", action: "speak", pictogramId: 32743 },
        { id: 'jue-33', pos: 33, label: "Jenga", type: "noun", action: "speak" },
        { id: 'jue-34', pos: 34, label: "tu turno", type: "phrase", action: "speak", pictogramId: 34713 },
        { id: 'jue-35', pos: 35, label: "mi turno", type: "phrase", action: "speak", pictogramId: 7158 },

        // Fila 5
        { id: 'jue-36', pos: 36, label: "dominó", type: "noun", action: "speak", pictogramId: 3095 },
        { id: 'jue-37', pos: 37, label: "Bingo", type: "noun", action: "speak", pictogramId: 11191 },
        { id: 'jue-38', pos: 38, label: "ludo", type: "noun", action: "speak", pictogramId: 2501 },
        { id: 'jue-39', pos: 39, label: "charadas", type: "noun", action: "speak" },
        { id: 'jue-40', pos: 40, label: "¿Cuándo me toca?", type: "phrase", action: "speak", pictogramId: 7158 },
        { id: 'jue-41', pos: 41, label: "juego de memoria", type: "noun", action: "speak", pictogramId: 24680 },
        { id: 'jue-42', pos: 42, label: "Colores", type: "folder", action: "navigate", folderTarget: "colores", pictogramId: 7075 },
        { id: 'jue-43', pos: 43, label: "Números", type: "folder", action: "navigate", folderTarget: "numeros", pictogramId: 2879 },
        { id: 'jue-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cosas_2", pictogramId: 37086 }
    ] as GridCell[],

    'festivas': [
        // Row 1 (Core Genérico Activo)
        { id: 'fes-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'fes-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'fes-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'fes-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'fes-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'fes-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'fes-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'fes-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'fes-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Row 2 (Core Genérico Adaptado)
        { id: 'fes-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'fes-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'fes-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'fes-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'fes-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'fes-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'fes-15', pos: 15, label: "Navidad", type: "noun", action: "speak", pictogramId: 3134 },
        { id: 'fes-16', pos: 16, label: "regalo", type: "noun", action: "speak", pictogramId: 25381 },
        { id: 'fes-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak" },

        // Row 3
        { id: 'fes-18', pos: 18, label: "luces de Navidad", type: "noun", action: "speak", pictogramId: 5083 },
        { id: 'fes-19', pos: 19, label: "árbol de Navidad", type: "noun", action: "speak", pictogramId: 3058 },
        { id: 'fes-20', pos: 20, label: "fuegos artificiales", type: "noun", action: "speak", pictogramId: 5474 },
        { id: 'fes-21', pos: 21, label: "adornos de Navidad", type: "noun", action: "speak", pictogramId: 6885 },
        { id: 'fes-22', pos: 22, label: "papel para envolver", type: "noun", action: "speak", pictogramId: 36431 },
        { id: 'fes-23', pos: 23, label: "Santa Claus", type: "noun", action: "speak", pictogramId: 25298 },
        { id: 'fes-24', pos: 24, label: "Escena navideña del N...", type: "noun", action: "speak", pictogramId: 7269 },
        { id: 'fes-25', pos: 25, label: "estrella", type: "noun", action: "speak", pictogramId: 2752 },
        { id: 'fes-26', pos: 26, label: "bota navideña", type: "noun", action: "speak", pictogramId: 7269 },

        // Row 4
        { id: 'fes-27', pos: 27, label: "decorar el árbol", type: "verb", action: "speak", pictogramId: 27715 },
        { id: 'fes-28', pos: 28, label: "gorro de santa", type: "noun", action: "speak", pictogramId: 3139 },
        { id: 'fes-29', pos: 29, label: "campanas", type: "noun", action: "speak", pictogramId: 3072 },
        { id: 'fes-30', pos: 30, label: "Rodolfo", type: "noun", action: "speak", pictogramId: 3150 },
        { id: 'fes-31', pos: 31, label: "burrito sabanero", type: "noun", action: "speak", pictogramId: 10219 },

        // Row 5
        { id: 'fes-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "festivas_2", pictogramId: 3220 }
    ] as GridCell[],

    'festivas_2': [
        // Row 1
        { id: 'fes2-0', pos: 0, label: "bastón de caramelo", type: "noun", action: "speak", pictogramId: 36350 },
        { id: 'fes2-1', pos: 1, label: "blanca Navidad", type: "noun", action: "speak", pictogramId: 3067 },
        { id: 'fes2-2', pos: 2, label: "bota", type: "noun", action: "speak", pictogramId: 5401 },
        { id: 'fes2-3', pos: 3, label: "calendario de Adviento", type: "noun", action: "speak", pictogramId: 37985 },
        { id: 'fes2-4', pos: 4, label: "casa de galleta de jen...", type: "noun", action: "speak", pictogramId: 3331 },
        { id: 'fes2-5', pos: 5, label: "corona", type: "noun", action: "speak", pictogramId: 2718 },
        { id: 'fes2-6', pos: 6, label: "decoraciones de navid...", type: "noun", action: "speak" },
        { id: 'fes2-7', pos: 7, label: "duende", type: "noun", action: "speak", pictogramId: 5445 },
        { id: 'fes2-8', pos: 8, label: "bola de Navidad", type: "noun", action: "speak", pictogramId: 3058 },

        // Row 2
        { id: 'fes2-9', pos: 9, label: "gorro de Santa", type: "noun", action: "speak", pictogramId: 3139 },
        { id: 'fes2-10', pos: 10, label: "muérdago", type: "noun", action: "speak", pictogramId: 11590 },
        { id: 'fes2-11', pos: 11, label: "muñeco de nieve", type: "noun", action: "speak", pictogramId: 3131 },
        { id: 'fes2-12', pos: 12, label: "tarjeta de Navidad", type: "noun", action: "speak", pictogramId: 7269 },
        { id: 'fes2-13', pos: 13, label: "villancico", type: "noun", action: "speak", pictogramId: 2778 },
        { id: 'fes2-14', pos: 14, label: "regalo", type: "noun", action: "speak", pictogramId: 25381 },

        // Row 5
        { id: 'fes2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "festivas", pictogramId: 37086 }
    ] as GridCell[],
    'hogar': [
        // Fila 1
        { id: 'hog-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'hog-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'hog-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'hog-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'hog-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'hog-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'hog-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'hog-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'hog-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2
        { id: 'hog-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'hog-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'hog-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'hog-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'hog-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'hog-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'hog-15', pos: 15, label: "alfombra", type: "noun", action: "speak", pictogramId: 2249 },
        { id: 'hog-16', pos: 16, label: "bolsa de papel", type: "noun", action: "speak", pictogramId: 23849 },
        { id: 'hog-17', pos: 17, label: "ya terminé", type: "adverb", action: "speak" },

        // Fila 3
        { id: 'hog-18', pos: 18, label: "bote de basura", type: "noun", action: "speak", pictogramId: 25185 },
        { id: 'hog-19', pos: 19, label: "buzón", type: "noun", action: "speak", pictogramId: 2293 },
        { id: 'hog-20', pos: 20, label: "caja", type: "noun", action: "speak", pictogramId: 7054 },
        { id: 'hog-21', pos: 21, label: "canasta", type: "noun", action: "speak", pictogramId: 3260 },
        { id: 'hog-22', pos: 22, label: "florero", type: "noun", action: "speak", pictogramId: 3271 },
        { id: 'hog-23', pos: 23, label: "hielera", type: "noun", action: "speak" },
        { id: 'hog-24', pos: 24, label: "llave", type: "noun", action: "speak", pictogramId: 8153 },
        { id: 'hog-25', pos: 25, label: "pantalla para lámpara", type: "noun", action: "speak", pictogramId: 38691 },
        { id: 'hog-26', pos: 26, label: "portarretratos", type: "noun", action: "speak" },

        // Fila 4
        { id: 'hog-27', pos: 27, label: "tapete", type: "noun", action: "speak" },
        { id: 'hog-28', pos: 28, label: "termostato", type: "noun", action: "speak" },
        { id: 'hog-29', pos: 29, label: "vela", type: "noun", action: "speak", pictogramId: 6242 },
        { id: 'hog-30', pos: 30, label: "Ropa de cama", type: "folder", action: "navigate", folderTarget: "ropa_de_cama", pictogramId: 36465 },
        { id: 'hog-31', pos: 31, label: "taper", type: "noun", action: "speak", pictogramId: 31091 },
        { id: 'hog-32', pos: 32, label: "almohada", type: "noun", action: "speak", pictogramId: 2250 },
        { id: 'hog-33', pos: 33, label: "trapo", type: "noun", action: "speak", pictogramId: 34862 },

        // Navegación
        { id: 'hog-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cosas_2", pictogramId: 37086 }
    ] as GridCell[],

    'ocio': [
        // Fila 1
        { id: 'ocio-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'ocio-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'ocio-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'ocio-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'ocio-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'ocio-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'ocio-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'ocio-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'ocio-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2
        { id: 'ocio-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'ocio-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'ocio-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'ocio-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'ocio-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'ocio-14', pos: 14, label: "¡Me toca!", type: "phrase", action: "speak", pictogramId: 7157 },
        { id: 'ocio-15', pos: 15, label: "¡Te toca!", type: "phrase", action: "speak", pictogramId: 7158 },
        { id: 'ocio-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'ocio-17', pos: 17, label: "ya terminé", type: "adverb", action: "speak" },

        // Fila 3
        { id: 'ocio-18', pos: 18, label: "colorear", type: "verb", action: "speak", pictogramId: 2348 },
        { id: 'ocio-19', pos: 19, label: "esto", type: "pronoun", action: "speak", pictogramId: 7095 },
        { id: 'ocio-20', pos: 20, label: "pasear", type: "verb", action: "speak", pictogramId: 29951 },
        { id: 'ocio-21', pos: 21, label: "jugar a atrapadas", type: "verb", action: "speak", pictogramId: 10163 },
        { id: 'ocio-22', pos: 22, label: "leer", type: "verb", action: "speak", pictogramId: 7141 },
        { id: 'ocio-23', pos: 23, label: "hacer cosquillas", type: "verb", action: "speak", pictogramId: 5480 },
        { id: 'ocio-24', pos: 24, label: "escuchar música", type: "verb", action: "speak", pictogramId: 2746 },
        { id: 'ocio-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'ocio-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Fila 4
        { id: 'ocio-27', pos: 27, label: "jugar afuera", type: "verb", action: "speak", pictogramId: 10163 },
        { id: 'ocio-28', pos: 28, label: "andar en bicicleta", type: "verb", action: "speak", pictogramId: 5566 },
        { id: 'ocio-29', pos: 29, label: "columpio", type: "noun", action: "speak", pictogramId: 4608 },
        { id: 'ocio-30', pos: 30, label: "videojuego", type: "noun", action: "speak", pictogramId: 21945 },
        { id: 'ocio-31', pos: 31, label: "Actividades de ejemplo", type: "folder", action: "navigate", folderTarget: "actividades_de_ejemplo", pictogramId: 24701 },
        { id: 'ocio-32', pos: 32, label: "sube y baja", type: "noun", action: "speak", pictogramId: 4572 },
        { id: 'ocio-33', pos: 33, label: "plastilina", type: "noun", action: "speak", pictogramId: 2529 },
        { id: 'ocio-34', pos: 34, label: "película", type: "noun", action: "speak", pictogramId: 34320 },
        { id: 'ocio-35', pos: 35, label: "crear", type: "verb", action: "speak", pictogramId: 11698 },

        // Fila 5
        { id: 'ocio-44', pos: 44, label: "Más...", type: "navigation", action: "navigate", folderTarget: "ocio_2", pictogramId: 37162 }
    ] as GridCell[],

    'ocio_2': [
        // Fila 1
        { id: 'ocio2-0', pos: 0, label: "botar sobre la pelota", type: "verb", action: "speak", pictogramId: 27218 },
        { id: 'ocio2-1', pos: 1, label: "acampar", type: "verb", action: "speak", pictogramId: 6025 },
        { id: 'ocio2-2', pos: 2, label: "adornarse", type: "verb", action: "speak" },
        { id: 'ocio2-3', pos: 3, label: "hacer excursionismo", type: "verb", action: "speak" },
        { id: 'ocio2-4', pos: 4, label: "jugar a avión", type: "verb", action: "speak", pictogramId: 10163 },
        { id: 'ocio2-5', pos: 5, label: "brincar cuerda", type: "verb", action: "speak", pictogramId: 37954 },
        { id: 'ocio2-6', pos: 6, label: "tejer", type: "verb", action: "speak", pictogramId: 9039 },
        { id: 'ocio2-7', pos: 7, label: "jugar a las cartas", type: "verb", action: "speak", pictogramId: 10163 },
        { id: 'ocio2-8', pos: 8, label: "patinar", type: "verb", action: "speak", pictogramId: 16841 },

        // Fila 2
        { id: 'ocio2-9', pos: 9, label: "escalar", type: "verb", action: "speak", pictogramId: 26814 },
        { id: 'ocio2-10', pos: 10, label: "cuentas", type: "noun", action: "speak", pictogramId: 5356 },
        { id: 'ocio2-11', pos: 11, label: "escondidas", type: "noun", action: "speak" },
        { id: 'ocio2-12', pos: 12, label: "golfito", type: "noun", action: "speak" },
        { id: 'ocio2-13', pos: 13, label: "álbum de fotos", type: "noun", action: "speak", pictogramId: 38383 },
        { id: 'ocio2-14', pos: 14, label: "patín del diablo", type: "noun", action: "speak", pictogramId: 4713 },
        { id: 'ocio2-15', pos: 15, label: "Simón dice", type: "noun", action: "speak" },
        { id: 'ocio2-16', pos: 16, label: "trineo", type: "noun", action: "speak", pictogramId: 8710 },
        { id: 'ocio2-17', pos: 17, label: "brincolín", type: "noun", action: "speak" },

        // Fila 3
        { id: 'ocio2-18', pos: 18, label: "saltar en el trampolín", type: "verb", action: "speak", pictogramId: 3224 },

        // Navegación
        { id: 'ocio2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "ocio", pictogramId: 37086 }
    ] as GridCell[],

    'actividades_de_ejemplo': [
        // Fila 1
        { id: 'ae-0', pos: 0, label: "Arte y manualidades", type: "folder", action: "navigate", folderTarget: "arte_y_manualidades", pictogramId: 24645 },
        { id: 'ae-1', pos: 1, label: "Jugar boliche", type: "folder", action: "navigate", folderTarget: "boliche", pictogramId: 10163 },
        { id: 'ae-2', pos: 2, label: "Burbujas", type: "folder", action: "navigate", folderTarget: "burbujas", pictogramId: 6945 },
        { id: 'ae-3', pos: 3, label: "Hacer súper", type: "folder", action: "navigate", folderTarget: "supermercado", pictogramId: 3389 },
        { id: 'ae-4', pos: 4, label: "Harry Potter", type: "folder", action: "navigate", folderTarget: "harry_potter" },
        { id: 'ae-5', pos: 5, label: "A comer", type: "folder", action: "navigate", folderTarget: "a_comer", pictogramId: 28414 },
        { id: 'ae-6', pos: 6, label: "Hoy en la escuela", type: "folder", action: "navigate", folderTarget: "hoy_escuela", pictogramId: 29911 },

        // Navegación
        { id: 'ae-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "ocio", pictogramId: 37086 }
    ] as GridCell[],

    'arte_y_manualidades': [
        // Fila 1
        { id: 'arte-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'arte-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'arte-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'arte-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'arte-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'arte-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'arte-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'arte-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'arte-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2
        { id: 'arte-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'arte-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'arte-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'arte-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'arte-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'arte-14', pos: 14, label: "bonito", type: "adjective", action: "speak", pictogramId: 11194 },
        { id: 'arte-15', pos: 15, label: "desordenado", type: "adjective", action: "speak", pictogramId: 4627 },
        { id: 'arte-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'arte-17', pos: 17, label: "ya terminé", type: "adverb", action: "speak" },

        // Fila 3
        { id: 'arte-18', pos: 18, label: "dibujar", type: "verb", action: "speak", pictogramId: 8088 },
        { id: 'arte-19', pos: 19, label: "esto", type: "pronoun", action: "speak", pictogramId: 7095 },
        { id: 'arte-20', pos: 20, label: "parar", type: "verb", action: "speak", pictogramId: 7196 },
        { id: 'arte-21', pos: 21, label: "colorear", type: "verb", action: "speak", pictogramId: 2348 },
        { id: 'arte-22', pos: 22, label: "escribir", type: "verb", action: "speak", pictogramId: 2380 },
        { id: 'arte-23', pos: 23, label: "aburrido", type: "adjective", action: "speak", pictogramId: 35531 },
        { id: 'arte-24', pos: 24, label: "en", type: "preposition", action: "speak", pictogramId: 7034 },
        { id: 'arte-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'arte-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Fila 4
        { id: 'arte-27', pos: 27, label: "pegar", type: "verb", action: "speak", pictogramId: 24749 },
        { id: 'arte-28', pos: 28, label: "cortar", type: "verb", action: "speak", pictogramId: 5975 },
        { id: 'arte-29', pos: 29, label: "derramar", type: "verb", action: "speak", pictogramId: 5982 },
        { id: 'arte-30', pos: 30, label: "ayudar", type: "verb", action: "speak", pictogramId: 32648 },
        { id: 'arte-31', pos: 31, label: "mirar", type: "verb", action: "speak", pictogramId: 6564 },
        { id: 'arte-32', pos: 32, label: "con", type: "preposition", action: "speak", pictogramId: 7064 },
        { id: 'arte-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'arte-34', pos: 34, label: "grandioso", type: "adjective", action: "speak" },
        { id: 'arte-35', pos: 35, label: "arte", type: "noun", action: "speak", pictogramId: 2396 },

        // Fila 5
        { id: 'arte-36', pos: 36, label: "papel", type: "noun", action: "speak", pictogramId: 8349 },
        { id: 'arte-37', pos: 37, label: "crayón", type: "noun", action: "speak" },
        { id: 'arte-38', pos: 38, label: "calcomanía", type: "noun", action: "speak" },
        { id: 'arte-39', pos: 39, label: "pegamento en barra", type: "noun", action: "speak", pictogramId: 37499 },
        { id: 'arte-40', pos: 40, label: "rotulador", type: "noun", action: "speak", pictogramId: 3246 },
        { id: 'arte-41', pos: 41, label: "Artículos de arte", type: "folder", action: "navigate", folderTarget: "articulos_arte", pictogramId: 38130 },
        { id: 'arte-42', pos: 42, label: "Colores", type: "folder", action: "navigate", folderTarget: "colores", pictogramId: 7075 },
        { id: 'arte-43', pos: 43, label: "Palabras de Inicio", type: "folder", action: "navigate", folderTarget: "root", pictogramId: 38222 },
        { id: 'arte-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "actividades_de_ejemplo", pictogramId: 37086 }
    ] as GridCell[],

    'medico_cosas': [
        // Row 1 — vocabulario nuclear estándar
        { id: 'medc-0',  pos: 0,  label: "yo",      type: "pronoun",  action: "speak", pictogramId: 6632 },
        { id: 'medc-1',  pos: 1,  label: "estar",   type: "verb",     action: "speak", pictogramId: 36392 },
        { id: 'medc-2',  pos: 2,  label: "ser",     type: "verb",     action: "speak", pictogramId: 36480 },
        { id: 'medc-3',  pos: 3,  label: "querer",  type: "verb",     action: "speak", pictogramId: 11538 },
        { id: 'medc-4',  pos: 4,  label: "gustar",  type: "verb",     action: "speak", pictogramId: 37826 },
        { id: 'medc-5',  pos: 5,  label: "qué",     type: "adverb",   action: "speak", pictogramId: 22620 },
        { id: 'medc-6',  pos: 6,  label: "dónde",   type: "adverb",   action: "speak", pictogramId: 7764 },
        { id: 'medc-7',  pos: 7,  label: "no",      type: "adverb",   action: "speak", pictogramId: 5526 },
        { id: 'medc-8',  pos: 8,  label: "más",     type: "adverb",   action: "speak", pictogramId: 3220 },

        // Row 2 — núcleo + transición temática
        { id: 'medc-9',  pos: 9,  label: "tú",       type: "pronoun",  action: "speak", pictogramId: 12281 },
        { id: 'medc-10', pos: 10, label: "eso",      type: "pronoun",  action: "speak", pictogramId: 7091 },
        { id: 'medc-11', pos: 11, label: "poder",    type: "verb",     action: "speak", pictogramId: 35949 },
        { id: 'medc-12', pos: 12, label: "tener",    type: "verb",     action: "speak", pictogramId: 32761 },
        { id: 'medc-13', pos: 13, label: "hacer",    type: "verb",     action: "speak", pictogramId: 32751 },
        { id: 'medc-14', pos: 14, label: "poner",    type: "verb",     action: "speak", pictogramId: 32757 },
        { id: 'medc-15', pos: 15, label: "aspirina", type: "noun",     action: "speak"                    },
        { id: 'medc-16', pos: 16, label: "curita",   type: "noun",     action: "speak", pictogramId: 3404 },
        { id: 'medc-17', pos: 17, label: "ya terminé", type: "adjective", action: "speak"                 },

        // Row 3 — vocabulario médico temático (frecuente)
        { id: 'medc-18', pos: 18, label: "inyección",     type: "noun", action: "speak", pictogramId: 5601 },
        { id: 'medc-19', pos: 19, label: "jarabe para la tos", type: "noun", action: "speak", pictogramId: 35585 },
        { id: 'medc-20', pos: 20, label: "medicina",      type: "noun", action: "speak", pictogramId: 8163 },
        { id: 'medc-21', pos: 21, label: "píldoras",      type: "noun", action: "speak", pictogramId: 15000 },
        { id: 'medc-22', pos: 22, label: "rayos x",       type: "noun", action: "speak", pictogramId: 6198 },
        { id: 'medc-23', pos: 23, label: "receta médica", type: "noun", action: "speak", pictogramId: 38606 },
        { id: 'medc-24', pos: 24, label: "termómetro",    type: "noun", action: "speak", pictogramId: 32051 },
        { id: 'medc-25', pos: 25, label: "vendas",        type: "noun", action: "speak", pictogramId: 6243 },
        { id: 'medc-26', pos: 26, label: "vitaminas",     type: "noun", action: "speak", pictogramId: 36504 },

        // Row 4 — vocabulario médico temático (menos frecuente)
        { id: 'medc-27', pos: 27, label: "alcohol", type: "folder", action: "navigate", folderTarget: "alcohol", pictogramId: 2984 },

        // Row 5 — navegación
        { id: 'medc-44', pos: 44, label: "Más...", type: "navigation", action: "navigate", folderTarget: "medico_cosas_2", pictogramId: 37162 },
    ] as GridCell[],

    'medico_cosas_2': [
        // Row 1
        { id: 'medc2-0',  pos: 0,  label: "alimentación por sonda gástrica", type: "noun", action: "speak", pictogramId: 31690 },
        { id: 'medc2-1',  pos: 1,  label: "bomba de alimentación",            type: "noun", action: "speak", pictogramId: 31352 },
        { id: 'medc2-2',  pos: 2,  label: "bomba de baclofeno",               type: "noun", action: "speak", pictogramId: 31352 },
        { id: 'medc2-3',  pos: 3,  label: "botiquín de primeros auxilios",    type: "noun", action: "speak", pictogramId: 36683 },
        { id: 'medc2-4',  pos: 4,  label: "botón para llamar a la enfermera", type: "noun", action: "speak", pictogramId: 35757 },
        { id: 'medc2-5',  pos: 5,  label: "estetoscopio",                     type: "noun", action: "speak", pictogramId: 6000 },
        { id: 'medc2-6',  pos: 6,  label: "gotas para los oídos",             type: "noun", action: "speak", pictogramId: 32808 },
        { id: 'medc2-7',  pos: 7,  label: "guantes desechables",              type: "noun", action: "speak", pictogramId: 9147 },
        { id: 'medc2-8',  pos: 8,  label: "inhalador",                        type: "noun", action: "speak", pictogramId: 6017 },

        // Row 2
        { id: 'medc2-9',  pos: 9,  label: "mesa de exploración", type: "noun", action: "speak", pictogramId: 37356 },
        { id: 'medc2-10', pos: 10, label: "operación",            type: "noun", action: "speak", pictogramId: 27925 },
        { id: 'medc2-11', pos: 11, label: "pinzas",               type: "noun", action: "speak", pictogramId: 2833 },
        { id: 'medc2-12', pos: 12, label: "presión arterial",     type: "noun", action: "speak", pictogramId: 38855 },
        { id: 'medc2-13', pos: 13, label: "succión traqueal",     type: "noun", action: "speak" },
        { id: 'medc2-14', pos: 14, label: "tarjeta de seguro",    type: "noun", action: "speak", pictogramId: 7269 },
        { id: 'medc2-15', pos: 15, label: "tubo traqueal",        type: "noun", action: "speak", pictogramId: 9186 },
        { id: 'medc2-16', pos: 16, label: "yeso",                 type: "noun", action: "speak", pictogramId: 5457 },

        // Navegación
        { id: 'medc2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "medico_cosas", pictogramId: 37086 },
    ] as GridCell[],

    'dinero': [
        // Row 1 — vocabulario nuclear estándar
        { id: 'din-0',  pos: 0,  label: "yo",     type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'din-1',  pos: 1,  label: "estar",  type: "verb",    action: "speak", pictogramId: 36392 },
        { id: 'din-2',  pos: 2,  label: "ser",    type: "verb",    action: "speak", pictogramId: 36480 },
        { id: 'din-3',  pos: 3,  label: "querer", type: "verb",    action: "speak", pictogramId: 11538 },
        { id: 'din-4',  pos: 4,  label: "gustar", type: "verb",    action: "speak", pictogramId: 37826 },
        { id: 'din-5',  pos: 5,  label: "qué",    type: "adverb",  action: "speak", pictogramId: 22620 },
        { id: 'din-6',  pos: 6,  label: "dónde",  type: "adverb",  action: "speak", pictogramId: 7764 },
        { id: 'din-7',  pos: 7,  label: "no",     type: "adverb",  action: "speak", pictogramId: 5526 },
        { id: 'din-8',  pos: 8,  label: "más",    type: "adverb",  action: "speak", pictogramId: 3220 },

        // Row 2 — núcleo + transición temática (Números elevado a zona núcleo, "costar" como verbo temático primario)
        { id: 'din-9',  pos: 9,  label: "tú",          type: "pronoun",  action: "speak", pictogramId: 12281 },
        { id: 'din-10', pos: 10, label: "eso",         type: "pronoun",  action: "speak", pictogramId: 7091 },
        { id: 'din-11', pos: 11, label: "poder",       type: "verb",     action: "speak", pictogramId: 35949 },
        { id: 'din-12', pos: 12, label: "tener",       type: "verb",     action: "speak", pictogramId: 32761 },
        { id: 'din-13', pos: 13, label: "hacer",       type: "verb",     action: "speak", pictogramId: 32751 },
        { id: 'din-14', pos: 14, label: "poner",       type: "verb",     action: "speak", pictogramId: 32757 },
        { id: 'din-15', pos: 15, label: "Números",     type: "folder",   action: "navigate", folderTarget: "numeros", pictogramId: 2879 },
        { id: 'din-16', pos: 16, label: "costar",      type: "verb",     action: "speak"                           },
        { id: 'din-17', pos: 17, label: "ya terminé",  type: "adjective", action: "speak"                          },

        // Row 3 — monedas y billetes (orden ascendente de valor)
        { id: 'din-18', pos: 18, label: "centavo",              type: "noun", action: "speak" },
        { id: 'din-19', pos: 19, label: "cinco centavos",       type: "noun", action: "speak" },
        { id: 'din-20', pos: 20, label: "diez centavos",        type: "noun", action: "speak", pictogramId: 35691 },
        { id: 'din-21', pos: 21, label: "veinticinco centavos", type: "noun", action: "speak", pictogramId: 29288 },
        { id: 'din-22', pos: 22, label: "un dólar",             type: "noun", action: "speak", pictogramId: 5091 },
        { id: 'din-23', pos: 23, label: "cinco dólares",        type: "noun", action: "speak" },
        { id: 'din-24', pos: 24, label: "diez dólares",         type: "noun", action: "speak", pictogramId: 35691 },
        { id: 'din-25', pos: 25, label: "veinte dólares",       type: "noun", action: "speak", pictogramId: 29550 },
        { id: 'din-26', pos: 26, label: "cincuenta dólares",    type: "noun", action: "speak", pictogramId: 29350 },

        // Row 4 — operaciones y objetos financieros cotidianos
        { id: 'din-27', pos: 27, label: "dinero para gastar", type: "noun", action: "speak", pictogramId: 39789 },
        { id: 'din-28', pos: 28, label: "cambio",             type: "noun", action: "speak", pictogramId: 28833 },
        { id: 'din-29', pos: 29, label: "cheque",             type: "noun", action: "speak", pictogramId: 16605 },
        { id: 'din-30', pos: 30, label: "tarjeta de crédito", type: "noun", action: "speak", pictogramId: 4751 },
        { id: 'din-31', pos: 31, label: "dólar",              type: "noun", action: "speak", pictogramId: 5091 },
        { id: 'din-32', pos: 32, label: "precio",             type: "noun", action: "speak", pictogramId: 9874 },
        { id: 'din-33', pos: 33, label: "oferta",             type: "noun", action: "speak" },
        { id: 'din-34', pos: 34, label: "billetera",          type: "noun", action: "speak", pictogramId: 2689 },

        // Navegación
        { id: 'din-44', pos: 44, label: "Más...", type: "navigation", action: "navigate", folderTarget: "dinero_2", pictogramId: 37162 },
    ] as GridCell[],

    'dinero_2': [
        // Row 1 — vocabulario bancario-administrativo
        // "cobrar cheque" (acción prioritaria → verb) y "pobre" (descriptor → adjective) encabezan por prioridad comunicativa
        { id: 'din2-0',  pos: 0,  label: "cobrar cheque",          type: "verb",      action: "speak", pictogramId: 15986 },
        { id: 'din2-1',  pos: 1,  label: "pobre",                  type: "adjective", action: "speak", pictogramId: 4723 },
        { id: 'din2-2',  pos: 2,  label: "cajero automático",       type: "noun",      action: "speak", pictogramId: 17190 },
        { id: 'din2-3',  pos: 3,  label: "balance financiero",      type: "noun",      action: "speak" },
        { id: 'din2-4',  pos: 4,  label: "estado de cuenta bancaria", type: "noun",   action: "speak", pictogramId: 16909 },
        { id: 'din2-5',  pos: 5,  label: "factura",                 type: "noun",      action: "speak", pictogramId: 5995 },
        { id: 'din2-6',  pos: 6,  label: "presupuesto",             type: "noun",      action: "speak" },
        { id: 'din2-7',  pos: 7,  label: "centavo",                 type: "noun",      action: "speak" },
        { id: 'din2-8',  pos: 8,  label: "registro de cheques",     type: "noun",      action: "speak", pictogramId: 32996 },

        // Row 2 — vocabulario bancario avanzado
        { id: 'din2-9',  pos: 9,  label: "cuenta de cheques",  type: "noun", action: "speak" },
        { id: 'din2-10', pos: 10, label: "cupón",              type: "noun", action: "speak" },
        { id: 'din2-11', pos: 11, label: "tarjeta de débito",  type: "noun", action: "speak", pictogramId: 7269 },
        { id: 'din2-12', pos: 12, label: "prestar dinero",     type: "verb", action: "speak", pictogramId: 39789 },
        { id: 'din2-13', pos: 13, label: "nómina",             type: "noun", action: "speak" },
        { id: 'din2-14', pos: 14, label: "cuenta del teléfono", type: "noun", action: "speak", pictogramId: 3258 },
        { id: 'din2-15', pos: 15, label: "alcancía",           type: "noun", action: "speak", pictogramId: 4666 },
        { id: 'din2-16', pos: 16, label: "salario",            type: "noun", action: "speak", pictogramId: 33996 },
        { id: 'din2-17', pos: 17, label: "cuenta de ahorros",  type: "noun", action: "speak", pictogramId: 19528 },

        // Navegación
        { id: 'din2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "dinero", pictogramId: 37086 },
    ] as GridCell[],

    'musica_cosas': [
        // Row 1 — vocabulario nuclear estándar
        { id: 'musc-0',  pos: 0,  label: "yo",     type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'musc-1',  pos: 1,  label: "estar",  type: "verb",    action: "speak", pictogramId: 36392 },
        { id: 'musc-2',  pos: 2,  label: "ser",    type: "verb",    action: "speak", pictogramId: 36480 },
        { id: 'musc-3',  pos: 3,  label: "querer", type: "verb",    action: "speak", pictogramId: 11538 },
        { id: 'musc-4',  pos: 4,  label: "gustar", type: "verb",    action: "speak", pictogramId: 37826 },
        { id: 'musc-5',  pos: 5,  label: "qué",    type: "adverb",  action: "speak", pictogramId: 22620 },
        { id: 'musc-6',  pos: 6,  label: "dónde",  type: "adverb",  action: "speak", pictogramId: 7764 },
        { id: 'musc-7',  pos: 7,  label: "no",     type: "adverb",  action: "speak", pictogramId: 5526 },
        { id: 'musc-8',  pos: 8,  label: "más",    type: "adverb",  action: "speak", pictogramId: 3220 },

        // Row 2 — núcleo + verbos musicales primarios elevados (R15)
        { id: 'musc-9',  pos: 9,  label: "tú",          type: "pronoun",   action: "speak", pictogramId: 12281 },
        { id: 'musc-10', pos: 10, label: "eso",         type: "pronoun",   action: "speak", pictogramId: 7091 },
        { id: 'musc-11', pos: 11, label: "poder",       type: "verb",      action: "speak", pictogramId: 35949 },
        { id: 'musc-12', pos: 12, label: "tener",       type: "verb",      action: "speak", pictogramId: 32761 },
        { id: 'musc-13', pos: 13, label: "hacer",       type: "verb",      action: "speak", pictogramId: 32751 },
        { id: 'musc-14', pos: 14, label: "escuchar",    type: "verb",      action: "speak", pictogramId: 6572 },  // verbo temático elevado
        { id: 'musc-15', pos: 15, label: "tocar",       type: "verb",      action: "speak", pictogramId: 3293 },  // verbo temático elevado
        { id: 'musc-16', pos: 16, label: "bien",        type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'musc-17', pos: 17, label: "ya terminé",  type: "adjective", action: "speak"  },

        // Row 3 — verbos musicales secundarios + transición temática
        { id: 'musc-18', pos: 18, label: "cantar",    type: "verb",      action: "speak", pictogramId: 6960 },
        { id: 'musc-19', pos: 19, label: "esto",      type: "pronoun",   action: "speak", pictogramId: 7095 },
        { id: 'musc-20', pos: 20, label: "bailar",    type: "verb",      action: "speak", pictogramId: 35747 },
        { id: 'musc-21', pos: 21, label: "audífonos", type: "noun",      action: "speak", pictogramId: 5912 },
        { id: 'musc-22', pos: 22, label: "banda",     type: "noun",      action: "speak", pictogramId: 23806 },
        { id: 'musc-23', pos: 23, label: "canción",   type: "noun",      action: "speak", pictogramId: 24791 },
        { id: 'musc-24', pos: 24, label: "cantante",  type: "noun",      action: "speak", pictogramId: 4585 },
        { id: 'musc-25', pos: 25, label: "mal",       type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'musc-26', pos: 26, label: "algo",      type: "pronoun",   action: "speak", pictogramId: 38768 },

        // Row 4 — géneros e instrumentos frecuentes
        { id: 'musc-27', pos: 27, label: "CD",            type: "noun", action: "speak", pictogramId: 2322 },
        { id: 'musc-28', pos: 28, label: "clásico",       type: "noun", action: "speak" },
        { id: 'musc-29', pos: 29, label: "coro",          type: "noun", action: "speak", pictogramId: 2717 },
        { id: 'musc-30', pos: 30, label: "country",       type: "noun", action: "speak", pictogramId: 8071 },
        { id: 'musc-31', pos: 31, label: "guitarra",      type: "noun", action: "speak", pictogramId: 2417 },
        { id: 'musc-32', pos: 32, label: "música",        type: "noun", action: "speak", pictogramId: 24791 },
        { id: 'musc-33', pos: 33, label: "música clásica", type: "noun", action: "speak", pictogramId: 37225 },
        { id: 'musc-34', pos: 34, label: "piano",         type: "noun", action: "speak", pictogramId: 2521 },
        { id: 'musc-35', pos: 35, label: "rap",           type: "noun", action: "speak", pictogramId: 2413 },

        // Row 5 — instrumentos adicionales + subcategoría anidada (R17 — pos 43) + paginación
        { id: 'musc-36', pos: 36, label: "reproductor de mp3", type: "noun", action: "speak", pictogramId: 24509 },
        { id: 'musc-37', pos: 37, label: "rock",               type: "noun", action: "speak", pictogramId: 38704 },
        { id: 'musc-38', pos: 38, label: "trompeta",           type: "noun", action: "speak", pictogramId: 2607 },
        { id: 'musc-39', pos: 39, label: "platillos",          type: "noun", action: "speak", pictogramId: 2531 },
        { id: 'musc-40', pos: 40, label: "batería",            type: "noun", action: "speak", pictogramId: 5923 },
        { id: 'musc-41', pos: 41, label: "violín",             type: "noun", action: "speak", pictogramId: 2615 },
        { id: 'musc-42', pos: 42, label: "clarinete",          type: "noun", action: "speak", pictogramId: 5964 },
        { id: 'musc-43', pos: 43, label: "Más", type: "navigation", action: "navigate", folderTarget: "musica_cosas_2", pictogramId: 3220 },
        // pos 44 — subcategoría "Canciones para niños" en última posición (R17)
        { id: 'musc-44', pos: 44, label: "Canciones para niños", type: "folder", action: "navigate", folderTarget: "canciones_ninos", pictogramId: 6281 },
    ] as GridCell[],

    'musica_cosas_2': [
        // Row 1 — géneros/instrumentos/personas (mezcla por frecuencia)
        { id: 'musc2-0',  pos: 0,  label: "armónica",        type: "noun", action: "speak", pictogramId: 5909 },
        { id: 'musc2-1',  pos: 1,  label: "audiocassette",   type: "noun", action: "speak" },
        { id: 'musc2-2',  pos: 2,  label: "bluegrass",       type: "noun", action: "speak" },
        { id: 'musc2-3',  pos: 3,  label: "claves",          type: "noun", action: "speak", pictogramId: 23937 },
        { id: 'musc2-4',  pos: 4,  label: "compositor",      type: "noun", action: "speak", pictogramId: 24424 },
        { id: 'musc2-5',  pos: 5,  label: "director",        type: "noun", action: "speak", pictogramId: 4631 },
        { id: 'musc2-6',  pos: 6,  label: "guitarra eléctrica", type: "noun", action: "speak", pictogramId: 8599 },
        { id: 'musc2-7',  pos: 7,  label: "hip hop",         type: "noun", action: "speak" },
        { id: 'musc2-8',  pos: 8,  label: "maracas",         type: "noun", action: "speak", pictogramId: 2463 },

        // Row 2 — géneros musicales
        { id: 'musc2-9',  pos: 9,  label: "Motown",          type: "noun", action: "speak" },
        { id: 'musc2-10', pos: 10, label: "música cristiana", type: "noun", action: "speak", pictogramId: 37225 },
        { id: 'musc2-11', pos: 11, label: "música ligera",   type: "noun", action: "speak", pictogramId: 37225 },
        { id: 'musc2-12', pos: 12, label: "ópera",           type: "noun", action: "speak", pictogramId: 27921 },
        { id: 'musc2-13', pos: 13, label: "orquesta",        type: "noun", action: "speak", pictogramId: 2870 },
        { id: 'musc2-14', pos: 14, label: "pandereta",       type: "noun", action: "speak", pictogramId: 2564 },
        { id: 'musc2-15', pos: 15, label: "r&b",             type: "noun", action: "speak", pictogramId: 3147 },
        { id: 'musc2-16', pos: 16, label: "salsa",           type: "noun", action: "speak", pictogramId: 35735 },
        { id: 'musc2-17', pos: 17, label: "sinfonía",        type: "noun", action: "speak" },

        // Row 3 — instrumentos de percusión y cuerda
        { id: 'musc2-18', pos: 18, label: "tambor",      type: "noun", action: "speak", pictogramId: 2578 },
        { id: 'musc2-19', pos: 19, label: "triángulo",   type: "noun", action: "speak", pictogramId: 2604 },
        { id: 'musc2-20', pos: 20, label: "violín",      type: "noun", action: "speak", pictogramId: 2615 },
        { id: 'musc2-21', pos: 21, label: "xilófono",    type: "noun", action: "speak", pictogramId: 2616 },
        { id: 'musc2-22', pos: 22, label: "batería",     type: "noun", action: "speak", pictogramId: 5923 },
        { id: 'musc2-23', pos: 23, label: "flauta",      type: "noun", action: "speak", pictogramId: 2396 },
        { id: 'musc2-24', pos: 24, label: "arpa",        type: "noun", action: "speak", pictogramId: 8493 },
        { id: 'musc2-25', pos: 25, label: "violonchelo", type: "noun", action: "speak", pictogramId: 4771 },
        { id: 'musc2-26', pos: 26, label: "gong",        type: "noun", action: "speak", pictogramId: 36639 },

        // Row 4 — instrumentos de viento (fila parcial)
        { id: 'musc2-27', pos: 27, label: "fagot",     type: "noun", action: "speak", pictogramId: 33044 },
        { id: 'musc2-28', pos: 28, label: "bajo",      type: "noun", action: "speak", pictogramId: 25839 },
        { id: 'musc2-29', pos: 29, label: "oboe",      type: "noun", action: "speak", pictogramId: 38228 },
        { id: 'musc2-30', pos: 30, label: "trombón",   type: "noun", action: "speak", pictogramId: 6233 },
        { id: 'musc2-31', pos: 31, label: "micrófono", type: "noun", action: "speak", pictogramId: 2912 },

        // Navegación
        { id: 'musc2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "musica_cosas", pictogramId: 37086 },
    ] as GridCell[],

    'canciones_ninos': [
        // Row 1
        { id: 'can-0',  pos: 0,  label: "colores",                        type: "phrase", action: "speak", pictogramId: 7075 },
        { id: 'can-1',  pos: 1,  label: "Días de la semana",               type: "phrase", action: "speak", pictogramId: 37372 },
        { id: 'can-2',  pos: 2,  label: "cumpleaños feliz",                type: "phrase", action: "speak", pictogramId: 32123 },
        { id: 'can-3',  pos: 3,  label: "canción ¡Hola!",                  type: "phrase", action: "speak", pictogramId: 6522 },
        { id: 'can-4',  pos: 4,  label: "Panecillos de Pascua",            type: "phrase", action: "speak", pictogramId: 37453 },
        { id: 'can-5',  pos: 5,  label: "A la víbora de la mar",           type: "phrase", action: "speak", pictogramId: 38394 },
        { id: 'can-6',  pos: 6,  label: "el Viejo McDonald",               type: "phrase", action: "speak", pictogramId: 4770 },
        { id: 'can-7',  pos: 7,  label: "vamos a remar en un botecito",    type: "phrase", action: "speak", pictogramId: 28031 },
        { id: 'can-8',  pos: 8,  label: "El vendedor de panecillos",       type: "phrase", action: "speak", pictogramId: 5603 },

        // Row 2 (parcial)
        { id: 'can-9',  pos: 9,  label: "estrellita ¿dónde estás?", type: "phrase", action: "speak", pictogramId: 10744 },
        { id: 'can-10', pos: 10, label: "Las ruedas del autobús",   type: "phrase", action: "speak", pictogramId: 32288 },

        // Navegación — R21: breadcrumb apunta al padre inmediato (Música), no al raíz
        { id: 'can-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "musica_cosas", pictogramId: 37086 },
    ] as GridCell[],

    'deportes_cosas': [

        { id: 'dep-0',  pos: 0,  label: "yo",               type: "pronoun",     action: "speak", pictogramId: 6632 },
        { id: 'dep-1',  pos: 1,  label: "estar",            type: "verb",        action: "speak", pictogramId: 36392 },
        { id: 'dep-2',  pos: 2,  label: "ser",              type: "verb",        action: "speak", pictogramId: 36480 },
        { id: 'dep-3',  pos: 3,  label: "querer",           type: "verb",        action: "speak", pictogramId: 11538 },
        { id: 'dep-4',  pos: 4,  label: "gustar",           type: "verb",        action: "speak", pictogramId: 37826 },
        { id: 'dep-5',  pos: 5,  label: "qué",              type: "adverb",      action: "speak", pictogramId: 22620 },
        { id: 'dep-6',  pos: 6,  label: "dónde",            type: "adverb",      action: "speak", pictogramId: 7764 },
        { id: 'dep-7',  pos: 7,  label: "no",               type: "adverb",      action: "speak", pictogramId: 5526 },
        { id: 'dep-8',  pos: 8,  label: "más",              type: "adverb",      action: "speak", pictogramId: 3220 },

        { id: 'dep-9',  pos: 9,  label: "tú",              type: "pronoun",     action: "speak", pictogramId: 12281 },
        { id: 'dep-10', pos: 10, label: "eso",             type: "pronoun",     action: "speak", pictogramId: 7091 },
        { id: 'dep-11', pos: 11, label: "poder",           type: "verb",        action: "speak", pictogramId: 35949 },
        { id: 'dep-12', pos: 12, label: "tener",           type: "verb",        action: "speak", pictogramId: 32761 },
        { id: 'dep-13', pos: 13, label: "hacer",           type: "verb",        action: "speak", pictogramId: 32751 },
        { id: 'dep-14', pos: 14, label: "jugar",           type: "verb",        action: "speak", pictogramId: 23392 },
        { id: 'dep-15', pos: 15, label: "a",               type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'dep-16', pos: 16, label: "bien",            type: "adjective",   action: "speak", pictogramId: 5397 },
        { id: 'dep-17', pos: 17, label: "ya terminé",      type: "adjective",   action: "speak" },

        { id: 'dep-18', pos: 18, label: "deporte",         type: "noun",        action: "speak", pictogramId: 7010 },
        { id: 'dep-19', pos: 19, label: "béisbol",         type: "noun",        action: "speak", pictogramId: 10165 },
        { id: 'dep-20', pos: 20, label: "parar",           type: "verb",        action: "speak", pictogramId: 7196 },
        { id: 'dep-21', pos: 21, label: "ir",              type: "verb",        action: "speak", pictogramId: 8142 },
        { id: 'dep-22', pos: 22, label: "básquetbol",      type: "noun",        action: "speak"  },
        { id: 'dep-23', pos: 23, label: "futbol americano",type: "noun",        action: "speak", pictogramId: 19530 },
        { id: 'dep-24', pos: 24, label: "en",              type: "preposition", action: "speak", pictogramId: 7034 },
        { id: 'dep-25', pos: 25, label: "mal",             type: "adjective",   action: "speak", pictogramId: 5504 },
        { id: 'dep-26', pos: 26, label: "hockey",          type: "noun",        action: "speak", pictogramId: 10161 },

        { id: 'dep-27', pos: 27, label: "futbol",          type: "noun",        action: "speak", pictogramId: 16743 },
        { id: 'dep-28', pos: 28, label: "softball",        type: "noun",        action: "speak" },
        { id: 'dep-29', pos: 29, label: "Special Olympics",type: "noun",        action: "speak", pictogramId: 2476 },
        { id: 'dep-30', pos: 30, label: "natación",        type: "noun",        action: "speak", pictogramId: 25038 },
        { id: 'dep-31', pos: 31, label: "mi turno",        type: "phrase",      action: "speak", pictogramId: 7158 },
        { id: 'dep-32', pos: 32, label: "tu turno",        type: "phrase",      action: "speak", pictogramId: 34713 },
        { id: 'dep-33', pos: 33, label: "de",              type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'dep-34', pos: 34, label: "Básquetbol",      type: "folder",      action: "navigate", folderTarget: "basquetbol"  },
        { id: 'dep-35', pos: 35, label: "Boliche",         type: "folder",      action: "navigate", folderTarget: "boliche" },

        { id: 'dep-36', pos: 36, label: "Futbol americano",type: "folder",      action: "navigate", folderTarget: "futbol_americano", pictogramId: 19530 },
        { id: 'dep-37', pos: 37, label: "Cricket",              type: "folder",      action: "navigate", folderTarget: "cricket" },
        { id: 'dep-38', pos: 38, label: "maratón",               type: "noun",        action: "speak" },
        { id: 'dep-39', pos: 39, label: "Carreras de caballos",  type: "folder",      action: "navigate", folderTarget: "carreras_caballos", pictogramId: 34830 },
        { id: 'dep-40', pos: 40, label: "premio",          type: "noun",        action: "speak", pictogramId: 26845 },
        { id: 'dep-41', pos: 41, label: "flecha",          type: "noun",        action: "speak", pictogramId: 5471 },
        { id: 'dep-42', pos: 42, label: "medalla",         type: "noun",        action: "speak", pictogramId: 3128 },
        { id: 'dep-43', pos: 43, label: "golf",            type: "noun",        action: "speak", pictogramId: 10160 },
        { id: 'dep-44', pos: 44, label: "Más",             type: "navigation",  action: "navigate", folderTarget: "deportes_cosas_2", pictogramId: 3220 },
    ] as GridCell[],

    'deportes_cosas_2': [

        { id: 'dep2-0',  pos: 0,  label: "Beisbol",               type: "folder", action: "navigate", folderTarget: "beisbol", pictogramId: 10165 },
        { id: 'dep2-1',  pos: 1,  label: "Automovilismo",         type: "folder", action: "navigate", folderTarget: "automovilismo" },
        { id: 'dep2-2',  pos: 2,  label: "casco para bici",       type: "noun",   action: "speak", pictogramId: 39563 },
        { id: 'dep2-3',  pos: 3,  label: "esquí a campo traviesa",type: "noun",   action: "speak", pictogramId: 38716 },
        { id: 'dep2-4',  pos: 4,  label: "hockey sobre pasto",    type: "noun",   action: "speak", pictogramId: 3113 },
        { id: 'dep2-5',  pos: 5,  label: "gimnasia",              type: "noun",   action: "speak", pictogramId: 37910 },
        { id: 'dep2-6',  pos: 6,  label: "patinaje sobre hielo",  type: "noun",   action: "speak", pictogramId: 31143 },
        { id: 'dep2-7',  pos: 7,  label: "karate",                type: "noun",   action: "speak", pictogramId: 21955 },
        { id: 'dep2-8',  pos: 8,  label: "Paralympic Games",      type: "noun",   action: "speak", pictogramId: 5905 },

        { id: 'dep2-9',  pos: 9,  label: "ping pong",             type: "noun",   action: "speak", pictogramId: 2471 },
        { id: 'dep2-10', pos: 10, label: "carrera",               type: "noun",   action: "speak", pictogramId: 11205 },
        { id: 'dep2-11', pos: 11, label: "patineta",              type: "noun",   action: "speak" },
        { id: 'dep2-12', pos: 12, label: "esquí",                 type: "noun",   action: "speak", pictogramId: 16701 },
        { id: 'dep2-13', pos: 13, label: "snowboarding",          type: "noun",   action: "speak", pictogramId: 29810 },
        { id: 'dep2-14', pos: 14, label: "Súper Tazón",           type: "noun",   action: "speak", pictogramId: 9091 },
        { id: 'dep2-15', pos: 15, label: "surfear",               type: "verb",   action: "speak", pictogramId: 32928 },
        { id: 'dep2-16', pos: 16, label: "tee ball",              type: "noun",   action: "speak" },
        { id: 'dep2-17', pos: 17, label: "equipo",                type: "noun",   action: "speak", pictogramId: 15262 },

        { id: 'dep2-18', pos: 18, label: "tenis",                 type: "noun",   action: "speak", pictogramId: 10158 },
        { id: 'dep2-19', pos: 19, label: "empate",                type: "noun",   action: "speak" },
        { id: 'dep2-20', pos: 20, label: "voleibol",              type: "noun",   action: "speak", pictogramId: 10167 },
        { id: 'dep2-21', pos: 21, label: "esquí acuático",        type: "noun",   action: "speak", pictogramId: 9189 },
        { id: 'dep2-22', pos: 22, label: "lucha",                 type: "noun",   action: "speak", pictogramId: 37041 },
        { id: 'dep2-23', pos: 23, label: "Futbol MLS",            type: "folder", action: "navigate", folderTarget: "futbol_mls", pictogramId: 8610 },

        { id: 'dep2-44', pos: 44, label: "Atrás",                 type: "navigation", action: "back", folderTarget: "deportes_cosas", pictogramId: 37086 },
    ] as GridCell[],

    'basquetbol': [

        { id: 'bsk-0',  pos: 0,  label: "yo",                     type: "pronoun",     action: "speak", pictogramId: 6632 },
        { id: 'bsk-1',  pos: 1,  label: "estar",                  type: "verb",        action: "speak", pictogramId: 36392 },
        { id: 'bsk-2',  pos: 2,  label: "ser",                    type: "verb",        action: "speak", pictogramId: 36480 },
        { id: 'bsk-3',  pos: 3,  label: "querer",                 type: "verb",        action: "speak", pictogramId: 11538 },
        { id: 'bsk-4',  pos: 4,  label: "gustar",                 type: "verb",        action: "speak", pictogramId: 37826 },
        { id: 'bsk-5',  pos: 5,  label: "qué",                    type: "adverb",      action: "speak", pictogramId: 22620 },
        { id: 'bsk-6',  pos: 6,  label: "dónde",                  type: "adverb",      action: "speak", pictogramId: 7764 },
        { id: 'bsk-7',  pos: 7,  label: "no",                     type: "adverb",      action: "speak", pictogramId: 5526 },
        { id: 'bsk-8',  pos: 8,  label: "más",                    type: "adverb",      action: "speak", pictogramId: 3220 },

        { id: 'bsk-9',  pos: 9,  label: "tú",                     type: "pronoun",     action: "speak", pictogramId: 12281 },
        { id: 'bsk-10', pos: 10, label: "eso",                    type: "pronoun",     action: "speak", pictogramId: 7091 },
        { id: 'bsk-11', pos: 11, label: "poder",                  type: "verb",        action: "speak", pictogramId: 35949 },
        { id: 'bsk-12', pos: 12, label: "tener",                  type: "verb",        action: "speak", pictogramId: 32761 },
        { id: 'bsk-13', pos: 13, label: "hacer",                  type: "verb",        action: "speak", pictogramId: 32751 },
        { id: 'bsk-14', pos: 14, label: "jugar",                  type: "verb",        action: "speak", pictogramId: 23392 },
        { id: 'bsk-15', pos: 15, label: "a",                      type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'bsk-16', pos: 16, label: "bien",                   type: "adjective",   action: "speak", pictogramId: 5397 },
        { id: 'bsk-17', pos: 17, label: "ya terminé",             type: "adjective",   action: "speak" },

        { id: 'bsk-18', pos: 18, label: "encestar",               type: "verb",        action: "speak", pictogramId: 6487 },
        { id: 'bsk-19', pos: 19, label: "escoltar",               type: "verb",        action: "speak" },
        { id: 'bsk-20', pos: 20, label: "parar",                  type: "verb",        action: "speak", pictogramId: 7196 },
        { id: 'bsk-21', pos: 21, label: "ir",                     type: "verb",        action: "speak", pictogramId: 8142 },
        { id: 'bsk-22', pos: 22, label: "pasar",                  type: "verb",        action: "speak", pictogramId: 6829 },
        { id: 'bsk-23', pos: 23, label: "tirar",                  type: "verb",        action: "speak", pictogramId: 36673 },
        { id: 'bsk-24', pos: 24, label: "en",                     type: "preposition", action: "speak", pictogramId: 7034 },
        { id: 'bsk-25', pos: 25, label: "mal",                    type: "adjective",   action: "speak", pictogramId: 5504 },
        { id: 'bsk-26', pos: 26, label: "lanzar",                 type: "verb",        action: "speak", pictogramId: 6543 },

        { id: 'bsk-27', pos: 27, label: "rebote",                 type: "noun",        action: "speak" },
        { id: 'bsk-28', pos: 28, label: "falta",                  type: "noun",        action: "speak", pictogramId: 37641 },
        { id: 'bsk-29', pos: 29, label: "pelota de básquetbol",   type: "noun",        action: "speak", pictogramId: 27218 },
        { id: 'bsk-30', pos: 30, label: "canasta",                type: "noun",        action: "speak", pictogramId: 3260 },
        { id: 'bsk-31', pos: 31, label: "entrenador",             type: "noun",        action: "speak", pictogramId: 5991 },
        { id: 'bsk-32', pos: 32, label: "partido de básquetbol",  type: "noun",        action: "speak", pictogramId: 31184 },
        { id: 'bsk-33', pos: 33, label: "de",                     type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'bsk-34', pos: 34, label: "jugador",                type: "noun",        action: "speak", pictogramId: 39276 },
        { id: 'bsk-35', pos: 35, label: "tiro libre",             type: "noun",        action: "speak", pictogramId: 36517 },

        { id: 'bsk-36', pos: 36, label: "árbitro",                type: "noun",        action: "speak", pictogramId: 4564 },
        { id: 'bsk-44', pos: 44, label: "Más",                    type: "navigation",  action: "navigate", folderTarget: "basquetbol_2", pictogramId: 3220 },
    ] as GridCell[],

    'basquetbol_2': [

        { id: 'bsk2-0',  pos: 0,  label: "jugar a básquetbol",    type: "verb",  action: "speak", pictogramId: 10163 },
        { id: 'bsk2-1',  pos: 1,  label: "driblar",               type: "verb",  action: "speak", pictogramId: 39223 },
        { id: 'bsk2-2',  pos: 2,  label: "truco",                 type: "noun",  action: "speak", pictogramId: 39690 },
        { id: 'bsk2-3',  pos: 3,  label: "uniforme de básquetbol",type: "noun",  action: "speak" },
        { id: 'bsk2-4',  pos: 4,  label: "Locura de Marzo",       type: "noun",  action: "speak", pictogramId: 6558 },
        { id: 'bsk2-5',  pos: 5,  label: "NBA",                   type: "noun",  action: "speak" },
        { id: 'bsk2-6',  pos: 6,  label: "NCAA",                  type: "noun",  action: "speak" },
        { id: 'bsk2-7',  pos: 7,  label: "cancha de básquetbol",  type: "noun",  action: "speak", pictogramId: 6186 },
        { id: 'bsk2-8',  pos: 8,  label: "equipo de básquetbol",  type: "noun",  action: "speak", pictogramId: 24665 },

        { id: 'bsk2-9',  pos: 9,  label: "escolta",               type: "noun",  action: "speak" },

        { id: 'bsk2-44', pos: 44, label: "Atrás",                 type: "navigation", action: "back", folderTarget: "basquetbol", pictogramId: 37086 },
    ] as GridCell[],

    'boliche': [

        { id: 'bol-0',  pos: 0,  label: "yo",                     type: "pronoun",     action: "speak", pictogramId: 6632 },
        { id: 'bol-1',  pos: 1,  label: "estar",                  type: "verb",        action: "speak", pictogramId: 36392 },
        { id: 'bol-2',  pos: 2,  label: "ser",                    type: "verb",        action: "speak", pictogramId: 36480 },
        { id: 'bol-3',  pos: 3,  label: "querer",                 type: "verb",        action: "speak", pictogramId: 11538 },
        { id: 'bol-4',  pos: 4,  label: "gustar",                 type: "verb",        action: "speak", pictogramId: 37826 },
        { id: 'bol-5',  pos: 5,  label: "qué",                    type: "adverb",      action: "speak", pictogramId: 22620 },
        { id: 'bol-6',  pos: 6,  label: "dónde",                  type: "adverb",      action: "speak", pictogramId: 7764 },
        { id: 'bol-7',  pos: 7,  label: "no",                     type: "adverb",      action: "speak", pictogramId: 5526 },
        { id: 'bol-8',  pos: 8,  label: "más",                    type: "adverb",      action: "speak", pictogramId: 3220 },

        { id: 'bol-9',  pos: 9,  label: "tú",                     type: "pronoun",     action: "speak", pictogramId: 12281 },
        { id: 'bol-10', pos: 10, label: "eso",                    type: "pronoun",     action: "speak", pictogramId: 7091 },
        { id: 'bol-11', pos: 11, label: "poder",                  type: "verb",        action: "speak", pictogramId: 35949 },
        { id: 'bol-12', pos: 12, label: "tener",                  type: "verb",        action: "speak", pictogramId: 32761 },
        { id: 'bol-13', pos: 13, label: "hacer",                  type: "verb",        action: "speak", pictogramId: 32751 },
        { id: 'bol-14', pos: 14, label: "jugar",                  type: "verb",        action: "speak", pictogramId: 23392 },
        { id: 'bol-15', pos: 15, label: "a",                      type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'bol-16', pos: 16, label: "bien",                   type: "adjective",   action: "speak", pictogramId: 5397 },
        { id: 'bol-17', pos: 17, label: "ya terminé",             type: "adjective",   action: "speak" },

        { id: 'bol-18', pos: 18, label: "lanzar",                 type: "verb",        action: "speak", pictogramId: 6543 },
        { id: 'bol-19', pos: 19, label: "Boliche",                type: "noun",        action: "speak" },
        { id: 'bol-20', pos: 20, label: "parar",                  type: "verb",        action: "speak", pictogramId: 7196 },
        { id: 'bol-21', pos: 21, label: "ir",                     type: "verb",        action: "speak", pictogramId: 8142 },
        { id: 'bol-22', pos: 22, label: "bola de boliche",        type: "noun",        action: "speak", pictogramId: 24891 },
        { id: 'bol-23', pos: 23, label: "pino de boliche",        type: "noun",        action: "speak", pictogramId: 39193 },
        { id: 'bol-24', pos: 24, label: "en",                     type: "preposition", action: "speak", pictogramId: 7034 },
        { id: 'bol-25', pos: 25, label: "mal",                    type: "adjective",   action: "speak", pictogramId: 5504 },
        { id: 'bol-26', pos: 26, label: "mesa",                   type: "noun",        action: "speak", pictogramId: 3129 },

        { id: 'bol-27', pos: 27, label: "línea de falta",         type: "noun",        action: "speak", pictogramId: 37684 },
        { id: 'bol-28', pos: 28, label: "tarjeta de puntuación",  type: "noun",        action: "speak", pictogramId: 7269 },
        { id: 'bol-29', pos: 29, label: "zapatos de boliche",     type: "noun",        action: "speak", pictogramId: 37935 },
        { id: 'bol-30', pos: 30, label: "canalón",                type: "noun",        action: "speak", pictogramId: 10254 },
        { id: 'bol-31', pos: 31, label: "split",                  type: "noun",        action: "speak" },
        { id: 'bol-32', pos: 32, label: "chuza",                  type: "noun",        action: "speak", pictogramId: 2945 },
        { id: 'bol-33', pos: 33, label: "de",                     type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'bol-34', pos: 34, label: "rampa",                  type: "noun",        action: "speak", pictogramId: 22799 },

        { id: 'bol-44', pos: 44, label: "Más",                    type: "navigation",  action: "navigate", folderTarget: "boliche_2", pictogramId: 3220 },
    ] as GridCell[],

    'boliche_2': [

        { id: 'bol2-0',  pos: 0,  label: "bolsa para bolas", type: "noun", action: "speak", pictogramId: 37388 },
        { id: 'bol2-1',  pos: 1,  label: "bolera",           type: "noun", action: "speak", pictogramId: 4579 },
        { id: 'bol2-2',  pos: 2,  label: "retorno de bola",  type: "noun", action: "speak", pictogramId: 24891 },
        // Navigation
        { id: 'bol2-44', pos: 44, label: "Atrás",            type: "navigation", action: "back", folderTarget: "boliche", pictogramId: 37086 },
    ] as GridCell[],

    'futbol_americano': [

        { id: 'fa-0',  pos: 0,  label: "yo",             type: "pronoun",     action: "speak", pictogramId: 6632 },
        { id: 'fa-1',  pos: 1,  label: "estar",          type: "verb",        action: "speak", pictogramId: 36392 },
        { id: 'fa-2',  pos: 2,  label: "ser",            type: "verb",        action: "speak", pictogramId: 36480 },
        { id: 'fa-3',  pos: 3,  label: "querer",         type: "verb",        action: "speak", pictogramId: 11538 },
        { id: 'fa-4',  pos: 4,  label: "gustar",         type: "verb",        action: "speak", pictogramId: 37826 },
        { id: 'fa-5',  pos: 5,  label: "qué",            type: "adverb",      action: "speak", pictogramId: 22620 },
        { id: 'fa-6',  pos: 6,  label: "dónde",          type: "adverb",      action: "speak", pictogramId: 7764 },
        { id: 'fa-7',  pos: 7,  label: "no",             type: "adverb",      action: "speak", pictogramId: 5526 },
        { id: 'fa-8',  pos: 8,  label: "más",            type: "adverb",      action: "speak", pictogramId: 3220 },

        { id: 'fa-9',  pos: 9,  label: "tú",            type: "pronoun",     action: "speak", pictogramId: 12281 },
        { id: 'fa-10', pos: 10, label: "eso",           type: "pronoun",     action: "speak", pictogramId: 7091 },
        { id: 'fa-11', pos: 11, label: "poder",         type: "verb",        action: "speak", pictogramId: 35949 },
        { id: 'fa-12', pos: 12, label: "tener",         type: "verb",        action: "speak", pictogramId: 32761 },
        { id: 'fa-13', pos: 13, label: "hacer",         type: "verb",        action: "speak", pictogramId: 32751 },
        { id: 'fa-14', pos: 14, label: "jugar",         type: "verb",        action: "speak", pictogramId: 23392 },
        { id: 'fa-15', pos: 15, label: "a",             type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'fa-16', pos: 16, label: "bien",          type: "adjective",   action: "speak", pictogramId: 5397 },
        { id: 'fa-17', pos: 17, label: "ya terminé",    type: "phrase",      action: "speak" },

        { id: 'fa-18', pos: 18, label: "patear",        type: "verb",        action: "speak", pictogramId: 6977 },
        { id: 'fa-19', pos: 19, label: "correr",        type: "verb",        action: "speak", pictogramId: 6465 },
        { id: 'fa-20', pos: 20, label: "parar",         type: "verb",        action: "speak", pictogramId: 7196 },
        { id: 'fa-21', pos: 21, label: "ir",            type: "verb",        action: "speak", pictogramId: 8142 },
        { id: 'fa-22', pos: 22, label: "pasar",         type: "verb",        action: "speak", pictogramId: 6829 },
        { id: 'fa-23', pos: 23, label: "anotar",        type: "verb",        action: "speak", pictogramId: 6487 },
        { id: 'fa-24', pos: 24, label: "en",            type: "preposition", action: "speak", pictogramId: 7034 },
        { id: 'fa-25', pos: 25, label: "mal",           type: "adjective",   action: "speak", pictogramId: 5504 },
        { id: 'fa-26', pos: 26, label: "taclear",       type: "verb",        action: "speak" },

        { id: 'fa-27', pos: 27, label: "bola",          type: "noun",        action: "speak", pictogramId: 24891 },
        { id: 'fa-28', pos: 28, label: "primero y diez",type: "noun",        action: "speak", pictogramId: 35691 },
        { id: 'fa-29', pos: 29, label: "campo",         type: "noun",        action: "speak", pictogramId: 2683 },
        { id: 'fa-30', pos: 30, label: "partido",       type: "noun",        action: "speak", pictogramId: 6170 },
        { id: 'fa-31', pos: 31, label: "casco",         type: "noun",        action: "speak", pictogramId: 2691 },
        { id: 'fa-32', pos: 32, label: "jugada",        type: "noun",        action: "speak" },
        { id: 'fa-33', pos: 33, label: "de",            type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'fa-34', pos: 34, label: "poste de gol",  type: "noun",        action: "speak", pictogramId: 6007 },
        { id: 'fa-35', pos: 35, label: "medio tiempo",  type: "noun",        action: "speak", pictogramId: 39393 },

        { id: 'fa-36', pos: 36, label: "receptor",      type: "noun",        action: "speak" },
        { id: 'fa-37', pos: 37, label: "árbitro",       type: "noun",        action: "speak", pictogramId: 4564 },
        { id: 'fa-38', pos: 38, label: "touchdown",     type: "noun",        action: "speak" },

        // Navigation
        { id: 'fa-44', pos: 44, label: "Más",           type: "navigation",  action: "navigate", folderTarget: "futbol_americano_2", pictogramId: 3220 },
    ] as GridCell[],

    'futbol_americano_2': [

        { id: 'fa2-0',  pos: 0,  label: "defensa",                           type: "noun", action: "speak", pictogramId: 15322 },
        { id: 'fa2-1',  pos: 1,  label: "ala defensiva",                     type: "noun", action: "speak", pictogramId: 5368 },
        { id: 'fa2-2',  pos: 2,  label: "zona de anotación",                 type: "noun", action: "speak", pictogramId: 38414 },
        { id: 'fa2-3',  pos: 3,  label: "entrenador",                        type: "noun", action: "speak", pictogramId: 5991 },
        { id: 'fa2-4',  pos: 4,  label: "hombreras",                         type: "noun", action: "speak" },
        { id: 'fa2-5',  pos: 5,  label: "jugador de fútbol americano",       type: "noun", action: "speak", pictogramId: 8610 },
        { id: 'fa2-6',  pos: 6,  label: "playoffs",                          type: "noun", action: "speak" },
        { id: 'fa2-7',  pos: 7,  label: "uniforme de fútbol americano",      type: "noun", action: "speak", pictogramId: 19530 },
        { id: 'fa2-8',  pos: 8,  label: "apoyador",                          type: "noun", action: "speak" },

        { id: 'fa2-9',  pos: 9,  label: "mariscal de campo",                 type: "noun", action: "speak", pictogramId: 5066 },
        { id: 'fa2-10', pos: 10, label: "líneas laterales de fútbol americano", type: "noun", action: "speak", pictogramId: 39408 },
        { id: 'fa2-11', pos: 11, label: "equipo de fútbol americano",        type: "noun", action: "speak", pictogramId: 3073 },

        // Navigation
        { id: 'fa2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "futbol_americano", pictogramId: 37086 },
    ] as GridCell[],

    'beisbol': [

        { id: 'bei-0',  pos: 0,  label: "yo",                 type: "pronoun",     action: "speak", pictogramId: 6632 },
        { id: 'bei-1',  pos: 1,  label: "estar",              type: "verb",        action: "speak", pictogramId: 36392 },
        { id: 'bei-2',  pos: 2,  label: "ser",                type: "verb",        action: "speak", pictogramId: 36480 },
        { id: 'bei-3',  pos: 3,  label: "querer",             type: "verb",        action: "speak", pictogramId: 11538 },
        { id: 'bei-4',  pos: 4,  label: "gustar",             type: "verb",        action: "speak", pictogramId: 37826 },
        { id: 'bei-5',  pos: 5,  label: "qué",                type: "adverb",      action: "speak", pictogramId: 22620 },
        { id: 'bei-6',  pos: 6,  label: "dónde",              type: "adverb",      action: "speak", pictogramId: 7764 },
        { id: 'bei-7',  pos: 7,  label: "no",                 type: "adverb",      action: "speak", pictogramId: 5526 },
        { id: 'bei-8',  pos: 8,  label: "más",                type: "adverb",      action: "speak", pictogramId: 3220 },

        { id: 'bei-9',  pos: 9,  label: "tú",                type: "pronoun",     action: "speak", pictogramId: 12281 },
        { id: 'bei-10', pos: 10, label: "eso",               type: "pronoun",     action: "speak", pictogramId: 7091 },
        { id: 'bei-11', pos: 11, label: "poder",             type: "verb",        action: "speak", pictogramId: 35949 },
        { id: 'bei-12', pos: 12, label: "tener",             type: "verb",        action: "speak", pictogramId: 32761 },
        { id: 'bei-13', pos: 13, label: "hacer",             type: "verb",        action: "speak", pictogramId: 32751 },
        { id: 'bei-14', pos: 14, label: "jugar",             type: "verb",        action: "speak", pictogramId: 23392 },
        { id: 'bei-15', pos: 15, label: "a",                 type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'bei-16', pos: 16, label: "bien",              type: "adjective",   action: "speak", pictogramId: 5397 },
        { id: 'bei-17', pos: 17, label: "ya terminé",        type: "phrase",      action: "speak" },

        { id: 'bei-18', pos: 18, label: "hit",               type: "verb",        action: "speak", pictogramId: 5399 },
        { id: 'bei-19', pos: 19, label: "lanzar",            type: "verb",        action: "speak", pictogramId: 6543 },
        { id: 'bei-20', pos: 20, label: "parar",             type: "verb",        action: "speak", pictogramId: 7196 },
        { id: 'bei-21', pos: 21, label: "ir",                type: "verb",        action: "speak", pictogramId: 8142 },
        { id: 'bei-22', pos: 22, label: "atrapar",           type: "verb",        action: "speak", pictogramId: 8188 },
        { id: 'bei-23', pos: 23, label: "correr",            type: "verb",        action: "speak", pictogramId: 6465 },
        { id: 'bei-24', pos: 24, label: "en",                type: "preposition", action: "speak", pictogramId: 7034 },
        { id: 'bei-25', pos: 25, label: "mal",               type: "adjective",   action: "speak", pictogramId: 5504 },
        { id: 'bei-26', pos: 26, label: "pelota de béisbol", type: "noun",        action: "speak", pictogramId: 8660 },

        { id: 'bei-27', pos: 27, label: "guante de béisbol",  type: "noun",        action: "speak", pictogramId: 8595 },
        { id: 'bei-28', pos: 28, label: "strike",             type: "noun",        action: "speak" },
        { id: 'bei-29', pos: 29, label: "bola fuera de juego",type: "noun",        action: "speak", pictogramId: 36431 },
        { id: 'bei-30', pos: 30, label: "a salvo",            type: "adjective",   action: "speak", pictogramId: 39393 },
        { id: 'bei-31', pos: 31, label: "out",                type: "noun",        action: "speak", pictogramId: 4885 },
        { id: 'bei-32', pos: 32, label: "jonrón",             type: "noun",        action: "speak" },
        { id: 'bei-33', pos: 33, label: "de",                 type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'bei-34', pos: 34, label: "primera base",       type: "noun",        action: "speak", pictogramId: 31334 },
        { id: 'bei-35', pos: 35, label: "plato",              type: "noun",        action: "speak", pictogramId: 16857 },

        // Navigation
        { id: 'bei-44', pos: 44, label: "Más",               type: "navigation",  action: "navigate", folderTarget: "beisbol_2", pictogramId: 3220 },
    ] as GridCell[],

    'beisbol_2': [
        { id: 'bei2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "beisbol", pictogramId: 37086 },
    ] as GridCell[],

    'automovilismo': [

        { id: 'auto-0',  pos: 0,  label: "yo",                    type: "pronoun",     action: "speak", pictogramId: 6632 },
        { id: 'auto-1',  pos: 1,  label: "estar",                 type: "verb",        action: "speak", pictogramId: 36392 },
        { id: 'auto-2',  pos: 2,  label: "ser",                   type: "verb",        action: "speak", pictogramId: 36480 },
        { id: 'auto-3',  pos: 3,  label: "querer",                type: "verb",        action: "speak", pictogramId: 11538 },
        { id: 'auto-4',  pos: 4,  label: "gustar",                type: "verb",        action: "speak", pictogramId: 37826 },
        { id: 'auto-5',  pos: 5,  label: "qué",                   type: "adverb",      action: "speak", pictogramId: 22620 },
        { id: 'auto-6',  pos: 6,  label: "dónde",                 type: "adverb",      action: "speak", pictogramId: 7764 },
        { id: 'auto-7',  pos: 7,  label: "no",                    type: "adverb",      action: "speak", pictogramId: 5526 },
        { id: 'auto-8',  pos: 8,  label: "más",                   type: "adverb",      action: "speak", pictogramId: 3220 },

        { id: 'auto-9',  pos: 9,  label: "tú",                    type: "pronoun",     action: "speak", pictogramId: 12281 },
        { id: 'auto-10', pos: 10, label: "eso",                   type: "pronoun",     action: "speak", pictogramId: 7091 },
        { id: 'auto-11', pos: 11, label: "poder",                 type: "verb",        action: "speak", pictogramId: 35949 },
        { id: 'auto-12', pos: 12, label: "tener",                 type: "verb",        action: "speak", pictogramId: 32761 },
        { id: 'auto-13', pos: 13, label: "hacer",                 type: "verb",        action: "speak", pictogramId: 32751 },
        { id: 'auto-14', pos: 14, label: "jugar",                 type: "verb",        action: "speak", pictogramId: 23392 },
        { id: 'auto-15', pos: 15, label: "a",                     type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'auto-16', pos: 16, label: "bien",                  type: "adjective",   action: "speak", pictogramId: 5397 },
        { id: 'auto-17', pos: 17, label: "ya terminé",            type: "adjective",   action: "speak" },

        { id: 'auto-18', pos: 18, label: "correr",                type: "verb",        action: "speak", pictogramId: 6465 },
        { id: 'auto-19', pos: 19, label: "chocar",                type: "verb",        action: "speak", pictogramId: 4551 },
        { id: 'auto-20', pos: 20, label: "parar",                 type: "verb",        action: "speak", pictogramId: 7196 },
        { id: 'auto-21', pos: 21, label: "ir",                    type: "verb",        action: "speak", pictogramId: 8142 },
        { id: 'auto-22', pos: 22, label: "rebasar",               type: "verb",        action: "speak" },
        { id: 'auto-23', pos: 23, label: "NASCAR",                type: "noun",        action: "speak" },
        { id: 'auto-24', pos: 24, label: "en",                    type: "preposition", action: "speak", pictogramId: 7034 },
        { id: 'auto-25', pos: 25, label: "mal",                   type: "adjective",   action: "speak", pictogramId: 5504 },
        { id: 'auto-26', pos: 26, label: "auto de NASCAR",        type: "noun",        action: "speak", pictogramId: 37616 },

        { id: 'auto-27', pos: 27, label: "carrera de IndyCar",    type: "noun",        action: "speak", pictogramId: 36105 },
        { id: 'auto-28', pos: 28, label: "carrera de NASCAR",     type: "noun",        action: "speak", pictogramId: 36105 },
        { id: 'auto-29', pos: 29, label: "ganador de IndyCar",    type: "noun",        action: "speak", pictogramId: 11578 },
        { id: 'auto-30', pos: 30, label: "equipo de pits",        type: "noun",        action: "speak", pictogramId: 24665 },
        { id: 'auto-31', pos: 31, label: "museo de IndyCar",      type: "noun",        action: "speak", pictogramId: 3132 },
        { id: 'auto-32', pos: 32, label: "circuito de carreras",  type: "noun",        action: "speak", pictogramId: 38898 },
        { id: 'auto-33', pos: 33, label: "de",                    type: "preposition", action: "speak", pictogramId: 7074 },
        // pos 34–35 empty (no content)

        { id: 'auto-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "deportes_cosas_2", pictogramId: 37086 },
    ] as GridCell[],

    'futbol_mls': [

        { id: 'fml-0',  pos: 0,  label: "yo",                    type: "pronoun",     action: "speak", pictogramId: 6632 },
        { id: 'fml-1',  pos: 1,  label: "estar",                 type: "verb",        action: "speak", pictogramId: 36392 },
        { id: 'fml-2',  pos: 2,  label: "ser",                   type: "verb",        action: "speak", pictogramId: 36480 },
        { id: 'fml-3',  pos: 3,  label: "querer",                type: "verb",        action: "speak", pictogramId: 11538 },
        { id: 'fml-4',  pos: 4,  label: "gustar",                type: "verb",        action: "speak", pictogramId: 37826 },
        { id: 'fml-5',  pos: 5,  label: "qué",                   type: "adverb",      action: "speak", pictogramId: 22620 },
        { id: 'fml-6',  pos: 6,  label: "dónde",                 type: "adverb",      action: "speak", pictogramId: 7764 },
        { id: 'fml-7',  pos: 7,  label: "no",                    type: "adverb",      action: "speak", pictogramId: 5526 },
        { id: 'fml-8',  pos: 8,  label: "más",                   type: "adverb",      action: "speak", pictogramId: 3220 },

        { id: 'fml-9',  pos: 9,  label: "tú",                    type: "pronoun",     action: "speak", pictogramId: 12281 },
        { id: 'fml-10', pos: 10, label: "eso",                   type: "pronoun",     action: "speak", pictogramId: 7091 },
        { id: 'fml-11', pos: 11, label: "poder",                 type: "verb",        action: "speak", pictogramId: 35949 },
        { id: 'fml-12', pos: 12, label: "tener",                 type: "verb",        action: "speak", pictogramId: 32761 },
        { id: 'fml-13', pos: 13, label: "hacer",                 type: "verb",        action: "speak", pictogramId: 32751 },
        { id: 'fml-14', pos: 14, label: "jugar",                 type: "verb",        action: "speak", pictogramId: 23392 },
        { id: 'fml-15', pos: 15, label: "a",                     type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'fml-16', pos: 16, label: "bien",                  type: "adjective",   action: "speak", pictogramId: 5397 },
        { id: 'fml-17', pos: 17, label: "ya terminé",            type: "adjective",   action: "speak" },

        { id: 'fml-18', pos: 18, label: "patear",                type: "verb",        action: "speak", pictogramId: 6977 },
        { id: 'fml-19', pos: 19, label: "marcar",                type: "verb",        action: "speak", pictogramId: 4691 },
        { id: 'fml-20', pos: 20, label: "parar",                 type: "verb",        action: "speak", pictogramId: 7196 },
        { id: 'fml-21', pos: 21, label: "ir",                    type: "verb",        action: "speak", pictogramId: 8142 },
        { id: 'fml-22', pos: 22, label: "pitar",                 type: "verb",        action: "speak", pictogramId: 7250 },
        { id: 'fml-23', pos: 23, label: "balón de futbol",       type: "noun",        action: "speak", pictogramId: 8610 },
        { id: 'fml-24', pos: 24, label: "en",                    type: "preposition", action: "speak", pictogramId: 7034 },
        { id: 'fml-25', pos: 25, label: "mal",                   type: "adjective",   action: "speak", pictogramId: 5504 },
        { id: 'fml-26', pos: 26, label: "botas de futbol",       type: "noun",        action: "speak", pictogramId: 16585 },

        { id: 'fml-27', pos: 27, label: "descuento",             type: "noun",        action: "speak" },
        { id: 'fml-28', pos: 28, label: "portería",              type: "noun",        action: "speak", pictogramId: 2535 },
        { id: 'fml-29', pos: 29, label: "penalti",               type: "noun",        action: "speak", pictogramId: 27021 },
        { id: 'fml-30', pos: 30, label: "tarjeta roja",          type: "noun",        action: "speak", pictogramId: 8371 },
        { id: 'fml-31', pos: 31, label: "cancha",                type: "noun",        action: "speak", pictogramId: 6186 },
        { id: 'fml-32', pos: 32, label: "partido",               type: "noun",        action: "speak", pictogramId: 6170 },
        { id: 'fml-33', pos: 33, label: "de",                    type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'fml-34', pos: 34, label: "equipo de fútbol",      type: "noun",        action: "speak", pictogramId: 3073 },
        { id: 'fml-35', pos: 35, label: "tarjeta amarilla",      type: "noun",        action: "speak", pictogramId: 8370 },

        { id: 'fml-36', pos: 36, label: "futbolista",            type: "noun",        action: "speak", pictogramId: 3199 },
        { id: 'fml-37', pos: 37, label: "Club Brugge",           type: "noun",        action: "speak", pictogramId: 29919 },
        { id: 'fml-38', pos: 38, label: "Copa del Mundo",        type: "noun",        action: "speak", pictogramId: 30014 },
        { id: 'fml-39', pos: 39, label: "penalti",               type: "noun",        action: "speak", pictogramId: 27021 },
        // pos 40-43 empty
        { id: 'fml-44', pos: 44, label: "Más",                   type: "navigation",  action: "navigate", folderTarget: "futbol_mls_2", pictogramId: 3220 },
    ] as GridCell[],

    'futbol_mls_2': [

        { id: 'fml2-0',  pos: 0,  label: "FIFA",                     type: "noun", action: "speak" },
        { id: 'fml2-1',  pos: 1,  label: "Major League Soccer",      type: "noun", action: "speak" },
        { id: 'fml2-2',  pos: 2,  label: "MLS Eastern Division",     type: "noun", action: "speak", pictogramId: 5707 },
        { id: 'fml2-3',  pos: 3,  label: "New England Revolution",   type: "noun", action: "speak", pictogramId: 8261 },
        { id: 'fml2-4',  pos: 4,  label: "temporada de fútbol",      type: "noun", action: "speak", pictogramId: 8610 },
        { id: 'fml2-5',  pos: 5,  label: "estadio de fútbol",        type: "noun", action: "speak", pictogramId: 5993 },
        { id: 'fml2-6',  pos: 6,  label: "Socceroos",                type: "noun", action: "speak" },
        { id: 'fml2-7',  pos: 7,  label: "Western MLS",              type: "noun", action: "speak" },
        { id: 'fml2-8',  pos: 8,  label: "Copa Mundial",             type: "noun", action: "speak", pictogramId: 9074 },

        { id: 'fml2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "futbol_mls", pictogramId: 37086 },
    ] as GridCell[],

    'pensamientos': [

        { id: 'pens-0',  pos: 0,  label: "yo",           type: "pronoun",     action: "speak", pictogramId: 6632 },
        { id: 'pens-1',  pos: 1,  label: "estar",        type: "verb",        action: "speak", pictogramId: 36392 },
        { id: 'pens-2',  pos: 2,  label: "ser",          type: "verb",        action: "speak", pictogramId: 36480 },
        { id: 'pens-3',  pos: 3,  label: "querer",       type: "verb",        action: "speak", pictogramId: 11538 },
        { id: 'pens-4',  pos: 4,  label: "gustar",       type: "verb",        action: "speak", pictogramId: 37826 },
        { id: 'pens-5',  pos: 5,  label: "qué",          type: "adverb",      action: "speak", pictogramId: 22620 },
        { id: 'pens-6',  pos: 6,  label: "dónde",        type: "adverb",      action: "speak", pictogramId: 7764 },
        { id: 'pens-7',  pos: 7,  label: "no",           type: "adverb",      action: "speak", pictogramId: 5526 },
        { id: 'pens-8',  pos: 8,  label: "más",          type: "adverb",      action: "speak", pictogramId: 3220 },

        { id: 'pens-9',  pos: 9,  label: "tú",           type: "pronoun",     action: "speak", pictogramId: 12281 },
        { id: 'pens-10', pos: 10, label: "eso",          type: "pronoun",     action: "speak", pictogramId: 7091 },
        { id: 'pens-11', pos: 11, label: "poder",        type: "verb",        action: "speak", pictogramId: 35949 },
        { id: 'pens-12', pos: 12, label: "tener",        type: "verb",        action: "speak", pictogramId: 32761 },
        { id: 'pens-13', pos: 13, label: "hacer",        type: "verb",        action: "speak", pictogramId: 32751 },
        { id: 'pens-14', pos: 14, label: "poner",        type: "verb",        action: "speak", pictogramId: 32757 },
        { id: 'pens-15', pos: 15, label: "decisión",     type: "noun",        action: "speak", pictogramId: 14670 },
        { id: 'pens-16', pos: 16, label: "deseo",        type: "noun",        action: "speak", pictogramId: 38001 },
        { id: 'pens-17', pos: 17, label: "ya terminé",   type: "adjective",   action: "speak" },

        { id: 'pens-18', pos: 18, label: "discurso",     type: "noun",        action: "speak" },
        { id: 'pens-19', pos: 19, label: "idea",         type: "noun",        action: "speak", pictogramId: 6019 },
        { id: 'pens-20', pos: 20, label: "mala idea",    type: "noun",        action: "speak", pictogramId: 13378 },
        { id: 'pens-21', pos: 21, label: "mente",        type: "noun",        action: "speak", pictogramId: 3210 },
        { id: 'pens-22', pos: 22, label: "mentira",      type: "noun",        action: "speak" },
        { id: 'pens-23', pos: 23, label: "muerte",       type: "noun",        action: "speak", pictogramId: 16359 },
        { id: 'pens-24', pos: 24, label: "oración",      type: "noun",        action: "speak", pictogramId: 30850 },
        { id: 'pens-25', pos: 25, label: "pensamiento",  type: "noun",        action: "speak", pictogramId: 26310 },
        { id: 'pens-26', pos: 26, label: "pesadilla",    type: "noun",        action: "speak", pictogramId: 24272 },

        { id: 'pens-27', pos: 27, label: "plan",         type: "noun",        action: "speak", pictogramId: 2528 },
        { id: 'pens-28', pos: 28, label: "problema",     type: "noun",        action: "speak", pictogramId: 5556 },
        { id: 'pens-29', pos: 29, label: "promesa",      type: "noun",        action: "speak" },
        { id: 'pens-30', pos: 30, label: "razón",        type: "noun",        action: "speak", pictogramId: 5739 },
        { id: 'pens-31', pos: 31, label: "respuesta",    type: "noun",        action: "speak", pictogramId: 39692 },
        { id: 'pens-32', pos: 32, label: "soñar",        type: "verb",        action: "speak", pictogramId: 7257 },
        { id: 'pens-33', pos: 33, label: "verdad",       type: "noun",        action: "speak", pictogramId: 8715 },
        { id: 'pens-34', pos: 34, label: "vida",         type: "noun",        action: "speak", pictogramId: 8717 },
        { id: 'pens-35', pos: 35, label: "talento",      type: "noun",        action: "speak" },

        { id: 'pens-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "pensamientos_2", pictogramId: 3220 },
    ] as GridCell[],

    'pensamientos_2': [

        { id: 'pens2-0',  pos: 0,  label: "imaginación", type: "noun", action: "speak", pictogramId: 38003 },
        { id: 'pens2-1',  pos: 1,  label: "memoria",     type: "noun", action: "speak", pictogramId: 9157 },
        { id: 'pens2-2',  pos: 2,  label: "voto",        type: "noun", action: "speak", pictogramId: 24603 },
        // pos 3–35 empty — intentional, no placeholder buttons

        { id: 'pens2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "pensamientos", pictogramId: 37086 },
    ] as GridCell[],

    'herramientas': [

        { id: 'herr-0',  pos: 0,  label: "yo",                    type: "pronoun",     action: "speak", pictogramId: 6632 },
        { id: 'herr-1',  pos: 1,  label: "estar",                 type: "verb",        action: "speak", pictogramId: 36392 },
        { id: 'herr-2',  pos: 2,  label: "ser",                   type: "verb",        action: "speak", pictogramId: 36480 },
        { id: 'herr-3',  pos: 3,  label: "querer",                type: "verb",        action: "speak", pictogramId: 11538 },
        { id: 'herr-4',  pos: 4,  label: "gustar",                type: "verb",        action: "speak", pictogramId: 37826 },
        { id: 'herr-5',  pos: 5,  label: "qué",                   type: "adverb",      action: "speak", pictogramId: 22620 },
        { id: 'herr-6',  pos: 6,  label: "dónde",                 type: "adverb",      action: "speak", pictogramId: 7764 },
        { id: 'herr-7',  pos: 7,  label: "no",                    type: "adverb",      action: "speak", pictogramId: 5526 },
        { id: 'herr-8',  pos: 8,  label: "más",                   type: "adverb",      action: "speak", pictogramId: 3220 },

        { id: 'herr-9',  pos: 9,  label: "tú",                    type: "pronoun",     action: "speak", pictogramId: 12281 },
        { id: 'herr-10', pos: 10, label: "eso",                   type: "pronoun",     action: "speak", pictogramId: 7091 },
        { id: 'herr-11', pos: 11, label: "poder",                 type: "verb",        action: "speak", pictogramId: 35949 },
        { id: 'herr-12', pos: 12, label: "tener",                 type: "verb",        action: "speak", pictogramId: 32761 },
        { id: 'herr-13', pos: 13, label: "hacer",                 type: "verb",        action: "speak", pictogramId: 32751 },
        { id: 'herr-14', pos: 14, label: "poner",                 type: "verb",        action: "speak", pictogramId: 32757 },
        { id: 'herr-15', pos: 15, label: "herramientas",          type: "noun",        action: "speak", pictogramId: 7127 },
        { id: 'herr-16', pos: 16, label: "caja de herramientas",  type: "noun",        action: "speak", pictogramId: 2676 },
        { id: 'herr-17', pos: 17, label: "ya terminé",            type: "adjective",   action: "speak" },

        { id: 'herr-18', pos: 18, label: "cuerda",                type: "noun",        action: "speak", pictogramId: 7006 },
        { id: 'herr-19', pos: 19, label: "destornillador",        type: "noun",        action: "speak", pictogramId: 2736 },
        { id: 'herr-20', pos: 20, label: "escalera",              type: "noun",        action: "speak", pictogramId: 2379 },
        { id: 'herr-21', pos: 21, label: "flexómetro",            type: "noun",        action: "speak" },
        { id: 'herr-22', pos: 22, label: "linterna",              type: "noun",        action: "speak", pictogramId: 6138 },
        { id: 'herr-23', pos: 23, label: "llave inglesa",         type: "noun",        action: "speak", pictogramId: 2937 },
        { id: 'herr-24', pos: 24, label: "manguera",              type: "noun",        action: "speak", pictogramId: 2929 },
        { id: 'herr-25', pos: 25, label: "martillo",              type: "noun",        action: "speak", pictogramId: 2922 },
        { id: 'herr-26', pos: 26, label: "pala",                  type: "noun",        action: "speak", pictogramId: 2867 },

        { id: 'herr-27', pos: 27, label: "pinzas",                type: "noun",        action: "speak", pictogramId: 2833 },
        { id: 'herr-28', pos: 28, label: "podadora",              type: "noun",        action: "speak" },
        { id: 'herr-29', pos: 29, label: "sopladora de hojas",    type: "noun",        action: "speak", pictogramId: 28571 },
        { id: 'herr-30', pos: 30, label: "taladro",               type: "noun",        action: "speak", pictogramId: 3392 },
        { id: 'herr-31', pos: 31, label: "clavo",                 type: "noun",        action: "speak", pictogramId: 8306 },
        { id: 'herr-32', pos: 32, label: "serrucho",              type: "noun",        action: "speak", pictogramId: 2799 },
        // pos 33–35 empty

        { id: 'herr-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "herramientas_2", pictogramId: 3220 },
    ] as GridCell[],

    'herramientas_2': [
        { id: 'herr2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "herramientas", pictogramId: 37086 },
    ] as GridCell[],
    'juguetes': [{ id: 'jug-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cosas_2", pictogramId: 37086 }] as GridCell[],
    'primavera': [{ id: 'pri-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cosas_2", pictogramId: 37086 }] as GridCell[],
    'verano': [{ id: 'ver-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cosas_2", pictogramId: 37086 }] as GridCell[],
    'otono': [{ id: 'oto-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cosas_2", pictogramId: 37086 }] as GridCell[],
    'invierno': [{ id: 'inv-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "cosas_2", pictogramId: 37086 }] as GridCell[],

    'diversion': [
        { id: 'div-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "root", pictogramId: 37086 }
    ] as GridCell[],

    'accesorios_ropa_2': [
        { id: 'acc2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "accesorios_ropa", pictogramId: 37086 }
    ] as GridCell[],

    'articulos_arte': [
        // Fila 1
        { id: 'art-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'art-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'art-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'art-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'art-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'art-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'art-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'art-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'art-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2
        { id: 'art-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'art-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'art-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'art-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'art-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'art-14', pos: 14, label: "poner", type: "verb", action: "speak", pictogramId: 32757 },
        { id: 'art-15', pos: 15, label: "Colores", type: "folder", action: "navigate", folderTarget: "colores", pictogramId: 7075 },
        { id: 'art-16', pos: 16, label: "Formas", type: "folder", action: "navigate", folderTarget: "formas", pictogramId: 4651 },
        { id: 'art-17', pos: 17, label: "ya terminé", type: "adverb", action: "speak" },

        // Fila 3
        { id: 'art-18', pos: 18, label: "lapicero", type: "noun", action: "speak", pictogramId: 2440 },
        { id: 'art-19', pos: 19, label: "borrador", type: "noun", action: "speak", pictogramId: 2409 },
        { id: 'art-20', pos: 20, label: "stickers", type: "noun", action: "speak" },
        { id: 'art-21', pos: 21, label: "cartulina", type: "noun", action: "speak", pictogramId: 17208 },
        { id: 'art-22', pos: 22, label: "cinta adhesiva", type: "noun", action: "speak", pictogramId: 27681 },
        { id: 'art-23', pos: 23, label: "crayola", type: "noun", action: "speak" },
        { id: 'art-24', pos: 24, label: "mandil", type: "noun", action: "speak", pictogramId: 2366 },
        { id: 'art-25', pos: 25, label: "escarcha", type: "noun", action: "speak" },
        { id: 'art-26', pos: 26, label: "engrapadora", type: "noun", action: "speak" },

        // Fila 4
        { id: 'art-27', pos: 27, label: "lápiz", type: "noun", action: "speak", pictogramId: 2440 },
        { id: 'art-28', pos: 28, label: "plumón", type: "noun", action: "speak" },
        { id: 'art-29', pos: 29, label: "papel", type: "noun", action: "speak", pictogramId: 8349 },
        { id: 'art-30', pos: 30, label: "goma", type: "noun", action: "speak", pictogramId: 2409 },
        { id: 'art-31', pos: 31, label: "goma en barra", type: "noun", action: "speak", pictogramId: 38853 },
        { id: 'art-32', pos: 32, label: "perforadora", type: "noun", action: "speak", pictogramId: 24420 },
        { id: 'art-33', pos: 33, label: "pincel", type: "noun", action: "speak", pictogramId: 2523 },
        { id: 'art-34', pos: 34, label: "témpera", type: "noun", action: "speak" },
        { id: 'art-35', pos: 35, label: "plastilina", type: "noun", action: "speak", pictogramId: 2529 },

        // Fila 5
        { id: 'art-36', pos: 36, label: "regla", type: "noun", action: "speak", pictogramId: 32490 },
        { id: 'art-37', pos: 37, label: "tijera", type: "noun", action: "speak", pictogramId: 4964 },
        { id: 'art-38', pos: 38, label: "tajador", type: "noun", action: "speak" },
        { id: 'art-39', pos: 39, label: "cartuchera", type: "noun", action: "speak" },
        { id: 'art-40', pos: 40, label: "cuaderno", type: "noun", action: "speak", pictogramId: 2359 },
        { id: 'art-41', pos: 41, label: "lápices", type: "noun", action: "speak", pictogramId: 2440 },
        { id: 'art-42', pos: 42, label: "pintura", type: "noun", action: "speak", pictogramId: 4870 },
        { id: 'art-43', pos: 43, label: "limpiatipo", type: "noun", action: "speak" },
        { id: 'art-44', pos: 44, label: "Más", type: "navigation", action: "navigate", folderTarget: "articulos_arte_2", pictogramId: 3220 }
    ] as GridCell[],

    'articulos_arte_2': [
        { id: 'art2-0', pos: 0, label: "folder", type: "noun", action: "speak" },
        { id: 'art2-1', pos: 1, label: "lana", type: "noun", action: "speak", pictogramId: 2948 },
        { id: 'art2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "articulos_arte", pictogramId: 37086 }
    ] as GridCell[],

    'palabras_inicio': [
        // Fila 1
        { id: 'pi-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'pi-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'pi-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'pi-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'pi-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'pi-5', pos: 5, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'pi-6', pos: 6, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'pi-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'pi-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2
        { id: 'pi-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'pi-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'pi-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'pi-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'pi-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'pi-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'pi-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'pi-16', pos: 16, label: "bien", type: "adjective", action: "speak", pictogramId: 5397 },
        { id: 'pi-17', pos: 17, label: "ya terminé", type: "adverb", action: "speak" },

        // Fila 3
        { id: 'pi-19', pos: 19, label: "esto", type: "pronoun", action: "speak", pictogramId: 7095 },
        { id: 'pi-20', pos: 20, label: "parar", type: "verb", action: "speak", pictogramId: 7196 },
        { id: 'pi-21', pos: 21, label: "ir", type: "verb", action: "speak", pictogramId: 8142 },
        { id: 'pi-22', pos: 22, label: "venir", type: "verb", action: "speak", pictogramId: 32669 },
        { id: 'pi-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 },
        { id: 'pi-24', pos: 24, label: "en", type: "preposition", action: "speak", pictogramId: 7034 },
        { id: 'pi-25', pos: 25, label: "mal", type: "adjective", action: "speak", pictogramId: 5504 },
        { id: 'pi-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Fila 4
        { id: 'pi-29', pos: 29, label: "comer", type: "verb", action: "speak", pictogramId: 6456 },
        { id: 'pi-30', pos: 30, label: "ayudar", type: "verb", action: "speak", pictogramId: 32648 },
        { id: 'pi-31', pos: 31, label: "mirar", type: "verb", action: "speak", pictogramId: 6564 },
        { id: 'pi-32', pos: 32, label: "con", type: "preposition", action: "speak", pictogramId: 7064 },
        { id: 'pi-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },

        // Fila 5
        { id: 'pi-36', pos: 36, label: "Cerrar", type: "navigation", action: "back", folderTarget: "root", pictogramId: 24976 }
    ] as GridCell[],

    'cricket': [

        { id: 'cri-0',  pos: 0,  label: "yo",                   type: "pronoun",     action: "speak", pictogramId: 6632 },
        { id: 'cri-1',  pos: 1,  label: "estar",                type: "verb",        action: "speak", pictogramId: 36392 },
        { id: 'cri-2',  pos: 2,  label: "ser",                  type: "verb",        action: "speak", pictogramId: 36480 },
        { id: 'cri-3',  pos: 3,  label: "querer",               type: "verb",        action: "speak", pictogramId: 11538 },
        { id: 'cri-4',  pos: 4,  label: "gustar",               type: "verb",        action: "speak", pictogramId: 37826 },
        { id: 'cri-5',  pos: 5,  label: "qué",                  type: "adverb",      action: "speak", pictogramId: 22620 },
        { id: 'cri-6',  pos: 6,  label: "dónde",                type: "adverb",      action: "speak", pictogramId: 7764 },
        { id: 'cri-7',  pos: 7,  label: "no",                   type: "adverb",      action: "speak", pictogramId: 5526 },
        { id: 'cri-8',  pos: 8,  label: "más",                  type: "adverb",      action: "speak", pictogramId: 3220 },

        { id: 'cri-9',  pos: 9,  label: "tú",                  type: "pronoun",     action: "speak", pictogramId: 12281 },
        { id: 'cri-10', pos: 10, label: "eso",                 type: "pronoun",     action: "speak", pictogramId: 7091 },
        { id: 'cri-11', pos: 11, label: "poder",               type: "verb",        action: "speak", pictogramId: 35949 },
        { id: 'cri-12', pos: 12, label: "tener",               type: "verb",        action: "speak", pictogramId: 32761 },
        { id: 'cri-13', pos: 13, label: "hacer",               type: "verb",        action: "speak", pictogramId: 32751 },
        { id: 'cri-14', pos: 14, label: "jugar",               type: "verb",        action: "speak", pictogramId: 23392 },
        { id: 'cri-15', pos: 15, label: "a",                   type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'cri-16', pos: 16, label: "bien",                type: "adjective",   action: "speak", pictogramId: 5397 },
        { id: 'cri-17', pos: 17, label: "ya terminé",          type: "phrase",      action: "speak" },

        { id: 'cri-18', pos: 18, label: "cricket",             type: "noun",        action: "speak" },
        { id: 'cri-19', pos: 19, label: "bateador",            type: "noun",        action: "speak" },
        { id: 'cri-20', pos: 20, label: "parar",               type: "verb",        action: "speak", pictogramId: 7196 },
        { id: 'cri-21', pos: 21, label: "ir",                  type: "verb",        action: "speak", pictogramId: 8142 },
        { id: 'cri-22', pos: 22, label: "boleador",            type: "noun",        action: "speak" },
        { id: 'cri-23', pos: 23, label: "Cricket Australia",   type: "noun",        action: "speak", pictogramId: 21393 },
        { id: 'cri-24', pos: 24, label: "en",                  type: "preposition", action: "speak", pictogramId: 7034 },
        { id: 'cri-25', pos: 25, label: "mal",                 type: "adjective",   action: "speak", pictogramId: 5504 },
        { id: 'cri-26', pos: 26, label: "travesáño de cricket", type: "noun",        action: "speak" },

        { id: 'cri-27', pos: 27, label: "pelota de cricket",   type: "noun",        action: "speak", pictogramId: 27218 },
        { id: 'cri-28', pos: 28, label: "bat",                 type: "noun",        action: "speak", pictogramId: 36121 },
        { id: 'cri-29', pos: 29, label: "partido de cricket",  type: "noun",        action: "speak", pictogramId: 31184 },
        { id: 'cri-30', pos: 30, label: "equipo de cricket",   type: "noun",        action: "speak", pictogramId: 24665 },
        { id: 'cri-31', pos: 31, label: "fildeador",           type: "noun",        action: "speak" },
        { id: 'cri-33', pos: 33, label: "de",                  type: "preposition", action: "speak", pictogramId: 7074 },

        // Navigation — single page, back to sports hub
        { id: 'cri-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "deportes_cosas", pictogramId: 37086 },
    ] as GridCell[],

    'carreras_caballos': [

        { id: 'cc-0',  pos: 0,  label: "yo",                          type: "pronoun",     action: "speak", pictogramId: 6632 },
        { id: 'cc-1',  pos: 1,  label: "estar",                       type: "verb",        action: "speak", pictogramId: 36392 },
        { id: 'cc-2',  pos: 2,  label: "ser",                         type: "verb",        action: "speak", pictogramId: 36480 },
        { id: 'cc-3',  pos: 3,  label: "querer",                      type: "verb",        action: "speak", pictogramId: 11538 },
        { id: 'cc-4',  pos: 4,  label: "gustar",                      type: "verb",        action: "speak", pictogramId: 37826 },
        { id: 'cc-5',  pos: 5,  label: "qué",                         type: "adverb",      action: "speak", pictogramId: 22620 },
        { id: 'cc-6',  pos: 6,  label: "dónde",                       type: "adverb",      action: "speak", pictogramId: 7764 },
        { id: 'cc-7',  pos: 7,  label: "no",                          type: "adverb",      action: "speak", pictogramId: 5526 },
        { id: 'cc-8',  pos: 8,  label: "más",                         type: "adverb",      action: "speak", pictogramId: 3220 },

        { id: 'cc-9',  pos: 9,  label: "tú",                         type: "pronoun",     action: "speak", pictogramId: 12281 },
        { id: 'cc-10', pos: 10, label: "eso",                        type: "pronoun",     action: "speak", pictogramId: 7091 },
        { id: 'cc-11', pos: 11, label: "poder",                      type: "verb",        action: "speak", pictogramId: 35949 },
        { id: 'cc-12', pos: 12, label: "tener",                      type: "verb",        action: "speak", pictogramId: 32761 },
        { id: 'cc-13', pos: 13, label: "hacer",                      type: "verb",        action: "speak", pictogramId: 32751 },
        { id: 'cc-14', pos: 14, label: "jugar",                      type: "verb",        action: "speak", pictogramId: 23392 },
        { id: 'cc-15', pos: 15, label: "a",                          type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'cc-16', pos: 16, label: "bien",                       type: "adjective",   action: "speak", pictogramId: 5397 },
        { id: 'cc-17', pos: 17, label: "ya terminé",                 type: "phrase",      action: "speak" },

        { id: 'cc-18', pos: 18, label: "correr",                     type: "verb",        action: "speak", pictogramId: 6465 },
        { id: 'cc-19', pos: 19, label: "caballo",                    type: "noun",        action: "speak", pictogramId: 2294 },
        { id: 'cc-20', pos: 20, label: "parar",                      type: "verb",        action: "speak", pictogramId: 7196 },
        { id: 'cc-21', pos: 21, label: "ir",                         type: "verb",        action: "speak", pictogramId: 8142 },
        { id: 'cc-22', pos: 22, label: "carrera de caballos",        type: "noun",        action: "speak", pictogramId: 34830 },
        { id: 'cc-23', pos: 23, label: "jinete",                     type: "noun",        action: "speak", pictogramId: 3169 },
        { id: 'cc-24', pos: 24, label: "en",                         type: "preposition", action: "speak", pictogramId: 7034 },
        { id: 'cc-25', pos: 25, label: "mal",                        type: "adjective",   action: "speak", pictogramId: 5504 },
        { id: 'cc-26', pos: 26, label: "casco de jinete",            type: "noun",        action: "speak", pictogramId: 3169 },

        { id: 'cc-27', pos: 27, label: "adiestrador de caballos de carrera", type: "noun", action: "speak", pictogramId: 29939 },
        { id: 'cc-32', pos: 32, label: "de",                         type: "preposition", action: "speak", pictogramId: 7074 },

        // Navigation — single page, back to sports hub
        { id: 'cc-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "deportes_cosas", pictogramId: 37086 },
    ] as GridCell[],

    'burbujas': [
        // Fila 1
        { id: 'bur-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'bur-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'bur-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'bur-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'bur-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'bur-5', pos: 5, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'bur-6', pos: 6, label: "quién", type: "adverb", action: "speak", pictogramId: 9853 },
        { id: 'bur-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'bur-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2
        { id: 'bur-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'bur-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'bur-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'bur-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'bur-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'bur-14', pos: 14, label: "dar", type: "verb", action: "speak", pictogramId: 28431 },
        { id: 'bur-15', pos: 15, label: "pegajoso", type: "adjective", action: "speak", pictogramId: 25307 },
        { id: 'bur-16', pos: 16, label: "bonito", type: "adjective", action: "speak", pictogramId: 11194 },
        { id: 'bur-17', pos: 17, label: "ya terminé", type: "adverb", action: "speak" },

        // Fila 3
        { id: 'bur-18', pos: 18, label: "soplar", type: "verb", action: "speak", pictogramId: 7258 },
        { id: 'bur-19', pos: 19, label: "esto", type: "pronoun", action: "speak", pictogramId: 7095 },
        { id: 'bur-20', pos: 20, label: "parar", type: "verb", action: "speak", pictogramId: 7196 },
        { id: 'bur-21', pos: 21, label: "ir", type: "verb", action: "speak", pictogramId: 8142 },
        { id: 'bur-22', pos: 22, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 },
        { id: 'bur-23', pos: 23, label: "varita", type: "noun", action: "speak", pictogramId: 6240 },
        { id: 'bur-24', pos: 24, label: "en", type: "preposition", action: "speak", pictogramId: 7034 },
        { id: 'bur-25', pos: 25, label: "húmedo", type: "adjective", action: "speak" },
        { id: 'bur-26', pos: 26, label: "tonto", type: "adjective", action: "speak" },

        // Fila 4
        { id: 'bur-27', pos: 27, label: "reventar", type: "verb", action: "speak" },
        { id: 'bur-28', pos: 28, label: "derramar", type: "verb", action: "speak", pictogramId: 5982 },
        { id: 'bur-29', pos: 29, label: "limpiar", type: "verb", action: "speak", pictogramId: 3351 },
        { id: 'bur-30', pos: 30, label: "ayudar", type: "verb", action: "speak", pictogramId: 32648 },
        { id: 'bur-31', pos: 31, label: "mirar", type: "verb", action: "speak", pictogramId: 6564 },
        { id: 'bur-32', pos: 32, label: "botella", type: "noun", action: "speak", pictogramId: 2288 },
        { id: 'bur-33', pos: 33, label: "tapón", type: "noun", action: "speak", pictogramId: 7267 },
        { id: 'bur-34', pos: 34, label: "mano", type: "noun", action: "speak", pictogramId: 2928 },
        { id: 'bur-35', pos: 35, label: "brilloso", type: "adjective", action: "speak" },

        // Fila 5
        { id: 'bur-36', pos: 36, label: "atrapar", type: "verb", action: "speak", pictogramId: 8188 },
        { id: 'bur-37', pos: 37, label: "flotar", type: "verb", action: "speak", pictogramId: 21876 },
        { id: 'bur-39', pos: 39, label: "pie", type: "noun", action: "speak", pictogramId: 25327 },
        { id: 'bur-40', pos: 40, label: "cabello", type: "noun", action: "speak", pictogramId: 2851 },
        { id: 'bur-41', pos: 41, label: "piso", type: "noun", action: "speak", pictogramId: 2575 },
        { id: 'bur-42', pos: 42, label: "techo", type: "noun", action: "speak", pictogramId: 2583 },
        { id: 'bur-43', pos: 43, label: "burbujas", type: "noun", action: "speak", pictogramId: 6945 },
        { id: 'bur-44', pos: 44, label: "Palabras de Inicio", type: "navigation", action: "navigate", folderTarget: "palabras_inicio", pictogramId: 38222 }
    ] as GridCell[],

    'supermercado': [
        // Fila 1
        { id: 'sup-0', pos: 0, label: "yo", type: "pronoun", action: "speak", pictogramId: 6632 },
        { id: 'sup-1', pos: 1, label: "estar", type: "verb", action: "speak", pictogramId: 36392 },
        { id: 'sup-2', pos: 2, label: "ser", type: "verb", action: "speak", pictogramId: 36480 },
        { id: 'sup-3', pos: 3, label: "querer", type: "verb", action: "speak", pictogramId: 11538 },
        { id: 'sup-4', pos: 4, label: "gustar", type: "verb", action: "speak", pictogramId: 37826 },
        { id: 'sup-5', pos: 5, label: "dónde", type: "adverb", action: "speak", pictogramId: 7764 },
        { id: 'sup-6', pos: 6, label: "qué", type: "adverb", action: "speak", pictogramId: 22620 },
        { id: 'sup-7', pos: 7, label: "no", type: "adverb", action: "speak", pictogramId: 5526 },
        { id: 'sup-8', pos: 8, label: "más", type: "adverb", action: "speak", pictogramId: 3220 },

        // Fila 2
        { id: 'sup-9', pos: 9, label: "tú", type: "pronoun", action: "speak", pictogramId: 12281 },
        { id: 'sup-10', pos: 10, label: "eso", type: "pronoun", action: "speak", pictogramId: 7091 },
        { id: 'sup-11', pos: 11, label: "poder", type: "verb", action: "speak", pictogramId: 35949 },
        { id: 'sup-12', pos: 12, label: "tener", type: "verb", action: "speak", pictogramId: 32761 },
        { id: 'sup-13', pos: 13, label: "hacer", type: "verb", action: "speak", pictogramId: 32751 },
        { id: 'sup-14', pos: 14, label: "delicioso", type: "adjective", action: "speak", pictogramId: 32340 },
        { id: 'sup-15', pos: 15, label: "a", type: "preposition", action: "speak", pictogramId: 3021 },
        { id: 'sup-16', pos: 16, label: "suficiente", type: "adjective", action: "speak" },
        { id: 'sup-17', pos: 17, label: "ya terminé", type: "adverb", action: "speak" },

        // Fila 3
        { id: 'sup-18', pos: 18, label: "comprar", type: "verb", action: "speak", pictogramId: 8986 },
        { id: 'sup-19', pos: 19, label: "esto", type: "pronoun", action: "speak", pictogramId: 7095 },
        { id: 'sup-20', pos: 20, label: "parar", type: "verb", action: "speak", pictogramId: 7196 },
        { id: 'sup-21', pos: 21, label: "ir", type: "verb", action: "speak", pictogramId: 8142 },
        { id: 'sup-22', pos: 22, label: "venir", type: "verb", action: "speak", pictogramId: 32669 },
        { id: 'sup-23', pos: 23, label: "tomar", type: "verb", action: "speak", pictogramId: 10148 },
        { id: 'sup-24', pos: 24, label: "en", type: "preposition", action: "speak", pictogramId: 7034 },
        { id: 'sup-25', pos: 25, label: "demasiado", type: "adjective", action: "speak", pictogramId: 39188 },
        { id: 'sup-26', pos: 26, label: "algo", type: "pronoun", action: "speak", pictogramId: 38768 },

        // Fila 4
        { id: 'sup-27', pos: 27, label: "empujar", type: "verb", action: "speak", pictogramId: 6485 },
        { id: 'sup-28', pos: 28, label: "olvidar", type: "verb", action: "speak", pictogramId: 26258 },
        { id: 'sup-29', pos: 29, label: "alcanzar", type: "verb", action: "speak", pictogramId: 24208 },
        { id: 'sup-30', pos: 30, label: "ayudar", type: "verb", action: "speak", pictogramId: 32648 },
        { id: 'sup-31', pos: 31, label: "mirar", type: "verb", action: "speak", pictogramId: 6564 },
        { id: 'sup-32', pos: 32, label: "con", type: "preposition", action: "speak", pictogramId: 7064 },
        { id: 'sup-33', pos: 33, label: "de", type: "preposition", action: "speak", pictogramId: 7074 },
        { id: 'sup-34', pos: 34, label: "lista", type: "noun", action: "speak", pictogramId: 7144 },
        { id: 'sup-35', pos: 35, label: "pesado", type: "adjective", action: "speak", pictogramId: 27025 },

        // Fila 5
        { id: 'sup-36', pos: 36, label: "llevar", type: "verb", action: "speak", pictogramId: 6553 },
        { id: 'sup-38', pos: 38, label: "carrito", type: "noun", action: "speak", pictogramId: 5948 },
        { id: 'sup-39', pos: 39, label: "bolsa de papel", type: "noun", action: "speak", pictogramId: 23849 },
        { id: 'sup-40', pos: 40, label: "dinero", type: "folder", action: "navigate", folderTarget: "dinero", pictogramId: 4630 },
        { id: 'sup-41', pos: 41, label: "compra", type: "noun", action: "speak", pictogramId: 9058 },
        { id: 'sup-42', pos: 42, label: "Comida", type: "folder", action: "navigate", folderTarget: "comida", pictogramId: 4610 },
        { id: 'sup-43', pos: 43, label: "Cosas de limpieza", type: "folder", action: "navigate", folderTarget: "cosas_2", pictogramId: 16059 },
        { id: 'sup-44', pos: 44, label: "Palabras de Inicio", type: "navigation", action: "navigate", folderTarget: "palabras_inicio", pictogramId: 38222 }
    ] as GridCell[],

    'edificios': [
        // Row 1 (a → ba)
        { id: 'edif-0',  pos: 0,  label: "acera",           type: "noun", action: "speak", pictogramId: 2247 },
        { id: 'edif-1',  pos: 1,  label: "arco",            type: "noun", action: "speak", pictogramId: 2535 },
        { id: 'edif-2',  pos: 2,  label: "ascensor",        type: "noun", action: "speak", pictogramId: 2260 },
        { id: 'edif-3',  pos: 3,  label: "balcón",          type: "noun", action: "speak", pictogramId: 8254 },
        { id: 'edif-4',  pos: 4,  label: "baño",            type: "noun", action: "speak", pictogramId: 6929 },
        { id: 'edif-5',  pos: 5,  label: "barandilla",      type: "noun", action: "speak", pictogramId: 37021 },
        { id: 'edif-6',  pos: 6,  label: "bodega",          type: "noun", action: "speak", pictogramId: 27608 },
        { id: 'edif-7',  pos: 7,  label: "buhardilla",      type: "noun", action: "speak", pictogramId: 8047 },
        { id: 'edif-8',  pos: 8,  label: "buzón",           type: "noun", action: "speak", pictogramId: 2293 },

        // Row 2 (ca → co)
        { id: 'edif-9',  pos: 9,  label: "calefacción",     type: "noun", action: "speak", pictogramId: 34872 },
        { id: 'edif-10', pos: 10, label: "canaleta",        type: "noun", action: "speak", pictogramId: 36189 },
        { id: 'edif-11', pos: 11, label: "cantera",         type: "noun", action: "speak" },
        { id: 'edif-12', pos: 12, label: "cartel",          type: "noun", action: "speak", pictogramId: 8064 },
        { id: 'edif-13', pos: 13, label: "celosía",         type: "noun", action: "speak" },
        { id: 'edif-14', pos: 14, label: "cerradura",       type: "noun", action: "speak", pictogramId: 3261 },
        { id: 'edif-15', pos: 15, label: "cobertizo",       type: "noun", action: "speak" },
        { id: 'edif-16', pos: 16, label: "columna",         type: "noun", action: "speak", pictogramId: 31308 },
        { id: 'edif-17', pos: 17, label: "comedor",         type: "noun", action: "speak", pictogramId: 5970 },

        // Row 3 (co → do)
        { id: 'edif-18', pos: 18, label: "corredor",        type: "noun", action: "speak", pictogramId: 8544 },
        { id: 'edif-19', pos: 19, label: "cuarto",          type: "noun", action: "speak", pictogramId: 5436 },
        { id: 'edif-20', pos: 20, label: "desván",          type: "noun", action: "speak" },
        { id: 'edif-21', pos: 21, label: "dormitorio",      type: "noun", action: "speak", pictogramId: 5988 },
        { id: 'edif-22', pos: 22, label: "ducha",           type: "noun", action: "speak", pictogramId: 32426 },
        { id: 'edif-23', pos: 23, label: "entrada",         type: "noun", action: "speak", pictogramId: 11254 },
        { id: 'edif-24', pos: 24, label: "escalera",        type: "noun", action: "speak", pictogramId: 2379 },
        { id: 'edif-25', pos: 25, label: "estacionamiento", type: "noun", action: "speak", pictogramId: 24755 },
        { id: 'edif-26', pos: 26, label: "fachada",         type: "noun", action: "speak", pictogramId: 39779 },

        // Row 4 (ga → pu)
        { id: 'edif-27', pos: 27, label: "garage",          type: "noun", action: "speak" },
        { id: 'edif-28', pos: 28, label: "grifo",           type: "noun", action: "speak", pictogramId: 2414 },
        { id: 'edif-29', pos: 29, label: "habitación",      type: "noun", action: "speak", pictogramId: 5988 },
        { id: 'edif-30', pos: 30, label: "jardín",          type: "noun", action: "speak", pictogramId: 2434 },
        { id: 'edif-31', pos: 31, label: "pared",           type: "noun", action: "speak", pictogramId: 2860 },
        { id: 'edif-32', pos: 32, label: "pasillo",         type: "noun", action: "speak", pictogramId: 16315 },
        { id: 'edif-33', pos: 33, label: "patio",           type: "noun", action: "speak", pictogramId: 33064 },
        { id: 'edif-34', pos: 34, label: "piso",            type: "noun", action: "speak", pictogramId: 2575 },
        { id: 'edif-35', pos: 35, label: "planta baja",     type: "noun", action: "speak", pictogramId: 27477 },

        // Row 5 (pu → ve)
        { id: 'edif-36', pos: 36, label: "puerta",          type: "noun", action: "speak", pictogramId: 3244 },
        { id: 'edif-37', pos: 37, label: "puerta principal",type: "noun", action: "speak", pictogramId: 4687 },
        { id: 'edif-38', pos: 38, label: "sala",            type: "noun", action: "speak", pictogramId: 30387 },
        { id: 'edif-39', pos: 39, label: "sótano",          type: "noun", action: "speak", pictogramId: 8223 },
        { id: 'edif-40', pos: 40, label: "terraza",         type: "noun", action: "speak", pictogramId: 22129 },
        { id: 'edif-41', pos: 41, label: "umbral",          type: "noun", action: "speak" },
        { id: 'edif-42', pos: 42, label: "ventana",         type: "noun", action: "speak", pictogramId: 2611 },
        { id: 'edif-43', pos: 43, label: "ventilación",     type: "noun", action: "speak", pictogramId: 28043 },
        { id: 'edif-44', pos: 44, label: "Más",             type: "navigation", action: "navigate", folderTarget: "edificios_2", pictogramId: 3220 }
    ] as GridCell[],

    'edificios_2': [
        // Row 1 (9 items: cerca → techo)
        { id: 'edif2-0',  pos: 0,  label: "cerca",                type: "noun", action: "speak", pictogramId: 30383 },
        { id: 'edif2-1',  pos: 1,  label: "chimenea",             type: "noun", action: "speak", pictogramId: 2333 },
        { id: 'edif2-2',  pos: 2,  label: "escalera eléctrica",   type: "noun", action: "speak", pictogramId: 38151 },
        { id: 'edif2-3',  pos: 3,  label: "papel tapiz",          type: "noun", action: "speak", pictogramId: 30981 },
        { id: 'edif2-4',  pos: 4,  label: "perilla",              type: "noun", action: "speak", pictogramId: 38536 },
        { id: 'edif2-5',  pos: 5,  label: "portón",               type: "noun", action: "speak" },
        { id: 'edif2-6',  pos: 6,  label: "puertas automáticas",  type: "noun", action: "speak", pictogramId: 36698 },
        { id: 'edif2-7',  pos: 7,  label: "repisa",               type: "noun", action: "speak" },
        { id: 'edif2-8',  pos: 8,  label: "techo",                type: "noun", action: "speak", pictogramId: 2583 },

        // Row 2 (2 items: tejado, timbre — remaining cells empty per R3)
        { id: 'edif2-9',  pos: 9,  label: "tejado",               type: "noun", action: "speak", pictogramId: 2584 },
        { id: 'edif2-10', pos: 10, label: "timbre",               type: "noun", action: "speak", pictogramId: 2592 },

        // Navigation — "Atrás 1" → back to page 1 (R2)
        { id: 'edif2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "edificios", pictogramId: 37086 }
    ] as GridCell[],

    'lectura': [

        { id: 'lec-0',  pos: 0,  label: "yo",           type: "pronoun",  action: "speak", pictogramId: 6632 },
        { id: 'lec-1',  pos: 1,  label: "estar",        type: "verb",     action: "speak", pictogramId: 36392 },
        { id: 'lec-2',  pos: 2,  label: "ser",          type: "verb",     action: "speak", pictogramId: 36480 },
        { id: 'lec-3',  pos: 3,  label: "querer",       type: "verb",     action: "speak", pictogramId: 11538 },
        { id: 'lec-4',  pos: 4,  label: "gustar",       type: "verb",     action: "speak", pictogramId: 37826 },
        { id: 'lec-5',  pos: 5,  label: "qué",          type: "adverb",   action: "speak", pictogramId: 22620 },
        { id: 'lec-6',  pos: 6,  label: "dónde",        type: "adverb",   action: "speak", pictogramId: 7764 },
        { id: 'lec-7',  pos: 7,  label: "no",           type: "adverb",   action: "speak", pictogramId: 5526 },
        { id: 'lec-8',  pos: 8,  label: "más",          type: "adverb",   action: "speak", pictogramId: 3220 },

        { id: 'lec-9',  pos: 9,  label: "tú",           type: "pronoun",  action: "speak", pictogramId: 12281 },
        { id: 'lec-10', pos: 10, label: "eso",          type: "pronoun",  action: "speak", pictogramId: 7091 },
        { id: 'lec-11', pos: 11, label: "poder",        type: "verb",     action: "speak", pictogramId: 35949 },
        { id: 'lec-12', pos: 12, label: "tener",        type: "verb",     action: "speak", pictogramId: 32761 },
        { id: 'lec-13', pos: 13, label: "hacer",        type: "verb",     action: "speak", pictogramId: 32751 },
        { id: 'lec-14', pos: 14, label: "actuar",       type: "verb",     action: "speak", pictogramId: 35709 },  // Contextual slot 6
        { id: 'lec-15', pos: 15, label: "leer",         type: "verb",     action: "speak", pictogramId: 7141 },  // Contextual slot 7
        { id: 'lec-16', pos: 16, label: "bien",         type: "adjective",action: "speak", pictogramId: 5397 },
        { id: 'lec-17', pos: 17, label: "ya terminé",   type: "phrase",   action: "speak" },

        { id: 'lec-18', pos: 18, label: "voltear página",type: "noun",   action: "speak", pictogramId: 38578 },
        { id: 'lec-19', pos: 19, label: "esto",         type: "pronoun",  action: "speak", pictogramId: 7095 },
        { id: 'lec-20', pos: 20, label: "escribir",     type: "verb",     action: "speak", pictogramId: 2380 },
        { id: 'lec-21', pos: 21, label: "algo distinto",type: "phrase",   action: "speak", pictogramId: 32386 },
        { id: 'lec-22', pos: 22, label: "libro",        type: "noun",     action: "speak", pictogramId: 25191 },
        { id: 'lec-23', pos: 23, label: "Internet",     type: "noun",     action: "speak", pictogramId: 37366 },
        { id: 'lec-24', pos: 24, label: "carta",        type: "noun",     action: "speak", pictogramId: 2688 },
        { id: 'lec-25', pos: 25, label: "mal",          type: "adjective",action: "speak", pictogramId: 5504 },
        { id: 'lec-26', pos: 26, label: "algo",         type: "pronoun",  action: "speak", pictogramId: 38768 },

        { id: 'lec-27', pos: 27, label: "revista",      type: "noun",     action: "speak", pictogramId: 24364 },
        { id: 'lec-28', pos: 28, label: "periódico",    type: "noun",     action: "speak", pictogramId: 2845 },
        { id: 'lec-29', pos: 29, label: "página",       type: "noun",     action: "speak", pictogramId: 20115 },
        { id: 'lec-30', pos: 30, label: "historia",     type: "noun",     action: "speak", pictogramId: 32634 },
        { id: 'lec-31', pos: 31, label: "léeme",        type: "phrase",   action: "speak" },
        { id: 'lec-32', pos: 32, label: "Leer otra vez",type: "phrase",   action: "speak", pictogramId: 30872 },
        { id: 'lec-33', pos: 33, label: "Libros",       type: "folder",   action: "navigate", folderTarget: "libros", pictogramId: 25191 },  // R6 — subcategory embedded
        { id: 'lec-34', pos: 34, label: "DC Comics",    type: "noun",     action: "speak" },
        { id: 'lec-35', pos: 35, label: "tarjeta de felicitación", type: "noun", action: "speak", pictogramId: 28115 },

        { id: 'lec-36', pos: 36, label: "oración",      type: "noun",     action: "speak", pictogramId: 30850 },

        // Navigation — Más... 2 (R8, paginación)
        { id: 'lec-44', pos: 44, label: "Más",          type: "navigation", action: "navigate", folderTarget: "lectura_2", pictogramId: 3220 }
    ] as GridCell[],

    'lectura_2': [

        { id: 'lec2-0',  pos: 0,  label: "deletrear",              type: "verb",  action: "speak"  },  // Pinned
        { id: 'lec2-1',  pos: 1,  label: "regresar a la página anterior", type: "phrase", action: "speak", pictogramId: 39738 }, // Pinned
        { id: 'lec2-2',  pos: 2,  label: "argumento",              type: "noun",  action: "speak" },
        { id: 'lec2-3',  pos: 3,  label: "audiolibro",             type: "noun",  action: "speak", pictogramId: 26650 },
        { id: 'lec2-4',  pos: 4,  label: "biblioteca",             type: "noun",  action: "speak", pictogramId: 6063 },
        { id: 'lec2-5',  pos: 5,  label: "blog",                   type: "noun",  action: "speak", pictogramId: 16577 },
        { id: 'lec2-6',  pos: 6,  label: "capítulo",               type: "noun",  action: "speak", pictogramId: 39769 },
        { id: 'lec2-7',  pos: 7,  label: "diccionario",            type: "noun",  action: "speak", pictogramId: 7024 },
        { id: 'lec2-8',  pos: 8,  label: "eLibro",                 type: "noun",  action: "speak" },

        { id: 'lec2-9',  pos: 9,  label: "Facebook",               type: "noun",  action: "speak" },
        { id: 'lec2-10', pos: 10, label: "fónicos",                type: "noun",  action: "speak" },
        { id: 'lec2-11', pos: 11, label: "Google",                 type: "noun",  action: "speak" },
        { id: 'lec2-12', pos: 12, label: "idea principal",         type: "noun",  action: "speak", pictogramId: 6019 },
        { id: 'lec2-13', pos: 13, label: "invitación",             type: "noun",  action: "speak", pictogramId: 37535 },
        { id: 'lec2-14', pos: 14, label: "lectura guiada",         type: "noun",  action: "speak", pictogramId: 25686 },
        { id: 'lec2-15', pos: 15, label: "libro en CD",            type: "noun",  action: "speak", pictogramId: 9820 },
        { id: 'lec2-16', pos: 16, label: "mensaje",                type: "noun",  action: "speak", pictogramId: 37867 },
        { id: 'lec2-17', pos: 17, label: "mensaje de texto",       type: "noun",  action: "speak", pictogramId: 37867 },

        { id: 'lec2-18', pos: 18, label: "News-2-You",             type: "noun",  action: "speak", pictogramId: 29530 },
        { id: 'lec2-19', pos: 19, label: "pared de palabras",      type: "noun",  action: "speak", pictogramId: 26324 },
        { id: 'lec2-20', pos: 20, label: "párrafo",                type: "noun",  action: "speak" },
        { id: 'lec2-21', pos: 21, label: "personaje principal",    type: "noun",  action: "speak" },
        { id: 'lec2-22', pos: 22, label: "sílaba",                 type: "noun",  action: "speak", pictogramId: 32722 },
        { id: 'lec2-23', pos: 23, label: "tarjeta de la biblioteca",type: "noun", action: "speak", pictogramId: 28115 },
        { id: 'lec2-24', pos: 24, label: "tarjeta postal",         type: "noun",  action: "speak", pictogramId: 28119 },
        { id: 'lec2-25', pos: 25, label: "tira de oraciones",      type: "noun",  action: "speak", pictogramId: 36454 },
        { id: 'lec2-26', pos: 26, label: "título",                 type: "noun",  action: "speak", pictogramId: 37406 },

        { id: 'lec2-27', pos: 27, label: "twitter",                type: "noun",  action: "speak" },

        // Navigation — "Atrás 1" (R2)
        { id: 'lec2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "lectura", pictogramId: 37086 }
    ] as GridCell[],

    'libros': [

        { id: 'lib-0',  pos: 0,  label: "yo",                   type: "pronoun",  action: "speak", pictogramId: 6632 },
        { id: 'lib-1',  pos: 1,  label: "estar",                type: "verb",     action: "speak", pictogramId: 36392 },
        { id: 'lib-2',  pos: 2,  label: "ser",                  type: "verb",     action: "speak", pictogramId: 36480 },
        { id: 'lib-3',  pos: 3,  label: "querer",               type: "verb",     action: "speak", pictogramId: 11538 },
        { id: 'lib-4',  pos: 4,  label: "gustar",               type: "verb",     action: "speak", pictogramId: 37826 },
        { id: 'lib-5',  pos: 5,  label: "qué",                  type: "adverb",   action: "speak", pictogramId: 22620 },
        { id: 'lib-6',  pos: 6,  label: "dónde",                type: "adverb",   action: "speak", pictogramId: 7764 },
        { id: 'lib-7',  pos: 7,  label: "no",                   type: "adverb",   action: "speak", pictogramId: 5526 },
        { id: 'lib-8',  pos: 8,  label: "más",                  type: "adverb",   action: "speak", pictogramId: 3220 },

        // Slot de cierre: "ya terminé" (R14) en lugar de "bien"
        { id: 'lib-9',  pos: 9,  label: "tú",                   type: "pronoun",  action: "speak", pictogramId: 12281 },
        { id: 'lib-10', pos: 10, label: "eso",                  type: "pronoun",  action: "speak", pictogramId: 7091 },
        { id: 'lib-11', pos: 11, label: "poder",                type: "verb",     action: "speak", pictogramId: 35949 },
        { id: 'lib-12', pos: 12, label: "tener",                type: "verb",     action: "speak", pictogramId: 32761 },
        { id: 'lib-13', pos: 13, label: "hacer",                type: "verb",     action: "speak", pictogramId: 32751 },
        { id: 'lib-14', pos: 14, label: "poner",                type: "verb",     action: "speak", pictogramId: 32757 },
        { id: 'lib-15', pos: 15, label: "tomar libro prestado", type: "verb",     action: "speak", pictogramId: 8235 },  // Contextual slot 7
        { id: 'lib-16', pos: 16, label: "leer",                 type: "verb",     action: "speak", pictogramId: 7141 },  // Contextual slot 8
        { id: 'lib-17', pos: 17, label: "ya terminé",           type: "phrase",   action: "speak" },  // R14 — finite-activity closer

        { id: 'lib-18', pos: 18, label: "La Sirenita",          type: "noun",     action: "speak" },

        // Navigation — Más... 2
        { id: 'lib-44', pos: 44, label: "Más",                  type: "navigation", action: "navigate", folderTarget: "libros_2", pictogramId: 3220 }
    ] as GridCell[],

    'libros_2': [
        // Row 1 (añadir títulos de libros del usuario aquí)
        // Navigation
        { id: 'lib2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "libros", pictogramId: 37086 }
    ] as GridCell[],

    'escolares': [

        { id: 'esc-0',  pos: 0,  label: "yo",                 type: "pronoun",  action: "speak", pictogramId: 6632 },
        { id: 'esc-1',  pos: 1,  label: "estar",              type: "verb",     action: "speak", pictogramId: 36392 },
        { id: 'esc-2',  pos: 2,  label: "ser",                type: "verb",     action: "speak", pictogramId: 36480 },
        { id: 'esc-3',  pos: 3,  label: "querer",             type: "verb",     action: "speak", pictogramId: 11538 },
        { id: 'esc-4',  pos: 4,  label: "gustar",             type: "verb",     action: "speak", pictogramId: 37826 },
        { id: 'esc-5',  pos: 5,  label: "qué",                type: "adverb",   action: "speak", pictogramId: 22620 },
        { id: 'esc-6',  pos: 6,  label: "dónde",              type: "adverb",   action: "speak", pictogramId: 7764 },
        { id: 'esc-7',  pos: 7,  label: "no",                 type: "adverb",   action: "speak", pictogramId: 5526 },
        { id: 'esc-8',  pos: 8,  label: "más",                type: "adverb",   action: "speak", pictogramId: 3220 },

        { id: 'esc-9',  pos: 9,  label: "tú",                 type: "pronoun",  action: "speak", pictogramId: 12281 },
        { id: 'esc-10', pos: 10, label: "eso",                type: "pronoun",  action: "speak", pictogramId: 7091 },
        { id: 'esc-11', pos: 11, label: "poder",              type: "verb",     action: "speak", pictogramId: 35949 },
        { id: 'esc-12', pos: 12, label: "tener",              type: "verb",     action: "speak", pictogramId: 32761 },
        { id: 'esc-13', pos: 13, label: "hacer",              type: "verb",     action: "speak", pictogramId: 32751 },
        { id: 'esc-14', pos: 14, label: "poner",              type: "verb",     action: "speak", pictogramId: 32757 },  // Contextual domain verb
        { id: 'esc-15', pos: 15, label: "lapicero",           type: "noun",     action: "speak", pictogramId: 2440 },  // Promoted (R17)
        { id: 'esc-16', pos: 16, label: "borrador",           type: "noun",     action: "speak", pictogramId: 2409 },  // Promoted (R17)
        { id: 'esc-17', pos: 17, label: "ya terminé",         type: "phrase",   action: "speak" },  // R20

        { id: 'esc-18', pos: 18, label: "carpeta",            type: "noun",     action: "speak", pictogramId: 3233 },
        { id: 'esc-19', pos: 19, label: "carpeta de anillas", type: "noun",     action: "speak", pictogramId: 8828 },
        { id: 'esc-20', pos: 20, label: "cinta adhesiva",     type: "noun",     action: "speak", pictogramId: 27681 },
        { id: 'esc-21', pos: 21, label: "clip",               type: "noun",     action: "speak", pictogramId: 10309 },
        { id: 'esc-22', pos: 22, label: "copiadora",          type: "noun",     action: "speak" },
        { id: 'esc-23', pos: 23, label: "cuaderno",           type: "noun",     action: "speak", pictogramId: 2359 },
        { id: 'esc-24', pos: 24, label: "engrapadora",        type: "noun",     action: "speak"  },
        { id: 'esc-25', pos: 25, label: "lápiz",              type: "noun",     action: "speak", pictogramId: 2440 },
        { id: 'esc-26', pos: 26, label: "plumones de pizarra",type: "noun",     action: "speak", pictogramId: 9162 },

        { id: 'esc-27', pos: 27, label: "mochila",            type: "noun",     action: "speak", pictogramId: 2475 },
        { id: 'esc-28', pos: 28, label: "papel",              type: "noun",     action: "speak", pictogramId: 8349 },
        { id: 'esc-29', pos: 29, label: "goma",               type: "noun",     action: "speak", pictogramId: 2409 },
        { id: 'esc-30', pos: 30, label: "perforadora",        type: "noun",     action: "speak", pictogramId: 24420 },
        { id: 'esc-31', pos: 31, label: "regla",              type: "noun",     action: "speak", pictogramId: 32490 },
        { id: 'esc-32', pos: 32, label: "sobre",              type: "noun",     action: "speak", pictogramId: 7814 },
        { id: 'esc-33', pos: 33, label: "tijeras",            type: "noun",     action: "speak", pictogramId: 2591 },
        { id: 'esc-34', pos: 34, label: "plumón",             type: "noun",     action: "speak" },
        { id: 'esc-35', pos: 35, label: "tajador",            type: "noun",     action: "speak" },

        { id: 'esc-36', pos: 36, label: "crayolas",           type: "noun",     action: "speak" },
        { id: 'esc-37', pos: 37, label: "lápices de colores", type: "noun",     action: "speak", pictogramId: 17016 },
        { id: 'esc-38', pos: 38, label: "goma en barra",      type: "noun",     action: "speak", pictogramId: 38853 },
        { id: 'esc-39', pos: 39, label: "útiles escolares",   type: "noun",     action: "speak", pictogramId: 6664 },
        { id: 'esc-40', pos: 40, label: "cartuchera",         type: "noun",     action: "speak" },
        { id: 'esc-41', pos: 41, label: "agenda",             type: "noun",     action: "speak", pictogramId: 5898 },
        { id: 'esc-42', pos: 42, label: "papeles de colores", type: "noun",     action: "speak", pictogramId: 8677 },
        { id: 'esc-43', pos: 43, label: "mochila grande",     type: "noun",        action: "speak", pictogramId: 37519 },
        { id: 'esc-44', pos: 44, label: "Más",                 type: "navigation",  action: "navigate", folderTarget: "escolares_2", pictogramId: 3220 },
    ] as GridCell[],

    'escolares_2': [

        { id: 'esc2-0',  pos: 0,  label: "almohadilla de tinta",    type: "noun", action: "speak", pictogramId: 5095 },
        { id: 'esc2-1',  pos: 1,  label: "etiquetas",               type: "noun", action: "speak", pictogramId: 9920 },
        { id: 'esc2-2',  pos: 2,  label: "gis",                     type: "noun", action: "speak", pictogramId: 2677 },
        { id: 'esc2-3',  pos: 3,  label: "liga",                    type: "noun", action: "speak", pictogramId: 15523 },
        { id: 'esc2-4',  pos: 4,  label: "marcatextos",             type: "noun", action: "speak" },
        { id: 'esc2-5',  pos: 5,  label: "pizarrón",               type: "noun", action: "speak", pictogramId: 2526 },
        { id: 'esc2-6',  pos: 6,  label: "portapapeles",            type: "noun", action: "speak", pictogramId: 39557 },
        { id: 'esc2-7',  pos: 7,  label: "recipiente de reciclaje", type: "noun", action: "speak", pictogramId: 37635 },
        { id: 'esc2-8',  pos: 8,  label: "sello",                   type: "noun", action: "speak", pictogramId: 2802 },

        { id: 'esc2-9',  pos: 9,  label: "trituradora de papel",    type: "noun", action: "speak", pictogramId: 31428 },
        { id: 'esc2-10', pos: 10, label: "témperas",                type: "noun", action: "speak", pictogramId: 35793 },
        { id: 'esc2-11', pos: 11, label: "pincel",                  type: "noun", action: "speak", pictogramId: 2523 },

        { id: 'esc2-44', pos: 44, label: "Atrás", type: "navigation", action: "back", folderTarget: "escolares", pictogramId: 37086 },
    ] as GridCell[],

};

export const CATEGORY_COLORS: Record<string, string> = {
    pronoun: "bg-orange-200 border-orange-400",
    verb: "bg-pink-200 border-pink-400",
    noun: "bg-yellow-200 border-yellow-400", // Standard Fitzgerald key
    adjective: "bg-blue-200 border-blue-400",
    adverb: "bg-blue-200 border-blue-400", // Often same as adjective
    preposition: "bg-green-200 border-green-400",
    folder: "bg-white border-gray-400",
    navigation: "bg-gray-100 border-gray-400",
    phrase: "bg-white border-gray-400", // New type for pre-stored phrases
};    // Parent: cosas_2