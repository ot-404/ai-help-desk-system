import {
  List, Briefcase, User, Home, Star, Heart, BookOpen, Code2,
  ShoppingCart, Target, Dumbbell, Plane, Palette, GraduationCap,
} from "lucide-react";

export const LIST_ICONS = {
  list: List,
  briefcase: Briefcase,
  user: User,
  home: Home,
  star: Star,
  heart: Heart,
  book: BookOpen,
  code: Code2,
  cart: ShoppingCart,
  target: Target,
  dumbbell: Dumbbell,
  plane: Plane,
  palette: Palette,
  study: GraduationCap,
};

export const LIST_ICON_NAMES = Object.keys(LIST_ICONS);

export const LIST_COLORS = [
  "#2DD4BF", "#34D399", "#60A5FA", "#A78BFA",
  "#F472B6", "#FBBF24", "#F87171", "#94A3B8",
];

export function iconFor(name) {
  return LIST_ICONS[name] || List;
}
