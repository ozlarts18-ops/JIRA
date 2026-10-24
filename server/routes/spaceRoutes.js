import express from 'express';

const router = express.Router();

const mockSpaces = [
  {
    id: '1',
    title: 'Pract7',
    subtitle: 'Software space',
    iconType: 'flask',
    members: ['KB', 'BG', 'PE', 'VD', 'A']
  },
  {
    id: '2',
    title: 'pract 6',
    subtitle: 'Software space',
    iconType: 'robot',
    members: ['KB', 'BG', 'PE', 'VD', 'A']
  },
  {
    id: '3',
    title: 'AI-Based Smart Building Audit and Facility Management System',
    subtitle: 'Software space',
    iconType: 'building',
    members: ['KB', 'BG', 'PE', 'VD', 'A']
  }
];

router.get('/', (req, res) => {
  res.json(mockSpaces);
});

export default router;
