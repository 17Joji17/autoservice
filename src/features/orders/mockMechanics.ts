export type Mechanic = {
  id: number;
  name: string;
  specialization: string;
};

export const mockMechanics: Mechanic[] = [
  {
    id: 1,
    name: 'Алексей Смирнов',
    specialization: 'Двигатель и техническое обслуживание',
  },
  {
    id: 2,
    name: 'Дмитрий Волков',
    specialization: 'Ходовая часть и подвеска',
  },
  {
    id: 3,
    name: 'Максим Орлов',
    specialization: 'Тормозная система',
  },
  {
    id: 4,
    name: 'Игорь Петров',
    specialization: 'Комплексная диагностика',
  },
];
