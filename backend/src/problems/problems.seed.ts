import { ProblemDifficulty } from './entities/problem.entity.js';

export const PROBLEMS_SEED = [
  {
    title: 'Parking Lot',
    description:
      'Design a parking lot system that manages multiple floors, parking spots, vehicles, tickets, and parking fees.',
    difficulty: ProblemDifficulty.MEDIUM,
    requirements: [
      'Support multiple parking floors',
      'Support different vehicle types',
      'Support different parking spot types',
      'Generate a parking ticket when a vehicle enters',
      'Calculate parking fees when a vehicle exits',
      'Track available parking spots',
    ],
    constraints: [
      'The design should be extensible for new vehicle types',
      'Parking allocation logic should be easy to modify',
    ],
  },
  {
    title: 'Vending Machine',
    description:
      'Design a vending machine that allows users to select products, insert money, receive products, and receive change.',
    difficulty: ProblemDifficulty.MEDIUM,
    requirements: [
      'Display available products',
      'Allow users to select a product',
      'Accept money',
      'Dispense products',
      'Return change',
      'Handle insufficient money',
    ],
    constraints: [
      'The system should support adding new products',
      'Different payment methods may be added later',
    ],
  },
  {
    title: 'Elevator System',
    description:
      'Design an elevator system that manages multiple elevators and handles requests from different floors.',
    difficulty: ProblemDifficulty.HARD,
    requirements: [
      'Support multiple elevators',
      'Handle requests from different floors',
      'Move elevators up and down',
      'Track elevator state',
      'Select an appropriate elevator for a request',
    ],
    constraints: [
      'The elevator selection strategy should be replaceable',
      'The system should support additional elevators',
    ],
  },
  {
    title: 'Library Management System',
    description:
      'Design a library management system for managing books, members, borrowing, and returning books.',
    difficulty: ProblemDifficulty.EASY,
    requirements: [
      'Manage books',
      'Manage library members',
      'Allow borrowing books',
      'Allow returning books',
      'Track book availability',
      'Prevent borrowing unavailable books',
    ],
    constraints: [
      'The system should support multiple copies of a book',
      'New member types may be added later',
    ],
  },
];