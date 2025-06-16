// API route context types
export interface HabitRouteContext {
  params: Promise<{ id: string }>;
}

export interface CategoryRouteContext {
  params: Promise<{ id: string }>;
}
