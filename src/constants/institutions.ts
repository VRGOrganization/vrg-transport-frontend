export interface Institution {
  id: string;
  name: string;
  courses: string[];
}

export const INSTITUTIONS: Institution[] = [
  {
    id: "uniflu",
    name: "Centro Universitário Fluminense - UNIFLU",
    courses: [
      "Direito", "Odontologia", "Letras", "Jornalismo", "Inglês",
      "Artes Visuais", "Arquitetura e Urbanismo", "Pedagogia",
      "Logística", "Gestão de Recursos Humanos", "Fonoaudiologia",
      "Libras", "Terapia Ocupacional"
    ],
  },
  {
    id: "faberj",
    name: "Faculdade Batista do Estado do Rio de Janeiro - FABERJ",
    courses: ["Teologia"],
  },
  {
    id: "fmc",
    name: "Faculdade de Medicina de Campos - FMC",
    courses: ["Medicina", "Farmácia"],
  },
  {
    id: "iff",
    name: "Instituto Federal Fluminense - IFF",
    courses: [
      "Ciências da Natureza: Ciências e Química",
      "Ciências da Natureza: Ciências e Biologia",
      "Ciências da Natureza: Ciências e Física",
      "Geografia", "Matemática", "Sistemas de Telecomunicações",
      "Engenharia de Controle e Automação", "Arquitetura e Urbanismo",
      "Sistemas de Informação", "Engenharia Ambiental", "Letras - Português e Literaturas",
      "Engenharia Elétrica", "Engenharia de Computação", "Educação Física",
      "Teatro", "Música - Educação Musical", "Engenharia Mecânica",
      "Enfermagem", "Design Gráfico"
    ],
  },
  {
    id: "isecensa",
    name: "Instituto Superior de Educação do Centro Educacional Nossa Senhora Auxiliadora - ISECENSA",
    courses: ["Pedagogia"],
  },
  {
    id: "isepam",
    name: "Instituto Superior de Educação Professor Aldo Muylaert - ISEPAM",
    courses: ["Normal Superior", "Pedagogia", "Educação do Campo - Ciências da Natureza e Matemática"],
  },
  {
    id: "uenf",
    name: "Universidade Estadual do Norte Fluminense Darcy Ribeiro - UENF",
    courses: [
      "Medicina Veterinária", "Ciências Biológicas", "Física",
      "Matemática", "Química", "Ciências Sociais",
      "Engenharia Metalúrgica", "Engenharia Civil", "Agronomia",
      "Engenharia de Petróleo", "Zootecnia", "Engenharia de Produção",
      "Ciência da Computação", "Pedagogia", "Administração Pública"
    ],
  },
  {
    id: "itcsas",
    name: "Instituto Tecnológico e das Ciências Sociais Aplicadas e da Saúde do Centro Educ. N. Sra Auxiliadora - ITCSAS/CENSA",
    courses: [
      "Direito", "Engenharia Civil", "Educação Física",
      "Engenharia Mecânica", "Enfermagem", "Psicologia",
      "Arquitetura e Urbanismo", "Engenharia de Produção", "Fisioterapia",
      "Administração"
    ],
  },
  {
    id: "uff",
    name: "Universidade Federal Fluminense - UFF",
    courses: [
      "Ciências Econômicas", "Ciências Sociais", "História",
      "Psicologia", "Geografia", "Serviço Social"
    ],
  },
  {
    id: "ucam",
    name: "UNIVERSIDADE CÂNDIDO MENDES - UCAM",
    courses: ["Direito", "Administração", "Ciências Contábeis", 
              "Ciências Econômicas", "Ciências da Computação", 
              "Estilismo", "História", "Letras", "Ciências Sociais",
              "Comunicação Social", "Pedagogia", "Relações Internacionais",
              "Engenharia de Produção","Sistemas de Informação"],
  }
];

// Função utilitária para obter todas as instituições (útil para autocomplete geral)
export const getAllInstitutions = (): string[] => {
  return INSTITUTIONS.map(inst => inst.name);
};

// Função para obter os cursos de uma instituição específica
export const getCoursesForInstitution = (institutionName: string): string[] => {
  const institution = INSTITUTIONS.find(
    inst => inst.name.toLowerCase() === institutionName.toLowerCase()
  );
  return institution?.courses ?? [];
};