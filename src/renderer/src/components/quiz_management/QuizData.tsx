export const QuizData = [
  {
    id: 1,
    title: 'Quiz Bee of the Year',
    date: '2024-02-29',
    description: 'Quiz Bee for College Students',
    settings: [
      { difficulty: 'easy', points: 2, time: 15 },
      { difficulty: 'average', points: 5, time: 25 },
      { difficulty: 'hard', points: 10, time: 35 },
      { difficulty: 'clincher', points: 20, time: 40 }
    ],
    questions: [
      {
        id: 1,
        question: 'What is 1+1?',
        answer: '2',
        choices: ['1', '2', '3', '4'],
        difficulty: 'easy'
      },
      {
        id: 2,
        question: 'What is 2+2?',
        answer: '4',
        choices: ['1', '2', '3', '4'],
        difficulty: 'easy'
      },
      {
        id: 3,
        question: 'What is 3+3?',
        answer: '6',
        choices: ['6', '2', '3', '4'],
        difficulty: 'easy'
      }
    ],
    participants: [
      { id: 1, name: 'Francis Angoring', description: 'BSCS 4-4' },
      { id: 2, name: 'David Calumba', description: 'BSCS 4-4' },
      { id: 3, name: 'Jezter Landicho', description: 'BSCS 4-4' },
      { id: 4, name: 'Danica Estrada', description: 'BSCS 4-4' }
    ],
    clincher: [
      {
        id: 1,
        question: 'What is 1+1?',
        answer: '2',
        choices: ['1', '2', '3', '4'],
        difficulty: 'clincher'
      },
      {
        id: 2,
        question: 'What is 2+2?',
        answer: '4',
        choices: ['1', '2', '3', '4'],
        difficulty: 'clincher'
      },
      {
        id: 3,
        question: 'What is 2+2?',
        answer: '4',
        difficulty: 'clincher'
      }
    ]
  }
]
