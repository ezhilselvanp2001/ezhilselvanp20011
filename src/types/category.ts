export interface Category {
  id: string;
  name: string;
  type: number; // 1 = Expense, 2 = Income
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  type: number;
  color: string;
  icon: string;
}

export interface UpdateCategoryData {
  name?: string;
  type?: number;
  color?: string;
  icon?: string;
}

export const CATEGORY_COLORS = [
  'indigo','teal','yellow', 'orange',
  'maroon', 'pink', 'lime',
  'violet', 'rose', 'slate', 'fuchsia',
  'sky', 'amber', 'purple', 'stone',
  'brown', 'lightBlue'
] as const;

export type CategoryColor = typeof CATEGORY_COLORS[number];

export const CATEGORY_ICONS = {
  'Food': [
    'coffee', 'milk', 'wine-glass', 'salad', 'sandwich',
    'apple', 'banana', 'carrot', 'egg', 'fish',
    'cookie'
  ],
  'Travel': [
    'airplane', 'bus', 'car', 'train', 'taxi',
    'compass', 'map', 'ticket', 'suitcase', 'backpack'
  ],
  'Shopping': [
    'shopping-bag','shopping-basket','credit-card','money-bill','barcode','qrcode'
  ],
  'Family': [
    'family', 'home', 'baby', 'heart'
  ],
  'Entertainment': [
    'game','movie','music','dance','camera','drama','tv','party'
  ],
  'Medical': [
    'doctor','pill','syringe','heartbeat','thermometer'
  ],
  'Finance': [
    'wallet','bank','piggy-bank','salary','investment','loan','debt'
  ],
  'Business': [
    'briefcase','chart','meeting','document','calendar','task','office'
  ],
  'Utilities': [
    'electricity','water','gas','internet','phone','trash','maintenance','light'
  ],
  'Miscellaneous': [
    'note','misc','gift','question','tools','clock','location'
  ]
} as const;

export const colorMap: Record<string, string> = {
  'indigo': 'bg-indigo-500',
  'teal': 'bg-teal-500',
  'yellow': 'bg-yellow-500',
  'orange': 'bg-orange-500',
  'maroon': 'bg-red-800',
  'pink': 'bg-pink-500',
  'lime': 'bg-lime-500',
  'violet': 'bg-violet-500',
  'rose': 'bg-rose-500',
  'slate': 'bg-slate-500',
  'fuchsia': 'bg-fuchsia-500',
  'sky': 'bg-sky-500',
  'amber': 'bg-amber-500',
  'purple': 'bg-purple-500',
  'stone': 'bg-stone-500',
  'brown': 'bg-amber-900',
  'lightBlue': 'bg-blue-300',
};

export const iconTitle: Record<string, string> = {
  'Food': '🍽️',
  'Travel': '✈️',
  'Shopping': '🛍️',
  'Family': '👨‍👩‍👧‍👦',
  'Entertainment': '🎭',
  'Medical': '🩺',
  'Finance': '💰',
  'Business': '💼',
  'Utilities': '⚙️',
  'Miscellaneous': '📦'
};